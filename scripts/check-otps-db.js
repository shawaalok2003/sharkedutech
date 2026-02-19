const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');
const prisma = new PrismaClient();

function hashOTP(code) {
    return crypto.createHash('sha256').update(code).digest('hex');
}

async function checkOtps() {
    const email = 'aalokshaw2003@gmail.com';
    const otps = await prisma.otp.findMany({
        where: { email },
        orderBy: { createdAt: 'desc' },
        take: 5
    });

    console.log(`Otps for ${email}:`);
    otps.forEach(o => {
        console.log(`ID: ${o.id}, Verified: ${o.verified}, Expires: ${o.expiresAt}, Created: ${o.createdAt}`);
        // Check if the user's code 727164 matches this hashed code
        const userCode = '727164';
        const userHash = hashOTP(userCode);
        if (o.code === userHash) {
            console.log(`>>> MATCH FOUND for code ${userCode}!`);
        } else {
            console.log(`   (No match for ${userCode})`);
        }
    });

    process.exit(0);
}

checkOtps().catch(err => {
    console.error(err);
    process.exit(1);
});
