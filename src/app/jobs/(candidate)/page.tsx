"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Space_Grotesk } from "next/font/google";

// Types
interface Job {
    id: string;
    title: string;
    companyName?: string;
    type: string;
    category: string;
    location: string;
    salaryMin: number;
    salaryMax: number;
    posterUrl?: string;
    employer: { name: string };
    createdAt: string;
    description: string;
    questions?: string; // JSON string
}

const categories = [
    { name: "Front Office", count: 120, icon: "🛎️" },
    { name: "Culinary", count: 85, icon: "👨🍳" },
    { name: "Housekeeping", count: 64, icon: "🧹" },
    { name: "Management", count: 42, icon: "💼" },
];

const spaceGrotesk = Space_Grotesk({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
});

// Global in-memory cache variables for instant client navigation
let globalJobsMemoryCache: Job[] | null = null;
let globalAppliedIdsMemoryCache: Set<string> | null = null;

export default function JobsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [jobs, setJobs] = useState<Job[]>(() => globalJobsMemoryCache || []);
    const [loading, setLoading] = useState<boolean>(() => !globalJobsMemoryCache || globalJobsMemoryCache.length === 0);

    const [appliedJobIds, setAppliedJobIds] = useState<Set<string>>(() => globalAppliedIdsMemoryCache || new Set());

    // Search and filter state variables
    const [searchTerm, setSearchTerm] = useState("");
    const [searchLocation, setSearchLocation] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [filterRemote, setFilterRemote] = useState(false);
    const [filterUrgent, setFilterUrgent] = useState(false);

    const categoryMapping: Record<string, string> = {
        "Front Office": "Front Office",
        "Culinary": "Food Production",
        "Housekeeping": "Housekeeping",
        "Management": "Back Office"
    };

    const filteredJobs = jobs.filter(job => {
        const matchesSearch = searchTerm === "" || 
            job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (job.companyName && job.companyName.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (job.employer?.name && job.employer.name.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesLocation = searchLocation === "" || 
            job.location.toLowerCase().includes(searchLocation.toLowerCase());

        const matchesCategory = selectedCategory === "" || 
            job.category === selectedCategory;

        const matchesRemote = !filterRemote || job.location.toLowerCase().includes("remote");
        
        const matchesUrgent = !filterUrgent || 
            job.title.toLowerCase().includes("urgent") || 
            job.description.toLowerCase().includes("urgent");

        return matchesSearch && matchesLocation && matchesCategory && matchesRemote && matchesUrgent;
    });

    useEffect(() => {
        let isMounted = true;

        // 1. Instant load from sessionStorage if in-memory cache is empty
        if (!globalJobsMemoryCache || globalJobsMemoryCache.length === 0) {
            try {
                const storedJobs = sessionStorage.getItem('shark_jobs_cache_v2');
                if (storedJobs) {
                    const parsed = JSON.parse(storedJobs);
                    if (Array.isArray(parsed) && parsed.length > 0) {
                        globalJobsMemoryCache = parsed;
                        setJobs(parsed);
                        setLoading(false);
                    }
                }
            } catch (e) {}
        }

        if (!globalAppliedIdsMemoryCache) {
            try {
                const storedApps = sessionStorage.getItem('shark_applied_apps_v2');
                if (storedApps) {
                    const parsedApps = JSON.parse(storedApps);
                    const setIds = new Set<string>(parsedApps);
                    globalAppliedIdsMemoryCache = setIds;
                    setAppliedJobIds(setIds);
                }
            } catch (e) {}
        }

        // 2. Fetch/Revalidate in background (SWR pattern)
        async function fetchJobsAndApplications() {
            try {
                const res = await fetch('/api/jobs');
                if (res.ok) {
                    const data = await res.json();
                    if (isMounted) {
                        globalJobsMemoryCache = data;
                        setJobs(data);
                        try {
                            sessionStorage.setItem('shark_jobs_cache_v2', JSON.stringify(data));
                        } catch (e) {}
                    }
                }

                if (session) {
                    const appsRes = await fetch('/api/applications');
                    if (appsRes.ok) {
                        const appsData = await appsRes.json();
                        const idsArray = appsData.map((app: any) => app.jobId);
                        const ids = new Set<string>(idsArray);
                        if (isMounted) {
                            globalAppliedIdsMemoryCache = ids;
                            setAppliedJobIds(ids);
                            try {
                                sessionStorage.setItem('shark_applied_apps_v2', JSON.stringify(idsArray));
                            } catch (e) {}
                        }
                    }
                }
            } catch (error) {
                console.error("Failed to fetch jobs", error);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        fetchJobsAndApplications();

        return () => {
            isMounted = false;
        };
    }, [session]);

    const handleApplyRedirect = (jobId: string) => {
        router.push(`/jobs/apply/${jobId}`);
    };

    return (
        <>
            <style jsx>{`
                :global(body) {
                    background: #ffffff;
                }

                .page {
                    color: #0f172a;
                }

                .hero {
                    position: relative;
                    overflow: hidden;
                    padding: 3.5rem 1.5rem 2rem;
                    border-bottom: 1px solid #f1f5f9;
                    background: #ffffff;
                }

                .hero-pattern {
                    position: absolute;
                    inset: 0;
                    background-image: radial-gradient(#0f172a 0.5px, transparent 0.5px);
                    background-size: 24px 24px;
                    opacity: 0.03;
                    pointer-events: none;
                }

                .hero-inner {
                    max-width: 72rem;
                    margin: 0 auto;
                    text-align: center;
                    position: relative;
                    z-index: 1;
                    animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }

                .hero-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.4rem 1.1rem;
                    border-radius: 9999px;
                    background: #ffffff;
                    border: 1px solid #cbd5e1;
                    font-size: 0.75rem;
                    font-weight: 700;
                    letter-spacing: 0.12em;
                    text-transform: uppercase;
                    color: #001736;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
                    margin-bottom: 1.25rem;
                }

                .hero-title {
                    font-size: 3rem;
                    font-weight: 800;
                    line-height: 1.15;
                    letter-spacing: -0.03em;
                    margin-bottom: 1rem;
                    color: #001736;
                }

                .hero-subtitle {
                    font-size: 1.1rem;
                    color: #64748b;
                    max-width: 44rem;
                    margin: 0 auto 2rem;
                    line-height: 1.6;
                    font-weight: 500;
                }

                .search-shell {
                    max-width: 56rem;
                    margin: 0 auto;
                    background: #ffffff;
                    border: 1px solid #e2e8f0;
                    border-radius: 1.25rem;
                    box-shadow: 0 15px 25px -10px rgba(15, 23, 42, 0.1);
                    padding: 0.5rem;
                }

                .search-row {
                    display: flex;
                    flex-wrap: wrap;
                    align-items: center;
                    gap: 0.5rem;
                }

                .search-field {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.75rem 1rem;
                }

                .search-field input {
                    width: 100%;
                    border: none;
                    outline: none;
                    font-size: 1rem;
                    font-family: inherit;
                    color: #0f172a;
                }

                .search-divider {
                    width: 1px;
                    height: 2rem;
                    background: #e2e8f0;
                }

                .search-button {
                    padding: 0.85rem 2.5rem;
                    background: #0f172a;
                    color: #ffffff;
                    border: none;
                    border-radius: 0.9rem;
                    font-weight: 700;
                    cursor: pointer;
                    transition: transform 0.2s ease, background 0.2s ease;
                }

                .search-button:hover {
                    background: #1e293b;
                    transform: translateY(-1px);
                }

                .trending {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                    gap: 1.25rem;
                    margin-top: 1.5rem;
                    font-size: 0.85rem;
                    color: #94a3b8;
                }

                .trending a {
                    color: #0f172a;
                    text-decoration: none;
                    border-bottom: 1px solid rgba(15, 23, 42, 0.2);
                    transition: color 0.2s ease;
                }

                .trending a:hover {
                    color: #64748b;
                }

                .section {
                    max-width: 80rem;
                    margin: 0 auto;
                    padding: 3rem 1.5rem;
                }

                .section-header {
                    display: flex;
                    align-items: flex-end;
                    justify-content: space-between;
                    gap: 1.5rem;
                    margin-bottom: 3.5rem;
                }

                .section-kicker {
                    font-size: 0.7rem;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 0.2em;
                    color: #94a3b8;
                    margin-bottom: 0.5rem;
                }

                .section-title {
                    font-size: 2.4rem;
                    font-weight: 800;
                    color: #0f172a;
                }

                .section-action {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-weight: 700;
                    color: #0f172a;
                    text-decoration: none;
                }

                .section-action:hover {
                    gap: 0.75rem;
                }

                .sector-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
                    gap: 2rem;
                }

                .card-lift {
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    border-radius: 1.5rem;
                    padding: 2.5rem;
                    transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
                }

                .card-lift:hover {
                    transform: translateY(-6px);
                    box-shadow: 0 20px 25px -5px rgba(15, 23, 42, 0.12);
                    border-color: rgba(15, 23, 42, 0.2);
                }

                .sector-icon {
                    width: 3.5rem;
                    height: 3.5rem;
                    border-radius: 0.9rem;
                    background: #0f172a;
                    color: #ffffff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.4rem;
                    margin-bottom: 2rem;
                }

                .featured {
                    background: #f8fafc;
                    border-top: 1px solid #e2e8f0;
                    border-bottom: 1px solid #e2e8f0;
                }

                .filter-row {
                    display: flex;
                    gap: 0.75rem;
                    flex-wrap: wrap;
                }

                .filter-button {
                    padding: 0.75rem 1.5rem;
                    border-radius: 0.9rem;
                    border: 1px solid #e2e8f0;
                    background: #ffffff;
                    font-weight: 700;
                    font-size: 0.85rem;
                    cursor: pointer;
                    transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
                }

                .filter-button:hover {
                    background: #f1f5f9;
                }

                .filter-button.active {
                    background: #0f172a;
                    color: #ffffff;
                    border-color: #0f172a;
                }

                .filter-badge-active {
                    display: inline-flex;
                    align-items: center;
                    padding: 0.4rem 0.8rem;
                    border-radius: 9999px;
                    background: #f1f5f9;
                    border: 1px solid #cbd5e1;
                    font-size: 0.8rem;
                    font-weight: 500;
                    color: #0f172a;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .filter-badge-active:hover {
                    background: #cbd5e1;
                }

                .job-list {
                    display: grid;
                    gap: 1.5rem;
                }

                .job-card {
                    background: #ffffff;
                    border: 1px solid #e2e8f0;
                    border-radius: 1.25rem;
                    padding: 1.5rem 1.75rem;
                    display: flex;
                    flex-direction: column;
                    gap: 1.25rem;
                    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                    box-shadow: 0 4px 15px rgba(0, 23, 54, 0.03);
                }

                .job-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 16px 35px rgba(0, 23, 54, 0.09);
                    border-color: #cbd5e1;
                }

                .job-row {
                    display: flex;
                    gap: 1.5rem;
                    align-items: center;
                    flex-wrap: wrap;
                }

                .job-logo {
                    width: 5.5rem;
                    height: 5.5rem;
                    border-radius: 1rem;
                    background: #001736;
                    border: 1px solid #e2e8f0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.5rem;
                    font-weight: 800;
                    color: #ffffff;
                    overflow: hidden;
                    flex-shrink: 0;
                    box-shadow: 0 6px 12px rgba(0, 23, 54, 0.1);
                }

                .job-logo img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    display: block;
                }

                .job-title {
                    font-size: 1.35rem;
                    font-weight: 800;
                    color: #001736;
                    letter-spacing: -0.02em;
                    line-height: 1.25;
                }

                .job-tags {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.4rem;
                    margin-top: 0.4rem;
                }

                .job-badge {
                    padding: 0.3rem 0.75rem;
                    border-radius: 9999px;
                    font-size: 0.7rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.08em;
                    background: #f1f5f9;
                    color: #001736;
                    border: 1px solid #cbd5e1;
                }

                .job-badge-luxury {
                    background: linear-gradient(135deg, #001736 0%, #0b2545 100%);
                    color: #ffffff;
                    border: none;
                }

                .job-meta {
                    display: flex;
                    flex-wrap: wrap;
                    align-items: center;
                    gap: 1.25rem;
                    font-size: 0.88rem;
                    color: #64748b;
                    font-weight: 600;
                    margin-top: 0.6rem;
                }

                .job-salary {
                    font-size: 1.3rem;
                    font-weight: 800;
                    color: #001736;
                    margin-bottom: 0.6rem;
                    letter-spacing: -0.02em;
                }

                .job-action {
                    padding: 0.8rem 1.8rem;
                    background: #001736;
                    color: #ffffff;
                    border-radius: 0.75rem;
                    border: none;
                    font-weight: 700;
                    font-size: 0.95rem;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    box-shadow: 0 4px 10px rgba(0, 23, 54, 0.15);
                }

                .job-action:hover {
                    background: #0f2b5c;
                    transform: translateY(-2px);
                    box-shadow: 0 8px 18px rgba(0, 23, 54, 0.25);
                }

                .job-action[disabled] {
                    background: #e2e8f0;
                    color: #64748b;
                    cursor: not-allowed;
                    box-shadow: none;
                    transform: none;
                }

                .logos {
                    padding: 6rem 1.5rem;
                    background: #ffffff;
                }

                .logos-row {
                    max-width: 72rem;
                    margin: 0 auto;
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                    align-items: center;
                    gap: 4rem;
                }

                .logos-row img {
                    height: 45px;
                    width: auto;
                    filter: grayscale(1);
                    opacity: 0.4;
                    transition: all 0.4s ease;
                    object-fit: contain;
                }

                .logos-row img:hover {
                    filter: grayscale(0);
                    opacity: 1;
                    transform: scale(1.1);
                }

                .cta {
                    max-width: 78rem;
                    margin: 0 auto 8rem;
                    padding: 5rem 3.5rem;
                    background: linear-gradient(135deg, #001529 0%, #003366 100%);
                    color: #ffffff;
                    border-radius: 3rem;
                    text-align: center;
                    position: relative;
                    overflow: hidden;
                    box-shadow: 0 40px 100px -20px rgba(0, 21, 41, 0.4);
                }

                .cta::before {
                    content: "";
                    position: absolute;
                    inset: 0;
                    background-image: radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0);
                    background-size: 32px 32px;
                    opacity: 0.08;
                }

                .cta-content {
                    position: relative;
                    z-index: 1;
                }

                .cta-title {
                    font-size: 3.5rem;
                    font-weight: 900;
                    margin-bottom: 1.5rem;
                    letter-spacing: -0.04em;
                    line-height: 1.1;
                    color: #ffffff;
                }

                .cta-text {
                    color: #e2e8f0;
                    max-width: 44rem;
                    margin: 0 auto 3rem;
                    font-size: 1.25rem;
                    line-height: 1.6;
                    font-weight: 500;
                }

                .cta-actions {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 1.5rem;
                    justify-content: center;
                }

                .cta-primary,
                .cta-secondary {
                    padding: 1.125rem 3rem;
                    border-radius: 1.25rem;
                    font-weight: 800;
                    border: none;
                    cursor: pointer;
                    font-size: 1.1rem;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .cta-primary {
                    background: #ffffff;
                    color: #001529;
                    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
                }

                .cta-primary:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
                    background: #f8fafc;
                }

                .cta-secondary {
                    background: rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(10px);
                    color: #ffffff;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                }

                .cta-secondary:hover {
                    background: rgba(255, 255, 255, 0.2);
                    transform: translateY(-4px);
                }

                .modal-backdrop {
                    position: fixed;
                    inset: 0;
                    background: rgba(15, 23, 42, 0.6);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 50;
                    backdrop-filter: blur(6px);
                }

                .modal-card {
                    background: #ffffff;
                    border-radius: 1.5rem;
                    padding: 2.5rem;
                    width: 90%;
                    max-width: 560px;
                    border: 1px solid #e2e8f0;
                    box-shadow: 0 30px 40px -20px rgba(15, 23, 42, 0.35);
                }

                .modal-header {
                    margin-bottom: 1.5rem;
                }

                .modal-title {
                    font-size: 1.6rem;
                    font-weight: 800;
                    margin-bottom: 0.4rem;
                }

                .modal-subtitle {
                    color: #64748b;
                    font-size: 0.9rem;
                }

                .modal-section {
                    margin-bottom: 1.75rem;
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    border-radius: 1rem;
                    padding: 1.5rem;
                }

                .modal-label {
                    font-weight: 700;
                    margin-bottom: 0.75rem;
                    display: block;
                }

                .modal-upload {
                    border: 2px dashed #0f172a;
                    border-radius: 1rem;
                    padding: 1.5rem;
                    text-align: center;
                    background: #ffffff;
                }

                .modal-input {
                    width: 100%;
                    padding: 0.8rem 1rem;
                    border-radius: 0.75rem;
                    border: 1px solid #cbd5f5;
                    font-family: inherit;
                }

                .modal-actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: 1rem;
                    padding-top: 1.5rem;
                    border-top: 1px solid #e2e8f0;
                }

                .button-ghost {
                    padding: 0.85rem 1.5rem;
                    background: #f1f5f9;
                    border: none;
                    border-radius: 0.8rem;
                    font-weight: 700;
                    cursor: pointer;
                }

                .button-primary {
                    padding: 0.85rem 2rem;
                    background: #0f172a;
                    color: #ffffff;
                    border: none;
                    border-radius: 0.8rem;
                    font-weight: 700;
                    cursor: pointer;
                }

                .button-primary[disabled] {
                    background: #cbd5f5;
                    cursor: not-allowed;
                }

                @media (max-width: 768px) {
                    .hero-title {
                        font-size: 2.3rem;
                    }

                    .search-divider {
                        display: none;
                    }

                    .search-row {
                        flex-direction: column;
                        align-items: stretch;
                        gap: 0;
                    }

                    .search-field {
                        border-bottom: 1px solid #e2e8f0;
                    }

                    .search-field:last-of-type {
                        border-bottom: none;
                    }

                    .section-header {
                        flex-direction: column;
                        align-items: flex-start;
                    }

                    .job-row {
                        flex-direction: column;
                        align-items: flex-start;
                    }
                }

                @media (max-width: 480px) {
                    .hero {
                        padding: 4rem 1.25rem;
                    }

                    .hero-title {
                        font-size: 2rem;
                    }

                    .cta {
                        padding: 2.5rem 1.5rem;
                    }

                    .cta-title {
                        font-size: 2rem;
                    }
                }
            `}</style>

            <div className={`page ${spaceGrotesk.className}`}>

                <section className="hero">
                    <div className="hero-pattern"></div>
                    <div className="hero-inner">
                        <div className="hero-badge">
                            <span style={{ width: 8, height: 8, borderRadius: 9999, background: "#0f172a", display: "inline-block" }}></span>
                            Elite Career Opportunities
                        </div>
                        <h1 className="hero-title">
                            Refining Excellence in <br />
                            <span style={{ color: "#94a3b8" }}>Global Hospitality</span>
                        </h1>
                        <p className="hero-subtitle">
                            Connecting distinguished talent with Michelin-tier institutions, private estates, and the world's most prestigious resorts.
                        </p>
                        <div className="search-shell">
                            <div className="search-row">
                                <div className="search-field">
                                    <span style={{ color: "#94a3b8" }}>Search</span>
                                    <input 
                                        placeholder="Role (e.g. Sommelier, Estate Manager)" 
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <div className="search-divider"></div>
                                <div className="search-field">
                                    <span style={{ color: "#94a3b8" }}>Location</span>
                                    <input 
                                        placeholder="Location (e.g. Maldives, Paris)" 
                                        value={searchLocation}
                                        onChange={(e) => setSearchLocation(e.target.value)}
                                    />
                                </div>
                                <div className="search-divider"></div>
                                <div className="search-field" style={{ minWidth: "200px" }}>
                                    <span style={{ color: "#94a3b8" }}>Category</span>
                                    <select 
                                        value={selectedCategory} 
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        style={{
                                            width: "100%",
                                            border: "none",
                                            outline: "none",
                                            fontSize: "1rem",
                                            fontFamily: "inherit",
                                            color: "#0f172a",
                                            backgroundColor: "transparent",
                                            cursor: "pointer"
                                        }}
                                    >
                                        <option value="">All Categories</option>
                                        <optgroup label="Operations">
                                            <option value="Front Office">Front Office</option>
                                            <option value="Back Office">Back Office</option>
                                            <option value="Guest Relations">Guest Relations</option>
                                            <option value="Concierge">Concierge</option>
                                            <option value="Reservations">Reservations</option>
                                        </optgroup>
                                        <optgroup label="Food & Beverage">
                                            <option value="F&B Service">F&B Service</option>
                                            <option value="Food Production">Food Production</option>
                                            <option value="Banquet & Events">Banquet & Events</option>
                                            <option value="Bar & Mixology">Bar & Mixology</option>
                                            <option value="Pastry & Bakery">Pastry & Bakery</option>
                                            <option value="Stewarding">Stewarding</option>
                                        </optgroup>
                                        <optgroup label="Rooms Division">
                                            <option value="Housekeeping">Housekeeping</option>
                                            <option value="Laundry">Laundry</option>
                                            <option value="Engineering & Maintenance">Engineering & Maintenance</option>
                                        </optgroup>
                                        <optgroup label="Wellness & Recreation">
                                            <option value="Spa & Wellness">Spa & Wellness</option>
                                            <option value="Recreation & Activities">Recreation & Activities</option>
                                        </optgroup>
                                        <optgroup label="Support Functions">
                                            <option value="Sales & Marketing">Sales & Marketing</option>
                                            <option value="HR & Admin">HR & Admin</option>
                                            <option value="Accounts & Finance">Accounts & Finance</option>
                                            <option value="Purchasing & Stores">Purchasing & Stores</option>
                                            <option value="Security">Security</option>
                                            <option value="IT & Systems">IT & Systems</option>
                                        </optgroup>
                                    </select>
                                </div>
                                <button className="search-button" onClick={() => {
                                    const featuredSection = document.querySelector('.featured');
                                    if (featuredSection) {
                                        featuredSection.scrollIntoView({ behavior: 'smooth' });
                                    }
                                }}>Search Roles</button>
                            </div>
                        </div>
                        <div className="trending">
                            <span style={{ textTransform: "uppercase", letterSpacing: "0.2em", fontSize: "0.6rem", fontWeight: 800 }}>Trending:</span>
                            <a href="#" onClick={(e) => { e.preventDefault(); setSearchTerm("Head Chef"); }}>Head Chef</a>
                            <a href="#" onClick={(e) => { e.preventDefault(); setSearchTerm("General Manager"); }}>General Manager</a>
                            <a href="#" onClick={(e) => { e.preventDefault(); setSearchTerm("Guest Relations"); }}>Guest Relations</a>
                            <a href="#" onClick={(e) => { e.preventDefault(); setSearchTerm("Yacht Crew"); }}>Yacht Crew</a>
                        </div>
                    </div>
                </section>

                <section className="section">
                    <div className="section-header">
                        <div>
                            <span className="section-kicker">Curation</span>
                            <h2 className="section-title">Elite Sectors</h2>
                        </div>
                        <a className="section-action" href="#" onClick={(e) => { e.preventDefault(); setSelectedCategory(""); }}>Explore All</a>
                    </div>
                    <div className="sector-grid">
                        {categories.map((cat, i) => (
                            <div 
                                key={i} 
                                className="card-lift" 
                                style={{ cursor: "pointer", border: selectedCategory === (categoryMapping[cat.name] || cat.name) ? "1.5px solid #0f172a" : "1px solid #e2e8f0" }}
                                onClick={() => {
                                    const mapped = categoryMapping[cat.name] || cat.name;
                                    setSelectedCategory(mapped);
                                    const featuredSection = document.querySelector('.featured');
                                    if (featuredSection) {
                                        featuredSection.scrollIntoView({ behavior: 'smooth' });
                                    }
                                }}
                            >
                                <div className="sector-icon">{cat.icon}</div>
                                <h3 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: "0.6rem" }}>{cat.name}</h3>
                                <p style={{ color: "#64748b", fontSize: "0.9rem", lineHeight: 1.6 }}>
                                    {cat.count} curated roles across elite hospitality networks.
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="section featured">
                    <div className="section-header">
                        <div>
                            <h2 className="section-title">Featured Positions</h2>
                            <p style={{ color: "#64748b", fontSize: "1rem", marginTop: "0.6rem" }}>
                                Hand-selected roles from our premier global partners.
                            </p>
                        </div>
                        <div className="filter-row">
                            <button 
                                className={`filter-button ${filterRemote ? "active" : ""}`}
                                onClick={() => setFilterRemote(!filterRemote)}
                            >
                                Remote Roles
                            </button>
                            <button 
                                className={`filter-button ${filterUrgent ? "active" : ""}`}
                                onClick={() => setFilterUrgent(!filterUrgent)}
                            >
                                Urgent Hire
                            </button>
                        </div>
                    </div>

                    {(searchTerm || searchLocation || selectedCategory || filterRemote || filterUrgent) && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "2rem", alignItems: "center" }}>
                            <span style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: 600, marginRight: "0.5rem" }}>Active Filters:</span>
                            {searchTerm && (
                                <span className="filter-badge-active" onClick={() => setSearchTerm("")}>
                                    Search: "{searchTerm}" <span style={{ marginLeft: "0.5rem", fontWeight: "bold" }}>×</span>
                                </span>
                            )}
                            {searchLocation && (
                                <span className="filter-badge-active" onClick={() => setSearchLocation("")}>
                                    Location: "{searchLocation}" <span style={{ marginLeft: "0.5rem", fontWeight: "bold" }}>×</span>
                                </span>
                            )}
                            {selectedCategory && (
                                <span className="filter-badge-active" onClick={() => setSelectedCategory("")}>
                                    Category: {selectedCategory} <span style={{ marginLeft: "0.5rem", fontWeight: "bold" }}>×</span>
                                </span>
                            )}
                            {filterRemote && (
                                <span className="filter-badge-active" onClick={() => setFilterRemote(false)}>
                                    Remote <span style={{ marginLeft: "0.5rem", fontWeight: "bold" }}>×</span>
                                </span>
                            )}
                            {filterUrgent && (
                                <span className="filter-badge-active" onClick={() => setFilterUrgent(false)}>
                                    Urgent <span style={{ marginLeft: "0.5rem", fontWeight: "bold" }}>×</span>
                                </span>
                            )}
                            <button 
                                onClick={() => {
                                    setSearchTerm("");
                                    setSearchLocation("");
                                    setSelectedCategory("");
                                    setFilterRemote(false);
                                    setFilterUrgent(false);
                                }}
                                style={{
                                    background: "none",
                                    border: "none",
                                    color: "#64748b",
                                    fontSize: "0.85rem",
                                    cursor: "pointer",
                                    textDecoration: "underline",
                                    fontWeight: 600,
                                    marginLeft: "0.5rem"
                                }}
                            >
                                Clear All
                            </button>
                        </div>
                    )}

                    <div className="job-list">
                        {loading ? (
                            <div className="job-card">Loading featured roles...</div>
                        ) : filteredJobs.length === 0 ? (
                            <div className="job-card" style={{ padding: "3rem", textAlign: "center", color: "#64748b" }}>
                                <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>🔍</div>
                                <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.5rem" }}>No matching jobs found</h3>
                                <p style={{ fontSize: "0.95rem" }}>We couldn't find any opportunities matching your active filters. Try broadening your criteria or resetting filters.</p>
                                <button 
                                    className="filter-button" 
                                    style={{ marginTop: "1.5rem" }}
                                    onClick={() => {
                                        setSearchTerm("");
                                        setSearchLocation("");
                                        setSelectedCategory("");
                                        setFilterRemote(false);
                                        setFilterUrgent(false);
                                    }}
                                >
                                    Reset All Filters
                                </button>
                            </div>
                        ) : filteredJobs.map((job, i) => {
                            const cleanTitle = job.title ? job.title.replace(/\s*#\d+\s*$/, '') : 'Hospitality Opportunity';
                            return (
                                <div key={job.id} className="job-card">
                                    <div className="job-row">
                                        <div className="job-logo">
                                            {job.posterUrl ? (
                                                <img src={job.posterUrl} alt={cleanTitle} />
                                            ) : (
                                                <span>🏨</span>
                                            )}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", flexWrap: "wrap" }}>
                                                <div className="job-title">{cleanTitle}</div>
                                                <span style={{ fontSize: "0.75rem", padding: "0.2rem 0.7rem", borderRadius: "9999px", background: "#f8fafc", border: "1px solid #e2e8f0", fontWeight: 700, color: "#475569" }}>
                                                    {job.category || 'Hotel Operations'}
                                                </span>
                                            </div>
                                            <div className="job-tags">
                                                <span className="job-badge">{job.type}</span>
                                                {i % 3 === 0 && <span className="job-badge job-badge-luxury">Top Brand</span>}
                                                {i % 2 === 1 && <span className="job-badge">Urgent Hire</span>}
                                            </div>
                                            <div className="job-meta">
                                                <span style={{ color: "#001736", fontWeight: 800 }}>
                                                    {job.companyName || job.employer?.name || "Luxury Partner"}
                                                </span>
                                                <span>📍 {job.location}</span>
                                                <span>Posted {new Date(job.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                                            </div>
                                        </div>
                                        <div style={{ textAlign: "right" }}>
                                            <div className="job-salary">
                                                ₹{job.salaryMin ? (job.salaryMin / 100000).toFixed(1) : "0.2"} - {job.salaryMax ? (job.salaryMax / 100000).toFixed(1) : "0.5"} LPA
                                            </div>
                                            {appliedJobIds.has(job.id) ? (
                                                <button className="job-action" disabled>Applied</button>
                                            ) : (
                                                <button className="job-action" onClick={() => handleApplyRedirect(job.id)}>
                                                    View Details →
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div style={{ marginTop: "3rem", textAlign: "center" }}>
                        <button 
                            className="filter-button" 
                            style={{ padding: "1rem 2.5rem" }}
                            onClick={() => {
                                setSearchTerm("");
                                setSearchLocation("");
                                setSelectedCategory("");
                                setFilterRemote(false);
                                setFilterUrgent(false);
                            }}
                        >
                            View All Opportunities
                        </button>
                    </div>
                </section>

                <section className="logos">
                    <div className="logos-row">
                        <img src="/HOTEL LOGOS-20260501T173926Z-3-001/HOTEL LOGOS/MARRIOTT.JPG.jpeg" alt="Marriott" />
                        <img src="/HOTEL LOGOS-20260501T173926Z-3-001/HOTEL LOGOS/HILTON.JPG.jpeg" alt="Hilton" />
                        <img src="/HOTEL LOGOS-20260501T173926Z-3-001/HOTEL LOGOS/FOUR POINTS BY SHERATON.JPG.jpeg" alt="Four Points" />
                        <img src="/HOTEL LOGOS-20260501T173926Z-3-001/HOTEL LOGOS/HYATT REGENCY.jpeg" alt="Hyatt" />
                        <img src="/HOTEL LOGOS-20260501T173926Z-3-001/HOTEL LOGOS/JW MARRIOTT.JPG.jpeg" alt="JW Marriott" />
                        <img src="/HOTEL LOGOS-20260501T173926Z-3-001/HOTEL LOGOS/RADISSON INDIVIDUALS.JPG.jpeg" alt="Radisson" />
                    </div>
                </section>

                <section className="cta">
                    <div className="cta-content">
                        <h2 className="cta-title">Ready to Elevate Your Career?</h2>
                        <p className="cta-text">
                            Join over 50,000 hospitality professionals receiving bespoke notifications from the world's most distinguished properties.
                        </p>
                        <div className="cta-actions">
                            <button className="cta-primary">Create Profile</button>
                            <button className="cta-secondary">Browse Secret Jobs</button>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}
