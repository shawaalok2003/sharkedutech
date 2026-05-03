const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const email = 'aalokentre22@gmail.com';
    const user = await prisma.user.findUnique({
        where: { email },
        include: { jobs: true }
    });

    if (!user) {
        console.log(`User ${email} not found`);
        return;
    }

    console.log(`User ID: ${user.id}`);
    console.log(`Number of jobs: ${user.jobs.length}`);
    console.log('Jobs:', JSON.stringify(user.jobs, null, 2));

    // Also check if there are jobs with this employerId but different user id? 
    // Unlikely, but let's check ALL jobs.
    const allJobs = await prisma.job.findMany({
        include: { employer: true }
    });
    console.log(`Total jobs in DB: ${allJobs.length}`);
    allJobs.forEach(job => {
        console.log(`Job: ${job.title}, Employer: ${job.employer.email}`);
    });
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
