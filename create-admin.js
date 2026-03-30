const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const email = 'admin@shark.com';
    const password = await bcrypt.hash('password123', 10);

    // Create or update the admin user
    const admin = await prisma.user.upsert({
        where: { email },
        update: { role: 'ADMIN', password },
        create: {
            email,
            name: 'Admin User',
            password,
            role: 'ADMIN',
        },
    });
    console.log('Successfully configured Admin account for:', admin.email);
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
