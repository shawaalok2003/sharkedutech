const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const targetEmail = 'aalokentre22@gmail.com';
    const sourceEmail = 'test1234@gmail.com';

    const targetUser = await prisma.user.findUnique({ where: { email: targetEmail } });
    const sourceUser = await prisma.user.findUnique({ where: { email: sourceEmail } });

    if (targetUser && sourceUser) {
        const result = await prisma.job.updateMany({
            where: { employerId: sourceUser.id },
            data: { employerId: targetUser.id }
        });
        console.log(`Moved ${result.count} jobs from ${sourceEmail} to ${targetEmail}`);
    } else {
        console.log(`Users not found: target=${!!targetUser}, source=${!!sourceUser}`);
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
