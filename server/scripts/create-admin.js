// Creates a dashboard login, or resets one.
//
//   npm run create-admin -- --email owner@example.com --name "Efrain"
//   npm run create-admin -- --email owner@example.com --reset
//
// Asks for the password without showing it. --reset also clears the
// authenticator app, so the next sign-in sets it up again.
require('dotenv').config({ path: `${__dirname}/../.env`, override: true });
const readline = require('readline');
const mongoose = require('mongoose');
const { AdminUser, AdminSession } = require('../admin/models');
const { hashPassword, checkPasswordStrength } = require('../admin/crypto');

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
    if (!email || (!reset && !name)) {
        console.log('Usage: npm run create-admin -- --email you@example.com --name "Your Name" [--reset]');
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
        console.error('That login already exists. Add --reset to reset its password and authenticator app.');
    } else if (existing) {
        await AdminUser.updateOne({ _id: existing._id }, {
            passwordHash, totpEnabled: false, failedAttempts: 0,
            $unset: { totpSecret: 1, pendingTotpSecret: 1, lockedUntil: 1 },
            ...(name ? { name } : {}),
        });
        await AdminSession.deleteMany({ userId: existing._id });
        console.log(`Reset ${email}. They'll set up the authenticator app again at their next sign-in.`);
    } else if (reset) {
        console.error('There is no login with that email.');
    } else {
        await AdminUser.create({ email, name, passwordHash });
        console.log(`Created ${email}. At the first sign-in at /admin they'll scan a QR code with an authenticator app.`);
    }
    await mongoose.disconnect();
};

main().catch((err) => {
    console.error(err.message);
    process.exit(1);
});
