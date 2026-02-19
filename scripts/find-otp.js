const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function findOtp() {
    const email = 'aalokshaw2003@gmail.com';
    const otp = await prisma.otp.findFirst({
        where: { email },
        orderBy: { createdAt: 'desc' }
    });
    console.log('LATEST_OTP:', JSON.stringify(otp, null, 2));
    process.exit(0);
}

findOtp().catch(err => {
    console.error(err);
    process.exit(1);
});
