-- AlterTable
ALTER TABLE "AdmissionApplication" ADD COLUMN "entranceExam" TEXT;
ALTER TABLE "AdmissionApplication" ADD COLUMN "entranceScore" TEXT;
ALTER TABLE "AdmissionApplication" ADD COLUMN "highestQualification" TEXT;
ALTER TABLE "AdmissionApplication" ADD COLUMN "intakeYear" TEXT;
ALTER TABLE "AdmissionApplication" ADD COLUMN "notes" TEXT;
ALTER TABLE "AdmissionApplication" ADD COLUMN "percentage" TEXT;

-- AlterTable
ALTER TABLE "College" ADD COLUMN "accreditation" TEXT;
ALTER TABLE "College" ADD COLUMN "admissionProcess" TEXT;
ALTER TABLE "College" ADD COLUMN "affiliation" TEXT;
ALTER TABLE "College" ADD COLUMN "applicationFee" INTEGER;
ALTER TABLE "College" ADD COLUMN "avgPackage" TEXT;
ALTER TABLE "College" ADD COLUMN "brochureUrl" TEXT;
ALTER TABLE "College" ADD COLUMN "campusArea" TEXT;
ALTER TABLE "College" ADD COLUMN "eligibility" TEXT;
ALTER TABLE "College" ADD COLUMN "establishedYear" INTEGER;
ALTER TABLE "College" ADD COLUMN "facilities" TEXT;
ALTER TABLE "College" ADD COLUMN "hostelAvailable" BOOLEAN DEFAULT false;
ALTER TABLE "College" ADD COLUMN "placementRate" TEXT;
ALTER TABLE "College" ADD COLUMN "ranking" TEXT;
ALTER TABLE "College" ADD COLUMN "scholarships" TEXT;
ALTER TABLE "College" ADD COLUMN "topRecruiters" TEXT;
ALTER TABLE "College" ADD COLUMN "totalSeats" INTEGER;

-- AlterTable
ALTER TABLE "Course" ADD COLUMN "admissionCriteria" TEXT;
ALTER TABLE "Course" ADD COLUMN "applicationDeadline" TEXT;
ALTER TABLE "Course" ADD COLUMN "code" TEXT;
ALTER TABLE "Course" ADD COLUMN "eligibility" TEXT;
ALTER TABLE "Course" ADD COLUMN "feesBreakup" TEXT;
ALTER TABLE "Course" ADD COLUMN "intakeMonth" TEXT;
ALTER TABLE "Course" ADD COLUMN "mode" TEXT;
ALTER TABLE "Course" ADD COLUMN "placementSupport" BOOLEAN DEFAULT false;
ALTER TABLE "Course" ADD COLUMN "scholarshipAvailable" BOOLEAN DEFAULT false;
ALTER TABLE "Course" ADD COLUMN "syllabusUrl" TEXT;
