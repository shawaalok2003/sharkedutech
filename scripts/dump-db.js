const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Starting database dump from SQLite...');
  
  try {
    const data = {};
    
    // 1. Fetch from all tables
    data.users = await prisma.user.findMany();
    console.log(`✅ Dumped ${data.users.length} Users`);
    
    data.studentProfiles = await prisma.studentProfile.findMany();
    console.log(`✅ Dumped ${data.studentProfiles.length} Student Profiles`);
    
    data.colleges = await prisma.college.findMany();
    console.log(`✅ Dumped ${data.colleges.length} Colleges`);
    
    data.courses = await prisma.course.findMany();
    console.log(`✅ Dumped ${data.courses.length} Courses`);
    
    data.jobs = await prisma.job.findMany();
    console.log(`✅ Dumped ${data.jobs.length} Jobs`);
    
    data.applications = await prisma.application.findMany();
    console.log(`✅ Dumped ${data.applications.length} Applications`);
    
    data.otps = await prisma.otp.findMany();
    console.log(`✅ Dumped ${data.otps.length} OTPs`);
    
    data.admissionRequirements = await prisma.admissionRequirement.findMany();
    console.log(`✅ Dumped ${data.admissionRequirements.length} Admission Requirements`);
    
    data.admissionDocuments = await prisma.admissionDocument.findMany();
    console.log(`✅ Dumped ${data.admissionDocuments.length} Admission Documents`);
    
    data.collegePhotos = await prisma.collegePhoto.findMany();
    console.log(`✅ Dumped ${data.collegePhotos.length} College Photos`);
    
    data.admissionQueries = await prisma.admissionQuery.findMany();
    console.log(`✅ Dumped ${data.admissionQueries.length} Admission Queries`);
    
    data.collegePartnerInquiries = await prisma.collegePartnerInquiry.findMany();
    console.log(`✅ Dumped ${data.collegePartnerInquiries.length} College Partner Inquiries`);
    
    // 2. Write to db_dump.json
    const outputPath = path.join(__dirname, '../db_dump.json');
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`\n🎉 Database successfully dumped to ${outputPath}`);
    
  } catch (error) {
    console.error('❌ Error dumping database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
