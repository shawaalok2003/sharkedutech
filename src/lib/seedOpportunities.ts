import { prisma } from "@/lib/prisma";

export const OPPORTUNITIES_DATA = [
  {
    title: "Angsana Oasis Spa & Resort Opportunities",
    companyName: "Angsana Oasis Spa & Resort",
    type: "Full Time",
    category: "Housekeeping & Spa",
    location: "Bengaluru, Karnataka",
    salaryMin: 22000,
    salaryMax: 35000,
    posterUrl: "/opportunites/WhatsApp Image 2026-08-12 at 16.05.49.jpeg",
    description: "Angsana Oasis Spa & Resort Bengaluru is hiring for Housekeeping (4 Positions) and Female Spa Receptionist (1 Position). Be part of a prestigious 5-star hospitality brand, grow your career with industry experts, and work in a peaceful & luxurious environment.",
    requirements: "Experience in luxury hotel operations or hospitality diploma. Strong interpersonal and guest relation skills.",
    isTopOpportunity: true,
  },
  {
    title: "On Job Training (OJT) – F&B Service & Front Office",
    companyName: "Enrise by Sayaji, Rewa",
    type: "On Job Training",
    category: "Front Office",
    location: "Rewa, Madhya Pradesh",
    salaryMin: 15000,
    salaryMax: 22000,
    posterUrl: "/opportunites/WhatsApp Image 2026-08-12 at 16.05.52.jpeg",
    description: "Sayaji Hotels is conducting On Job Training (OJT) programs for F&B Service and Front Office departments at Enrise by Sayaji, Rewa. Ideal for hospitality students seeking practical hands-on experience in 4-star luxury operations.",
    requirements: "Currently pursuing or recently completed Diploma/Degree in Hotel Management. Passionate about guest service.",
    isTopOpportunity: true,
  },
  {
    title: "Bel-La Monde Luxury Hotel Recruitment",
    companyName: "Bel-La Monde Hotel",
    type: "Full Time",
    category: "Culinary & Management",
    location: "Delhi NCR",
    salaryMin: 28000,
    salaryMax: 55000,
    posterUrl: "/opportunites/WhatsApp Image 2026-08-12 at 16.06.04.jpeg",
    description: "Bel-La Monde Hotel, Delhi is hiring for Pan Asian Cuisine (CDP & Sous Chef), Marketing Manager (1), Account Assistant (2), AM Account (2), Stewards (10), Captain (5), AM / Executive HR (2).",
    requirements: "1 to 4 years experience in luxury hotels/resorts. Excellent leadership and operational capabilities.",
    isTopOpportunity: true,
  },
  {
    title: "Club Mahindra Associate Resort Operations",
    companyName: "Colonia Santa Maria (Club Mahindra)",
    type: "Full Time",
    category: "Resort Operations",
    location: "Baga, Goa",
    salaryMin: 25000,
    salaryMax: 48000,
    posterUrl: "/opportunites/WhatsApp Image 2026-08-12 at 16.06.10.jpeg",
    description: "Colonia Santa Maria, A Club Mahindra Associate at Baga, Goa is hiring across Front Office (Supervisor, GSA, Bell Boy), Housekeeping (Asst Manager HK, Executive, Supervisor), F&B Service (Bartender, Supervisor), F&B Production (Sous Chef, CDP, Commi I/II), and Support Departments.",
    requirements: "Prior resort or hotel experience preferred. Willingness to relocate to Baga, Goa.",
    isTopOpportunity: true,
  },
  {
    title: "Industrial Trainee - F&B Production",
    companyName: "Cygnett Style Ganga Jaipur (Sarovar Portico)",
    type: "Industrial Training",
    category: "F&B Production",
    location: "Jaipur, Rajasthan",
    salaryMin: 12000,
    salaryMax: 18000,
    posterUrl: "/opportunites/WhatsApp Unknown 2026-08-13 at 01.48.13/WhatsApp Image 2026-08-12 at 16.05.49 (1).jpeg",
    description: "Cygnett Style Ganga Jaipur (A Sarovar Portico Hotel) is hiring Industrial Trainees for F&B Production. Kickstart your future with real-time experience in the hospitality industry.",
    requirements: "Hospitality students or recent diploma holders seeking hands-on culinary training.",
    isTopOpportunity: true,
  },
  {
    title: "Pride Hotel Bengaluru Recruitment",
    companyName: "Pride Hotel Bengaluru",
    type: "Full Time",
    category: "Housekeeping & FO",
    location: "Bengaluru, Karnataka",
    salaryMin: 23000,
    salaryMax: 36000,
    posterUrl: "/opportunites/WhatsApp Unknown 2026-08-13 at 01.48.13/WhatsApp Image 2026-08-12 at 16.05.50 (1).jpeg",
    description: "Pride Hotel Bengaluru is hiring Housekeeping - GSA, Food and Beverage - GSA, and Telephone Operator. Candidates with prior 3-star to 5-star hotel experience are eligible.",
    requirements: "3-5 star hotel experience preferred. Excellent spoken English and hospitality demeanor.",
    isTopOpportunity: true,
  },
  {
    title: "Radisson Blu Kochi Luxury Hiring",
    companyName: "Radisson Blu Kochi",
    type: "Full Time",
    category: "Hotel Operations",
    location: "Kochi, Kerala",
    salaryMin: 26000,
    salaryMax: 50000,
    posterUrl: "/opportunites/WhatsApp Unknown 2026-08-13 at 01.48.24/WhatsApp Image 2026-08-12 at 16.05.54.jpeg",
    description: "Radisson Blu Kochi is looking for F&B Controller-Supervisor, Guest Service Associate Front Office, Guest Service Associate F&B Service, Guest Service Associate Housekeeping, and Duty Manager (Opera knowledge is must). Minimum 1 year experience with international hotel brands required.",
    requirements: "Minimum 1 year experience in international hotel brands. Strong departmental ownership.",
    isTopOpportunity: true,
  },
  {
    title: "Sales, Food Production & F&B Service Openings",
    companyName: "The Pride Hotel, Chennai",
    type: "Full Time",
    category: "F&B Production & Sales",
    location: "Chennai, Tamil Nadu",
    salaryMin: 24000,
    salaryMax: 42000,
    posterUrl: "/opportunites/WhatsApp Unknown 2026-08-13 at 01.48.24/WhatsApp Image 2026-08-12 at 16.05.55 (1).jpeg",
    description: "The Pride Hotel Chennai is looking for passionate hospitality professionals: Sales & Marketing Executive, Marketing Coordinator, Assistant Manager Finance, Sous Chef, Tandoor Commis, Indian Commis, Bakery Commis, F&B Associates & Captains (4 Positions). Immediate joiners preferred.",
    requirements: "Degree/Diploma in Hotel Management. Strong technical skills in respective departmental specialization.",
    isTopOpportunity: true,
  },
  {
    title: "Golden Tulip Candolim Goa Hiring",
    companyName: "Golden Tulip Candolim Goa (Sarovar Hotels)",
    type: "Full Time",
    category: "Front Office & Sales",
    location: "Candolim, Goa",
    salaryMin: 26000,
    salaryMax: 50000,
    posterUrl: "/opportunites/WhatsApp Unknown 2026-08-13 at 01.48.24/WhatsApp Image 2026-08-12 at 16.05.57 (1).jpeg",
    description: "Sarovar Hotels is seeking Front Office Associate, Duty Manager / Front Office Executive, GSA Housekeeping, Housekeeping Supervisor, Unit Sales Manager, Reservation Executive, and Commi I/II for Golden Tulip Candolim Goa.",
    requirements: "Relevant hospitality experience required. Ready to relocate to Candolim, Goa.",
    isTopOpportunity: true,
  },
  {
    title: "The Astor Goa Luxury Resort Hiring",
    companyName: "The Astor Goa",
    type: "Full Time",
    category: "Resort Operations",
    location: "Candolim, North Goa",
    salaryMin: 23000,
    salaryMax: 40000,
    posterUrl: "/opportunites/WhatsApp Unknown 2026-08-13 at 01.48.24/WhatsApp Image 2026-08-12 at 16.05.58.jpeg",
    description: "The Astor Goa at Candolim North Goa is hiring F&B GSA / Steward, Room Attendant / GSA - Housekeeping, and Front Office Associate.",
    requirements: "Hospitality experience or hotel management degree. Email CV to hr@astorgoa.com.",
    isTopOpportunity: true,
  },
  {
    title: "Goldfinch Hotel OJT & Departmental Recruitment",
    companyName: "Goldfinch Hotel",
    type: "Full Time / OJT",
    category: "Operations",
    location: "Mumbai, Maharashtra",
    salaryMin: 20000,
    salaryMax: 38000,
    posterUrl: "/opportunites/WhatsApp Unknown 2026-08-13 at 01.48.24/WhatsApp Image 2026-08-12 at 16.05.59.jpeg",
    description: "Goldfinch Hotel Mumbai is hiring OJT - 4 Positions, F&B Service - 2 Positions, Food Production - 1 Position, Housekeeping - 1 Position.",
    requirements: "Enthusiastic candidates seeking growth in Mumbai's premier hospitality sector.",
    isTopOpportunity: true,
  },
  {
    title: "Bel-La Monde Luxury Hotel Delhi Openings",
    companyName: "Bel-La Monde Hotel Delhi",
    type: "Full Time",
    category: "Culinary & Management",
    location: "Delhi NCR",
    salaryMin: 28000,
    salaryMax: 52000,
    posterUrl: "/opportunites/WhatsApp Unknown 2026-08-13 at 01.48.24/WhatsApp Image 2026-08-12 at 16.06.02 (1).jpeg",
    description: "Bel-La Monde Hotel Delhi hiring drive for Pan Asian Cuisine CDP & Sous Chef, Marketing Manager, Account Assistant, AM Account, Stewards (10), Captain (5), AM / Executive HR (2).",
    requirements: "1 to 4 years experience in luxury hotels or resorts.",
    isTopOpportunity: true,
  },
  {
    title: "Guest Service Associate (GSA) - Lemon Tree Indore",
    companyName: "Lemon Tree Hotels",
    type: "Full Time",
    category: "F&B Service",
    location: "Indore, Madhya Pradesh",
    salaryMin: 22000,
    salaryMax: 30000,
    posterUrl: "/opportunites/WhatsApp Unknown 2026-08-13 at 01.48.30/WhatsApp Image 2026-08-12 at 16.06.05.jpeg",
    description: "Lemon Tree Hotels Indore is hiring Guest Service Associates (GSA) for Food & Beverage Service department. Work with one of India's leading hotel chains.",
    requirements: "Good communication skills, pleasant demeanor, qualification in hotel management.",
    isTopOpportunity: true,
  },
  {
    title: "On Job Training (OJT) in Radisson Network",
    companyName: "The Elite Narasapura (Radisson Individuals)",
    type: "On Job Training",
    category: "On Job Training",
    location: "Bangalore, Karnataka",
    salaryMin: 18000,
    salaryMax: 26000,
    posterUrl: "/opportunites/WhatsApp Unknown 2026-08-13 at 01.48.30/WhatsApp Image 2026-08-12 at 16.06.08.jpeg",
    description: "The Elite Narasapura, a member of Radisson Individuals, is inviting applications for OJT in F&B Service, OJT in Housekeeping, and OJT in Front Office. Build your career with Radisson Individuals.",
    requirements: "Hospitality students looking for hands-on exposure at a premier 5-star brand property.",
    isTopOpportunity: true,
  },
  {
    title: "ITC Grand Central Mumbai 5-Star Luxury OJT",
    companyName: "ITC Grand Central Mumbai (Luxury Collection)",
    type: "On Job Training",
    category: "Luxury Hotel Operations",
    location: "Mumbai, Maharashtra",
    salaryMin: 20000,
    salaryMax: 28000,
    posterUrl: "/opportunites/WhatsApp Unknown 2026-08-13 at 01.48.30/WhatsApp Image 2026-08-12 at 16.06.08 (1).jpeg",
    description: "ITC Grand Central Mumbai, A Luxury Collection Hotel, is hiring for OJT in F&B Service and OJT in Food Production. Learn from industry experts and get world-class exposure.",
    requirements: "Hospitality students or graduates aiming for careers with ITC Hotels.",
    isTopOpportunity: true,
  },
  {
    title: "The Westin Goa 5-Star Luxury Recruitment",
    companyName: "The Westin Goa (Marriott International)",
    type: "Full Time / OJT",
    category: "Luxury Hotel Operations",
    location: "Anjuna, Goa",
    salaryMin: 28000,
    salaryMax: 55000,
    posterUrl: "/opportunites/WhatsApp Unknown 2026-08-13 at 01.48.30/WhatsApp Image 2026-08-12 at 16.06.08 (2).jpeg",
    description: "The Westin Goa is hiring for IT, On Job Training (OJT), F&B Service Job, and Front Office Job. Join Marriott International's premier luxury brand.",
    requirements: "Enthusiastic hospitality graduates or IT professionals. Premium Marriott standard service mindset.",
    isTopOpportunity: true,
  },
  {
    title: "The Westin Goa Luxury Careers Drive",
    companyName: "The Westin Goa",
    type: "Full Time",
    category: "Front Office & F&B",
    location: "Anjuna, Goa",
    salaryMin: 29000,
    salaryMax: 56000,
    posterUrl: "/opportunites/WhatsApp Unknown 2026-08-13 at 01.48.30/WhatsApp Image 2026-08-12 at 16.06.09 (1).jpeg",
    description: "The Westin Goa experience well-being recruitment drive for IT, OJT, F&B Service, and Front Office positions.",
    requirements: "Work with the best, learn & develop, build a bright future.",
    isTopOpportunity: true,
  },
  {
    title: "Astor Goa Luxury Hotel Vacancies",
    companyName: "Astor Goa",
    type: "Full Time / OJT",
    category: "Housekeeping & IT",
    location: "Candolim, Goa",
    salaryMin: 24000,
    salaryMax: 45000,
    posterUrl: "/opportunites/WhatsApp Unknown 2026-08-13 at 01.48.30/WhatsApp Image 2026-08-12 at 16.06.09 (2).jpeg",
    description: "Astor Goa is looking for IT executives, OJT in Housekeeping, and Housekeeping staff to deliver timeless hospitality in the heart of Goa.",
    requirements: "Background in luxury hospitality or hotel IT systems.",
    isTopOpportunity: true,
  },
  {
    title: "Astor Goa Timeless Hospitality Recruitment",
    companyName: "The Astor Goa",
    type: "Full Time",
    category: "Resort Operations",
    location: "Candolim, Goa",
    salaryMin: 25000,
    salaryMax: 46000,
    posterUrl: "/opportunites/WhatsApp Unknown 2026-08-13 at 01.48.30/WhatsApp Image 2026-08-12 at 16.06.09.jpeg",
    description: "Join the team delivering exceptional experiences every day at Astor Goa. Positions open in IT, OJT in Housekeeping, and Housekeeping jobs.",
    requirements: "Prior resort or hotel experience preferred.",
    isTopOpportunity: true,
  },
  {
    title: "Riviera Beach Resort Openings",
    companyName: "Riviera Beach Resort",
    type: "Full Time",
    category: "Front Office & F&B",
    location: "Andhra Pradesh",
    salaryMin: 22000,
    salaryMax: 38000,
    posterUrl: "/opportunites/WhatsApp Unknown 2026-08-13 at 01.48.30/WhatsApp Image 2026-08-12 at 16.06.10 (1).jpeg",
    description: "Riviera Beach Resort Andhra Pradesh is hiring Reservation Executive (2 Vacancies), Front Office Associate (2 Vacancies), and F&B Hostess (1 Vacancy).",
    requirements: "Strong communication and customer relations experience in resort environments.",
    isTopOpportunity: true,
  }
];

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
        where: { title: opp.title }
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
            posterUrl: opp.posterUrl,
            isTopOpportunity: true
          }
        });
      }
    }
  } catch (error) {
    console.error('[ensureOpportunitiesSeeded] Error:', error);
  }
}
