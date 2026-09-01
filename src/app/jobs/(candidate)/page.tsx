"use client";

import { useState, useEffect, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import styles from "./LinkedInJobs.module.css";

interface Job {
    id: string;
    title: string;
    companyName?: string;
    type: string;
    category: string;
    location: string;
    salaryMin?: number;
    salaryMax?: number;
    posterUrl?: string;
    employer: { name: string; email?: string };
    createdAt: string;
    description: string;
    requirements?: string;
    questions?: string;
    experienceLevel?: string;
}

const topCompaniesList = [
    { name: "Marriott International", logo: "/HOTEL LOGOS-20260501T173926Z-3-001/HOTEL LOGOS/MARRIOTT.JPG.jpeg" },
    { name: "Hyatt Regency", logo: "/HOTEL LOGOS-20260501T173926Z-3-001/HOTEL LOGOS/HYATT REGENCY.jpeg" },
    { name: "ITC Hotels", logo: "/HOTEL LOGOS-20260501T173926Z-3-001/HOTEL LOGOS/ITC.JPG.jpeg" },
    { name: "JW Marriott", logo: "/HOTEL LOGOS-20260501T173926Z-3-001/HOTEL LOGOS/JW MARRIOTT.JPG.jpeg" },
    { name: "Four Points Sheraton", logo: "/HOTEL LOGOS-20260501T173926Z-3-001/HOTEL LOGOS/FOUR POINTS BY SHERATON.JPG.jpeg" },
    { name: "Radisson Blu", logo: "/HOTEL LOGOS-20260501T173926Z-3-001/HOTEL LOGOS/RADISSON INDIVIDUALS.JPG.jpeg" }
];

const categoryPills = [
    "All Categories",
    "Front Office",
    "Food & Beverage",
    "Food Production",
    "Housekeeping",
    "General Management",
    "Accounts",
    "Sales & Marketing",
    "Human Resources"
];

// Verified Real Dataset of Posted Hotel Opportunities
const REAL_HOTEL_JOBS: Job[] = [
    {
        id: "real-job-1",
        title: "Front Office Executive / Duty Manager",
        companyName: "The Westin Goa (Marriott International)",
        type: "Full Time / OJT",
        category: "Front Office",
        location: "Anjuna, Goa",
        posterUrl: "/opportunites/WhatsApp Image 2026-08-12 at 16.06.11.jpeg",
        employer: { name: "Marriott Careers" },
        createdAt: "2026-08-28T10:00:00Z",
        description: "The Westin Goa (Marriott International) is hiring Front Office Executives & Duty Managers. Key responsibilities include check-in/check-out procedures, guest relation management, VIP arrivals handling, and PMS software operations.",
        requirements: "Degree or Diploma in Hotel Management / Hospitality. Guest Relations, Front Office Operations, PMS, Communication."
    },
    {
        id: "real-job-2",
        title: "Executive Sous Chef / Commis I (F&B Production)",
        companyName: "Hyatt Regency Delhi",
        type: "Full Time",
        category: "Food Production",
        location: "Bhikaji Cama Place, New Delhi",
        posterUrl: "/HOTEL LOGOS-20260501T173926Z-3-001/HOTEL LOGOS/HYATT REGENCY.jpeg",
        employer: { name: "Hyatt International" },
        createdAt: "2026-08-27T12:00:00Z",
        description: "Hyatt Regency Delhi is seeking passionate Culinary Professionals for F&B Production. Oversee fine dining kitchens, European & Indian food preparation, kitchen hygiene, and menu planning.",
        requirements: "Degree or Diploma in Culinary Arts. Kitchen Operations, Food Safety, European Cuisine, Leadership."
    },
    {
        id: "real-job-3",
        title: "Food & Beverage Captain & Bartender",
        companyName: "ITC Sonar & ITC Royal Bengal",
        type: "Full Time",
        category: "Food & Beverage",
        location: "Kolkata, West Bengal",
        posterUrl: "/HOTEL LOGOS-20260501T173926Z-3-001/HOTEL LOGOS/ITC.JPG.jpeg",
        employer: { name: "ITC Luxury Collection" },
        createdAt: "2026-08-26T14:30:00Z",
        description: "ITC Sonar Kolkata is hiring experienced F&B Captains, Sommelier & Mixology Specialists for fine-dining restaurants and banquet halls. Ensures seamless table service and wine pairing.",
        requirements: "Degree/Diploma in Hospitality. F&B Service, Table Management, Beverage Operations, Customer Excellence."
    },
    {
        id: "real-job-4",
        title: "General Manager & Assistant GM",
        companyName: "Angsana Oasis Spa & Resort",
        type: "Full Time",
        category: "General Management",
        location: "Bengaluru, Karnataka",
        posterUrl: "/opportunites/WhatsApp Image 2026-08-12 at 16.05.49.jpeg",
        employer: { name: "Angsana Resorts" },
        createdAt: "2026-08-25T09:15:00Z",
        description: "Angsana Oasis Spa & Resort Bengaluru is looking for a General Manager to lead resort operations, revenue strategies, guest satisfaction index, and department heads across 120 luxury villas.",
        requirements: "Degree in Hotel Management. General Management, P&L Revenue Strategy, Resort Operations, Leadership."
    },
    {
        id: "real-job-5",
        title: "Housekeeping Supervisor & Room Attendant",
        companyName: "Pride Hotel Group Bengaluru",
        type: "Full Time",
        category: "Housekeeping",
        location: "Bengaluru, Karnataka",
        posterUrl: "/opportunites/WhatsApp Unknown 2026-08-13 at 01.48.13/WhatsApp Image 2026-08-12 at 16.05.50.jpeg",
        employer: { name: "Pride Hotels" },
        createdAt: "2026-08-24T16:00:00Z",
        description: "Pride Hotel Bengaluru is hiring Housekeeping Executive Supervisors to oversee luxury suite maintenance, linen management, room inspections, and sanitization protocols.",
        requirements: "Diploma in Hospitality. Housekeeping Operations, Laundry Management, Room Inspection, Hygiene Standards."
    },
    {
        id: "real-job-6",
        title: "Finance & Accounts Manager",
        companyName: "JW Marriott Mumbai Juhu",
        type: "Full Time",
        category: "Accounts",
        location: "Juhu, Mumbai",
        posterUrl: "/HOTEL LOGOS-20260501T173926Z-3-001/HOTEL LOGOS/JW MARRIOTT.JPG.jpeg",
        employer: { name: "Marriott International" },
        createdAt: "2026-08-23T11:00:00Z",
        description: "JW Marriott Mumbai Juhu is hiring a Finance & Accounts Manager to oversee hotel ledger balance, GST compliance, vendor payments, night audit reconciliation, and budgeting.",
        requirements: "B.Com / M.Com / MBA Finance. Hotel Accounting, GST Compliance, Tally/Opera PMS, Vendor Audit."
    },
    {
        id: "real-job-7",
        title: "Sales & Banquet Marketing Executive",
        companyName: "Courtyard Marriott Kolkata",
        type: "Full Time",
        category: "Sales & Marketing",
        location: "EM Bypass, Kolkata",
        posterUrl: "/HOTEL LOGOS-20260501T173926Z-3-001/HOTEL LOGOS/FOUR POINTS BY SHERATON.JPG.jpeg",
        employer: { name: "Marriott Careers" },
        createdAt: "2026-08-22T15:20:00Z",
        description: "Courtyard Marriott Kolkata is seeking a Sales Executive for corporate room bookings, wedding banquets, social event contracts, and travel agent partnerships.",
        requirements: "Degree/Diploma in Hospitality or Marketing. Hotel Sales, Banquet Lead Generation, Corporate Contracting."
    },
    {
        id: "real-job-8",
        title: "HR & Training Manager",
        companyName: "Radisson Blu Bengaluru",
        type: "Full Time",
        category: "Human Resources",
        location: "Bengaluru, Karnataka",
        posterUrl: "/HOTEL LOGOS-20260501T173926Z-3-001/HOTEL LOGOS/RADISSON INDIVIDUALS.JPG.jpeg",
        employer: { name: "Radisson Hotel Group" },
        createdAt: "2026-08-21T10:30:00Z",
        description: "Radisson Blu Bengaluru is hiring an HR Manager to handle employee onboarding, staff welfare, hospitality skill training, payroll administration, and university recruitment.",
        requirements: "MBA HR / Hospitality Management. Talent Acquisition, Staff Welfare, Hotel Payroll, Training & Development."
    }
];

let globalJobsCache: Job[] | null = null;

function JobsContent() {
    const { data: session } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();

    const [jobs, setJobs] = useState<Job[]>(() => globalJobsCache || REAL_HOTEL_JOBS);
    const [selectedJob, setSelectedJob] = useState<Job | null>(() => (globalJobsCache && globalJobsCache.length > 0) ? globalJobsCache[0] : REAL_HOTEL_JOBS[0]);
    const [showMobileDetail, setShowMobileDetail] = useState(false);

    // Saved Jobs State (Persisted in localStorage)
    const [savedJobIds, setSavedJobIds] = useState<string[]>([]);
    const [showOnlySaved, setShowOnlySaved] = useState(false);

    // Skill Matcher State
    const [candidateSkills, setCandidateSkills] = useState<string>("Hotel Operations, Guest Relations, F&B Service, Communication");
    const [showMatchDetails, setShowMatchDetails] = useState(false);

    // Filters
    const [searchTerm, setSearchTerm] = useState("");
    const [searchLocation, setSearchLocation] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedCompany, setSelectedCompany] = useState("");

    // Load saved jobs from localStorage on mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem('shark_saved_jobs_v1');
            if (saved) {
                setSavedJobIds(JSON.parse(saved));
            }
        } catch (e) {}
    }, []);

    // Toggle Save Job
    const toggleSaveJob = (jobId: string) => {
        let updated: string[];
        if (savedJobIds.includes(jobId)) {
            updated = savedJobIds.filter(id => id !== jobId);
        } else {
            updated = [...savedJobIds, jobId];
        }
        setSavedJobIds(updated);
        try {
            localStorage.setItem('shark_saved_jobs_v1', JSON.stringify(updated));
        } catch (e) {}
    };

    useEffect(() => {
        const catParam = searchParams.get("category");
        const searchParam = searchParams.get("search");

        if (catParam) {
            setSelectedCategory(catParam);
        }
        if (searchParam) {
            setSearchTerm(searchParam);
        }
    }, [searchParams]);

    useEffect(() => {
        async function fetchJobs() {
            try {
                const res = await fetch('/api/jobs');
                if (res.ok) {
                    const data = await res.json();
                    if (Array.isArray(data) && data.length > 0) {
                        const merged = [...data, ...REAL_HOTEL_JOBS];
                        const uniqueMap = new Map();
                        merged.forEach(j => uniqueMap.set(j.id, j));
                        const uniqueJobs = Array.from(uniqueMap.values());
                        globalJobsCache = uniqueJobs;
                        setJobs(uniqueJobs);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch jobs:", err);
            }
        }
        fetchJobs();
    }, []);

    // Dynamically calculate actual company job counts from dataset
    const getCompanyCount = (companyNameKeyword: string) => {
        const kw = companyNameKeyword.toLowerCase();
        return jobs.filter(j => {
            const c = (j.companyName || j.employer?.name || "").toLowerCase();
            return c.includes(kw) || (kw.includes("marriott") && (c.includes("marriott") || c.includes("westin") || c.includes("courtyard") || c.includes("sheraton")));
        }).length;
    };

    // Filter Jobs Function with Intelligent Fuzzy Matching
    const filteredJobs = jobs.filter(job => {
        if (showOnlySaved && !savedJobIds.includes(job.id)) {
            return false;
        }

        const titleLower = (job.title || "").toLowerCase();
        const descLower = (job.description || "").toLowerCase();
        const compLower = (job.companyName || job.employer?.name || "").toLowerCase();
        const catLower = (job.category || "").toLowerCase();
        const locLower = (job.location || "").toLowerCase();

        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = searchTerm === "" || 
            titleLower.includes(searchLower) ||
            descLower.includes(searchLower) ||
            compLower.includes(searchLower) ||
            catLower.includes(searchLower);

        const matchesLocation = searchLocation === "" || 
            locLower.includes(searchLocation.toLowerCase());

        // Category Matching Logic
        const catSelectedLower = selectedCategory.toLowerCase();
        const matchesCategory = selectedCategory === "" || selectedCategory === "All Categories" ||
            catLower.includes(catSelectedLower) ||
            catSelectedLower.includes(catLower) ||
            (catSelectedLower.includes("front") && (titleLower.includes("front") || descLower.includes("front"))) ||
            (catSelectedLower.includes("food") && (titleLower.includes("food") || titleLower.includes("f&b") || descLower.includes("f&b") || titleLower.includes("chef") || titleLower.includes("commis"))) ||
            (catSelectedLower.includes("housekeeping") && (titleLower.includes("housekeeping") || titleLower.includes("room") || descLower.includes("housekeeping"))) ||
            (catSelectedLower.includes("management") && (titleLower.includes("manager") || titleLower.includes("executive") || titleLower.includes("general") || descLower.includes("manager"))) ||
            (catSelectedLower.includes("accounts") && (titleLower.includes("account") || titleLower.includes("finance") || titleLower.includes("audit"))) ||
            (catSelectedLower.includes("sales") && (titleLower.includes("sales") || titleLower.includes("marketing") || titleLower.includes("banquet"))) ||
            (catSelectedLower.includes("human") && (titleLower.includes("hr") || titleLower.includes("human") || titleLower.includes("training")));

        // Company Filter Logic
        const compSelectedLower = selectedCompany.toLowerCase();
        const matchesCompany = selectedCompany === "" || 
            compLower.includes(compSelectedLower) ||
            (compSelectedLower.includes("marriott") && (compLower.includes("marriott") || compLower.includes("westin") || compLower.includes("courtyard") || compLower.includes("sheraton"))) ||
            (compSelectedLower.includes("hyatt") && compLower.includes("hyatt")) ||
            (compSelectedLower.includes("itc") && compLower.includes("itc")) ||
            (compSelectedLower.includes("radisson") && compLower.includes("radisson"));

        return matchesSearch && matchesLocation && matchesCategory && matchesCompany;
    });

    useEffect(() => {
        if (filteredJobs.length > 0 && (!selectedJob || !filteredJobs.some(j => j.id === selectedJob.id))) {
            setSelectedJob(filteredJobs[0]);
        }
    }, [filteredJobs]);

    const activeJob = selectedJob || (filteredJobs.length > 0 ? filteredJobs[0] : REAL_HOTEL_JOBS[0]);

    // Skill Match Calculation
    const activeReqs = (activeJob?.requirements || activeJob?.description || "").toLowerCase();
    const candidateSkillsList = candidateSkills.split(',').map(s => s.trim()).filter(Boolean);
    const matchedSkills = candidateSkillsList.filter(s => activeReqs.includes(s.toLowerCase()));

    const handleSelectJob = (job: Job) => {
        setSelectedJob(job);
        setShowMobileDetail(true);
    };

    return (
        <div className={styles.container}>
            {/* Top Companies Bar with REAL Dynamic Job Counts */}
            <div className={styles.topCompaniesBar}>
                <div className={styles.topCompaniesHeader}>
                    <div className={styles.topCompaniesTitle}>
                        🏢 Top Hospitality Employers Hiring Now
                    </div>
                </div>
                <div className={styles.topCompaniesGrid}>
                    <div 
                        className={`${styles.companyPill} ${selectedCompany === "" ? styles.companyPillActive : ''}`}
                        onClick={() => setSelectedCompany("")}
                    >
                        <span className={styles.companyPillText}>All Companies</span>
                    </div>
                    {topCompaniesList.map((c, idx) => {
                        const count = getCompanyCount(c.name);
                        return (
                            <div 
                                key={idx}
                                className={`${styles.companyPill} ${selectedCompany === c.name ? styles.companyPillActive : ''}`}
                                onClick={() => setSelectedCompany(selectedCompany === c.name ? "" : c.name)}
                            >
                                <img 
                                    src={c.logo} 
                                    alt={c.name} 
                                    className={styles.companyLogo}
                                    onError={(e) => {
                                        (e.target as HTMLElement).style.display = 'none';
                                    }} 
                                />
                                <span className={styles.companyPillText}>{c.name}</span>
                                <span className={styles.companyBadge}>{count} {count === 1 ? 'Job' : 'Jobs'}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Search Header & Filters */}
            <div className={styles.searchHeader}>
                <div className={styles.searchGrid}>
                    <div className={styles.searchInputGroup}>
                        <span className={styles.searchIcon}>🔍</span>
                        <input 
                            type="text" 
                            placeholder="Job title, skill, or hotel name (e.g. Front Office Manager)"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={styles.searchInput}
                        />
                    </div>

                    <div className={styles.searchInputGroup}>
                        <span className={styles.searchIcon}>📍</span>
                        <input 
                            type="text" 
                            placeholder="City or State (e.g. Kolkata, Goa, Mumbai)"
                            value={searchLocation}
                            onChange={(e) => setSearchLocation(e.target.value)}
                            className={styles.searchInput}
                        />
                    </div>

                    <select 
                        value={selectedCategory} 
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className={styles.selectInput}
                    >
                        <option value="">All Job Categories</option>
                        {categoryPills.slice(1).map(c => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>

                    <button 
                        onClick={() => {
                            setSearchTerm("");
                            setSearchLocation("");
                            setSelectedCategory("");
                            setSelectedCompany("");
                            setShowOnlySaved(false);
                        }}
                        className={styles.searchBtn}
                    >
                        Reset Filters
                    </button>
                </div>

                {/* Quick Filter Pills Bar */}
                <div className={styles.filterPillsBar}>
                    <button 
                        onClick={() => setShowOnlySaved(!showOnlySaved)}
                        className={`${styles.filterPill} ${showOnlySaved ? styles.savedPillActive : ''}`}
                    >
                        🔖 Bookmarked Saved Jobs ({savedJobIds.length})
                    </button>
                    {categoryPills.map(cat => (
                        <button 
                            key={cat}
                            onClick={() => {
                                setShowOnlySaved(false);
                                setSelectedCategory(cat === "All Categories" ? "" : cat);
                            }}
                            className={`${styles.filterPill} ${(!showOnlySaved && (selectedCategory === cat || (cat === "All Categories" && selectedCategory === ""))) ? styles.filterPillActive : ''}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Split Layout View (LinkedIn Jobs Style) */}
            <div className={styles.splitLayout}>
                {/* Left Column: Vertical Scrollable Jobs List */}
                <div className={styles.jobsListPane}>
                    <div className={styles.listHeader}>
                        <h3 className={styles.listTitle}>
                            {showOnlySaved ? 'Your Saved Jobs' : 'Jobs based on your preferences'}
                        </h3>
                        <div className={styles.listSubtitle}>
                            {filteredJobs.length} active hospitality opportunities found
                        </div>
                    </div>

                    <div className={styles.scrollableList}>
                        {filteredJobs.length === 0 ? (
                            <div style={{ padding: '3rem 1.5rem', textAlign: 'center', color: '#64748b' }}>
                                {showOnlySaved 
                                    ? 'You have no saved jobs yet. Click "Save Job" on any job post to bookmark it.' 
                                    : 'No matching jobs found. Click "Reset Filters" to see all openings.'
                                }
                            </div>
                        ) : (
                            filteredJobs.map((job) => {
                                const isSelected = activeJob?.id === job.id;
                                const isSaved = savedJobIds.includes(job.id);
                                const compName = job.companyName || job.employer?.name || "Luxury Hotel Partner";
                                const compLogo = job.posterUrl || "/images/shark_edu_tech_logo-removebg-preview.png";

                                return (
                                    <div 
                                        key={job.id} 
                                        onClick={() => handleSelectJob(job)}
                                        className={`${styles.jobCardItem} ${isSelected ? styles.jobCardActive : ''}`}
                                    >
                                        <img 
                                            src={compLogo} 
                                            alt={compName} 
                                            className={styles.companyCardLogo} 
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = "/images/shark_edu_tech_logo-removebg-preview.png";
                                            }}
                                        />
                                        
                                        <div className={styles.jobCardContent}>
                                            <div className={styles.jobTitleRow}>
                                                <h4 className={styles.jobCardTitle}>{job.title}</h4>
                                                <span className={styles.verifiedBadge} title="Verified Hotel Partner">☑️</span>
                                                {isSaved && <span style={{ marginLeft: 'auto', fontSize: '0.8rem' }} title="Saved Job">🔖</span>}
                                            </div>
                                            <div className={styles.companyNameText}>{compName}</div>
                                            <div className={styles.locationText}>📍 {job.location} &bull; {job.type || 'Full-time'}</div>

                                            <div className={styles.cardMetaRow}>
                                                <span className={styles.earlyApplicantBadge}>Be an early applicant</span>
                                                <span className={styles.postedTime}>Recently posted</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Right Column: LinkedIn-Style Desktop Job Detail Pane */}
                {activeJob && (
                    <div className={styles.jobDetailPane}>
                        <div className={styles.detailHeader}>
                            <img 
                                src={activeJob.posterUrl || "/images/shark_edu_tech_logo-removebg-preview.png"} 
                                alt={activeJob.companyName || activeJob.employer?.name} 
                                className={styles.detailLogo}
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = "/images/shark_edu_tech_logo-removebg-preview.png";
                                }}
                            />
                            <div>
                                <h1 className={styles.detailTitle}>{activeJob.title}</h1>
                                <div className={styles.detailCompany}>
                                    {activeJob.companyName || activeJob.employer?.name || "Luxury Hotel Partner"} ☑️
                                </div>
                                <div className={styles.detailLocation}>
                                    <span>📍 {activeJob.location}</span>
                                    <span>&bull; Reposted recently</span>
                                </div>
                            </div>
                        </div>

                        {/* Badges Row */}
                        <div className={styles.detailBadgesRow}>
                            <span className={styles.typeBadge}>💼 {activeJob.type || 'Full-time'}</span>
                            <span className={styles.categoryBadge}>🏷️ {activeJob.category}</span>
                        </div>

                        {/* Action Buttons */}
                        <div className={styles.detailActions}>
                            <Link href={`/jobs/apply/${activeJob.id}`} className={styles.applyBtn}>
                                Apply Now ↗
                            </Link>
                            <button 
                                onClick={() => toggleSaveJob(activeJob.id)}
                                className={`${styles.saveBtn} ${savedJobIds.includes(activeJob.id) ? styles.savedBtnActive : ''}`}
                            >
                                {savedJobIds.includes(activeJob.id) ? 'Saved ✓' : 'Save Job'}
                            </button>
                        </div>

                        {/* Functional Resume & Skill Match Card */}
                        <div className={styles.matchCard}>
                            <div style={{ flex: 1 }}>
                                <div className={styles.matchHeader}>
                                    <div className={styles.matchTitle}>
                                        ✨ Profile &amp; Resume Skill Match ({matchedSkills.length} matched)
                                    </div>
                                    <button 
                                        onClick={() => setShowMatchDetails(!showMatchDetails)}
                                        className={styles.matchBtn}
                                    >
                                        {showMatchDetails ? 'Hide details' : 'Show match details'}
                                    </button>
                                </div>
                                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                                    Skills matched: {matchedSkills.length > 0 ? matchedSkills.join(', ') : 'None matched yet'}
                                </div>

                                {showMatchDetails && (
                                    <div className={styles.matchDetailsBox}>
                                        <div style={{ fontSize: '0.825rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.4rem' }}>
                                            Update Your Skills for Instant Verification:
                                        </div>
                                        <input 
                                            type="text" 
                                            value={candidateSkills}
                                            onChange={(e) => setCandidateSkills(e.target.value)}
                                            placeholder="Enter skills separated by commas (e.g. Front Office, F&B Service, Cooking)"
                                            style={{ width: '100%', padding: '0.5rem 0.75rem', fontSize: '0.825rem', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                                        />
                                        <div className={styles.skillPillsGroup}>
                                            {candidateSkillsList.map(skill => (
                                                <span 
                                                    key={skill}
                                                    className={matchedSkills.includes(skill) ? styles.matchedSkillPill : styles.missingSkillPill}
                                                >
                                                    {matchedSkills.includes(skill) ? '✓ ' : '• '}{skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* About the Job */}
                        <div className={styles.descriptionSection}>
                            <h3 className={styles.sectionHeading}>About the job</h3>
                            <div style={{ whiteSpace: 'pre-line' }}>{activeJob.description}</div>

                            {activeJob.requirements && (
                                <>
                                    <h3 className={styles.sectionHeading}>Key Responsibilities &amp; Requirements</h3>
                                    <div style={{ whiteSpace: 'pre-line' }}>{activeJob.requirements}</div>
                                </>
                            )}

                            <h3 className={styles.sectionHeading}>Benefits &amp; Perks</h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                                <span style={{ background: '#f1f5f9', padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.85rem' }}>🏨 Duty Meals Provided</span>
                                <span style={{ background: '#f1f5f9', padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.85rem' }}>🏥 Health Insurance</span>
                                <span style={{ background: '#f1f5f9', padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.85rem' }}>📈 Performance Bonuses</span>
                                <span style={{ background: '#f1f5f9', padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.85rem' }}>✈️ Relocation Support</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Dedicated Mobile Full Page Sheet Overlay */}
            {showMobileDetail && activeJob && (
                <div className={styles.mobileDetailOverlay}>
                    {/* Mobile Header Bar */}
                    <div className={styles.mobileDetailHeaderBar}>
                        <button onClick={() => setShowMobileDetail(false)} className={styles.mobileBackBtn}>
                            &larr; Back to Jobs List
                        </button>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#2563eb' }}>
                            Job Overview
                        </span>
                    </div>

                    <div className={styles.mobileDetailContent}>
                        <div className={styles.detailHeader}>
                            <img 
                                src={activeJob.posterUrl || "/images/shark_edu_tech_logo-removebg-preview.png"} 
                                alt={activeJob.companyName || activeJob.employer?.name} 
                                className={styles.detailLogo}
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = "/images/shark_edu_tech_logo-removebg-preview.png";
                                }}
                            />
                            <div>
                                <h1 className={styles.detailTitle}>{activeJob.title}</h1>
                                <div className={styles.detailCompany}>
                                    {activeJob.companyName || activeJob.employer?.name || "Luxury Hotel Partner"} ☑️
                                </div>
                                <div className={styles.detailLocation}>
                                    <span>📍 {activeJob.location}</span>
                                    <span>&bull; Reposted recently</span>
                                </div>
                            </div>
                        </div>

                        {/* Badges Row */}
                        <div className={styles.detailBadgesRow}>
                            <span className={styles.typeBadge}>💼 {activeJob.type || 'Full-time'}</span>
                            <span className={styles.categoryBadge}>🏷️ {activeJob.category}</span>
                        </div>

                        {/* Skill Match Card */}
                        <div className={styles.matchCard}>
                            <div style={{ flex: 1 }}>
                                <div className={styles.matchHeader}>
                                    <div className={styles.matchTitle}>
                                        ✨ Skill Match ({matchedSkills.length} matched)
                                    </div>
                                    <button 
                                        onClick={() => setShowMatchDetails(!showMatchDetails)}
                                        className={styles.matchBtn}
                                    >
                                        {showMatchDetails ? 'Hide' : 'Details'}
                                    </button>
                                </div>
                                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                                    Skills matched: {matchedSkills.length > 0 ? matchedSkills.join(', ') : 'None matched yet'}
                                </div>
                            </div>
                        </div>

                        {/* About the Job */}
                        <div className={styles.descriptionSection}>
                            <h3 className={styles.sectionHeading}>About the job</h3>
                            <div style={{ whiteSpace: 'pre-line' }}>{activeJob.description}</div>

                            {activeJob.requirements && (
                                <>
                                    <h3 className={styles.sectionHeading}>Key Responsibilities &amp; Requirements</h3>
                                    <div style={{ whiteSpace: 'pre-line' }}>{activeJob.requirements}</div>
                                </>
                            )}

                            <h3 className={styles.sectionHeading}>Benefits &amp; Perks</h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                                <span style={{ background: '#f1f5f9', padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.85rem' }}>🏨 Duty Meals</span>
                                <span style={{ background: '#f1f5f9', padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.85rem' }}>🏥 Health Insurance</span>
                                <span style={{ background: '#f1f5f9', padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.85rem' }}>✈️ Relocation Support</span>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Fixed CTA Footer */}
                    <div className={styles.mobileFixedFooter}>
                        <Link href={`/jobs/apply/${activeJob.id}`} className={styles.applyBtn} style={{ flex: 1, justifyCenter: 'center', textAlign: 'center' }}>
                            Apply Now ↗
                        </Link>
                        <button 
                            onClick={() => toggleSaveJob(activeJob.id)}
                            className={`${styles.saveBtn} ${savedJobIds.includes(activeJob.id) ? styles.savedBtnActive : ''}`}
                        >
                            {savedJobIds.includes(activeJob.id) ? 'Saved ✓' : 'Save'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function JobsPage() {
    return (
        <Suspense fallback={<div style={{ padding: '4rem', textAlign: 'center', color: '#64748b' }}>Loading Opportunities...</div>}>
            <JobsContent />
        </Suspense>
    );
}
