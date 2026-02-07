const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

console.log('Modules required.');

const prisma = new PrismaClient();
console.log('Prisma initialized.');

async function main() {
    console.log('Hashing password...');
    const password = await bcrypt.hash('password123', 10);
    console.log('Password hashed.');

    // Create Admin
    console.log('Creating admin...');
    const admin = await prisma.user.upsert({
        where: { email: 'admin@shark.com' },
        update: {},
        create: {
            email: 'admin@shark.com',
            name: 'Admin User',
            password,
            role: 'ADMIN',
        },
    });
    console.log('Admin created.');

    // Create Employer
    console.log('Creating employer...');
    const employer = await prisma.user.upsert({
        where: { email: 'employer@shark.com' },
        update: {},
        create: {
            email: 'employer@shark.com',
            name: 'Employer User',
            password,
            role: 'EMPLOYER',
        },
    });
    console.log('Employer created.');

    console.log({ admin, employer });
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error('SEED ERROR:', e);
        await prisma.$disconnect();
        process.exit(1);
    });
