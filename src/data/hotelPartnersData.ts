export interface HotelPartner {
    id: string;
    name: string;
    logoFilename: string;
    category: string;
    rating: string;
    locations: string[];
    overview: string;
    keyBenefits: string[];
    activeJobs: {
        title: string;
        department: string;
        location: string;
        salary: string;
        experience: string;
    }[];
    requirements: string[];
    contactEmail: string;
}

const defaultJobs = [
    { title: "Front Office Associate / Executive", department: "Front Office", location: "Pan India", salary: "₹2.4L - ₹4.2L / yr", experience: "0-2 Years" },
    { title: "F&B Service Associate (Waiter / Captain)", department: "Food & Beverage", location: "Pan India", salary: "₹2.2L - ₹3.8L / yr", experience: "0-1 Year" },
    { title: "Commis Chef / Sous Chef", department: "Culinary & Kitchen", location: "Pan India", salary: "₹2.8L - ₹5.5L / yr", experience: "1-3 Years" },
    { title: "Housekeeping Executive / Attendant", department: "Housekeeping", location: "Pan India", salary: "₹2.0L - ₹3.5L / yr", experience: "0-2 Years" },
    { title: "Hotel Management Industrial Trainee", department: "Cross-Department", location: "Pan India", salary: "Stipend ₹12K - ₹18K/mo", experience: "Fresher" }
];

export const HOTEL_PARTNERS: Record<string, HotelPartner> = {
    "courtyard-marriott": {
        id: "courtyard-marriott",
        name: "Courtyard by Marriott",
        logoFilename: "COURTYARD MARRIOTT.jpeg",
        category: "4-Star Premium Business",
        rating: "4.8 ★",
        locations: ["Mumbai", "Bengaluru", "Ahmedabad", "Pune", "Chennai", "Gurugram"],
        overview: "Courtyard by Marriott offers modern travelers an invigorating experience designed for business and leisure. Featuring vibrant lobby environments, innovative dining options, and tech-driven amenities, Courtyard provides top-tier hospitality career pathways across India and worldwide.",
        keyBenefits: ["Global Marriott International Transfer Mobility", "Structured 5-Star Hospitality Training", "Duty Meals & Uniform Allowance", "Medical Insurance & Health Coverage", "Performance Performance Incentives"],
        activeJobs: defaultJobs,
        requirements: ["Diploma / Degree in Hotel Management (BHM / B.Sc / DHM)", "Fluent English communication skills", "Customer-first attitude & professional grooming", "Willingness to work in rotating shifts"],
        contactEmail: "careers@sharkedutech.com"
    },
    "citrus-hotel": {
        id: "citrus-hotel",
        name: "Citrus Hotels & Resorts",
        logoFilename: "CITRUS HOTEL.jpeg",
        category: "Boutique & Leisure Resorts",
        rating: "4.5 ★",
        locations: ["Goa", "Lonavala", "Mahabaleshwar", "Bengaluru", "Sriperumbudur"],
        overview: "Citrus Hotels & Resorts delivers vibrant hospitality experiences surrounded by nature and luxury. Renowned for custom dining, pristine spa facilities, and curated guest activities, Citrus offers dynamic career growth for hospitality professionals.",
        keyBenefits: ["Resort Staff Accommodation Provided", "Specialized F&B & Culinary Workshops", "Quarterly Bonus & Tips Pool", "Fast-Track Promotion Track"],
        activeJobs: defaultJobs,
        requirements: ["Hotel Management Qualification or Hospitality Certification", "Passionate about guest relations and service quality", "Team player with strong interpersonal skills"],
        contactEmail: "careers@sharkedutech.com"
    },
    "effotel-sayaji": {
        id: "effotel-sayaji",
        name: "Effotel by Sayaji",
        logoFilename: "EFFOTEL SAYAJI.jpeg",
        category: "Smart Luxury Business Hotel",
        rating: "4.6 ★",
        locations: ["Indore", "Bhopal", "Vadodara", "Pune", "Nashik"],
        overview: "Effotel by Sayaji combines contemporary comfort with warm Indian hospitality. Tailored for corporate executives and upscale travelers, Effotel features award-winning multi-cuisine restaurants, banquets, and state-of-the-art event spaces.",
        keyBenefits: ["Excellence in Culinary & Service Mentorship", "Duty Accommodations & Food Allowance", "Annual Appraisal Bonuses", "Comprehensive Health Benefits"],
        activeJobs: defaultJobs,
        requirements: ["Relevant Hotel Management Degree/Diploma", "Basic computer knowledge for Front Desk/F&B roles", "Strong service mindset"],
        contactEmail: "careers@sharkedutech.com"
    },
    "fairfield-marriott": {
        id: "fairfield-marriott",
        name: "Fairfield by Marriott",
        logoFilename: "FAIRFIELD MARRIOTT.JPG.jpeg",
        category: "4-Star International Hotel",
        rating: "4.7 ★",
        locations: ["Bengaluru", "Goa", "Kolkata", "Coimbatore", "Indore", "Lucknow"],
        overview: "Fairfield by Marriott is built on a founding tradition of warm hospitality and trusted service. With modern guestrooms, all-day dining options, and global Marriott rewards, working with Fairfield provides access to global hospitality standards.",
        keyBenefits: ["Access to Marriott Global Learning Platform", "Attractive Salary + Service Charge Share", "Staff Stay Discounts Globally", "Health & Wellness Coverage"],
        activeJobs: defaultJobs,
        requirements: ["Graduate or Diploma holder in Hospitality", "Good communication & problem-solving skills", "Attention to detail and presentation"],
        contactEmail: "careers@sharkedutech.com"
    },
    "four-points-by-sheraton": {
        id: "four-points-by-sheraton",
        name: "Four Points by Sheraton",
        logoFilename: "FOUR POINTS BY SHERATON.JPG.jpeg",
        category: "5-Star Deluxe Hotel",
        rating: "4.9 ★",
        locations: ["Mumbai", "Bengaluru", "Jaipur", "Kochi", "Dehradun", "Vashi"],
        overview: "Four Points by Sheraton offers timeless style and comfort with authentic service. From world-class craft beverages to signature beds and extensive banqueting, Four Points nurtures premier hospitality talent with structured growth opportunities.",
        keyBenefits: ["International Marriott Hospitality Certification", "Cross-departmental Career Rotations", "Subsidized Meals & Transportation", "Incentive Bonuses"],
        activeJobs: defaultJobs,
        requirements: ["Diploma / Degree in Hotel Management", "Positive personality and service orientation", "Physical stamina for dynamic operations"],
        contactEmail: "careers@sharkedutech.com"
    },
    "hilton": {
        id: "hilton",
        name: "Hilton Hotels & Resorts",
        logoFilename: "HILTON.JPG.jpeg",
        category: "5-Star Global Luxury",
        rating: "4.9 ★",
        locations: ["Mumbai", "Bengaluru", "Delhi NCR", "Goa", "Jaipur"],
        overview: "Hilton is a global leader in hospitality with an iconic portfolio of luxury hotels. Recognized consistently as a Great Place to Work worldwide, Hilton provides unmatched learning, global mobility, and rewarding careers.",
        keyBenefits: ["Hilton Go Global Team Member Travel Discount", "World-class Hilton University Certification", "Competitive Pay + Service Charge", "Life & Medical Insurance"],
        activeJobs: defaultJobs,
        requirements: ["BHM / B.Sc in Hospitality Management", "Excellent command over spoken & written English", "Customer success drive"],
        contactEmail: "careers@sharkedutech.com"
    },
    "hyatt-regency": {
        id: "hyatt-regency",
        name: "Hyatt Regency",
        logoFilename: "HYATT REGENCY.jpeg",
        category: "5-Star Luxury & Convention",
        rating: "4.9 ★",
        locations: ["Delhi NCR", "Mumbai", "Kolkata", "Ahmedabad", "Chandigarh", "Chennai"],
        overview: "Hyatt Regency offers stress-free environments for seamless business and leisure travel. Renowned worldwide for signature restaurants, grand ballrooms, and empathetic service culture, Hyatt is top choice for hospitality aspirants.",
        keyBenefits: ["Hyatt Care First Training Programs", "Free Employee Meals & Uniform Laundry", "Complimentary Room Nights per year", "Performance Bonuses"],
        activeJobs: defaultJobs,
        requirements: ["Degree/Diploma in Hotel Management", "High service standards & attention to detail", "Flexibility across shift schedules"],
        contactEmail: "careers@sharkedutech.com"
    },
    "jw-marriott": {
        id: "jw-marriott",
        name: "JW Marriott",
        logoFilename: "JW MARRIOTT.JPG.jpeg",
        category: "5-Star Ultra Luxury",
        rating: "5.0 ★",
        locations: ["Mumbai", "Bengaluru", "New Delhi", "Jaipur", "Mussoorie", "Chandigarh"],
        overview: "JW Marriott is part of Marriott International's luxury portfolio and consists of beautiful properties and distinctive resort locations around the world. Designed to orchestrate mindful, enriching experiences for guests and staff alike.",
        keyBenefits: ["Luxury Hospitality Certification & Standards", "Premium Salary Packages + Service Charge", "Global Transfer Opportunities", "Comprehensive Wellness Benefits"],
        activeJobs: defaultJobs,
        requirements: ["BHM / Master in Hospitality Management", "Flawless grooming and high-end etiquette", "Strong interpersonal & communication skills"],
        contactEmail: "careers@sharkedutech.com"
    },
    "lemon-tree": {
        id: "lemon-tree",
        name: "Lemon Tree Hotels",
        logoFilename: "LEMON TREE.JPG.jpeg",
        category: "Upscale & Midscale Business",
        rating: "4.6 ★",
        locations: ["Delhi NCR", "Bengaluru", "Hyderabad", "Mumbai", "Jaipur", "Udaipur", "Goa"],
        overview: "Lemon Tree Hotels is India's largest hotel chain in the mid-priced sector. Celebrated for inclusive hiring, vibrant decor, and friendly service, Lemon Tree offers rapid career progression across 80+ properties in India.",
        keyBenefits: ["Inclusive & Supportive Work Environment", "Rapid Promotion & Career Track", "Staff Accommodation & Meal Facilities", "Annual Performance Incentives"],
        activeJobs: defaultJobs,
        requirements: ["Hotel Management Diploma/Degree or Certification", "Enthusiastic and welcoming personality", "Dedicated team player"],
        contactEmail: "careers@sharkedutech.com"
    },
    "radisson-blu": {
        id: "radisson-blu",
        name: "Radisson Blu",
        logoFilename: "RADISSON BLU.JPG.jpeg",
        category: "5-Star Upper Upscale",
        rating: "4.8 ★",
        locations: ["Mumbai", "Bengaluru", "New Delhi", "Jaipur", "Udaipur", "Indore", "Guwahati"],
        overview: "Radisson Blu creates memorable experience through 'Yes I Can!' service philosophy. Featuring stylish design, cutting-edge facilities, and world-class dining, Radisson Blu empowers hotel professionals to excel.",
        keyBenefits: ["Radisson Academy Skill Certifications", "Competitive Remuneration Package", "Global Hotel Stay Discounts", "Duty Meals & Uniform Care"],
        activeJobs: defaultJobs,
        requirements: ["Degree / Diploma in Hospitality Management", "Customer orientation & problem solving", "Good English communication"],
        contactEmail: "careers@sharkedutech.com"
    },
    "st-regis": {
        id: "st-regis",
        name: "The St. Regis",
        logoFilename: "ST REGIS.JPG.jpeg",
        category: "5-Star Iconic Luxury",
        rating: "5.0 ★",
        locations: ["Mumbai", "Goa"],
        overview: "The St. Regis defines modern luxury with signature Butler Service, exquisite design, and legendary afternoon tea traditions. Joining St. Regis connects you with the highest standard of luxury hospitality worldwide.",
        keyBenefits: ["Elite St. Regis Butler & Service Training", "Top Tier Compensation + Gratuity", "Global Luxury Transfer Network", "Full Medical & Health Benefits"],
        activeJobs: defaultJobs,
        requirements: ["Degree in Hotel Management", "Impeccable grooming, posture & poise", "Proficiency in guest relations and luxury protocols"],
        contactEmail: "careers@sharkedutech.com"
    },
    "the-fern": {
        id: "the-fern",
        name: "The Fern Hotels & Resorts",
        logoFilename: "THE FERN.jpeg",
        category: "Eco-Friendly Luxury Resorts",
        rating: "4.6 ★",
        locations: ["Mumbai", "Jaipur", "Lonavala", "Ahmedabad", "Rajkot", "Goa"],
        overview: "The Fern Hotels & Resorts is India's leading environmentally sensitive hotel chain. Offering luxury with sustainability at its core, The Fern provides rewarding career opportunities in eco-friendly hospitality operations.",
        keyBenefits: ["Green Hospitality Certification", "Staff Housing & Meal Benefits", "Annual Increment & Performance Bonus", "Friendly Work Culture"],
        activeJobs: defaultJobs,
        requirements: ["Hospitality Qualification / Certification", "Environmental consciousness and guest dedication", "Proactive attitude"],
        contactEmail: "careers@sharkedutech.com"
    },
    "westin": {
        id: "westin",
        name: "The Westin Hotels & Resorts",
        logoFilename: "WESTIN.JPG.jpeg",
        category: "5-Star Wellness Luxury",
        rating: "4.9 ★",
        locations: ["Mumbai", "Bengaluru", "Gurugram", "Hyderabad", "Goa", "Kolkata"],
        overview: "Westin Hotels & Resorts empowers guests to enhance their well-being through Heavenly Bed, Eat Well dining, and Heavenly Spa facilities. Westin fosters a wellness-centered culture for employees and guests alike.",
        keyBenefits: ["Westin Employee Wellness & Fitness Access", "Global Marriott Career Network", "Top Industry Pay + Gratuity & Incentives", "Comprehensive Health Benefits"],
        activeJobs: defaultJobs,
        requirements: ["Bachelor in Hotel Management", "High energy, empathy & communication skills", "Commitment to guest well-being"],
        contactEmail: "careers@sharkedutech.com"
    }
};

// Fallback generator for any filename in logos array
export function getHotelPartnerData(filename: string): HotelPartner {
    const cleanName = filename
        .replace(/\.(JPG|jpeg|jpg|png)/gi, '')
        .replace(/\(\d+\)/g, '')
        .replace(/[._]/g, ' ')
        .trim();
    
    const slug = cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    
    if (HOTEL_PARTNERS[slug]) {
        return HOTEL_PARTNERS[slug];
    }
    
    // Find partial match
    const matchedKey = Object.keys(HOTEL_PARTNERS).find(k => slug.includes(k) || k.includes(slug));
    if (matchedKey && HOTEL_PARTNERS[matchedKey]) {
        return {
            ...HOTEL_PARTNERS[matchedKey],
            id: slug,
            name: cleanName,
            logoFilename: filename
        };
    }

    return {
        id: slug,
        name: cleanName,
        logoFilename: filename,
        category: "Premium Hospitality Partner",
        rating: "4.7 ★",
        locations: ["Mumbai", "Bengaluru", "Delhi NCR", "Goa", "Pune", "Hyderabad"],
        overview: `${cleanName} is a prestigious hospitality brand hiring trained talent through Shark Edutech. Recognized for outstanding service standards, world-class dining, and employee growth, ${cleanName} offers excellent career pathways for hospitality professionals.`,
        keyBenefits: [
            "Structured Hospitality Skill Mentorship",
            "Duty Meals & Uniform Facilities",
            "Performance Incentives & Appraisals",
            "Fast-Track Career Advancement"
        ],
        activeJobs: defaultJobs,
        requirements: [
            "Diploma or Degree in Hotel Management / Hospitality",
            "Good communication and guest interaction skills",
            "Professional grooming and positive work ethic"
        ],
        contactEmail: "careers@sharkedutech.com"
    };
}
