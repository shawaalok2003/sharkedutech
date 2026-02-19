const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');
const prisma = new PrismaClient();

function hashOTP(code) {
    return crypto.createHash('sha256').update(code).digest('hex');
}

async function inspectMatch() {
    const userCode = '727164';
    const userHash = hashOTP(userCode);

    const otp = await prisma.otp.findFirst({
        where: { code: userHash }
    });

    if (otp) {
        console.log('--- OTP Match Found ---');
        console.log('Email:', otp.email);
        console.log('Verified:', otp.verified);
        console.log('ExpiresAt:', otp.expiresAt);
        console.log('CreatedAt:', otp.createdAt);
        console.log('Current Time:', new Date());
        console.log('Is Expired?', new Date() > otp.expiresAt);
    } else {
        console.log('No OTP found matching hash of 727164');
    }

    process.exit(0);
}

inspectMatch().catch(err => {
    console.error(err);
    process.exit(1);
});
