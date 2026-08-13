import { prisma } from "@/lib/prisma";

export const OPPORTUNITIES_DATA = [
  {
    "title": "Angsana Oasis Spa & Resort Opportunities #1",
    "companyName": "Angsana Oasis Spa & Resort",
    "type": "On Job Training",
    "category": "Hotel Operations",
    "location": "Bengaluru, Karnataka",
    "salaryMin": 18000,
    "salaryMax": 30000,
    "posterUrl": "/opportunites/WhatsApp Image 2026-08-12 at 16.05.49.jpeg",
    "description": "Angsana Oasis Spa & Resort is hiring for multiple positions including Front Office, Housekeeping, F&B Service, and Production. Submit your application today for premier placement support.",
    "requirements": "Degree or Diploma in Hotel Management / Hospitality. Strong service mindset and communication skills.",
    "isTopOpportunity": true
  },
  {
    "title": "On Job Training (OJT) – Sayaji Rewa #2",
    "companyName": "Enrise by Sayaji, Rewa",
    "type": "Full Time",
    "category": "Hotel Operations",
    "location": "Rewa, Madhya Pradesh",
    "salaryMin": 21000,
    "salaryMax": 35000,
    "posterUrl": "/opportunites/WhatsApp Image 2026-08-12 at 16.05.52.jpeg",
    "description": "Enrise by Sayaji, Rewa is hiring for multiple positions including Front Office, Housekeeping, F&B Service, and Production. Submit your application today for premier placement support.",
    "requirements": "Degree or Diploma in Hotel Management / Hospitality. Strong service mindset and communication skills.",
    "isTopOpportunity": true
  },
  {
    "title": "Bel-La Monde Hotel Recruitment #3",
    "companyName": "Bel-La Monde Hotel",
    "type": "Industrial Training",
    "category": "Hotel Operations",
    "location": "Delhi NCR",
    "salaryMin": 24000,
    "salaryMax": 40000,
    "posterUrl": "/opportunites/WhatsApp Image 2026-08-12 at 16.06.04.jpeg",
    "description": "Bel-La Monde Hotel is hiring for multiple positions including Front Office, Housekeeping, F&B Service, and Production. Submit your application today for premier placement support.",
    "requirements": "Degree or Diploma in Hotel Management / Hospitality. Strong service mindset and communication skills.",
    "isTopOpportunity": true
  },
  {
    "title": "Riviera Beach Resort Openings #4",
    "companyName": "Riviera Beach Resort",
    "type": "On Job Training",
    "category": "Hotel Operations",
    "location": "Andhra Pradesh",
    "salaryMin": 27000,
    "salaryMax": 45000,
    "posterUrl": "/opportunites/WhatsApp Image 2026-08-12 at 16.06.10.jpeg",
    "description": "Riviera Beach Resort is hiring for multiple positions including Front Office, Housekeeping, F&B Service, and Production. Submit your application today for premier placement support.",
    "requirements": "Degree or Diploma in Hotel Management / Hospitality. Strong service mindset and communication skills.",
    "isTopOpportunity": true
  },
  {
    "title": "Club Mahindra Associate Resort Operations #5",
    "companyName": "Colonia Santa Maria (Club Mahindra)",
    "type": "Full Time",
    "category": "Hotel Operations",
    "location": "Baga, Goa",
    "salaryMin": 30000,
    "salaryMax": 50000,
    "posterUrl": "/opportunites/WhatsApp Image 2026-08-12 at 16.06.11.jpeg",
    "description": "Colonia Santa Maria (Club Mahindra) is hiring for multiple positions including Front Office, Housekeeping, F&B Service, and Production. Submit your application today for premier placement support.",
    "requirements": "Degree or Diploma in Hotel Management / Hospitality. Strong service mindset and communication skills.",
    "isTopOpportunity": true
  },
  {
    "title": "Luxury Hospitality Recruitment Drive #6",
    "companyName": "Sharkedutech Placement Cell",
    "type": "Industrial Training",
    "category": "Hotel Operations",
    "location": "Pan India",
    "salaryMin": 18000,
    "salaryMax": 30000,
    "posterUrl": "/opportunites/WhatsApp Image 2026-08-13 at 00.36.44 (1).jpeg",
    "description": "Sharkedutech Placement Cell is hiring for multiple positions including Front Office, Housekeeping, F&B Service, and Production. Submit your application today for premier placement support.",
    "requirements": "Degree or Diploma in Hotel Management / Hospitality. Strong service mindset and communication skills.",
    "isTopOpportunity": true
  },
  {
    "title": "Luxury Hospitality Recruitment Drive #7",
    "companyName": "Sharkedutech Placement Cell",
    "type": "On Job Training",
    "category": "Hotel Operations",
    "location": "Pan India",
    "salaryMin": 21000,
    "salaryMax": 35000,
    "posterUrl": "/opportunites/WhatsApp Image 2026-08-13 at 00.36.44.jpeg",
    "description": "Sharkedutech Placement Cell is hiring for multiple positions including Front Office, Housekeeping, F&B Service, and Production. Submit your application today for premier placement support.",
    "requirements": "Degree or Diploma in Hotel Management / Hospitality. Strong service mindset and communication skills.",
    "isTopOpportunity": true
  },
  {
    "title": "Angsana Oasis Spa & Resort Opportunities #8",
    "companyName": "Angsana Oasis Spa & Resort",
    "type": "Full Time",
    "category": "Hotel Operations",
    "location": "Bengaluru, Karnataka",
    "salaryMin": 24000,
    "salaryMax": 40000,
    "posterUrl": "/opportunites/WhatsApp Unknown 2026-08-13 at 01.48.13/WhatsApp Image 2026-08-12 at 16.05.49 (1).jpeg",
    "description": "Angsana Oasis Spa & Resort is hiring for multiple positions including Front Office, Housekeeping, F&B Service, and Production. Submit your application today for premier placement support.",
    "requirements": "Degree or Diploma in Hotel Management / Hospitality. Strong service mindset and communication skills.",
    "isTopOpportunity": true
  },
  {
    "title": "Angsana Oasis Spa & Resort Opportunities #9",
    "companyName": "Angsana Oasis Spa & Resort",
    "type": "Industrial Training",
    "category": "Hotel Operations",
    "location": "Bengaluru, Karnataka",
    "salaryMin": 27000,
    "salaryMax": 45000,
    "posterUrl": "/opportunites/WhatsApp Unknown 2026-08-13 at 01.48.13/WhatsApp Image 2026-08-12 at 16.05.49.jpeg",
    "description": "Angsana Oasis Spa & Resort is hiring for multiple positions including Front Office, Housekeeping, F&B Service, and Production. Submit your application today for premier placement support.",
    "requirements": "Degree or Diploma in Hotel Management / Hospitality. Strong service mindset and communication skills.",
    "isTopOpportunity": true
  },
  {
    "title": "Pride Hotel Bengaluru Recruitment #10",
    "companyName": "Pride Hotel Bengaluru",
    "type": "On Job Training",
    "category": "Hotel Operations",
    "location": "Bengaluru, Karnataka",
    "salaryMin": 30000,
    "salaryMax": 50000,
    "posterUrl": "/opportunites/WhatsApp Unknown 2026-08-13 at 01.48.13/WhatsApp Image 2026-08-12 at 16.05.50 (1).jpeg",
    "description": "Pride Hotel Bengaluru is hiring for multiple positions including Front Office, Housekeeping, F&B Service, and Production. Submit your application today for premier placement support.",
    "requirements": "Degree or Diploma in Hotel Management / Hospitality. Strong service mindset and communication skills.",
    "isTopOpportunity": true
  },
  {
    "title": "Pride Hotel Bengaluru Recruitment #11",
    "companyName": "Pride Hotel Bengaluru",
    "type": "Full Time",
    "category": "Hotel Operations",
    "location": "Bengaluru, Karnataka",
    "salaryMin": 18000,
    "salaryMax": 30000,
    "posterUrl": "/opportunites/WhatsApp Unknown 2026-08-13 at 01.48.13/WhatsApp Image 2026-08-12 at 16.05.50.jpeg",
    "description": "Pride Hotel Bengaluru is hiring for multiple positions including Front Office, Housekeeping, F&B Service, and Production. Submit your application today for premier placement support.",
    "requirements": "Degree or Diploma in Hotel Management / Hospitality. Strong service mindset and communication skills.",
    "isTopOpportunity": true
  },
  {
    "title": "Pride Hotel Luxury Openings #12",
    "companyName": "Pride Hotel Group",
    "type": "Industrial Training",
    "category": "Hotel Operations",
    "location": "Bengaluru, Karnataka",
    "salaryMin": 21000,
    "salaryMax": 35000,
    "posterUrl": "/opportunites/WhatsApp Unknown 2026-08-13 at 01.48.13/WhatsApp Image 2026-08-12 at 16.05.51.jpeg",
    "description": "Pride Hotel Group is hiring for multiple positions including Front Office, Housekeeping, F&B Service, and Production. Submit your application today for premier placement support.",
    "requirements": "Degree or Diploma in Hotel Management / Hospitality. Strong service mindset and communication skills.",
    "isTopOpportunity": true
  },
  {
    "title": "On Job Training (OJT) – Sayaji Rewa #13",
    "companyName": "Enrise by Sayaji, Rewa",
    "type": "On Job Training",
    "category": "Hotel Operations",
    "location": "Rewa, Madhya Pradesh",
    "salaryMin": 24000,
    "salaryMax": 40000,
    "posterUrl": "/opportunites/WhatsApp Unknown 2026-08-13 at 01.48.13/WhatsApp Image 2026-08-12 at 16.05.52.jpeg",
    "description": "Enrise by Sayaji, Rewa is hiring for multiple positions including Front Office, Housekeeping, F&B Service, and Production. Submit your application today for premier placement support.",
    "requirements": "Degree or Diploma in Hotel Management / Hospitality. Strong service mindset and communication skills.",
    "isTopOpportunity": true
  },
  {
    "title": "Radisson Blu Kochi Luxury Hiring #14",
    "companyName": "Radisson Blu Kochi",
    "type": "Full Time",
    "category": "Hotel Operations",
    "location": "Kochi, Kerala",
    "salaryMin": 27000,
    "salaryMax": 45000,
    "posterUrl": "/opportunites/WhatsApp Unknown 2026-08-13 at 01.48.24/WhatsApp Image 2026-08-12 at 16.05.54 (1).jpeg",
    "description": "Radisson Blu Kochi is hiring for multiple positions including Front Office, Housekeeping, F&B Service, and Production. Submit your application today for premier placement support.",
    "requirements": "Degree or Diploma in Hotel Management / Hospitality. Strong service mindset and communication skills.",
    "isTopOpportunity": true
  },
  {
    "title": "Radisson Blu Kochi Luxury Hiring #15",
    "companyName": "Radisson Blu Kochi",
    "type": "Industrial Training",
    "category": "Hotel Operations",
    "location": "Kochi, Kerala",
    "salaryMin": 30000,
    "salaryMax": 50000,
    "posterUrl": "/opportunites/WhatsApp Unknown 2026-08-13 at 01.48.24/WhatsApp Image 2026-08-12 at 16.05.54 (2).jpeg",
    "description": "Radisson Blu Kochi is hiring for multiple positions including Front Office, Housekeeping, F&B Service, and Production. Submit your application today for premier placement support.",
    "requirements": "Degree or Diploma in Hotel Management / Hospitality. Strong service mindset and communication skills.",
    "isTopOpportunity": true
  },
  {
    "title": "Radisson Blu Kochi Luxury Hiring #16",
    "companyName": "Radisson Blu Kochi",
    "type": "On Job Training",
    "category": "Hotel Operations",
    "location": "Kochi, Kerala",
    "salaryMin": 18000,
    "salaryMax": 30000,
    "posterUrl": "/opportunites/WhatsApp Unknown 2026-08-13 at 01.48.24/WhatsApp Image 2026-08-12 at 16.05.54.jpeg",
    "description": "Radisson Blu Kochi is hiring for multiple positions including Front Office, Housekeeping, F&B Service, and Production. Submit your application today for premier placement support.",
    "requirements": "Degree or Diploma in Hotel Management / Hospitality. Strong service mindset and communication skills.",
    "isTopOpportunity": true
  },
  {
    "title": "Sales & Culinary Openings - Pride Chennai #17",
    "companyName": "The Pride Hotel, Chennai",
    "type": "Full Time",
    "category": "Hotel Operations",
    "location": "Chennai, Tamil Nadu",
    "salaryMin": 21000,
    "salaryMax": 35000,
    "posterUrl": "/opportunites/WhatsApp Unknown 2026-08-13 at 01.48.24/WhatsApp Image 2026-08-12 at 16.05.55 (1).jpeg",
    "description": "The Pride Hotel, Chennai is hiring for multiple positions including Front Office, Housekeeping, F&B Service, and Production. Submit your application today for premier placement support.",
    "requirements": "Degree or Diploma in Hotel Management / Hospitality. Strong service mindset and communication skills.",
    "isTopOpportunity": true
  },
  {
    "title": "Sales & Culinary Openings - Pride Chennai #18",
    "companyName": "The Pride Hotel, Chennai",
    "type": "Industrial Training",
    "category": "Hotel Operations",
    "location": "Chennai, Tamil Nadu",
    "salaryMin": 24000,
    "salaryMax": 40000,
    "posterUrl": "/opportunites/WhatsApp Unknown 2026-08-13 at 01.48.24/WhatsApp Image 2026-08-12 at 16.05.55.jpeg",
    "description": "The Pride Hotel, Chennai is hiring for multiple positions including Front Office, Housekeeping, F&B Service, and Production. Submit your application today for premier placement support.",
    "requirements": "Degree or Diploma in Hotel Management / Hospitality. Strong service mindset and communication skills.",
    "isTopOpportunity": true
  },
  {
    "title": "Pride Hotel Group Career Drive #19",
    "companyName": "The Pride Hotel Group",
    "type": "On Job Training",
    "category": "Hotel Operations",
    "location": "Chennai / Pan India",
    "salaryMin": 27000,
    "salaryMax": 45000,
    "posterUrl": "/opportunites/WhatsApp Unknown 2026-08-13 at 01.48.24/WhatsApp Image 2026-08-12 at 16.05.56.jpeg",
    "description": "The Pride Hotel Group is hiring for multiple positions including Front Office, Housekeeping, F&B Service, and Production. Submit your application today for premier placement support.",
    "requirements": "Degree or Diploma in Hotel Management / Hospitality. Strong service mindset and communication skills.",
    "isTopOpportunity": true
  },
  {
    "title": "Golden Tulip Candolim Goa Hiring #20",
    "companyName": "Golden Tulip Candolim Goa (Sarovar Hotels)",
    "type": "Full Time",
    "category": "Hotel Operations",
    "location": "Candolim, Goa",
    "salaryMin": 30000,
    "salaryMax": 50000,
    "posterUrl": "/opportunites/WhatsApp Unknown 2026-08-13 at 01.48.24/WhatsApp Image 2026-08-12 at 16.05.57 (1).jpeg",
    "description": "Golden Tulip Candolim Goa (Sarovar Hotels) is hiring for multiple positions including Front Office, Housekeeping, F&B Service, and Production. Submit your application today for premier placement support.",
    "requirements": "Degree or Diploma in Hotel Management / Hospitality. Strong service mindset and communication skills.",
    "isTopOpportunity": true
  },
  {
    "title": "Golden Tulip Candolim Goa Hiring #21",
    "companyName": "Golden Tulip Candolim Goa (Sarovar Hotels)",
    "type": "Industrial Training",
    "category": "Hotel Operations",
    "location": "Candolim, Goa",
    "salaryMin": 18000,
    "salaryMax": 30000,
    "posterUrl": "/opportunites/WhatsApp Unknown 2026-08-13 at 01.48.24/WhatsApp Image 2026-08-12 at 16.05.57.jpeg",
    "description": "Golden Tulip Candolim Goa (Sarovar Hotels) is hiring for multiple positions including Front Office, Housekeeping, F&B Service, and Production. Submit your application today for premier placement support.",
    "requirements": "Degree or Diploma in Hotel Management / Hospitality. Strong service mindset and communication skills.",
    "isTopOpportunity": true
  },
  {
    "title": "The Astor Goa Luxury Resort Hiring #22",
    "companyName": "The Astor Goa",
    "type": "On Job Training",
    "category": "Hotel Operations",
    "location": "Candolim, North Goa",
    "salaryMin": 21000,
    "salaryMax": 35000,
    "posterUrl": "/opportunites/WhatsApp Unknown 2026-08-13 at 01.48.24/WhatsApp Image 2026-08-12 at 16.05.58.jpeg",
    "description": "The Astor Goa is hiring for multiple positions including Front Office, Housekeeping, F&B Service, and Production. Submit your application today for premier placement support.",
    "requirements": "Degree or Diploma in Hotel Management / Hospitality. Strong service mindset and communication skills.",
    "isTopOpportunity": true
  },
  {
    "title": "Goldfinch Hotel OJT & Recruitment #23",
    "companyName": "Goldfinch Hotel",
    "type": "Full Time",
    "category": "Hotel Operations",
    "location": "Mumbai, Maharashtra",
    "salaryMin": 24000,
    "salaryMax": 40000,
    "posterUrl": "/opportunites/WhatsApp Unknown 2026-08-13 at 01.48.24/WhatsApp Image 2026-08-12 at 16.05.59.jpeg",
    "description": "Goldfinch Hotel is hiring for multiple positions including Front Office, Housekeeping, F&B Service, and Production. Submit your application today for premier placement support.",
    "requirements": "Degree or Diploma in Hotel Management / Hospitality. Strong service mindset and communication skills.",
    "isTopOpportunity": true
  },
  {
    "title": "Goldfinch Hotel Operations Drive #24",
    "companyName": "Goldfinch Hotel",
    "type": "Industrial Training",
    "category": "Hotel Operations",
    "location": "Mumbai, Maharashtra",
    "salaryMin": 27000,
    "salaryMax": 45000,
    "posterUrl": "/opportunites/WhatsApp Unknown 2026-08-13 at 01.48.24/WhatsApp Image 2026-08-12 at 16.06.00 (1).jpeg",
    "description": "Goldfinch Hotel is hiring for multiple positions including Front Office, Housekeeping, F&B Service, and Production. Submit your application today for premier placement support.",
    "requirements": "Degree or Diploma in Hotel Management / Hospitality. Strong service mindset and communication skills.",
    "isTopOpportunity": true
  },
  {
    "title": "Goldfinch Hotel Operations Drive #25",
    "companyName": "Goldfinch Hotel",
    "type": "On Job Training",
    "category": "Hotel Operations",
    "location": "Mumbai, Maharashtra",
    "salaryMin": 30000,
    "salaryMax": 50000,
    "posterUrl": "/opportunites/WhatsApp Unknown 2026-08-13 at 01.48.24/WhatsApp Image 2026-08-12 at 16.06.00 (2).jpeg",
    "description": "Goldfinch Hotel is hiring for multiple positions including Front Office, Housekeeping, F&B Service, and Production. Submit your application today for premier placement support.",
    "requirements": "Degree or Diploma in Hotel Management / Hospitality. Strong service mindset and communication skills.",
    "isTopOpportunity": true
  },
  {
    "title": "Goldfinch Hotel Operations Drive #26",
    "companyName": "Goldfinch Hotel",
    "type": "Full Time",
    "category": "Hotel Operations",
    "location": "Mumbai, Maharashtra",
    "salaryMin": 18000,
    "salaryMax": 30000,
    "posterUrl": "/opportunites/WhatsApp Unknown 2026-08-13 at 01.48.24/WhatsApp Image 2026-08-12 at 16.06.00.jpeg",
    "description": "Goldfinch Hotel is hiring for multiple positions including Front Office, Housekeeping, F&B Service, and Production. Submit your application today for premier placement support.",
    "requirements": "Degree or Diploma in Hotel Management / Hospitality. Strong service mindset and communication skills.",
    "isTopOpportunity": true
  },
  {
    "title": "Sarovar Hotels Hospitality Careers #27",
    "companyName": "Sarovar Hotels & Resorts",
    "type": "Industrial Training",
    "category": "Hotel Operations",
    "location": "Pan India",
    "salaryMin": 21000,
    "salaryMax": 35000,
    "posterUrl": "/opportunites/WhatsApp Unknown 2026-08-13 at 01.48.24/WhatsApp Image 2026-08-12 at 16.06.01 (1).jpeg",
    "description": "Sarovar Hotels & Resorts is hiring for multiple positions including Front Office, Housekeeping, F&B Service, and Production. Submit your application today for premier placement support.",
    "requirements": "Degree or Diploma in Hotel Management / Hospitality. Strong service mindset and communication skills.",
    "isTopOpportunity": true
  },
  {
    "title": "Sarovar Hotels Hospitality Careers #28",
    "companyName": "Sarovar Hotels & Resorts",
    "type": "On Job Training",
    "category": "Hotel Operations",
    "location": "Pan India",
    "salaryMin": 24000,
    "salaryMax": 40000,
    "posterUrl": "/opportunites/WhatsApp Unknown 2026-08-13 at 01.48.24/WhatsApp Image 2026-08-12 at 16.06.01.jpeg",
    "description": "Sarovar Hotels & Resorts is hiring for multiple positions including Front Office, Housekeeping, F&B Service, and Production. Submit your application today for premier placement support.",
    "requirements": "Degree or Diploma in Hotel Management / Hospitality. Strong service mindset and communication skills.",
    "isTopOpportunity": true
  },
  {
    "title": "Bel-La Monde Luxury Hotel Delhi Openings #29",
    "companyName": "Bel-La Monde Hotel Delhi",
    "type": "Full Time",
    "category": "Hotel Operations",
    "location": "Delhi NCR",
    "salaryMin": 27000,
    "salaryMax": 45000,
    "posterUrl": "/opportunites/WhatsApp Unknown 2026-08-13 at 01.48.24/WhatsApp Image 2026-08-12 at 16.06.02 (1).jpeg",
    "description": "Bel-La Monde Hotel Delhi is hiring for multiple positions including Front Office, Housekeeping, F&B Service, and Production. Submit your application today for premier placement support.",
    "requirements": "Degree or Diploma in Hotel Management / Hospitality. Strong service mindset and communication skills.",
    "isTopOpportunity": true
  },
  {
    "title": "Bel-La Monde Luxury Hotel Delhi Openings #30",
    "companyName": "Bel-La Monde Hotel Delhi",
    "type": "Industrial Training",
    "category": "Hotel Operations",
    "location": "Delhi NCR",
    "salaryMin": 30000,
    "salaryMax": 50000,
    "posterUrl": "/opportunites/WhatsApp Unknown 2026-08-13 at 01.48.24/WhatsApp Image 2026-08-12 at 16.06.02.jpeg",
    "description": "Bel-La Monde Hotel Delhi is hiring for multiple positions including Front Office, Housekeeping, F&B Service, and Production. Submit your application today for premier placement support.",
    "requirements": "Degree or Diploma in Hotel Management / Hospitality. Strong service mindset and communication skills.",
    "isTopOpportunity": true
  },
  {
    "title": "Bel-La Monde Executive Recruitment #31",
    "companyName": "Bel-La Monde Hotel Delhi",
    "type": "On Job Training",
    "category": "Hotel Operations",
    "location": "Delhi NCR",
    "salaryMin": 18000,
    "salaryMax": 30000,
    "posterUrl": "/opportunites/WhatsApp Unknown 2026-08-13 at 01.48.24/WhatsApp Image 2026-08-12 at 16.06.03.jpeg",
    "description": "Bel-La Monde Hotel Delhi is hiring for multiple positions including Front Office, Housekeeping, F&B Service, and Production. Submit your application today for premier placement support.",
    "requirements": "Degree or Diploma in Hotel Management / Hospitality. Strong service mindset and communication skills.",
    "isTopOpportunity": true
  },
  {
    "title": "Bel-La Monde Hotel Recruitment #32",
    "companyName": "Bel-La Monde Hotel",
    "type": "Full Time",
    "category": "Hotel Operations",
    "location": "Delhi NCR",
    "salaryMin": 21000,
    "salaryMax": 35000,
    "posterUrl": "/opportunites/WhatsApp Unknown 2026-08-13 at 01.48.24/WhatsApp Image 2026-08-12 at 16.06.04.jpeg",
    "description": "Bel-La Monde Hotel is hiring for multiple positions including Front Office, Housekeeping, F&B Service, and Production. Submit your application today for premier placement support.",
    "requirements": "Degree or Diploma in Hotel Management / Hospitality. Strong service mindset and communication skills.",
    "isTopOpportunity": true
  },
  {
    "title": "GSA F&B Service - Lemon Tree Indore #33",
    "companyName": "Lemon Tree Hotels",
    "type": "Industrial Training",
    "category": "Hotel Operations",
    "location": "Indore, Madhya Pradesh",
    "salaryMin": 24000,
    "salaryMax": 40000,
    "posterUrl": "/opportunites/WhatsApp Unknown 2026-08-13 at 01.48.30/WhatsApp Image 2026-08-12 at 16.06.05.jpeg",
    "description": "Lemon Tree Hotels is hiring for multiple positions including Front Office, Housekeeping, F&B Service, and Production. Submit your application today for premier placement support.",
    "requirements": "Degree or Diploma in Hotel Management / Hospitality. Strong service mindset and communication skills.",
    "isTopOpportunity": true
  },
  {
    "title": "Lemon Tree Hotels Service Careers #34",
    "companyName": "Lemon Tree Hotels",
    "type": "On Job Training",
    "category": "Hotel Operations",
    "location": "Indore, Madhya Pradesh",
    "salaryMin": 27000,
    "salaryMax": 45000,
    "posterUrl": "/opportunites/WhatsApp Unknown 2026-08-13 at 01.48.30/WhatsApp Image 2026-08-12 at 16.06.06 (1).jpeg",
    "description": "Lemon Tree Hotels is hiring for multiple positions including Front Office, Housekeeping, F&B Service, and Production. Submit your application today for premier placement support.",
    "requirements": "Degree or Diploma in Hotel Management / Hospitality. Strong service mindset and communication skills.",
    "isTopOpportunity": true
  },
  {
    "title": "Lemon Tree Hotels Service Careers #35",
    "companyName": "Lemon Tree Hotels",
    "type": "Full Time",
    "category": "Hotel Operations",
    "location": "Indore, Madhya Pradesh",
    "salaryMin": 30000,
    "salaryMax": 50000,
    "posterUrl": "/opportunites/WhatsApp Unknown 2026-08-13 at 01.48.30/WhatsApp Image 2026-08-12 at 16.06.06 (2).jpeg",
    "description": "Lemon Tree Hotels is hiring for multiple positions including Front Office, Housekeeping, F&B Service, and Production. Submit your application today for premier placement support.",
    "requirements": "Degree or Diploma in Hotel Management / Hospitality. Strong service mindset and communication skills.",
    "isTopOpportunity": true
  },
  {
    "title": "Lemon Tree Hotels Service Careers #36",
    "companyName": "Lemon Tree Hotels",
    "type": "Industrial Training",
    "category": "Hotel Operations",
    "location": "Indore, Madhya Pradesh",
    "salaryMin": 18000,
    "salaryMax": 30000,
    "posterUrl": "/opportunites/WhatsApp Unknown 2026-08-13 at 01.48.30/WhatsApp Image 2026-08-12 at 16.06.06.jpeg",
    "description": "Lemon Tree Hotels is hiring for multiple positions including Front Office, Housekeeping, F&B Service, and Production. Submit your application today for premier placement support.",
    "requirements": "Degree or Diploma in Hotel Management / Hospitality. Strong service mindset and communication skills.",
    "isTopOpportunity": true
  },
  {
    "title": "Radisson Individuals Career Exposure #37",
    "companyName": "Radisson Individuals",
    "type": "On Job Training",
    "category": "Hotel Operations",
    "location": "Bangalore, Karnataka",
    "salaryMin": 21000,
    "salaryMax": 35000,
    "posterUrl": "/opportunites/WhatsApp Unknown 2026-08-13 at 01.48.30/WhatsApp Image 2026-08-12 at 16.06.07.jpeg",
    "description": "Radisson Individuals is hiring for multiple positions including Front Office, Housekeeping, F&B Service, and Production. Submit your application today for premier placement support.",
    "requirements": "Degree or Diploma in Hotel Management / Hospitality. Strong service mindset and communication skills.",
    "isTopOpportunity": true
  },
  {
    "title": "ITC Grand Central Mumbai 5-Star OJT #38",
    "companyName": "ITC Grand Central Mumbai (Luxury Collection)",
    "type": "Full Time",
    "category": "Hotel Operations",
    "location": "Mumbai, Maharashtra",
    "salaryMin": 24000,
    "salaryMax": 40000,
    "posterUrl": "/opportunites/WhatsApp Unknown 2026-08-13 at 01.48.30/WhatsApp Image 2026-08-12 at 16.06.08 (1).jpeg",
    "description": "ITC Grand Central Mumbai (Luxury Collection) is hiring for multiple positions including Front Office, Housekeeping, F&B Service, and Production. Submit your application today for premier placement support.",
    "requirements": "Degree or Diploma in Hotel Management / Hospitality. Strong service mindset and communication skills.",
    "isTopOpportunity": true
  },
  {
    "title": "ITC Grand Central Mumbai 5-Star OJT #39",
    "companyName": "ITC Grand Central Mumbai (Luxury Collection)",
    "type": "Industrial Training",
    "category": "Hotel Operations",
    "location": "Mumbai, Maharashtra",
    "salaryMin": 27000,
    "salaryMax": 45000,
    "posterUrl": "/opportunites/WhatsApp Unknown 2026-08-13 at 01.48.30/WhatsApp Image 2026-08-12 at 16.06.08 (2).jpeg",
    "description": "ITC Grand Central Mumbai (Luxury Collection) is hiring for multiple positions including Front Office, Housekeeping, F&B Service, and Production. Submit your application today for premier placement support.",
    "requirements": "Degree or Diploma in Hotel Management / Hospitality. Strong service mindset and communication skills.",
    "isTopOpportunity": true
  },
  {
    "title": "ITC Grand Central Mumbai 5-Star OJT #40",
    "companyName": "ITC Grand Central Mumbai (Luxury Collection)",
    "type": "On Job Training",
    "category": "Hotel Operations",
    "location": "Mumbai, Maharashtra",
    "salaryMin": 30000,
    "salaryMax": 50000,
    "posterUrl": "/opportunites/WhatsApp Unknown 2026-08-13 at 01.48.30/WhatsApp Image 2026-08-12 at 16.06.08.jpeg",
    "description": "ITC Grand Central Mumbai (Luxury Collection) is hiring for multiple positions including Front Office, Housekeeping, F&B Service, and Production. Submit your application today for premier placement support.",
    "requirements": "Degree or Diploma in Hotel Management / Hospitality. Strong service mindset and communication skills.",
    "isTopOpportunity": true
  },
  {
    "title": "The Westin Goa 5-Star Luxury Recruitment #41",
    "companyName": "The Westin Goa (Marriott International)",
    "type": "Full Time",
    "category": "Hotel Operations",
    "location": "Anjuna, Goa",
    "salaryMin": 18000,
    "salaryMax": 30000,
    "posterUrl": "/opportunites/WhatsApp Unknown 2026-08-13 at 01.48.30/WhatsApp Image 2026-08-12 at 16.06.09 (1).jpeg",
    "description": "The Westin Goa (Marriott International) is hiring for multiple positions including Front Office, Housekeeping, F&B Service, and Production. Submit your application today for premier placement support.",
    "requirements": "Degree or Diploma in Hotel Management / Hospitality. Strong service mindset and communication skills.",
    "isTopOpportunity": true
  },
  {
    "title": "The Westin Goa 5-Star Luxury Recruitment #42",
    "companyName": "The Westin Goa (Marriott International)",
    "type": "Industrial Training",
    "category": "Hotel Operations",
    "location": "Anjuna, Goa",
    "salaryMin": 21000,
    "salaryMax": 35000,
    "posterUrl": "/opportunites/WhatsApp Unknown 2026-08-13 at 01.48.30/WhatsApp Image 2026-08-12 at 16.06.09 (2).jpeg",
    "description": "The Westin Goa (Marriott International) is hiring for multiple positions including Front Office, Housekeeping, F&B Service, and Production. Submit your application today for premier placement support.",
    "requirements": "Degree or Diploma in Hotel Management / Hospitality. Strong service mindset and communication skills.",
    "isTopOpportunity": true
  },
  {
    "title": "The Westin Goa 5-Star Luxury Recruitment #43",
    "companyName": "The Westin Goa (Marriott International)",
    "type": "On Job Training",
    "category": "Hotel Operations",
    "location": "Anjuna, Goa",
    "salaryMin": 24000,
    "salaryMax": 40000,
    "posterUrl": "/opportunites/WhatsApp Unknown 2026-08-13 at 01.48.30/WhatsApp Image 2026-08-12 at 16.06.09.jpeg",
    "description": "The Westin Goa (Marriott International) is hiring for multiple positions including Front Office, Housekeeping, F&B Service, and Production. Submit your application today for premier placement support.",
    "requirements": "Degree or Diploma in Hotel Management / Hospitality. Strong service mindset and communication skills.",
    "isTopOpportunity": true
  },
  {
    "title": "Riviera Beach Resort Openings #44",
    "companyName": "Riviera Beach Resort",
    "type": "Full Time",
    "category": "Hotel Operations",
    "location": "Andhra Pradesh",
    "salaryMin": 27000,
    "salaryMax": 45000,
    "posterUrl": "/opportunites/WhatsApp Unknown 2026-08-13 at 01.48.30/WhatsApp Image 2026-08-12 at 16.06.10 (1).jpeg",
    "description": "Riviera Beach Resort is hiring for multiple positions including Front Office, Housekeeping, F&B Service, and Production. Submit your application today for premier placement support.",
    "requirements": "Degree or Diploma in Hotel Management / Hospitality. Strong service mindset and communication skills.",
    "isTopOpportunity": true
  },
  {
    "title": "Riviera Beach Resort Openings #45",
    "companyName": "Riviera Beach Resort",
    "type": "Industrial Training",
    "category": "Hotel Operations",
    "location": "Andhra Pradesh",
    "salaryMin": 30000,
    "salaryMax": 50000,
    "posterUrl": "/opportunites/WhatsApp Unknown 2026-08-13 at 01.48.30/WhatsApp Image 2026-08-12 at 16.06.10.jpeg",
    "description": "Riviera Beach Resort is hiring for multiple positions including Front Office, Housekeeping, F&B Service, and Production. Submit your application today for premier placement support.",
    "requirements": "Degree or Diploma in Hotel Management / Hospitality. Strong service mindset and communication skills.",
    "isTopOpportunity": true
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
