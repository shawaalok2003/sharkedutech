const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkUser() {
    const email = 'aalokshaw2003@gmail.com';
    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (user) {
        console.log('--- User Found ---');
        console.log('Email:', user.email);
        console.log('Role:', user.role);
        console.log('Password set?', !!user.password);
    } else {
        console.log('User NOT found for email:', email);
    }

    process.exit(0);
}

checkUser().catch(err => {
    console.error(err);
    process.exit(1);
});
