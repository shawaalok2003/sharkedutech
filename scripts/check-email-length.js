const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkEmail() {
    const otps = await prisma.otp.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5
    });

    otps.forEach(o => {
        console.log(`ID: ${o.id}`);
        console.log(`Email: "${o.email}"`);
        console.log(`Length: ${o.email.length}`);
    });

    process.exit(0);
}

checkEmail().catch(err => {
    console.error(err);
    process.exit(1);
});
