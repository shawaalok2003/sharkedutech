import fs from "fs";
import path from "path";
import { prisma } from "@/lib/prisma";

export const OPPORTUNITIES_DATA = [
  {
    "title": "Kasturi Restaurant Multi-Role Hiring (Captain, Cook, Steward & Manager)",
    "companyName": "Kasturi Restaurant Private Limited",
    "type": "Full Time",
    "category": "Food & Beverage",
    "location": "Kolkata, West Bengal",
    "salaryMin": 10000,
    "salaryMax": 22000,
    "posterUrl": "/jobs/WhatsApp Image 2026-11-25 at 13.30.50 (1).jpeg",
    "description": "Kasturi Restaurant Private Limited (12 outlets across Kolkata and 5 outlets outside Kolkata) is hiring for Restaurant Captain (₹12k–₹15k), Cook / Commis Cook (₹18k–₹20k), Bengali Cook (₹18k–₹20k), Chinese Commis 1 (₹18k–₹22k), Waiter / Steward (₹11k–₹12k), Kitchen Helper, Packing/Handi Boy, Plate Clearing Boy, Sweeper, Security Guard, Restaurant Manager (₹15k–₹17k), and Floor Attendant (Lady).",
    "requirements": "8th / 10th / 12th Pass depending on role. Freshers welcome; 1–5 years experience preferred for Captain, Cook, and Manager positions.",
    "isTopOpportunity": true
  },
  {
    "title": "Taj Deccan Hyderabad — Apprentice (F&B & Food Production)",
    "companyName": "Taj Deccan Hyderabad (IHCL)",
    "type": "Apprenticeship",
    "category": "Food & Beverage",
    "location": "Hyderabad, Telangana",
    "salaryMin": 10000,
    "salaryMax": 15000,
    "posterUrl": "/jobs/WhatsApp Image 2026-11-25 at 13.30.50.jpeg",
    "description": "Taj Deccan, Hyderabad is inviting applications for Apprentice F&B and Apprentice Food Production roles. Build a rewarding hospitality career with India's finest luxury hotel legacy.",
    "requirements": "Hospitality / Hotel Management students or freshers interested in F&B Service and Food Production apprenticeships.",
    "isTopOpportunity": true
  },
  {
    "title": "Four Points by Sheraton Vadodara — F&B, Front Office & GSA",
    "companyName": "Four Points by Sheraton Vadodara (Marriott International)",
    "type": "Full Time",
    "category": "Front Office",
    "location": "Vadodara, Gujarat",
    "salaryMin": 18000,
    "salaryMax": 32000,
    "posterUrl": "/jobs/WhatsApp Image 2026-11-25 at 13.30.52 copy.jpeg",
    "description": "Marriott International – Four Points by Sheraton Vadodara is hiring for FNB Executive, Front Office Supervisor, GSA - Housekeeping, and GSA - FNB Service.",
    "requirements": "Degree or Diploma in Hotel Management / Hospitality with strong communication and guest service skills.",
    "isTopOpportunity": true
  },
  {
    "title": "The Westin Pushkar Resort & Spa — NAPS Apprenticeship",
    "companyName": "The Westin Pushkar Resort & Spa",
    "type": "Apprenticeship",
    "category": "Hotel Operations",
    "location": "Pushkar, Rajasthan",
    "salaryMin": 9600,
    "salaryMax": 12300,
    "posterUrl": "/jobs/WhatsApp Image 2026-11-25 at 13.30.52.jpeg",
    "description": "The Westin Pushkar Resort & Spa is hiring freshers for 12-month NAPS Apprenticeship across Food & Beverage, Front Office, and Housekeeping. Monthly stipend ₹12,300 (with graduation & 1st sem marksheet) or ₹9,600, plus on-duty meals & uniforms. Immediate joining.",
    "requirements": "Freshers eligible under NAPS (National Apprenticeship Promotion Scheme). Note: Accommodation will not be provided at this moment.",
    "isTopOpportunity": true
  },
  {
    "title": "MAYFAIR Sanctuary Bhubaneswar — Housekeeping & F&B Associates",
    "companyName": "MAYFAIR Hotels & Resorts",
    "type": "Full Time",
    "category": "Housekeeping",
    "location": "Bhubaneswar, Odisha",
    "salaryMin": 16000,
    "salaryMax": 28000,
    "posterUrl": "/jobs/WhatsApp Image 2026-11-25 at 13.30.53 (1).jpeg",
    "description": "MAYFAIR Sanctuary, Bhubaneswar is hiring Senior Associates and Associates in Housekeeping and F&B Service. Join a reputed luxury hospitality brand with strong career development opportunities.",
    "requirements": "Hospitality degree/diploma or relevant hotel operations experience in Housekeeping or F&B Service.",
    "isTopOpportunity": true
  },
  {
    "title": "Vedic Village Spa Resort Kolkata — Room Attendant & Housekeeping",
    "companyName": "Vedic Village Spa Resort",
    "type": "Full Time",
    "category": "Housekeeping",
    "location": "Newtown, Kolkata",
    "salaryMin": 11000,
    "salaryMax": 16000,
    "posterUrl": "/jobs/WhatsApp Image 2026-11-25 at 13.30.53 (2).jpeg",
    "description": "Vedic Village Spa Resort, Newtown, Kolkata is hiring Room Attendant and Housekeeping staff. Salary ₹11,000 – ₹16,000/month + statutory benefits, accommodation, and on-duty meals provided.",
    "requirements": "Hospitality background or housekeeping experience; focus on cleanliness, hygiene, and guest comfort.",
    "isTopOpportunity": true
  },
  {
    "title": "Chai Break Kolkata — Chefs, F&B Staff, Baristas & Managers (338+ Openings)",
    "companyName": "Chai Break",
    "type": "Full Time",
    "category": "Food Production",
    "location": "Kolkata, West Bengal",
    "salaryMin": 12000,
    "salaryMax": 35000,
    "posterUrl": "/jobs/WhatsApp Image 2026-11-25 at 13.30.53.jpeg",
    "description": "Chai Break Kolkata is hiring across 338+ positions: F&B Service Staff (90), Conti Chef (60), Housekeeping (60), Indian Chef (50), Chinese Chef (45), Mocktail Maker (18), Barista (12), Manager B2B Sales (1), Marketing Manager (1), and Catering Sales Manager (1).",
    "requirements": "All levels welcome across Culinary, F&B Service, Barista, Housekeeping, and Sales/Marketing roles.",
    "isTopOpportunity": true
  },
  {
    "title": "Hilton Garden Inn Jabalpur — Industrial Training Opportunity",
    "companyName": "Hilton Garden Inn Jabalpur",
    "type": "Industrial Training",
    "category": "Hotel Operations",
    "location": "Jabalpur, Madhya Pradesh",
    "salaryMin": 4000,
    "salaryMax": 4000,
    "posterUrl": "/jobs/WhatsApp Image 2026-11-25 at 13.30.54 (1).jpeg",
    "description": "Hilton Garden Inn Jabalpur invites applications for Industrial Trainees across all hotel departments. Monthly stipend ₹4,000 plus complimentary food & accommodation and mentorship from Department Heads.",
    "requirements": "Hotel Management / Hospitality students seeking Industrial Training (IET) with a global brand.",
    "isTopOpportunity": true
  },
  {
    "title": "KR Inn Narasapura Bengaluru — GSA, Commis-III, IET & OJT",
    "companyName": "KR Inn Narasapura",
    "type": "Full Time / OJT",
    "category": "Hotel Operations",
    "location": "Narasapura, Bengaluru",
    "salaryMin": 3000,
    "salaryMax": 22000,
    "posterUrl": "/jobs/WhatsApp Image 2026-11-25 at 13.30.54 (2).jpeg",
    "description": "KR Inn Narasapura, Bengaluru is hiring Guest Service Associates (F&B Service, Front Office, Housekeeping) and Commis-III across all kitchen sections, plus IET (₹3,000/mo) and OJT (₹10,000/mo) internships. Free food & accommodation provided.",
    "requirements": "Degree/Diploma in Hotel Management or relevant experience; freshers welcome for IET and OJT.",
    "isTopOpportunity": true
  },
  {
    "title": "Regenta Fairlark Vadodara — F&B, GRE Front Office, Sales & OJT",
    "companyName": "Regenta Fairlark by Royal Orchid Hotels",
    "type": "Full Time",
    "category": "Front Office",
    "location": "Vadodara, Gujarat",
    "salaryMin": 9000,
    "salaryMax": 28000,
    "posterUrl": "/jobs/WhatsApp Image 2026-11-25 at 13.30.54 (3).jpeg",
    "description": "Regenta Fairlark by Royal Orchid Hotels, Vadodara is hiring F&B Associates (4 positions, ₹18,000/mo), GRE Front Office (1 position, ₹25,000–₹28,000/mo), Sales Executive (1 position, ₹22,000–₹25,000/mo), and OJT F&B Service (6 positions, ₹9,000/mo stipend). Includes Accommodation, Food, PF, ESIC, Bonus & Gratuity.",
    "requirements": "Relevant hospitality degree/diploma and communication skills.",
    "isTopOpportunity": true
  },
  {
    "title": "Golden Tulip Candolim Goa — GSA, Supervisors, Front Office & Commis-I",
    "companyName": "Golden Tulip Candolim Goa (Sarovar Hotels)",
    "type": "Full Time",
    "category": "Front Office",
    "location": "Candolim, Goa",
    "salaryMin": 18000,
    "salaryMax": 35000,
    "posterUrl": "/jobs/WhatsApp Image 2026-11-25 at 13.30.54.jpeg",
    "description": "Golden Tulip Candolim Goa is hiring GSA (F&B Service & Housekeeping), Housekeeping Supervisor, Desk Controller – Housekeeping, Guest Relation Supervisor/Executive (Female), Front Office Executive, and Commis-I / DCDP (Continental, Indian & Chinese).",
    "requirements": "Relevant experience in the role applied for; ready to relocate if not local.",
    "isTopOpportunity": true
  },
  {
    "title": "Goldfinch Hotel Mumbai Andheri — GSA & F&B Hostess",
    "companyName": "Goldfinch Hotels & Resorts",
    "type": "Full Time",
    "category": "Food & Beverage",
    "location": "Andheri, Mumbai",
    "salaryMin": 18000,
    "salaryMax": 28000,
    "posterUrl": "/jobs/WhatsApp Image 2026-11-25 at 13.30.55 (1).jpeg",
    "description": "Goldfinch Hotel, Mumbai – Andheri is hiring Guest Service Associates and Hostess in F&B Service. Free food & accommodation provided.",
    "requirements": "Hospitality graduate/diploma with pleasant personality and guest-facing communication skills.",
    "isTopOpportunity": true
  },
  {
    "title": "White Hotel Lonavala — GSA, Captain & Commis III (10 Openings)",
    "companyName": "White Hotel Lonavala",
    "type": "Full Time",
    "category": "Food & Beverage",
    "location": "Lonavala, Maharashtra",
    "salaryMin": 15000,
    "salaryMax": 26000,
    "posterUrl": "/jobs/WhatsApp Image 2026-11-25 at 13.30.56 (1).jpeg",
    "description": "White Hotel, Lonavala is hiring GSA (5 positions), Captain (2 positions), and Commis III (3 positions).",
    "requirements": "Hotel Management diploma/degree or prior hotel experience in F&B Service / Culinary.",
    "isTopOpportunity": true
  },
  {
    "title": "Avera Hotels & Resorts Nandi Hills — Front Office & Bell Boy",
    "companyName": "Avera Hotels & Resorts",
    "type": "Full Time",
    "category": "Front Office",
    "location": "Nandi Hills, Karnataka",
    "salaryMin": 16000,
    "salaryMax": 30000,
    "posterUrl": "/jobs/WhatsApp Image 2026-11-25 at 13.30.56.jpeg",
    "description": "Avera Hotels & Resorts, Nandi Hills, Karnataka is hiring Front Office Executive, Front Office Supervisor, Front Office Sr. Associate, and Bell Boy. Includes competitive salary, pickup & drop, accommodation within 1 km, and PF & ESIC benefits.",
    "requirements": "Relevant hospitality experience in Front Office, good communication, and guest-handling skills; pre-opening experience is an added advantage.",
    "isTopOpportunity": true
  },
  {
    "title": "Club Mahindra Baga Goa — Industrial Trainees, Job Trainees & Apprentices",
    "companyName": "Club Mahindra Baga, Goa",
    "type": "On Job Training",
    "category": "Hotel Operations",
    "location": "Baga, Goa",
    "salaryMin": 1500,
    "salaryMax": 5000,
    "posterUrl": "/jobs/WhatsApp Image 2026-11-25 at 13.32.30.jpeg",
    "description": "Club Mahindra Baga, Goa is hiring Industrial Trainees (₹1,500/mo stipend, min 6 months, all departments), Job Trainees (₹5,000/mo stipend, all departments), and Apprentices (F&B, Front Office, Housekeeping, Engineering, etc.).",
    "requirements": "Hospitality students & freshers across all operational departments.",
    "isTopOpportunity": true
  },
  {
    "title": "Hyatt Centric Ballygunge Kolkata — Chefs, F&B, Purchase & Engineering",
    "companyName": "Hyatt Centric Ballygunge Kolkata",
    "type": "Full Time",
    "category": "Food & Beverage",
    "location": "Ballygunge, Kolkata",
    "salaryMin": 20000,
    "salaryMax": 45000,
    "posterUrl": "/jobs/WhatsApp Image 2026-11-25 at 16.53.38.jpeg",
    "description": "Hyatt Centric Ballygunge Kolkata is hiring Commis – South Indian Cuisine, Demi Chef de Partie – Western Cuisine, Hostess – F&B Service, Associate – F&B Service (5 openings), Purchase and Store Associate/Executive, Team Leader – Engineering, and Assistant Restaurant Manager (Female). Competitive salary + PF & ESIC.",
    "requirements": "Relevant 5-star hotel experience or hospitality qualification for the respective department.",
    "isTopOpportunity": true
  },
  {
    "title": "Courtyard by Marriott Bhopal — Managers, Associates & Trainees",
    "companyName": "Courtyard by Marriott Bhopal",
    "type": "Full Time",
    "category": "Hotel Operations",
    "location": "Bhopal, Madhya Pradesh",
    "salaryMin": 12000,
    "salaryMax": 55000,
    "posterUrl": "/jobs/WhatsApp Image 2026-11-25 at 16.53.53.jpeg",
    "description": "Courtyard by Marriott Bhopal is hiring Food & Beverage Manager, F&B Associate, Housekeeping Associate, Front Office Associate, Finance Intern, Engineering Apprentice, Job Trainees (F&B Service, Front Office, Housekeeping), and Industrial Trainees across all four operational departments.",
    "requirements": "Degree/Diploma in Hotel Management or relevant Marriott/luxury hotel experience.",
    "isTopOpportunity": true
  },
  {
    "title": "Four Points by Sheraton Nashik — Banquets, Reservations, F&B & Barista",
    "companyName": "Four Points by Sheraton Nashik",
    "type": "Full Time",
    "category": "Food & Beverage",
    "location": "Nashik, Maharashtra",
    "salaryMin": 18000,
    "salaryMax": 40000,
    "posterUrl": "/jobs/WhatsApp Image 2026-11-25 at 17.36.52 (1).jpeg",
    "description": "Four Points by Sheraton Nashik is hiring Assistant Banquets Manager, Reservations Coordinator, Food & Beverage Controller, and Barista. Includes competitive salary, PF & ESIC benefits, training & skill development.",
    "requirements": "Hospitality degree/diploma with relevant experience in Banquets, Reservations, F&B Control, or Barista operations.",
    "isTopOpportunity": true
  },
  {
    "title": "Crowne Plaza Ahmedabad — Duty Manager, Sales, CDP & Engineering",
    "companyName": "Crowne Plaza Ahmedabad City Centre (IHG)",
    "type": "Full Time",
    "category": "General Management",
    "location": "Ahmedabad, Gujarat",
    "salaryMin": 15000,
    "salaryMax": 55000,
    "posterUrl": "/jobs/WhatsApp Image 2026-11-25 at 17.36.52.jpeg",
    "description": "Crowne Plaza Ahmedabad City Centre (An IHG Hotel) is hiring Assistant Director of Sales – Catering, Duty Manager, Chef de Partie (Indian Cuisine), Mason – Engineering, MST – Engineering, A/C Technician, OJT/Apprentice (HR), Reservation Apprentice, and Housekeeping Intern.",
    "requirements": "Relevant luxury hotel experience or hospitality qualification for managerial, culinary, engineering, and trainee roles.",
    "isTopOpportunity": true
  },
  {
    "title": "Regenta Fairlark Vadodara — GRE Front Office, GSA & Job Trainee",
    "companyName": "Regenta Fairlark, Vadodara (Royal Orchid Hotels)",
    "type": "Full Time",
    "category": "Front Office",
    "location": "Vadodara, Gujarat",
    "salaryMin": 10000,
    "salaryMax": 28000,
    "posterUrl": "/jobs/WhatsApp Image 2026-11-25 at 17.50.56 (1).jpeg",
    "description": "Regenta Fairlark, Vadodara is hiring GRE Front Office (₹25k–₹28k/mo), GSA F&B Service (₹18k/mo), and Job Trainee F&B Service (₹10k/mo stipend). Includes Accommodation, Food, PF, ESIC, Bonus, Gratuity & Loyalty.",
    "requirements": "Passionate hospitality professionals and trainees with strong service orientation.",
    "isTopOpportunity": true
  },
  {
    "title": "Hyatt Regency Pune & Residences — Multi-Department Hiring",
    "companyName": "Hyatt Regency Pune & Residences",
    "type": "Full Time",
    "category": "Front Office",
    "location": "Pune, Maharashtra",
    "salaryMin": 18000,
    "salaryMax": 45000,
    "posterUrl": "/jobs/WhatsApp Image 2026-11-25 at 17.50.56.jpeg",
    "description": "Hyatt Regency Pune & Residences is hiring Spa Therapist, Waiter/Waitress, Team Leader – Housekeeping, Assistant Manager – Front Office, Team Leader – Engineering, Fire Safety Officer, Housekeeping Attendant, Team Leader – Reservations, GSO – Front Office, and HR Apprentice.",
    "requirements": "Degree/Diploma in Hospitality or relevant 5-star hotel department experience.",
    "isTopOpportunity": true
  },
  {
    "title": "Jaipur Marriott Hotel — F&B, Culinary, Front Office, Spa & Fitness",
    "companyName": "Jaipur Marriott Hotel",
    "type": "Full Time",
    "category": "Food & Beverage",
    "location": "Jaipur, Rajasthan",
    "salaryMin": 18000,
    "salaryMax": 42000,
    "posterUrl": "/jobs/WhatsApp Image 2026-11-25 at 18.06.31.jpeg",
    "description": "Jaipur Marriott Hotel is hiring F&B Service Associate, Barista Executive (Female), Gym Instructor, Commis I (South Indian Cuisine), F&B Executive (Specialty Restaurant), Commis I (Tandoor), Front Office Associate, Spa Executive, Spa Receptionist, and Housekeeping Associate.",
    "requirements": "Hospitality degree/diploma or relevant luxury hotel experience; competitive salary + PF & ESIC.",
    "isTopOpportunity": true
  },
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

const SEED_MARKER_PATH = path.join(process.cwd(), "prisma", ".opportunities_v2_seeded");

export async function ensureOpportunitiesSeeded() {
  try {
    // Respect admin deletions: once v2 opportunities are seeded, never re-create deleted jobs
    if (fs.existsSync(SEED_MARKER_PATH)) {
      return;
    }

    const existingNewJob = await prisma.job.findFirst({
      where: { posterUrl: { startsWith: "/jobs/" } },
      select: { id: true }
    });
    if (existingNewJob) {
      try { fs.writeFileSync(SEED_MARKER_PATH, new Date().toISOString()); } catch {}
      return;
    }

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

    let idx = 0;
    for (const opp of OPPORTUNITIES_DATA) {
      idx++;
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
        employerId: employer.id,
        createdAt: new Date(Date.now() - (idx * 6 * 60 * 60 * 1000))
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
            location: opp.location,
            type: opp.type,
            category: opp.category,
            salaryMin: opp.salaryMin,
            salaryMax: opp.salaryMax,
            description: opp.description,
            requirements: opp.requirements,
            isTopOpportunity: true,
            status: "Active",
            createdAt: payload.createdAt
          }
        });
      }
    }

    try { fs.writeFileSync(SEED_MARKER_PATH, new Date().toISOString()); } catch {}
  } catch (error) {
    console.error('[ensureOpportunitiesSeeded] Error:', error);
  }
}
