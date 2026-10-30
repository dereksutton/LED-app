// Password hashing, authenticator codes (TOTP) and random tokens, all on
// Node's built-in crypto so there are no extra dependencies to trust.
const crypto = require('crypto');

const SCRYPT = { N: 16384, r: 8, p: 1, keylen: 64 };

const scrypt = (password, salt) =>
    new Promise((resolve, reject) => {
        crypto.scrypt(password, salt, SCRYPT.keylen, { N: SCRYPT.N, r: SCRYPT.r, p: SCRYPT.p }, (err, key) =>
            err ? reject(err) : resolve(key));
    });

// Stored as scrypt$N$r$p$salt$hash so the cost can be raised later.
const hashPassword = async (password) => {
    const salt = crypto.randomBytes(16);
    const key = await scrypt(password, salt);
    return ['scrypt', SCRYPT.N, SCRYPT.r, SCRYPT.p, salt.toString('base64'), key.toString('base64')].join('$');
};

// A fixed hash to compare against when the email is unknown, so a wrong
// email takes as long as a wrong password.
const DUMMY_HASH = 'scrypt$16384$8$1$AAAAAAAAAAAAAAAAAAAAAA==$' + Buffer.alloc(64).toString('base64');

const verifyPassword = async (password, stored) => {
    const parts = String(stored || DUMMY_HASH).split('$');
    if (parts.length !== 6 || parts[0] !== 'scrypt') return false;
    const [, N, r, p, salt, hash] = parts;
    const expected = Buffer.from(hash, 'base64');
    const key = await new Promise((resolve, reject) => {
        crypto.scrypt(String(password), Buffer.from(salt, 'base64'), expected.length,
            { N: Number(N), r: Number(r), p: Number(p) }, (err, k) => (err ? reject(err) : resolve(k)));
    });
    return crypto.timingSafeEqual(key, expected) && Boolean(stored);
};

const PASSWORD_MIN = 12;
const checkPasswordStrength = (password) => {
    if (typeof password !== 'string' || password.length < PASSWORD_MIN) {
        return `Use at least ${PASSWORD_MIN} characters.`;
    }
    if (password.length > 200) return 'That password is too long.';
    return null;
};

// --- TOTP (RFC 6238), as used by Google Authenticator, Authy, 1Password ---
const B32 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

const base32Encode = (buf) => {
    let bits = 0;
    let value = 0;
    let out = '';
    for (const byte of buf) {
        value = (value << 8) | byte;
        bits += 8;
        while (bits >= 5) {
            out += B32[(value >>> (bits - 5)) & 31];
            bits -= 5;
        }
    }
    if (bits > 0) out += B32[(value << (5 - bits)) & 31];
    return out;
};

const base32Decode = (str) => {
    const clean = String(str).toUpperCase().replace(/[^A-Z2-7]/g, '');
    let bits = 0;
    let value = 0;
    const out = [];
    for (const ch of clean) {
        value = (value << 5) | B32.indexOf(ch);
        bits += 5;
        if (bits >= 8) {
            out.push((value >>> (bits - 8)) & 255);
            bits -= 8;
        }
    }
    return Buffer.from(out);
};

const generateTotpSecret = () => base32Encode(crypto.randomBytes(20));

const hotp = (secret, counter, digits = 6) => {
    const buf = Buffer.alloc(8);
    buf.writeBigUInt64BE(BigInt(counter));
    const hmac = crypto.createHmac('sha1', base32Decode(secret)).update(buf).digest();
    const offset = hmac[hmac.length - 1] & 0xf;
    const code = (hmac.readUInt32BE(offset) & 0x7fffffff) % 10 ** digits;
    return String(code).padStart(digits, '0');
};

const STEP_SECONDS = 30;
const totpStep = (now = Date.now()) => Math.floor(now / 1000 / STEP_SECONDS);

// Returns the matched time step, or null. Allows one step of clock drift
// either way. The caller rejects steps it has already accepted (replay).
const verifyTotp = (secret, code, { now = Date.now(), window = 1 } = {}) => {
    const clean = String(code || '').replace(/\s/g, '');
    if (!/^\d{6}$/.test(clean) || !secret) return null;
    const current = totpStep(now);
    for (let i = -window; i <= window; i++) {
        const candidate = hotp(secret, current + i);
        if (crypto.timingSafeEqual(Buffer.from(candidate), Buffer.from(clean))) return current + i;
    }
    return null;
};

const totpUri = ({ secret, account, issuer }) =>
    `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(account)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}&algorithm=SHA1&digits=6&period=30`;

// --- Tokens ---
const randomToken = (bytes = 32) => crypto.randomBytes(bytes).toString('base64url');
const sha256 = (value) => crypto.createHash('sha256').update(String(value)).digest('hex');

module.exports = {
    hashPassword, verifyPassword, checkPasswordStrength, PASSWORD_MIN,
    base32Encode, base32Decode, generateTotpSecret, hotp, verifyTotp, totpStep, totpUri,
    randomToken, sha256,
};
