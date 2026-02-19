const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function unverifyOtp() {
    const email = 'aalokshaw2003@gmail.com';
    // Find the record matching the code hash
    const crypto = require('crypto');
    const userHash = crypto.createHash('sha256').update('727164').digest('hex');

    const updated = await prisma.otp.updateMany({
        where: {
            email,
            code: userHash,
            verified: true
        },
        data: {
            verified: false
        }
    });

    console.log(`Updated ${updated.count} OTP records to verified: false`);
    process.exit(0);
}

unverifyOtp().catch(err => {
    console.error(err);
    process.exit(1);
});
