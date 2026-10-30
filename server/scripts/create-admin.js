// Creates a dashboard login, or resets one.
//
//   npm run create-admin -- --email owner@example.com --name "Efrain" [--phone "(904) 555-0123"]
//   npm run create-admin -- --email owner@example.com --reset
//
// Asks for the password without showing it. Each sign-in then emails a
// code (or texts it, when a phone is set and Twilio is configured).
// --reset sets a new password, unlocks the login and signs out everywhere.
require('dotenv').config({ path: `${__dirname}/../.env`, override: true });
const readline = require('readline');
const mongoose = require('mongoose');
const { AdminUser, AdminSession } = require('../admin/models');
const { hashPassword, checkPasswordStrength } = require('../admin/crypto');
const { normalizePhone } = require('../admin/router');

const args = process.argv.slice(2);
const flag = (name) => {
    const i = args.indexOf(`--${name}`);
    return i >= 0 ? (args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : true) : undefined;
};

const askHidden = (question) => new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    rl.stdoutMuted = false;
    rl._writeToOutput = (s) => { if (!rl.stdoutMuted || s.includes(question)) rl.output.write(s); };
    rl.question(question, (answer) => {
        rl.output.write('\n');
        rl.close();
        resolve(answer);
    });
    rl.stdoutMuted = true;
});

const main = async () => {
    const email = typeof flag('email') === 'string' ? flag('email').trim().toLowerCase() : '';
    const name = typeof flag('name') === 'string' ? flag('name').trim() : '';
    const reset = Boolean(flag('reset'));
    const phone = typeof flag('phone') === 'string' ? normalizePhone(flag('phone')) : undefined;
    if (phone === null) {
        console.error('That phone number doesn\'t look right. Use a US cell like "(904) 555-0123".');
        process.exit(1);
    }
    if (!email || (!reset && !name)) {
        console.log('Usage: npm run create-admin -- --email you@example.com --name "Your Name" [--phone "(904) 555-0123"] [--reset]');
        process.exit(1);
    }
    if (!process.env.MONGO_URI) {
        console.error('MONGO_URI is not set.');
        process.exit(1);
    }

    const password = process.env.ADMIN_PASSWORD || await askHidden('New password (12+ characters): ');
    const weak = checkPasswordStrength(password);
    if (weak) {
        console.error(weak);
        process.exit(1);
    }
    if (!process.env.ADMIN_PASSWORD && password !== await askHidden('Type it again: ')) {
        console.error('The passwords don\'t match.');
        process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI);
    const passwordHash = await hashPassword(password);
    const existing = await AdminUser.findOne({ email });
    if (existing && !reset) {
        console.error('That login already exists. Add --reset to give it a new password.');
    } else if (existing) {
        await AdminUser.updateOne({ _id: existing._id }, {
            passwordHash, failedAttempts: 0, codeSentAt: [],
            $unset: { loginCode: 1, lockedUntil: 1, totpSecret: 1, totpEnabled: 1, pendingTotpSecret: 1, lastTotpStep: 1 },
            ...(name ? { name } : {}),
            ...(phone ? { phone } : {}),
        });
        await AdminSession.deleteMany({ userId: existing._id });
        console.log(`Reset ${email}. It's unlocked and signed out everywhere.`);
    } else if (reset) {
        console.error('There is no login with that email.');
    } else {
        await AdminUser.create({ email, name, passwordHash, ...(phone ? { phone } : {}) });
        console.log(`Created ${email}. Each sign-in at /admin emails a code${phone ? ' (or texts it, once texting is set up)' : ''}.`);
    }
    await mongoose.disconnect();
};

main().catch((err) => {
    console.error(err.message);
    process.exit(1);
});
