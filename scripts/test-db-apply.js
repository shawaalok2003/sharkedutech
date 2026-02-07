const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('--- Starting Application Flow Verification ---');

    // 1. Get a Candidate User
    console.log('1. Finding a Candidate...');
    const candidate = await prisma.user.findFirst({
        where: { email: { contains: 'candidate' } } // Adjust if needed
    });

    if (!candidate) {
        console.error('❌ No candidate found. Please create one first.');
        return;
    }
    console.log(`✅ Found Candidate: ${candidate.email} (ID: ${candidate.id})`);

    // 2. Get a Job
    console.log('2. Finding a Job...');
    const job = await prisma.job.findFirst({
        where: { status: 'Active' }
    });

    if (!job) {
        console.error('❌ No active job found. Please post a job first.');
        return;
    }
    console.log(`✅ Found Job: ${job.title} (ID: ${job.id})`);

    // 3. Attempt to Create Application
    console.log('3. Attempting to Create Application Record...');
    try {
        const application = await prisma.application.create({
            data: {
                jobId: job.id,
                applicantId: candidate.id,
                status: 'Applied',
                name: candidate.name || 'Test Candidate',
                email: candidate.email,
                resumeUrl: 'https://test-resume.com/cv.pdf'
            }
        });
        console.log('✅ SUCCESS! Application created in DB.');
        console.log('   Application ID:', application.id);
        console.log('   Resume URL:', application.resumeUrl);
    } catch (error) {
        console.error('❌ FAILED to create application.');
        console.error('   Error Message:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

main();
