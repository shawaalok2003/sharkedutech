const fs = require('fs');
const path = require('path');

const oppsDir = path.join(__dirname, 'public', 'opportunites');

function getAllJpegs(dir, relativePrefix = '/opportunites') {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllJpegs(fullPath, `${relativePrefix}/${file}`));
    } else if (file.endsWith('.jpeg') || file.endsWith('.jpg') || file.endsWith('.png')) {
      results.push(`${relativePrefix}/${file}`);
    }
  });
  return results;
}

const allImagePaths = getAllJpegs(oppsDir);
console.log(`Found ${allImagePaths.length} opportunity poster images.`);

// Map every image path to a distinct opportunity entry
const metadataMap = [
  { keywords: ['16.05.49'], title: "Angsana Oasis Spa & Resort Opportunities", company: "Angsana Oasis Spa & Resort", loc: "Bengaluru, Karnataka" },
  { keywords: ['16.05.50'], title: "Pride Hotel Bengaluru Recruitment", company: "Pride Hotel Bengaluru", loc: "Bengaluru, Karnataka" },
  { keywords: ['16.05.51'], title: "Pride Hotel Luxury Openings", company: "Pride Hotel Group", loc: "Bengaluru, Karnataka" },
  { keywords: ['16.05.52'], title: "On Job Training (OJT) – Sayaji Rewa", company: "Enrise by Sayaji, Rewa", loc: "Rewa, Madhya Pradesh" },
  { keywords: ['16.05.54'], title: "Radisson Blu Kochi Luxury Hiring", company: "Radisson Blu Kochi", loc: "Kochi, Kerala" },
  { keywords: ['16.05.55'], title: "Sales & Culinary Openings - Pride Chennai", company: "The Pride Hotel, Chennai", loc: "Chennai, Tamil Nadu" },
  { keywords: ['16.05.56'], title: "Pride Hotel Group Career Drive", company: "The Pride Hotel Group", loc: "Chennai / Pan India" },
  { keywords: ['16.05.57'], title: "Golden Tulip Candolim Goa Hiring", company: "Golden Tulip Candolim Goa (Sarovar Hotels)", loc: "Candolim, Goa" },
  { keywords: ['16.05.58'], title: "The Astor Goa Luxury Resort Hiring", company: "The Astor Goa", loc: "Candolim, North Goa" },
  { keywords: ['16.05.59'], title: "Goldfinch Hotel OJT & Recruitment", company: "Goldfinch Hotel", loc: "Mumbai, Maharashtra" },
  { keywords: ['16.06.00'], title: "Goldfinch Hotel Operations Drive", company: "Goldfinch Hotel", loc: "Mumbai, Maharashtra" },
  { keywords: ['16.06.01'], title: "Sarovar Hotels Hospitality Careers", company: "Sarovar Hotels & Resorts", loc: "Pan India" },
  { keywords: ['16.06.02'], title: "Bel-La Monde Luxury Hotel Delhi Openings", company: "Bel-La Monde Hotel Delhi", loc: "Delhi NCR" },
  { keywords: ['16.06.03'], title: "Bel-La Monde Executive Recruitment", company: "Bel-La Monde Hotel Delhi", loc: "Delhi NCR" },
  { keywords: ['16.06.04'], title: "Bel-La Monde Hotel Recruitment", company: "Bel-La Monde Hotel", loc: "Delhi NCR" },
  { keywords: ['16.06.05'], title: "GSA F&B Service - Lemon Tree Indore", company: "Lemon Tree Hotels", loc: "Indore, Madhya Pradesh" },
  { keywords: ['16.06.06'], title: "Lemon Tree Hotels Service Careers", company: "Lemon Tree Hotels", loc: "Indore, Madhya Pradesh" },
  { keywords: ['16.06.07'], title: "Radisson Individuals Career Exposure", company: "Radisson Individuals", loc: "Bangalore, Karnataka" },
  { keywords: ['16.06.08'], title: "ITC Grand Central Mumbai 5-Star OJT", company: "ITC Grand Central Mumbai (Luxury Collection)", loc: "Mumbai, Maharashtra" },
  { keywords: ['16.06.09'], title: "The Westin Goa 5-Star Luxury Recruitment", company: "The Westin Goa (Marriott International)", loc: "Anjuna, Goa" },
  { keywords: ['16.06.10'], title: "Riviera Beach Resort Openings", company: "Riviera Beach Resort", loc: "Andhra Pradesh" },
  { keywords: ['16.06.11'], title: "Club Mahindra Associate Resort Operations", company: "Colonia Santa Maria (Club Mahindra)", loc: "Baga, Goa" },
  { keywords: ['00.36.44'], title: "Luxury Hospitality Recruitment Drive", company: "Sharkedutech Placement Cell", loc: "Pan India" }
];

const seedEntries = allImagePaths.map((imgPath, index) => {
  const fileName = path.basename(imgPath);
  const matchedMeta = metadataMap.find(m => m.keywords.some(k => fileName.includes(k))) || {
    title: `Luxury Hotel Placement Opportunity ${index + 1}`,
    company: "Premium Hospitality Brand",
    loc: "India"
  };

  return {
    title: `${matchedMeta.title} #${index + 1}`,
    companyName: matchedMeta.company,
    type: index % 3 === 0 ? "On Job Training" : index % 3 === 1 ? "Full Time" : "Industrial Training",
    category: "Hotel Operations",
    location: matchedMeta.loc,
    salaryMin: 18000 + (index % 5) * 3000,
    salaryMax: 30000 + (index % 5) * 5000,
    posterUrl: imgPath,
    description: `${matchedMeta.company} is hiring for multiple positions including Front Office, Housekeeping, F&B Service, and Production. Submit your application today for premier placement support.`,
    requirements: "Degree or Diploma in Hotel Management / Hospitality. Strong service mindset and communication skills.",
    isTopOpportunity: true
  };
});

console.log(`Generated ${seedEntries.length} complete seed entries.`);

const code = `import { prisma } from "@/lib/prisma";

export const OPPORTUNITIES_DATA = ${JSON.stringify(seedEntries, null, 2)};

export async function ensureOpportunitiesSeeded() {
  try {
    let employer = await prisma.user.findFirst({
      where: { role: { in: ['ADMIN', 'EMPLOYER'] } }
    });

    if (!employer) {
      employer = await prisma.user.create({
        data: {
          email: "admin@sharkedutech.com",
          password: "hashedpassword123",
          name: "Shark Admin",
          role: "ADMIN",
          companyName: "Sharkedutech Placement Cell"
        }
      });
    }

    for (const opp of OPPORTUNITIES_DATA) {
      const existing = await prisma.job.findFirst({
        where: { posterUrl: opp.posterUrl }
      });

      const payload = {
        title: opp.title,
        companyName: opp.companyName,
        type: opp.type,
        category: opp.category,
        location: opp.location,
        salaryMin: opp.salaryMin,
        salaryMax: opp.salaryMax,
        description: opp.description,
        requirements: opp.requirements,
        posterUrl: opp.posterUrl,
        isTopOpportunity: true,
        status: "Active",
        employerId: employer.id
      };

      if (!existing) {
        await prisma.job.create({
          data: payload
        });
      } else {
        await prisma.job.update({
          where: { id: existing.id },
          data: {
            title: opp.title,
            companyName: opp.companyName,
            isTopOpportunity: true
          }
        });
      }
    }
  } catch (error) {
    console.error('[ensureOpportunitiesSeeded] Error:', error);
  }
}
`;

fs.writeFileSync(path.join(__dirname, 'src', 'lib', 'seedOpportunities.ts'), code);
console.log('Successfully updated src/lib/seedOpportunities.ts with ALL poster images!');
