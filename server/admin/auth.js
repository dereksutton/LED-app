// Owner login: email + password + authenticator code, sessions in MongoDB
// behind an HttpOnly cookie.
const QRCode = require('qrcode');
const { AdminUser, AdminSession } = require('./models');
const {
    verifyPassword, verifyTotp, generateTotpSecret, totpUri, randomToken, sha256,
} = require('./crypto');

const COOKIE_NAME = 'led_admin_session';
const SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // signed out after a week regardless
const SESSION_IDLE_MS = 12 * 60 * 60 * 1000;        // or after 12 hours unused
const TOUCH_EVERY_MS = 5 * 60 * 1000;
const MAX_FAILED = 5;
const LOCK_MS = 15 * 60 * 1000;
const ISSUER = 'LED Custom Painting';

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
    id: String(user._id), email: user.email, name: user.name, totpEnabled: user.totpEnabled,
});

const createAuth = ({ secureCookie = true, now = () => Date.now() } = {}) => {
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
        }
        await AdminUser.updateOne({ _id: user._id }, update);
    };

    // One endpoint, three outcomes: { step: 'code' } asks for the
    // authenticator code, { step: 'enroll' } shows the QR code to set one up
    // on first sign-in, and { user } means signed in.
    const login = async (req, res, next) => {
        try {
            const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
            const password = typeof req.body.password === 'string' ? req.body.password : '';
            const code = typeof req.body.code === 'string' ? req.body.code.trim() : '';
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

            if (user.totpEnabled) {
                if (!code) return res.json({ step: 'code' });
                const step = verifyTotp(user.totpSecret, code, { now: now() });
                if (step === null || step <= (user.lastTotpStep || 0)) {
                    await recordFailure(user);
                    return res.status(401).json({ step: 'code', message: 'That code didn\'t work. Try the newest one.' });
                }
                await AdminUser.updateOne({ _id: user._id }, {
                    lastTotpStep: step, failedAttempts: 0, $unset: { lockedUntil: 1 }, lastLoginAt: new Date(now()),
                });
                await startSession(res, user, req);
                return res.json({ user: publicUser(user) });
            }

            // First sign-in: set up the authenticator app before anything else.
            if (!code || !user.pendingTotpSecret) {
                const secret = user.pendingTotpSecret || generateTotpSecret();
                if (!user.pendingTotpSecret) {
                    await AdminUser.updateOne({ _id: user._id }, { pendingTotpSecret: secret });
                }
                const uri = totpUri({ secret, account: user.email, issuer: ISSUER });
                return res.json({
                    step: 'enroll',
                    secret,
                    qr: await QRCode.toDataURL(uri, { margin: 1, width: 240 }),
                });
            }
            const step = verifyTotp(user.pendingTotpSecret, code, { now: now() });
            if (step === null) {
                await recordFailure(user);
                return res.status(401).json({ step: 'enroll', message: 'That code didn\'t work. Check the app and try the newest one.' });
            }
            await AdminUser.updateOne({ _id: user._id }, {
                totpSecret: user.pendingTotpSecret,
                totpEnabled: true,
                $unset: { pendingTotpSecret: 1, lockedUntil: 1 },
                lastTotpStep: step,
                failedAttempts: 0,
                lastLoginAt: new Date(now()),
            });
            user.totpEnabled = true;
            await startSession(res, user, req);
            return res.json({ user: publicUser(user) });
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

    return { login, logout, requireAuth, loadSession, publicUser };
};

module.exports = { createAuth, parseCookies, COOKIE_NAME, MAX_FAILED, SESSION_IDLE_MS, SESSION_MAX_AGE_MS };
