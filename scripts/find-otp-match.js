const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');
const prisma = new PrismaClient();

function hashOTP(code) {
    return crypto.createHash('sha256').update(code).digest('hex');
}

async function findMatch() {
    const userCode = '727164';
    const userHash = hashOTP(userCode);
    console.log(`Searching for hash of ${userCode}: ${userHash}`);

    const otps = await prisma.otp.findMany({
        orderBy: { createdAt: 'desc' },
        take: 20
    });

    console.log(`Checking last 20 OTPs:`);
    let found = false;
    otps.forEach(o => {
        if (o.code === userHash) {
            console.log(`MATCH FOUND!`);
            console.log(`Email: ${o.email}`);
            console.log(`ID: ${o.id}, Verified: ${o.verified}, Expires: ${o.expiresAt}`);
            found = true;
        }
    });

    if (!found) {
        console.log('No match found for this hash in the last 20 records.');
        console.log('Last record hash:', otps[0]?.code);
    }

    process.exit(0);
}

findMatch().catch(err => {
    console.error(err);
    process.exit(1);
});
