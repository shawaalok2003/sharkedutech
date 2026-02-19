const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');
const prisma = new PrismaClient();

function hashOTP(code) {
    return crypto.createHash('sha256').update(code).digest('hex');
}

async function debugCompare() {
    const userCode = '727164';
    const userHash = hashOTP(userCode);
    console.log('User Code:', userCode);
    console.log('User Hash:', userHash);

    const email = 'aalokshaw2003@gmail.com';
    const otp = await prisma.otp.findFirst({
        where: { email },
        orderBy: { createdAt: 'desc' }
    });

    if (otp) {
        console.log('DB record found:');
        console.log('  Email:', otp.email);
        console.log('  Code in DB:', otp.code);
        console.log('  Verified:', otp.verified);
        console.log('  Is Match?', otp.code === userHash);

        // Let's try to query by EXACT hash
        const queryByHash = await prisma.otp.findFirst({
            where: {
                email,
                code: userHash,
                verified: false
            }
        });
        console.log('  Result of query by hash:', queryByHash ? 'FOUND' : 'NOT FOUND');
    } else {
        console.log('No record found for email:', email);
    }

    process.exit(0);
}

debugCompare().catch(err => {
    console.error(err);
    process.exit(1);
});
