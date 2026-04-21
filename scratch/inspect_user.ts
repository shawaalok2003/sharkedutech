import { prisma } from './src/lib/prisma';

async function main() {
    const user = await prisma.user.findFirst({
        where: { role: 'EMPLOYER' }
    });
    console.log(JSON.stringify(user, null, 2));
}

main().catch(console.error);
