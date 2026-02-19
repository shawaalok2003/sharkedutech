const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function listAllOtps() {
    const email = 'aalokshaw2003@gmail.com';
    const otps = await prisma.otp.findMany({
        where: { email },
        orderBy: { createdAt: 'desc' }
    });

    console.log(`Total OTPs for ${email}: ${otps.length}`);
    otps.forEach((o, i) => {
        console.log(`[${i}] ID: ${o.id}, Code: ${o.code.substring(0, 10)}..., Verified: ${o.verified}, Created: ${o.createdAt}`);
    });

    process.exit(0);
}

listAllOtps().catch(err => {
    console.error(err);
    process.exit(1);
});
