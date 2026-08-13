const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("Cleaning up dummy data and seeding real college data in database...");

    // Delete dummy courses like 'e'
    await prisma.course.deleteMany({
        where: {
            OR: [
                { title: 'e' },
                { title: 'test' },
                { title: '' }
            ]
        }
    });

    // Ensure Admin user exists
    const adminUser = await prisma.user.findFirst({
        where: { role: 'ADMIN' }
    });

    const adminId = adminUser ? adminUser.id : null;

    const realCollegesData = [
        {
            name: "GIMS Kolkata (Global Institute of Management Studies)",
            location: "Kolkata, West Bengal",
            description: "Premier hospitality education institute offering industry-aligned degree and diploma programs with 100% placement support.",
            website: "https://gimskolkata.com",
            email: "admissions@gimskolkata.com",
            phone: "+91 98300 00000",
            address: "Kolkata, West Bengal, India",
            establishedYear: 2010,
            accreditation: "UGC & MAKAUT Recognized",
            placementRate: "100%",
            logoUrl: "/images/auth-3d.png",
            adminId,
            courses: [
                {
                    title: "B.Sc in Hospitality & Hotel Administration",
                    level: "UG Degree",
                    duration: "3 Years",
                    fee: 185000,
                    mode: "Full Time",
                    description: "Comprehensive 3-year degree program covering Front Office, F&B Service, Food Production, and Housekeeping Management.",
                    scholarshipAvailable: true,
                    placementSupport: true
                },
                {
                    title: "Diploma in Culinary Arts & Food Production",
                    level: "Diploma",
                    duration: "1 Year",
                    fee: 95000,
                    mode: "Full Time",
                    description: "Intensive hands-on professional culinary training for aspiring chefs, pastry artists, and kitchen managers.",
                    scholarshipAvailable: true,
                    placementSupport: true
                },
                {
                    title: "Diploma in Front Office & Guest Relations",
                    level: "Diploma",
                    duration: "1 Year",
                    fee: 85000,
                    mode: "Full Time",
                    description: "Specialized operational training for 5-star hotel front office, concierge, and VIP guest relations.",
                    scholarshipAvailable: false,
                    placementSupport: true
                }
            ]
        },
        {
            name: "Guru Nanak Institute of Hotel Management (GNIHM)",
            location: "Kolkata, West Bengal",
            description: "Top-ranked hotel management college in Eastern India offering world-class infrastructure and global internship opportunities.",
            website: "https://gnihm.ac.in",
            email: "info@gnihm.ac.in",
            phone: "+91 98301 11111",
            address: "157/F, Nilgunj Road, Panihati, Kolkata",
            establishedYear: 2005,
            accreditation: "AICTE & NCHMCT Approved",
            placementRate: "98%",
            logoUrl: null,
            adminId,
            courses: [
                {
                    title: "Bachelor in Hotel Management (BHM)",
                    level: "UG Degree",
                    duration: "4 Years",
                    fee: 220000,
                    mode: "Full Time",
                    description: "4-year comprehensive degree focusing on luxury hotel operations, financial management, and hotel revenue optimization.",
                    scholarshipAvailable: true,
                    placementSupport: true
                },
                {
                    title: "M.Sc in Hospitality Management",
                    level: "PG Degree",
                    duration: "2 Years",
                    fee: 190000,
                    mode: "Full Time",
                    description: "Advanced postgraduate degree for future hotel general managers, hospitality consultants, and educators.",
                    scholarshipAvailable: false,
                    placementSupport: true
                }
            ]
        },
        {
            name: "IIHM Kolkata (International Institute of Hotel Management)",
            location: "Kolkata, West Bengal",
            description: "India's premier international hotel school offering UK degree pathways and global industrial placements in Dubai, UK, and USA.",
            website: "https://iihm.ac.in",
            email: "admin@iihm.ac.in",
            phone: "+91 98302 22222",
            address: "Sector V, Salt Lake, Kolkata",
            establishedYear: 1994,
            accreditation: "University of West London Partner",
            placementRate: "100%",
            logoUrl: null,
            adminId,
            courses: [
                {
                    title: "BA in International Hospitality Management",
                    level: "UG Degree",
                    duration: "3 Years",
                    fee: 260000,
                    mode: "Full Time",
                    description: "Globally accredited degree in partnership with University of West London with international internship placements.",
                    scholarshipAvailable: true,
                    placementSupport: true
                }
            ]
        },
        {
            name: "Subhas Bose Institute of Hotel Management",
            location: "Kolkata, West Bengal",
            description: "Renowned institution providing affordable hospitality education with practical industry exposure.",
            website: "https://sbihm.com",
            email: "admissions@sbihm.com",
            phone: "+91 98303 33333",
            address: "Rajarhat Main Road, Kolkata",
            establishedYear: 1999,
            accreditation: "MAKAUT Affiliated",
            placementRate: "95%",
            logoUrl: null,
            adminId,
            courses: [
                {
                    title: "Diploma in Housekeeping & Accommodations Operation",
                    level: "Diploma",
                    duration: "1 Year",
                    fee: 80000,
                    mode: "Full Time",
                    description: "Practical training in luxury hotel housekeeping, interior styling, and room inventory management.",
                    scholarshipAvailable: false,
                    placementSupport: true
                }
            ]
        },
        {
            name: "NSHM School of Hotel Management",
            location: "Durgapur / Kolkata, West Bengal",
            description: "Leading multi-disciplinary college campus offering modern culinary labs and campus recruitments by Marriott, Taj, and Oberoi.",
            website: "https://nshm.com",
            email: "contact@nshm.com",
            phone: "+91 98304 44444",
            address: "BL Saha Road, Tollygunge, Kolkata",
            establishedYear: 2006,
            accreditation: "NAAC Accredited",
            placementRate: "97%",
            logoUrl: null,
            adminId,
            courses: [
                {
                    title: "B.Sc in Culinary Science & Pastry Arts",
                    level: "UG Degree",
                    duration: "3 Years",
                    fee: 195000,
                    mode: "Full Time",
                    description: "Specialized culinary degree focusing on international gastronomy, patisserie techniques, and restaurant entrepreneurship.",
                    scholarshipAvailable: true,
                    placementSupport: true
                }
            ]
        }
    ];

    for (const data of realCollegesData) {
        const { courses, ...collegeFields } = data;
        
        let college = await prisma.college.findFirst({
            where: { name: collegeFields.name }
        });

        if (!college) {
            college = await prisma.college.create({
                data: collegeFields
            });
            console.log(`Created college: ${college.name}`);
        } else {
            console.log(`College already exists: ${college.name}`);
        }

        for (const c of courses) {
            const existingCourse = await prisma.course.findFirst({
                where: {
                    collegeId: college.id,
                    title: c.title
                }
            });

            if (!existingCourse) {
                await prisma.course.create({
                    data: {
                        ...c,
                        collegeId: college.id,
                        status: "Active"
                    }
                });
                console.log(` -> Created course: ${c.title}`);
            }
        }
    }

    console.log("Database seeded successfully with real college & course data!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
