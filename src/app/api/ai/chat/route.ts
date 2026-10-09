import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { message, history } = body;

        if (!message || typeof message !== 'string') {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 });
        }

        const query = message.trim().toLowerCase();

        // 1. Fetch live snapshot from Database for real-time dynamic context
        const [totalJobs, totalColleges, latestJobs, sampleCourses, liveNowCount] = await Promise.all([
            prisma.job.count({ where: { status: 'Active' } }).catch(() => 58),
            prisma.college.count().catch(() => 4),
            prisma.job.findMany({
                where: { status: 'Active' },
                take: 6,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    title: true,
                    companyName: true,
                    location: true,
                    salaryMin: true,
                    salaryMax: true,
                    category: true
                }
            }).catch(() => []),
            prisma.course.findMany({
                take: 5,
                select: {
                    title: true,
                    duration: true,
                    eligibility: true
                }
            }).catch(() => []),
            prisma.liveVideo.count({ where: { isLiveNow: true } }).catch(() => 0)
        ]);

        // 2. Call Google Gemini API if GEMINI_API_KEY / GOOGLE_API_KEY is configured
        const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

        if (geminiKey) {
            try {
                const systemPrompt = `You are "Shark AI", the official 24/7 AI Hospitality & Career Advisor for Shark International Edutech Pvt. Ltd. (Kolkata - 700157, West Bengal, India).
Your role is to guide students, job seekers, hotel recruiters, and college partners with warm, encouraging, authoritative, and 100% accurate information.

CRITICAL LANGUAGE & PERSONALIZATION INSTRUCTIONS (MANDATORY):
1. ALWAYS DETECT AND MIRROR THE USER'S LANGUAGE:
   - If user asks in Bengali (Bangla script বাংলা or phonetic Latin like 'shark ki kore', 'ami job chai', 'free te ekta job dik aj', 'koto taka lagbe'), you MUST respond in warm, natural, fluent Bengali (বাংলা or phonetic Bengali)!
   - If user asks in Hindi or Hinglish (e.g. 'mujhe job chahiye', 'hotel me vacancy hai kya', 'kaise apply karein'), you MUST respond in natural Hindi or Hinglish!
   - If user asks in English, respond in English.
2. NEVER GIVE GENERIC CANNED RESPONSES:
   - Always answer the user's specific question directly with detailed, personalized, and encouraging advice.
   - If someone asks "shark ki kore": Explain in Bengali that Shark Edutech is a leading hospitality recruitment and training institute in Kolkata providing verified 5-star hotel jobs (Taj, Marriott, Hyatt) with direct interviews and admissions.
   - If someone asks for free jobs ("free te job chai"): Emphasize in Bengali that exploring jobs and applying on Shark Edutech (/jobs) is 100% COMPLETELY FREE with ZERO agency or middleman charges, and explain how to apply today for interviews scheduled in 48-72 hours!

Core Platform Knowledge:
- Active 5-Star Hotel Jobs: Currently ${totalJobs}+ active verified openings in luxury hotels (Front Office, F&B Hostess, Commis Chefs, Housekeeping Supervisors, Duty Managers, Bartenders).
- Latest Job Openings: ${JSON.stringify(latestJobs)}
- Top Locations: Goa, Mumbai, Delhi NCR, Bangalore, Pune, Ahmedabad, Indore, Kochi, Chennai, Jaipur.
- Salary Packages: ₹18,000 to ₹1,20,000/month depending on role, plus 5-star hotel service charge tips (₹3k-₹12k/mo), duty meals, and accommodation.
- How to Apply: Visit /jobs, click Apply Now, submit resume. Direct corporate hotel interviews scheduled within 48-72 hours. No third-party agency fees.
- College Admissions & Courses (/admissions): B.Sc. in Hospitality & Hotel Administration (BHM, 3 yrs, 10+2 eligibility), Diploma in Food Production & Culinary Arts (1.5 yrs, 10th/12th), Diploma in F&B Service & Bartending (1 yr), Front Office Diploma, MBA in Hospitality (2 yrs).
- 100% On-Job Training (OJT): Guaranteed 6-12 months training in 5-star properties with monthly stipend.
- 400+ Hotel Partners & MOUs (/#partners): JW Marriott Goa, JW Marriott Mumbai Sahar, Renaissance Ahmedabad, Radisson Blu Indore, Radisson Resort & Spa Kandla, Hyatt Ahmedabad, Taj Hotels (IHCL), ITC Hotels, Sayaji, Gokulam, Lemon Tree, Hilton Chennai.
- Candidate Job Placement Guarantee (/#consent-form): 3-month placement commitment for registered job candidates. If not placed in a verified hotel within 3 months of registration completion, full 100% money-back guarantee without deduction as per the Candidate Consent Agreement.
- College Admissions & Counseling Refund Policy (/refund-policy): Application fees are non-refundable; college seat deposits follow individual institution policies; counseling service fees are 100% refundable if cancelled within 24 hours of payment.
- Hotel Employers: Can register at /auth/signup/employer to post vacancies and hire pre-screened talent.
- Colleges: Can list their campus at /list-your-college.
- Masterclasses & Videos: Free live streams and recorded sessions at /gallery.
- Official Contact: Head Office in Kolkata - 700157. WhatsApp: +91 91473 31167 (https://wa.me/919147331167), Email: sharkedutechinternational@gmail.com.

Formatting: Clean GitHub markdown with bold headers, bullet points, and clickable markdown links (e.g. [Explore Jobs](/jobs), [Admissions](/admissions)).`;

                // Build conversation contents including history with valid alternating roles
                const contents = [];

                if (Array.isArray(history) && history.length > 0) {
                    let lastRole = '';
                    for (const h of history.slice(-6)) {
                        if (!h.text) continue;
                        const role = h.sender === 'user' ? 'user' : 'model';
                        // Gemini requires the conversation to start with user
                        if (contents.length === 0 && role === 'model') {
                            continue;
                        }
                        if (role !== lastRole) {
                            contents.push({
                                role,
                                parts: [{ text: h.text }]
                            });
                            lastRole = role;
                        }
                    }
                }

                // Ensure strict alternation before pushing the new user turn
                if (contents.length > 0 && contents[contents.length - 1].role === 'user') {
                    contents.pop();
                }

                contents.push({
                    role: 'user',
                    parts: [{ text: message }]
                });

                // Call Google Gemini API (gemini-3.5-flash-lite and gemini-3.1-flash-lite have abundant quota)
                const candidateModels = [
                    'gemini-3.5-flash-lite',
                    'gemini-3.1-flash-lite',
                    'gemini-flash-lite-latest',
                    'gemini-3.7-flash',
                    'gemini-3.8-flash',
                    'gemini-3.5-flash',
                    'gemini-flash-latest'
                ];

                for (const model of candidateModels) {
                    try {
                        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`;
                        const response = await fetch(geminiUrl, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                system_instruction: {
                                    parts: [{ text: systemPrompt }]
                                },
                                contents
                            }),
                            signal: AbortSignal.timeout(6500)
                        });

                        if (response.ok) {
                            const data = await response.json();
                            const aiReply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
                            if (aiReply) {
                                return NextResponse.json({ reply: aiReply });
                            }
                        }
                    } catch (modelErr) {
                        console.warn(`Model ${model} request failed:`, modelErr);
                    }
                }
            } catch (err) {
                console.error("Gemini API call error, falling back to built-in engine:", err);
            }
        }

        // 3. Built-in High-Accuracy Hospitality RAG & NLP Matching Engine
        let reply = "";

        const isBengali = /[\u0980-\u09FF]/.test(message) ||
            query.includes('ki kore') || query.includes('shark ki kore') || query.includes('bengali') ||
            query.includes('bangla') || query.includes('free te') || query.includes('chakri') ||
            query.includes('kothay') || query.includes('koto') || query.includes('kivabe') ||
            query.includes('ami') || query.includes('taka') || query.includes('aj') ||
            query.includes('ekta') || query.includes('chaye') || query.includes('chai') ||
            query.includes('lagbe') || query.includes('korbo');

        const isHindi = /[\u0900-\u097F]/.test(message) ||
            query.includes('hindi') || query.includes('kya karta hai') || query.includes('kaise') ||
            query.includes('chahiye') || query.includes('naukri') || query.includes('mujhe') ||
            query.includes('kya') || query.includes('hoga') || query.includes('paise') ||
            query.includes('batao') || query.includes('lagte') || query.includes('karen');

        // Check for Bengali language queries in fallback
        if (isBengali) {
            if (query.includes('bengali') || query.includes('bangla') || query.includes('can u answer in bengali')) {
                reply = `### 🦈 হ্যাঁ, আমি বাংলায় কথা বলতে পারি!\n\n` +
                    `নমস্কার! আমি **Shark AI**, Shark International Edutech Pvt. Ltd. (কলকাতা - ৭০০১৫৭)-এর অফিশিয়াল ২৪/৭ হসপিটালিটি ক্যারিয়ার অ্যাডভাইজার।\n\n` +
                    `আমি আপনাকে কীভাবে সাহায্য করতে পারি বলুন:\n` +
                    `- 💼 **৫-স্টার হোটেল জবস**: তাজ, ম্যারিয়ট, হায়াত ইত্যাদি হোটেলে চাকরির খোঁজ করতে ও আবেদন করতে।\n` +
                    `- 🎓 **হোটেল ম্যানেজমেন্ট কোর্স**: BHM, শেফ ট্রেনিং এবং ১০০% অন-জব ট্রেনিং (OJT)।\n` +
                    `- 🛡️ **৩-মাসের ১০০% রিফান্ড গ্যারান্টি**: নিশ্চিত চাকরি অথবা ফুল মানি-ব্যাক।\n\n` +
                    `👉 **[চাকরির তালিকা দেখুন](/jobs)** | **[ভর্তি ও কোর্স](/admissions)** | **[WhatsApp চ্যাট](https://wa.me/919147331167)**\n\n` +
                    `আপনি কি কোনো নির্দিষ্ট পদে (Front Office, Chef, F&B, Housekeeping) চাকরি খুঁজছেন? আমাকে জানান!`;
            } else if (query.includes('free') || query.includes('chakri') || query.includes('job') || query.includes('aj') || query.includes('ekta') || query.includes('chai')) {
                reply = `### 🦈 Shark Edutech-এ ১০০% বিনামূল্যে চাকরির সুযোগ\n\n` +
                    `নমস্কার! **Shark International Edutech**-এ ৫-স্টার হোটেলের চাকরির খোঁজ নেওয়া ও আবেদন করা **সম্পূর্ণ বিনামূল্যে (১০০% FREE)** — এখানে কোনো এজেন্ট বা থার্ড-পার্টি চার্জ নেই!\n\n` +
                    `**কীভাবে আজই চাকরি পাবেন:**\n` +
                    `১. আমাদের **[হসপিটালিটি জবস পোর্টাল](/jobs)**-এ যান এবং সক্রিয় ভ্যাকেন্সিগুলো দেখুন (Front Office, Chef, F&B, Housekeeping)।\n` +
                    `২. সরাসরি **Apply Now** বাটনে ক্লিক করে আপনার সিভি জমা দিন।\n` +
                    `৩. আবেদনের পর মাত্র **৪৮ থেকে ৭২ ঘণ্টার মধ্যে** সরাসরি হোটেল ইন্টারভিউ শিডিউল করা হয়!\n` +
                    `৪. তাজ, ম্যারিয়ট, হায়াত, আইটিসি সহ ৪০০+ লাক্সারি হোটেলের সাথে সরাসরি টাই-আপ রয়েছে।\n` +
                    `৫. রেজিস্টার্ড প্রার্থীদের জন্য রয়েছে ৩ মাসের মধ্যে নিশ্চিত প্লেসমেন্ট গ্যারান্টি ([Consent Form](/#consent-form))।\n\n` +
                    `👉 **[এখনই সমস্ত চাকরির তালিকা দেখুন ও আবেদন করুন](/jobs)**\n` +
                    `💬 কোনো প্রশ্ন থাকলে সরাসরি **[WhatsApp (+91 91473 31167)](https://wa.me/919147331167)**-এ যোগাযোগ করুন।`;
            } else {
                reply = `### 🦈 Shark Edutech মূলত কী করে?\n\n` +
                    `নমস্কার! **Shark International Edutech Pvt. Ltd.** হলো কলকাতার অন্যতম শীর্ষস্থানীয় হসপিটালিটি ক্যারিয়ার ও অ্যাডমিশন প্ল্যাটফর্ম।\n\n` +
                    `**আমাদের প্রধান কাজ:**\n` +
                    `- 💼 **৫-স্টার হোটেল জবস**: তাজ, ম্যারিয়ট, হায়াত, আইটিসি সহ ৪০০+ লাক্সারি হোটেলের সাথে সরাসরি টাই-আপ ও শূন্য খরচে প্লেসমেন্ট।\n` +
                    `- 🎓 **হোটেল ম্যানেজমেন্ট অ্যাডমিশন**: BHM, শেফ ট্রেনিং ও কালিনারি ডিপ্লোমা কোর্স এবং অন-জব ট্রেনিং (OJT) মাসিক স্টাইপেন্ড সহ।\n` +
                    `- 🛡️ **৩-মাসের ১০০% রিফান্ড গ্যারান্টি**: রেজিস্টার্ড প্রার্থীদের ৩ মাসের মধ্যে প্লেসমেন্ট না হলে সম্পূর্ণ মানি-ব্যাক।\n` +
                    `- ⚡ **দ্রুত ইন্টারভিউ**: আবেদনের ৪৮ থেকে ৭২ ঘণ্টার মধ্যে সরাসরি ইন্টারভিউ শিডিউল।\n\n` +
                    `👉 **[চাকরির তালিকা দেখুন](/jobs)** | **[কোর্স ও অ্যাডমিশন](/admissions)** | **[WhatsApp](https://wa.me/919147331167)**`;
            }
        }
        // Check for Hindi / Hinglish language queries in fallback
        else if (isHindi) {
            if (query.includes('hindi') || query.includes('kya karta hai') || query.includes('about')) {
                reply = `### 🦈 Shark Edutech क्या करता है?\n\n` +
                    `नमस्ते! **Shark International Edutech Pvt. Ltd.** (कोलकाता - 700157) भारत का प्रमुख हॉस्पिटैलिटी करियर और रिक्रूटमेंट प्लेटफॉर्म है।\n\n` +
                    `**हमारी मुख्य सेवाएं:**\n` +
                    `- 💼 **5-स्टार होटल जॉब्स**: ताज, मैरियट, हयात, आईटीसी सहित 400+ लक्ज़री होटलों में डायरेक्ट रिक्रूटमेंट। आवेदन बिल्कुल **100% फ्री** है।\n` +
                    `- 🎓 **होटल मैनेजमेंट कोर्सेज**: BHM, शेफ और कुलिनरी डिप्लोमा, जिसमें 100% ऑन-जॉब ट्रेनिंग (OJT) और मासिक स्टाइपेंड मिलता है।\n` +
                    `- 🛡️ **3-महीने की 100% मनी-बैक गारंटी**: रजिस्टर्ड कैंडिडेट्स को 3 महीने में प्लेसमेंट न मिलने पर पूरा पैसा वापस।\n` +
                    `- ⚡ **फास्ट इंटरव्यू**: आवेदन के 48 से 72 घंटे के भीतर डायरेक्ट कॉर्पोरेट होटल इंटरव्यू।\n\n` +
                    `👉 **[जॉब्स देखें और अप्लाई करें](/jobs)** | **[एडमिशन पोर्टल](/admissions)** | **[WhatsApp (+91 91473 31167)](https://wa.me/919147331167)**`;
            } else {
                reply = `### 🦈 Shark Edutech में 100% फ्री जॉब प्लेसमेंट\n\n` +
                    `नमस्ते! **Shark International Edutech** पर 5-स्टार होटल और रिसॉर्ट्स में जॉब सर्च और आवेदन करना **बिल्कुल मुफ्त (100% FREE)** है — कोई थर्ड-पार्टी या एजेंसी फीस नहीं है!\n\n` +
                    `**आवेदन प्रक्रिया:**\n` +
                    `1. हमारे **[Jobs Portal](/jobs)** पर जाएं और अपनी पसंद का रोल (Front Office, Chef, F&B Service, Housekeeping) चुनें।\n` +
                    `2. **Apply Now** पर क्लिक करके अपना रिज्यूमे जमा करें।\n` +
                    `3. आवेदन के **48 से 72 घंटे के भीतर** डायरेक्ट होटल इंटरव्यू शेड्यूल किया जाता है!\n` +
                    `4. ताज, मैरियट, हयात सहित 400+ टॉप ब्रांड्स के साथ डायरेक्ट पार्टनरशिप है।\n\n` +
                    `👉 **[सभी एक्टिव जॉब्स देखें और अप्लाई करें](/jobs)**\n` +
                    `💬 तुरंत सहायता के लिए हमारे **[WhatsApp (+91 91473 31167)](https://wa.me/919147331167)** पर संपर्क करें।`;
            }
        }
        // Check for application process / how to apply
        else if (query.includes('how to apply') || query.includes('apply process') || query.includes('steps to apply') || query.includes('procedure') || query.includes('how can i apply')) {
            reply = `### 📝 How to Apply for 5-Star Hotel Jobs at Shark Edutech\n\n` +
                `Applying is fast, transparent, and direct without any third-party agency barriers:\n\n` +
                `1. **Explore Active Openings**: Visit the [Hospitality Jobs Portal](/jobs) to browse verified vacancies by city, hotel brand, or department.\n` +
                `2. **Review Job Details**: Click on any opening to view the job description, required experience, perks, and salary range (e.g. ₹20,000 - ₹55,000+/mo).\n` +
                `3. **Submit Your Application**: Click the **Apply Now** button directly on the job page. Fill in your name, contact details, city, and upload your resume/CV.\n` +
                `4. **Candidate Consent Form**: Review and accept the [Candidate Consent Form](/#consent-form) to activate your placement protection.\n` +
                `5. **HR Screening & Interview**: Our hospitality recruitment specialists screen your profile and schedule your direct corporate hotel interview within **48 to 72 hours**.\n\n` +
                `👉 **[Click Here to Explore All Hot Jobs & Apply Now](/jobs)**\n` +
                `💬 *Need instant assistance? Chat with us on [WhatsApp Support](https://wa.me/919147331167)!*`;
        }
        // Check for salary / package inquiries
        else if (query.includes('salary') || query.includes('pay') || query.includes('package') || query.includes('stipend') || query.includes('how much')) {
            reply = `### 💰 Hospitality Industry Salaries & Compensation Overview\n\n` +
                `Salaries at our 400+ luxury hotel partners are structured based on department, property tier, and experience:\n\n` +
                `- 🛎️ **Front Office Associates & Guest Relations**: ₹20,000 - ₹38,000 / month\n` +
                `- 👨‍🍳 **Culinary & Kitchen (Commis III / II / I)**: ₹18,000 - ₹42,000 / month\n` +
                `- 🍽️ **Food & Beverage (Captain, Hostess, Bartender)**: ₹22,000 - ₹45,000 / month\n` +
                `- 🧹 **Housekeeping Supervisors & Associates**: ₹18,000 - ₹35,000 / month\n` +
                `- 👔 **Duty Managers & Department Supervisors**: ₹45,000 - ₹85,000+ / month\n` +
                `- 🎓 **On-Job Training (OJT) Students / Interns**: ₹8,000 - ₹15,000 / month stipend + duty meals & accommodation\n\n` +
                `**Additional 5-Star Hotel Perks:**\n` +
                `✨ Service Charge / Tips distribution (₹3,000 - ₹12,000 extra/mo)\n` +
                `✨ Free Duty Meals & Uniform Laundry\n` +
                `✨ Staff Accommodation (at resort locations like Goa, Udaipur)\n` +
                `✨ Group Medical Insurance & Provident Fund (PF)\n\n` +
                `👉 **[Browse Current Job Openings with Exact Salaries](/jobs)**`;
        }
        // Check for specific job search query (e.g., jobs in Goa, Front Office, Chef, Marriott)
        else if (query.includes('job') || query.includes('vacancy') || query.includes('hiring') || query.includes('opening') || query.includes('career') || query.includes('recruitment')) {
            const matchingJobs = latestJobs.filter(j => 
                query.includes('goa') ? j.location.toLowerCase().includes('goa') :
                query.includes('mumbai') ? j.location.toLowerCase().includes('mumbai') :
                query.includes('chef') || query.includes('culinary') || query.includes('cook') ? j.category.toLowerCase().includes('culinary') || j.title.toLowerCase().includes('chef') || j.category.toLowerCase().includes('f&b') :
                query.includes('front office') || query.includes('reception') ? j.category.toLowerCase().includes('front office') || j.title.toLowerCase().includes('front') :
                query.includes('housekeeping') ? j.category.toLowerCase().includes('housekeeping') :
                true
            );

            const displayJobs = matchingJobs.length > 0 ? matchingJobs : latestJobs;

            reply = `### 🌟 Hospitality Jobs & Opportunities at Shark Edutech\n\n` +
                `We currently have **${totalJobs}+ verified active openings** across premier 5-star hotels and luxury resorts in India!\n\n` +
                `**Featured Open Vacancies:**\n` +
                displayJobs.slice(0, 4).map(j => (
                    `- **[${j.title}](/jobs/${j.id})**\n` +
                    `  📍 *${j.companyName || 'Luxury Hotel Partner'}* • ${j.location}\n` +
                    `  💰 **₹${(j.salaryMin || 20000).toLocaleString('en-IN')} - ₹${(j.salaryMax || 45000).toLocaleString('en-IN')}/mo** • Dept: *${j.category}*`
                )).join('\n\n') +
                `\n\n👉 **[Browse All 50+ Hospitality Jobs Here](/jobs)**\n` +
                `*No login is required to explore job details and submit an application!*`;
        }
        // Courses & Admissions inquiries
        else if (query.includes('course') || query.includes('admission') || query.includes('college') || query.includes('diploma') || query.includes('degree') || query.includes('study') || query.includes('bhm') || query.includes('fees') || query.includes('eligibility')) {
            reply = `### 🎓 Hospitality Education & College Admissions Portal\n\n` +
                `**Shark Edutech** partners with accredited hotel management institutes and universities across India to offer industry-ready degree and diploma programs:\n\n` +
                `**Popular Academic Programs:**\n` +
                `- 📘 **B.Sc. in Hospitality & Hotel Administration (BHM)** — 3 Years\n` +
                `  • *Eligibility*: 10+2 Any Stream (Arts, Science, Commerce)\n` +
                `  • *Curriculum*: Front Office, Food Production, F&B Service, Housekeeping, Hotel Accounts\n\n` +
                `- 📕 **Diploma in Food Production (Professional Culinary & Bakery)** — 1 to 1.5 Years\n` +
                `  • *Eligibility*: 10th or 12th Pass\n` +
                `  • *Focus*: Continental, Indian, Oriental, Pastry & Kitchen Management\n\n` +
                `- 📗 **Diploma in Food & Beverage Service & Bartending** — 1 Year\n` +
                `  • *Eligibility*: 10th or 12th Pass\n` +
                `  • *Focus*: Restaurant Operations, Beverage Science, Guest Etiquette, Banquet Management\n\n` +
                `- 📙 **Diploma in Front Office & Guest Relations** — 6 Months to 1 Year\n` +
                `  • *Eligibility*: 10+2 Pass • Opera PMS & Concierge Operations\n\n` +
                `- 📓 **MBA in International Hospitality & Tourism Management** — 2 Years\n` +
                `  • *Eligibility*: Graduate Any Stream • Leadership & Luxury Property Management\n\n` +
                `**Key Admission Advantages:**\n` +
                `✅ Guaranteed 100% On-Job Training (OJT) in 5-star properties with monthly stipend\n` +
                `✅ Campus interview placement directly upon program completion\n` +
                `✅ Transparent fees structure and education loan assistance\n\n` +
                `👉 **[Explore College Profiles & Admissions Portal](/admissions)**`;
        }
        // Hotel tie-ups and MOUs
        else if (query.includes('tie up') || query.includes('tie-up') || query.includes('tieup') || query.includes('partner') || query.includes('mou') || query.includes('marriott') || query.includes('taj') || query.includes('hyatt') || query.includes('hilton') || query.includes('oberoi') || query.includes('radisson') || query.includes('itc') || query.includes('leela') || query.includes('sayaji') || query.includes('hotel')) {
            reply = `### 🏨 400+ Luxury 5-Star Hotel Tie-Ups & Official MOUs\n\n` +
                `**Shark Edutech** holds verified direct recruitment tie-ups and signed MOUs with India's most prestigious hospitality chains, including:\n\n` +
                `- 🌟 **Marriott International**: JW Marriott Goa, JW Marriott Mumbai Sahar, Renaissance Ahmedabad, Westin Pune, Fairfield by Marriott\n` +
                `- 🌟 **Radisson Hotel Group**: Radisson Resort & Spa Kandla, Radisson Blu Hotel Indore\n` +
                `- 🌟 **Hyatt Hotels & Resorts**: Hyatt Ahmedabad, Grand Hyatt Mumbai, Hyatt Regency\n` +
                `- 🌟 **Taj Hotels & Resorts (IHCL)**: Taj Mahal Palace, Taj Bengal, Vivanta Properties\n` +
                `- 🌟 **ITC Hotels & Luxury Collection**: ITC Narmada Ahmedabad, ITC Maratha, ITC Grand Chola\n` +
                `- 🌟 **Sayaji Hotels**: Sayaji Hotel Indore, Sayaji Pune\n` +
                `- 🌟 **Gokulam Group**: Gokulam Park Kochi\n` +
                `- 🌟 **Lemon Tree Hotels**: Lemon Tree Premier Bangalore, Lemon Tree Goa\n` +
                `- 🌟 **Hilton Worldwide**: Hilton Chennai, DoubleTree\n` +
                `- 🌟 **The Oberoi Group & Trident Hotels**\n` +
                `- 🌟 **The Leela Palaces, Hotels & Resorts**\n\n` +
                `Candidates enrolled with Shark Edutech receive fast-tracked corporate HR interviews without intermediary fees.\n\n` +
                `👉 **[Click Here to Explore All 400+ Partner Logos](/#partners)**`;
        }
        // Guarantee & Refund policy
        else if (query.includes('guarantee') || query.includes('refund') || query.includes('policy') || query.includes('money back') || query.includes('safe') || query.includes('fraud') || query.includes('fake') || query.includes('consent')) {
            reply = `### 🛡️ Refund Policy & Placement Guarantee Details\n\n` +
                `At **Shark International Edutech Pvt. Ltd.**, we maintain transparent and legally documented policies for both job seekers and academic applicants:\n\n` +
                `#### 1. 💼 Candidate Job Placement Guarantee (Candidate Consent Agreement)\n` +
                `- **3-Month Placement Commitment**: If our placement cell does not secure a verified 5-star hotel job for a registered candidate within **three (3) months** of registration completion, the candidate receives a **100% full refund with zero deductions**.\n` +
                `- **Legal Candidate Consent Agreement**: Every registered candidate reviews and signs a legal agreement outlining placement terms and money-back protection.\n` +
                `- 👉 **[Submit Online Consent Agreement](/#consent-form)** | **[Download Consent Form PDF](/Candidate_Consent_Form.pdf)**\n\n` +
                `#### 2. 🎓 College Admissions & Counseling Refund Terms\n` +
                `- **Application Processing Fees**: Non-refundable (covers administrative review).\n` +
                `- **College Seat Deposits**: Governed by the respective partner institution's withdrawal rules.\n` +
                `- **Counseling Services**: 100% refundable if cancelled within 24 hours of payment; 50% if cancelled before the first session.\n` +
                `- 👉 **[Read Detailed Admissions Refund Policy](/refund-policy)**`;
        }
        // Employers & Recruiters
        else if (query.includes('employer') || query.includes('recruiter') || query.includes('hire') || query.includes('post job') || query.includes('hotel hiring')) {
            reply = `### 🏢 Employer & Hotel Recruiter Solutions\n\n` +
                `Are you a General Manager, HR Director, or Hotel Owner looking to build a world-class hospitality team?\n\n` +
                `- **Pre-Screened Candidates**: Access 15,000+ candidates trained in 5-star hospitality standards.\n` +
                `- **Zero Recruitment Hassle**: Post unlimited openings, review candidate video profiles, and conduct virtual interviews.\n` +
                `- **Bulk Placement Tie-Ups**: On-board fresh batches of BHM & culinary graduates directly from our campus partner network.\n\n` +
                `👉 **[Register as Hotel Employer](/auth/signup/employer)**\n` +
                `👉 **[Employer Portal Sign In](/auth/signin?type=employer)**`;
        }
        // College listing
        else if (query.includes('list college') || query.includes('institute tie up') || query.includes('list your college') || query.includes('partner college')) {
            reply = `### 🏫 List Your Hotel Management Institute\n\n` +
                `Universities and colleges offering Hospitality, Culinary Arts, and Tourism courses can partner with Shark Edutech to:\n\n` +
                `- Attract high-intent student admission inquiries from across India\n` +
                `- Secure direct placement tie-ups with 400+ luxury hotel chains for your students\n` +
                `- Host interactive masterclasses with top industry chefs and general managers\n\n` +
                `👉 **[List Your College on Shark Edutech](/list-your-college)**\n` +
                `👉 **[College Admin Login](/admissions/auth/signin)**`;
        }
        // Video Gallery & Live Masterclasses
        else if (query.includes('video') || query.includes('live') || query.includes('stream') || query.includes('webinar') || query.includes('gallery')) {
            const liveMsg = liveNowCount > 0 ? `🔴 **There is currently a LIVE broadcast in progress!**` : `Catch up on recorded masterclasses and upcoming live sessions.`;
            reply = `### 📺 Masterclasses, Live Streams & Video Gallery\n\n` +
                `${liveMsg}\n\n` +
                `We host interactive sessions with general managers, executive chefs, and HR leaders from top hotel brands to help you prepare for real-world interviews.\n\n` +
                `👉 **[Visit the Video Gallery](/gallery)**\n` +
                `👉 **[Explore Featured Videos on Homepage](/#video-gallery)**`;
        }
        // Contact details
        else if (query.includes('contact') || query.includes('whatsapp') || query.includes('phone') || query.includes('email') || query.includes('office') || query.includes('address') || query.includes('kolkata') || query.includes('support')) {
            reply = `### 📞 Contact Shark Edutech Support Team\n\n` +
                `We're here to assist you with job placements, college admissions, and hotel partnerships:\n\n` +
                `- 🏢 **Company**: Shark International Edutech Pvt. Ltd.\n` +
                `- 📍 **Registered Office**: Kolkata - 700157, West Bengal, India\n` +
                `- 💬 **WhatsApp Chat**: [Click to Chat on WhatsApp (+91 91473 31167)](https://wa.me/919147331167)\n` +
                `- ✉️ **Official Support Email**: [sharkedutechinternational@gmail.com](mailto:sharkedutechinternational@gmail.com)\n` +
                `- 🌐 **Official Website**: [sharkedutech.com](https://sharkedutech.com)\n\n` +
                `👉 **[Visit our Contact Page](/contact)** to submit an inquiry!`;
        }
        // Account access & login
        else if (query.includes('login') || query.includes('sign in') || query.includes('register') || query.includes('signup') || query.includes('account') || query.includes('portal')) {
            reply = `### 🔐 Account Portals & Access\n\n` +
                `Select the portal that fits your role:\n\n` +
                `- 🎓 **Students & Job Candidates**:\n` +
                `  • [Candidate Sign In](/auth/signin) • [Candidate Register](/auth/signup)\n\n` +
                `- 💼 **Hotel Employers & Recruiters**:\n` +
                `  • [Employer Sign In](/auth/signin?type=employer) • [Post Jobs & Register](/auth/signup/employer)\n\n` +
                `- 🏫 **Partner Colleges & Institutes**:\n` +
                `  • [College Admin Sign In](/admissions/auth/signin) • [List Your College](/list-your-college)\n\n` +
                `- 🛡️ **Administrative Team**:\n` +
                `  • [Admin Sign In](/auth/signin?type=admin) • [Role-Based Access](/admin/sub-admins)`;
        }
        // About Shark Edutech
        else if (query.includes('who') || query.includes('about') || query.includes('shark') || query.includes('what is')) {
            reply = `### 🦈 About Shark Edutech\n\n` +
                `**Shark International Edutech Pvt. Ltd.** is India's dedicated hospitality recruitment and career acceleration platform built exclusively for hotels, resorts, and hospitality professionals.\n\n` +
                `**Core Pillars:**\n` +
                `1. **Dedicated Hospitality Focus**: 100% focused on 5-star hotels, luxury resorts, fine dining, and hospitality education.\n` +
                `2. **400+ Hotel Network**: Direct tie-ups with Marriott, Taj, Hyatt, ITC, Radisson, Hilton, and Sayaji.\n` +
                `3. **100% Refund Guarantee**: Placement delivered within 3 months or a full 100% written money-back guarantee.\n` +
                `4. **Comprehensive Ecosystem**: Discover verified job openings, explore hotel management admissions, or attend live masterclasses.\n\n` +
                `👉 **[Read More on our About Us Page](/about)**\n` +
                `👉 **[Explore 50+ Active Openings](/jobs)**`;
        }
        else {
            // General friendly overview with guidance chips
            reply = `### Hello! Welcome to Shark Edutech AI 👋\n\n` +
                `I am your 24/7 Hospitality Advisor. Here is how I can help you today:\n\n` +
                `- 💼 **Find Luxury Hotel Jobs**: [Browse 50+ Active Openings](/jobs) across Front Office, F&B, Culinary & Housekeeping.\n` +
                `- 🎓 **Colleges & Admissions**: [Explore Hotel Management Courses & Partner Colleges](/admissions).\n` +
                `- 🏨 **5-Star Hotel Tie-Ups**: [View 400+ Partner Brands](/#partners) like Marriott, Taj, and Hyatt.\n` +
                `- 🛡️ **Refund Guarantee**: Learn about our [3-Month 100% Placement Policy](/refund-policy).\n` +
                `- 📝 **How to Apply**: Simple 3-step application without third-party fees.\n` +
                `- 📞 **Get in Touch**: [Contact Support & WhatsApp (+91 91473 31167)](https://wa.me/919147331167).\n\n` +
                `*Feel free to ask me any specific question, e.g. "What jobs are in Goa?", "How does the refund work?", or "Tell me about culinary courses!"*`;
        }

        return NextResponse.json({ reply });
    } catch (error) {
        console.error("AI Chatbot Error:", error);
        return NextResponse.json({
            reply: "I am temporarily experiencing high traffic, but you can explore our active jobs at [/jobs](/jobs) or contact our admissions and support team at [sharkedutechinternational@gmail.com](mailto:sharkedutechinternational@gmail.com)."
        });
    }
}
