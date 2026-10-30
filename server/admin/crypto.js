// Password hashing, one-time sign-in codes and random tokens, all on
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

// --- One-time sign-in codes, sent by email or text ---
const randomCode = () => String(crypto.randomInt(0, 1000000)).padStart(6, '0');
// Bound to the account so a stored hash can't be reused for another login.
const hashCode = (userId, code) => crypto.createHash('sha256').update(`${userId}:${code}`).digest('hex');
const codeMatches = (userId, code, storedHash) => {
    if (!storedHash || !/^\d{6}$/.test(code)) return false;
    const a = Buffer.from(hashCode(userId, code), 'hex');
    const b = Buffer.from(String(storedHash), 'hex');
    return a.length === b.length && crypto.timingSafeEqual(a, b);
};

// --- Tokens ---
const randomToken = (bytes = 32) => crypto.randomBytes(bytes).toString('base64url');
const sha256 = (value) => crypto.createHash('sha256').update(String(value)).digest('hex');

module.exports = {
    hashPassword, verifyPassword, checkPasswordStrength, PASSWORD_MIN,
    randomCode, hashCode, codeMatches,
    randomToken, sha256,
};
