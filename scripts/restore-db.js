const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

function parseDate(val) {
  if (!val) return null;
  return new Date(val);
}

async function main() {
  console.log('🔄 Starting data restoration to Neon PostgreSQL...');
  
  const dumpPath = path.join(__dirname, '../db_dump.json');
  if (!fs.existsSync(dumpPath)) {
    console.error('❌ Error: db_dump.json not found! Please run dump script first.');
    process.exit(1);
  }
  
  const data = JSON.parse(fs.readFileSync(dumpPath, 'utf-8'));
  
  try {
    // Clean up tables first (in reverse dependency order to avoid foreign key violations)
    console.log('🧹 Cleaning up any existing records in Neon PostgreSQL...');
    await prisma.collegePartnerInquiry.deleteMany();
    await prisma.admissionQuery.deleteMany();
    await prisma.collegePhoto.deleteMany();
    await prisma.admissionDocument.deleteMany();
    await prisma.admissionRequirement.deleteMany();
    await prisma.admissionApplication.deleteMany();
    await prisma.studentProfile.deleteMany();
    await prisma.otp.deleteMany();
    await prisma.application.deleteMany();
    await prisma.job.deleteMany();
    await prisma.course.deleteMany();
    await prisma.college.deleteMany();
    await prisma.user.deleteMany();
    console.log('✨ Clean up complete!');

    // 1. Users
    if (data.users && data.users.length > 0) {
      console.log(`\n📥 Restoring ${data.users.length} Users...`);
      for (const item of data.users) {
        await prisma.user.create({
          data: {
            ...item,
            createdAt: parseDate(item.createdAt),
            resetTokenExpires: parseDate(item.resetTokenExpires)
          }
        });
      }
      console.log('✅ Users restored.');
    }

    // 2. Student Profiles
    if (data.studentProfiles && data.studentProfiles.length > 0) {
      console.log(`\n📥 Restoring ${data.studentProfiles.length} Student Profiles...`);
      for (const item of data.studentProfiles) {
        await prisma.studentProfile.create({
          data: {
            ...item,
            dob: parseDate(item.dob),
            createdAt: parseDate(item.createdAt),
            updatedAt: parseDate(item.updatedAt)
          }
        });
      }
      console.log('✅ Student Profiles restored.');
    }

    // 3. Colleges
    if (data.colleges && data.colleges.length > 0) {
      console.log(`\n📥 Restoring ${data.colleges.length} Colleges...`);
      for (const item of data.colleges) {
        await prisma.college.create({
          data: {
            ...item,
            createdAt: parseDate(item.createdAt),
            updatedAt: parseDate(item.updatedAt)
          }
        });
      }
      console.log('✅ Colleges restored.');
    }

    // 4. Courses
    if (data.courses && data.courses.length > 0) {
      console.log(`\n📥 Restoring ${data.courses.length} Courses...`);
      for (const item of data.courses) {
        await prisma.course.create({
          data: {
            ...item,
            createdAt: parseDate(item.createdAt),
            updatedAt: parseDate(item.updatedAt)
          }
        });
      }
      console.log('✅ Courses restored.');
    }

    // 5. Jobs
    if (data.jobs && data.jobs.length > 0) {
      console.log(`\n📥 Restoring ${data.jobs.length} Jobs...`);
      for (const item of data.jobs) {
        await prisma.job.create({
          data: {
            ...item,
            createdAt: parseDate(item.createdAt),
            updatedAt: parseDate(item.updatedAt)
          }
        });
      }
      console.log('✅ Jobs restored.');
    }

    // 6. Applications
    if (data.applications && data.applications.length > 0) {
      console.log(`\n📥 Restoring ${data.applications.length} Applications...`);
      for (const item of data.applications) {
        await prisma.application.create({
          data: {
            ...item,
            createdAt: parseDate(item.createdAt)
          }
        });
      }
      console.log('✅ Applications restored.');
    }

    // 7. OTPs
    if (data.otps && data.otps.length > 0) {
      console.log(`\n📥 Restoring ${data.otps.length} OTPs...`);
      for (const item of data.otps) {
        await prisma.otp.create({
          data: {
            ...item,
            expiresAt: parseDate(item.expiresAt),
            createdAt: parseDate(item.createdAt)
          }
        });
      }
      console.log('✅ OTPs restored.');
    }

    // 8. Admission Requirements
    if (data.admissionRequirements && data.admissionRequirements.length > 0) {
      console.log(`\n📥 Restoring ${data.admissionRequirements.length} Admission Requirements...`);
      for (const item of data.admissionRequirements) {
        await prisma.admissionRequirement.create({
          data: {
            ...item,
            createdAt: parseDate(item.createdAt),
            updatedAt: parseDate(item.updatedAt)
          }
        });
      }
      console.log('✅ Admission Requirements restored.');
    }

    // 9. Admission Documents
    if (data.admissionDocuments && data.admissionDocuments.length > 0) {
      console.log(`\n📥 Restoring ${data.admissionDocuments.length} Admission Documents...`);
      for (const item of data.admissionDocuments) {
        await prisma.admissionDocument.create({
          data: {
            ...item,
            createdAt: parseDate(item.createdAt)
          }
        });
      }
      console.log('✅ Admission Documents restored.');
    }

    // 10. College Photos
    if (data.collegePhotos && data.collegePhotos.length > 0) {
      console.log(`\n📥 Restoring ${data.collegePhotos.length} College Photos...`);
      for (const item of data.collegePhotos) {
        await prisma.collegePhoto.create({
          data: {
            ...item,
            createdAt: parseDate(item.createdAt)
          }
        });
      }
      console.log('✅ College Photos restored.');
    }

    // 11. Admission Queries
    if (data.admissionQueries && data.admissionQueries.length > 0) {
      console.log(`\n📥 Restoring ${data.admissionQueries.length} Admission Queries...`);
      for (const item of data.admissionQueries) {
        await prisma.admissionQuery.create({
          data: {
            ...item,
            createdAt: parseDate(item.createdAt)
          }
        });
      }
      console.log('✅ Admission Queries restored.');
    }

    // 12. College Partner Inquiries
    if (data.collegePartnerInquiries && data.collegePartnerInquiries.length > 0) {
      console.log(`\n📥 Restoring ${data.collegePartnerInquiries.length} College Partner Inquiries...`);
      for (const item of data.collegePartnerInquiries) {
        await prisma.collegePartnerInquiry.create({
          data: {
            ...item,
            createdAt: parseDate(item.createdAt),
            updatedAt: parseDate(item.updatedAt)
          }
        });
      }
      console.log('✅ College Partner Inquiries restored.');
    }

    console.log('\n🎉 ALL DATA HAS BEEN SUCCESSFULLY TRANSFERRED TO NEON POSTGRESQL!');

  } catch (error) {
    console.error('❌ Error during data restoration:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
