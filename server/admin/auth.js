// Owner login: email + password, then a one-time code sent by email or
// text. Sessions live in MongoDB behind an HttpOnly cookie.
const { AdminUser, AdminSession } = require('./models');
const { verifyPassword, randomCode, hashCode, codeMatches, randomToken, sha256 } = require('./crypto');

const COOKIE_NAME = 'led_admin_session';
const SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // signed out after a week regardless
const SESSION_IDLE_MS = 12 * 60 * 60 * 1000;        // or after 12 hours unused
const TOUCH_EVERY_MS = 5 * 60 * 1000;
const MAX_FAILED = 5;
const LOCK_MS = 15 * 60 * 1000;
const CODE_TTL_MS = 10 * 60 * 1000;
const CODE_MAX_TRIES = 5;           // wrong guesses before a code is thrown away
const RESEND_GAP_MS = 30 * 1000;
const SENDS_PER_HOUR = 5;

const parseCookies = (header = '') =>
    Object.fromEntries(header.split(';').map((part) => {
        const i = part.indexOf('=');
        if (i < 0) return [part.trim(), ''];
        try {
            return [part.slice(0, i).trim(), decodeURIComponent(part.slice(i + 1).trim())];
        } catch {
            return [part.slice(0, i).trim(), ''];
        }
    }));

const cookieHeader = (value, { secure, maxAgeMs }) => [
    `${COOKIE_NAME}=${value}`,
    'Path=/api',
    'HttpOnly',
    'SameSite=Strict',
    secure ? 'Secure' : null,
    `Max-Age=${Math.floor(maxAgeMs / 1000)}`,
].filter(Boolean).join('; ');

const publicUser = (user) => ({
    id: String(user._id),
    email: user.email,
    name: user.name,
    phone: user.phone || '',
    codeChannel: user.codeChannel || 'email',
});

const maskEmail = (email) => {
    const [local, domain] = String(email).split('@');
    return `${local.slice(0, 1)}•••@${domain}`;
};
const maskPhone = (phone) => `•••${String(phone).slice(-4)}`;

const httpError = (status, message) => Object.assign(new Error(message), { status, expose: true });

// sendCode({ user, code, channel }) delivers a code; smsAvailable says
// whether texting is set up on this server.
const createAuth = ({ secureCookie = true, now = () => Date.now(), sendCode, smsAvailable = false } = {}) => {
    const startSession = async (res, user, req) => {
        const token = randomToken(32);
        const at = new Date(now());
        await AdminSession.create({
            tokenHash: sha256(token),
            userId: user._id,
            createdAt: at,
            lastSeenAt: at,
            expiresAt: new Date(at.getTime() + SESSION_MAX_AGE_MS),
            ip: req.ip,
            userAgent: String(req.get('user-agent') || '').slice(0, 300),
        });
        res.setHeader('Set-Cookie', cookieHeader(token, { secure: secureCookie, maxAgeMs: SESSION_MAX_AGE_MS }));
    };

    const loadSession = async (req) => {
        const token = parseCookies(req.headers.cookie)[COOKIE_NAME];
        if (!token || token.length > 100) return null;
        const session = await AdminSession.findOne({ tokenHash: sha256(token) });
        if (!session) return null;
        const t = now();
        if (session.expiresAt.getTime() <= t || session.lastSeenAt.getTime() + SESSION_IDLE_MS <= t) {
            await AdminSession.deleteOne({ _id: session._id });
            return null;
        }
        const user = await AdminUser.findById(session.userId);
        if (!user) return null;
        if (t - session.lastSeenAt.getTime() > TOUCH_EVERY_MS) {
            await AdminSession.updateOne({ _id: session._id }, { lastSeenAt: new Date(t) });
        }
        return { session, user };
    };

    const requireAuth = async (req, res, next) => {
        try {
            const found = await loadSession(req);
            if (!found) return res.status(401).json({ message: 'Please sign in.' });
            req.admin = found.user;
            req.adminSession = found.session;
            next();
        } catch (err) {
            next(err);
        }
    };

    const GENERIC = 'That email and password don\'t match.';
    const LOCKED = 'Too many tries. Wait 15 minutes and try again.';

    const recordFailure = async (user) => {
        if (!user) return;
        const failed = (user.failedAttempts || 0) + 1;
        const update = { failedAttempts: failed };
        if (failed >= MAX_FAILED) {
            update.lockedUntil = new Date(now() + LOCK_MS);
            update.failedAttempts = 0;
            update.$unset = { loginCode: 1 };
        }
        await AdminUser.updateOne({ _id: user._id }, update);
    };

    const canText = (user) => Boolean(smsAvailable && user.phone);
    const codeStep = (user, channel) => ({
        step: 'code',
        channel,
        to: channel === 'sms' ? maskPhone(user.phone) : maskEmail(user.email),
        canText: canText(user),
    });

    // Makes a fresh code, stores only its hash and sends it. "Send a new
    // code" waits 30 seconds between sends; every send counts toward 5 an hour.
    const issueCode = async (user, channel, { resend = false } = {}) => {
        const t = now();
        const recent = (user.codeSentAt || []).filter((d) => d.getTime() > t - 60 * 60 * 1000);
        if (resend && recent.length && recent[recent.length - 1].getTime() > t - RESEND_GAP_MS) {
            throw httpError(429, 'Wait a few seconds before asking for another code.');
        }
        if (recent.length >= SENDS_PER_HOUR) {
            throw httpError(429, 'Too many codes sent. Wait an hour, or reset this login from the server.');
        }
        const code = randomCode();
        await AdminUser.updateOne({ _id: user._id }, {
            loginCode: { hash: hashCode(user._id, code), channel, expiresAt: new Date(t + CODE_TTL_MS), attempts: 0 },
            codeSentAt: [...recent, new Date(t)],
            codeChannel: channel,
        });
        try {
            await sendCode({ user, code, channel });
        } catch (err) {
            console.error('[SIGN_IN_CODE_FAILED]', channel, err.message);
            await AdminUser.updateOne({ _id: user._id }, { $unset: { loginCode: 1 } });
            throw httpError(502, channel === 'sms'
                ? 'We couldn\'t text the code. Try again, or have it emailed instead.'
                : 'We couldn\'t email the code. Try again in a minute.');
        }
    };

    // One endpoint, two steps: email + password sends a code and answers
    // { step: 'code' }; the same plus the code signs in and answers { user }.
    // { resend: true, channel: 'email' | 'sms' } sends a new code.
    const login = async (req, res, next) => {
        try {
            const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
            const password = typeof req.body.password === 'string' ? req.body.password : '';
            const code = typeof req.body.code === 'string' ? req.body.code.replace(/\s/g, '') : '';
            if (!email || !password || email.length > 200 || password.length > 200) {
                return res.status(400).json({ message: 'Enter your email and password.' });
            }

            const user = await AdminUser.findOne({ email });
            if (user && user.lockedUntil && user.lockedUntil.getTime() > now()) {
                return res.status(429).json({ message: LOCKED });
            }

            const ok = await verifyPassword(password, user && user.passwordHash);
            if (!user || !ok) {
                await recordFailure(user);
                return res.status(401).json({ message: GENERIC });
            }

            const pending = user.loginCode && user.loginCode.hash ? user.loginCode : null;
            const live = Boolean(pending && pending.expiresAt && pending.expiresAt.getTime() > now());

            if (code && !req.body.resend) {
                if (!live) {
                    return res.status(401).json({
                        ...codeStep(user, (pending && pending.channel) || user.codeChannel || 'email'),
                        message: 'That code has expired. Send a new one.',
                    });
                }
                if (!codeMatches(user._id, code, pending.hash)) {
                    const attempts = (pending.attempts || 0) + 1;
                    await AdminUser.updateOne({ _id: user._id }, attempts >= CODE_MAX_TRIES
                        ? { $unset: { loginCode: 1 } }
                        : { 'loginCode.attempts': attempts });
                    await recordFailure(user);
                    return res.status(401).json({
                        ...codeStep(user, pending.channel),
                        message: attempts >= CODE_MAX_TRIES
                            ? 'Too many wrong codes. Send a new one.'
                            : 'That code didn\'t work. Check it and try again.',
                    });
                }
                await AdminUser.updateOne({ _id: user._id }, {
                    failedAttempts: 0, lastLoginAt: new Date(now()), $unset: { loginCode: 1, lockedUntil: 1 },
                });
                await startSession(res, user, req);
                return res.json({ user: publicUser(user) });
            }

            const wanted = ['email', 'sms'].includes(req.body.channel) ? req.body.channel : user.codeChannel;
            const channel = wanted === 'sms' && canText(user) ? 'sms' : 'email';
            // A code already on its way is reused unless they asked for another.
            if (!live || req.body.resend || pending.channel !== channel) {
                await issueCode(user, channel, { resend: Boolean(req.body.resend) });
            }
            return res.json(codeStep(user, channel));
        } catch (err) {
            next(err);
        }
    };

    const logout = async (req, res, next) => {
        try {
            const token = parseCookies(req.headers.cookie)[COOKIE_NAME];
            if (token) await AdminSession.deleteOne({ tokenHash: sha256(token) });
            res.setHeader('Set-Cookie', cookieHeader('', { secure: secureCookie, maxAgeMs: 0 }));
            res.json({ ok: true });
        } catch (err) {
            next(err);
        }
    };

    return { login, logout, requireAuth, loadSession, publicUser, smsAvailable };
};

module.exports = {
    createAuth, parseCookies, COOKIE_NAME, MAX_FAILED, SESSION_IDLE_MS, SESSION_MAX_AGE_MS, CODE_TTL_MS, CODE_MAX_TRIES,
};
