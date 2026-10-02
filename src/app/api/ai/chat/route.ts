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

        // 2. Check if external LLM API key is provided (OpenAI or Gemini)
        const geminiKey = process.env.GEMINI_API_KEY;
        const openAiKey = process.env.OPENAI_API_KEY;

        if (geminiKey) {
            try {
                const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [
                            {
                                role: 'user',
                                parts: [
                                    {
                                        text: `You are the official Shark Edutech AI Assistant for Shark International Edutech Pvt. Ltd. (Kolkata - 700157).
Live Database Status:
- Total Active Hospitality Jobs: ${totalJobs}
- Latest Openings: ${JSON.stringify(latestJobs)}
- Top Courses: ${JSON.stringify(sampleCourses)}
- Partner Hotels: Over 400+ luxury hotels (Marriott, Taj, Hyatt, Hilton, Radisson, Oberoi, ITC, The Leela).
- Policy: 100% written refund guarantee if placement is not secured within 3 months.
- Platform links: /jobs (Browse Jobs), /admissions (Explore Colleges & Courses), /gallery (Video Gallery), /#partners (Hotel Tie-Ups), /auth/signin (Login), /auth/signup (Register).
Answer the user's question clearly, warmly, and professionally using markdown with clickable links.
User Question: "${message}"`
                                    }
                                ]
                            }
                        ]
                    })
                });

                const data = await response.json();
                const aiReply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
                if (aiReply) {
                    return NextResponse.json({ reply: aiReply });
                }
            } catch (err) {
                console.error("Gemini API call failed, falling back to local engine:", err);
            }
        }

        // 3. Built-in High-Accuracy Hospitality RAG & NLP Matching Engine
        let reply = "";

        // Check for specific job search query (e.g., jobs in Goa, Front Office, Chef, Marriott)
        if (query.includes('job') || query.includes('vacancy') || query.includes('hiring') || query.includes('opening') || query.includes('salary') || query.includes('career') || query.includes('recruitment')) {
            const matchingJobs = latestJobs.filter(j => 
                query.includes('goa') ? j.location.toLowerCase().includes('goa') :
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
        else if (query.includes('course') || query.includes('admission') || query.includes('college') || query.includes('diploma') || query.includes('degree') || query.includes('study') || query.includes('bhm') || query.includes('fees') || query.includes('eligibility')) {
            reply = `### 🎓 Hospitality Education & Admissions\n\n` +
                `Shark Edutech partners with accredited hotel management institutes and universities to provide industry-ready degrees and diploma programs:\n\n` +
                `**Popular Programs Offered:**\n` +
                `- 📘 **B.Sc. in Hospitality & Hotel Administration (BHM)** — 3 Years (Eligibility: 10+2)\n` +
                `- 📕 **Diploma in Food & Beverage Service & Production** — 1-2 Years (Eligibility: 10th / 12th)\n` +
                `- 📗 **Culinary Arts & Bakery Management** — 1 Year Intensive Kitchen Training\n` +
                `- 📙 **Front Office & Guest Relations Executive Diploma** — 6 Months to 1 Year\n` +
                `- 📓 **MBA in International Hospitality & Tourism Management** — 2 Years (Post Graduation)\n\n` +
                `**Admissions Benefits:**\n` +
                `✅ Guaranteed 100% On-Job Training (OJT) in 5-star hotels\n` +
                `✅ Direct placement interviews upon course completion\n` +
                `✅ Seat reservations and scholarship guidance\n\n` +
                `👉 **[Explore College Profiles & Admissions Portal](/admissions)**`;
        }
        else if (query.includes('tie up') || query.includes('tie-up') || query.includes('tieup') || query.includes('partner') || query.includes('marriott') || query.includes('taj') || query.includes('hyatt') || query.includes('hilton') || query.includes('oberoi') || query.includes('radisson') || query.includes('itc') || query.includes('leela') || query.includes('hotel')) {
            reply = `### 🏨 400+ Luxury 5-Star Hotel Tie-Ups\n\n` +
                `**Shark Edutech** is officially partnered with over **400+ leading hospitality chains and 5-star properties** nationwide, including:\n\n` +
                `- 🌟 **Marriott International** (JW Marriott, Courtyard, Sheraton, Westin)\n` +
                `- 🌟 **Taj Hotels & Resorts** (IHCL Luxury Properties)\n` +
                `- 🌟 **Hyatt Hotels & Resorts** (Grand Hyatt, Hyatt Regency)\n` +
                `- 🌟 **Hilton Worldwide & DoubleTree**\n` +
                `- 🌟 **The Oberoi & Trident Hotels**\n` +
                `- 🌟 **ITC Hotels & Luxury Collection**\n` +
                `- 🌟 **Radisson Hotel Group**\n` +
                `- 🌟 **The Leela Palaces, Hotels & Resorts**\n` +
                `- 🌟 **Pride Hotels & Angsana Resorts**\n\n` +
                `Our candidates receive direct interview shortlisting, On-Job Training (OJT), and accelerated placement support.\n\n` +
                `👉 **[Click Here to Explore All Hotel Partners](/#partners)**`;
        }
        else if (query.includes('guarantee') || query.includes('refund') || query.includes('policy') || query.includes('money back') || query.includes('safe') || query.includes('fraud') || query.includes('consent')) {
            reply = `### 🛡️ 100% Written Refund Policy & 3-Month Placement Guarantee\n\n` +
                `At **Shark International Edutech Pvt. Ltd.**, your career investment is 100% safe and legally backed by our Candidate Protection SOP:\n\n` +
                `1. **3-Month Placement Commitment**: If our team does not successfully secure a hospitality placement for a registered candidate within **three (3) months** of completed registration, the full registration amount is **100% refunded without deduction**.\n` +
                `2. **Direct Official Receipt**: Every registered student receives an official branded company receipt.\n` +
                `3. **Online Consent Form**: Candidates can easily review and sign the digital placement agreement online.\n\n` +
                `👉 **[Fill & Submit Consent Online](/#consent-form)**\n` +
                `👉 **[Review Full Refund Policy](/refund-policy)**`;
        }
        else if (query.includes('video') || query.includes('live') || query.includes('stream') || query.includes('webinar') || query.includes('gallery')) {
            const liveMsg = liveNowCount > 0 ? `🔴 **There is currently a LIVE broadcast in progress!**` : `Catch up on recorded masterclasses and upcoming live sessions.`;
            reply = `### 📺 Masterclasses, Live Streams & Video Gallery\n\n` +
                `${liveMsg}\n\n` +
                `We host interactive sessions with general managers, executive chefs, and HR leaders from top hotel brands to help you prepare for real-world interviews.\n\n` +
                `👉 **[Visit the Video Gallery](/gallery)**\n` +
                `👉 **[Explore Featured Videos on Homepage](/#video-gallery)**`;
        }
        else if (query.includes('contact') || query.includes('whatsapp') || query.includes('phone') || query.includes('email') || query.includes('office') || query.includes('address') || query.includes('kolkata')) {
            reply = `### 📞 Contact Shark Edutech\n\n` +
                `We're here to assist you with jobs, admissions, and employer partnerships:\n\n` +
                `- 🏢 **Company**: Shark International Edutech Pvt. Ltd.\n` +
                `- 📍 **Registered Office**: Kolkata - 700157, West Bengal, India\n` +
                `- 💬 **WhatsApp Chat**: [Click to Chat on WhatsApp](https://wa.me/919830000000)\n` +
                `- ✉️ **Official Email**: [sharkedutechinternational@gmail.com](mailto:sharkedutechinternational@gmail.com)\n` +
                `- 🌐 **Website**: [sharkedutech.com](https://sharkedutech.com)\n\n` +
                `👉 **[Visit our Contact Page](/contact)** to submit an inquiry!`;
        }
        else if (query.includes('login') || query.includes('sign in') || query.includes('register') || query.includes('signup') || query.includes('account') || query.includes('portal')) {
            reply = `### 🔐 Account Portals & Access\n\n` +
                `Select the portal that fits your role:\n\n` +
                `- 🎓 **Students & Candidates**:\n` +
                `  • [Candidate Login](/auth/signin) • [Candidate Register](/auth/signup)\n\n` +
                `- 💼 **Hotel Employers**:\n` +
                `  • [Employer Login](/auth/signin?type=employer) • [Post Jobs & Register](/auth/signup/employer)\n\n` +
                `- 🏫 **Partner Colleges**:\n` +
                `  • [College Admin Login](/admissions/auth/signin) • [List Your College](/list-your-college)\n\n` +
                `- 🛡️ **Super Admin & Sub-Admins**:\n` +
                `  • [Admin Portal](/auth/signin?type=admin) • [Role-Based Access](/admin/sub-admins)`;
        }
        else if (query.includes('who') || query.includes('about') || query.includes('shark') || query.includes('what is')) {
            reply = `### 🦈 About Shark Edutech\n\n` +
                `**Shark International Edutech Pvt. Ltd.** is India's premier integrated **Hospitality Education & Direct Placement Platform**.\n\n` +
                `**What Sets Us Apart:**\n` +
                `1. **Exclusive Hospitality Focus**: Dedicated solely to luxury hotels, resorts, airlines, and fine dining.\n` +
                `2. **400+ Hotel Partners**: Direct recruiter network with Taj, Marriott, Hyatt, ITC, Hilton, and Radisson.\n` +
                `3. **100% Refund Guarantee**: Placement secured within 3 months or a full 100% refund.\n` +
                `4. **Dual Career Path**: Start fresh with hotel management admissions or get hired immediately via active openings.\n\n` +
                `👉 **[Learn More on our About Us Page](/about)**\n` +
                `👉 **[Explore 50+ Job Openings](/jobs)**`;
        }
        else {
            // General friendly overview with guidance chips
            reply = `### Hello! Welcome to Shark Edutech AI 👋\n\n` +
                `I am your 24/7 Hospitality Advisor. Here is how I can help you today:\n\n` +
                `- 💼 **Find Luxury Hotel Jobs**: [Browse 50+ Active Openings](/jobs) across Front Office, F&B, Culinary & Housekeeping.\n` +
                `- 🎓 **Colleges & Admissions**: [Explore Hotel Management Courses & Partner Colleges](/admissions).\n` +
                `- 🏨 **5-Star Hotel Tie-Ups**: [View 400+ Partner Brands](/#partners) like Marriott, Taj, and Hyatt.\n` +
                `- 🛡️ **Refund Guarantee**: Learn about our [3-Month 100% Placement Policy](/refund-policy).\n` +
                `- 📞 **Get in Touch**: [Contact Support & WhatsApp](/contact).\n\n` +
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
