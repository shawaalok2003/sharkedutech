"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Space_Grotesk } from "next/font/google";

// Types
interface Job {
    id: string;
    title: string;
    type: string;
    location: string;
    salaryMin: number;
    salaryMax: number;
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

export default function JobsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);

    // Application Modal State
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [resumeUrl, setResumeUrl] = useState('');
    const [applying, setApplying] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [appliedJobIds, setAppliedJobIds] = useState<Set<string>>(new Set());

    useEffect(() => {
        async function fetchJobs() {
            try {
                const res = await fetch('/api/jobs');
                if (res.ok) {
                    const data = await res.json();
                    setJobs(data);
                }

                // Fetch User Applications (if logged in)
                if (session) {
                    const appsRes = await fetch('/api/applications'); // We need an endpoint that returns user's apps
                    if (appsRes.ok) {
                        const appsData = await appsRes.json();
                        // Assuming appsData is array of { jobId: string, ... }
                        const ids = new Set<string>(appsData.map((app: any) => app.jobId));
                        setAppliedJobIds(ids);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch jobs", error);
            } finally {
                setLoading(false);
            }
        }
        fetchJobs();

        // Pre-fill resume if available in session/profile
        // For simplicity, we assume the user might paste it, or we fetch profile
        if (session) {
            fetch('/api/profile').then(res => res.json()).then(data => {
                if (data.resumeUrl) setResumeUrl(data.resumeUrl);
            }).catch(err => console.log(err));
        }
    }, [session]);

    const openApplyModal = (job: Job) => {
        if (status === "loading") {
            return;
        }
        if (!session) {
            alert('Please login to apply');
            router.push('/auth/signin?type=candidate');
            return;
        }
        setSelectedJob(job);
        setAnswers({});
        setShowModal(true);
    };

    const handleApply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedJob) return;
        setApplying(true);

        try {
            const res = await fetch('/api/applications', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    jobId: selectedJob.id,
                    resumeUrl: resumeUrl,
                    answers: JSON.stringify(answers)
                })
            });

            if (res.ok) {
                setAppliedJobIds(prev => new Set(prev).add(selectedJob.id));
                setShowModal(false);
                router.push(`/applications/success?job=${encodeURIComponent(selectedJob.title)}`);
                setSelectedJob(null);
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to apply');
            }
        } catch (err) {
            alert('Error applying');
        } finally {
            setApplying(false);
        }
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
                    padding: 6rem 1.5rem;
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
                }

                .hero-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.4rem 1rem;
                    border-radius: 9999px;
                    background: #f1f5f9;
                    border: 1px solid #e2e8f0;
                    font-size: 0.7rem;
                    font-weight: 700;
                    letter-spacing: 0.15em;
                    text-transform: uppercase;
                    color: rgba(15, 23, 42, 0.65);
                    margin-bottom: 2rem;
                }

                .hero-title {
                    font-size: 3rem;
                    font-weight: 800;
                    line-height: 1.05;
                    letter-spacing: -0.02em;
                    margin-bottom: 1.5rem;
                }

                .hero-subtitle {
                    font-size: 1.1rem;
                    color: #64748b;
                    max-width: 42rem;
                    margin: 0 auto 3rem;
                    line-height: 1.7;
                }

                .search-shell {
                    max-width: 56rem;
                    margin: 0 auto;
                    background: #ffffff;
                    border: 1px solid #e2e8f0;
                    border-radius: 1.25rem;
                    box-shadow: 0 20px 30px -15px rgba(15, 23, 42, 0.2);
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
                    gap: 1.5rem;
                    margin-top: 2.5rem;
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
                    padding: 6rem 1.5rem;
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
                    transition: background 0.2s ease;
                }

                .filter-button:hover {
                    background: #f1f5f9;
                }

                .job-list {
                    display: grid;
                    gap: 1.5rem;
                }

                .job-card {
                    background: #ffffff;
                    border: 1px solid #e2e8f0;
                    border-radius: 1.5rem;
                    padding: 2rem;
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }

                .job-row {
                    display: flex;
                    gap: 1.5rem;
                    align-items: center;
                    flex-wrap: wrap;
                }

                .job-logo {
                    width: 5rem;
                    height: 5rem;
                    border-radius: 1rem;
                    background: #f1f5f9;
                    border: 1px solid #e2e8f0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.4rem;
                    font-weight: 700;
                    color: #0f172a;
                }

                .job-title {
                    font-size: 1.5rem;
                    font-weight: 800;
                    margin-bottom: 0.5rem;
                }

                .job-tags {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.5rem;
                }

                .job-badge {
                    padding: 0.35rem 0.8rem;
                    border-radius: 9999px;
                    font-size: 0.65rem;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 0.12em;
                    background: rgba(15, 23, 42, 0.05);
                    color: #0f172a;
                    border: 1px solid rgba(15, 23, 42, 0.12);
                }

                .job-meta {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 1.5rem;
                    font-size: 0.85rem;
                    color: #64748b;
                    font-weight: 600;
                }

                .job-salary {
                    font-size: 1.4rem;
                    font-weight: 800;
                    color: #0f172a;
                }

                .job-action {
                    padding: 0.8rem 2rem;
                    background: #0f172a;
                    color: #ffffff;
                    border-radius: 0.9rem;
                    border: none;
                    font-weight: 700;
                    cursor: pointer;
                    transition: background 0.2s ease;
                }

                .job-action:hover {
                    background: #1e293b;
                }

                .job-action[disabled] {
                    background: #e2e8f0;
                    color: #64748b;
                    cursor: not-allowed;
                }

                .logos {
                    padding: 4.5rem 1.5rem;
                    opacity: 0.35;
                }

                .logos-row {
                    max-width: 72rem;
                    margin: 0 auto;
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                    gap: 3rem;
                    font-weight: 900;
                    font-size: 1.2rem;
                    font-style: italic;
                    color: #0f172a;
                }

                .cta {
                    max-width: 72rem;
                    margin: 0 auto 6rem;
                    padding: 3.5rem;
                    background: #0f172a;
                    color: #ffffff;
                    border-radius: 2rem;
                    text-align: center;
                    position: relative;
                    overflow: hidden;
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
                    font-size: 2.6rem;
                    font-weight: 800;
                    margin-bottom: 1.5rem;
                }

                .cta-text {
                    color: #cbd5f5;
                    max-width: 40rem;
                    margin: 0 auto 2.5rem;
                    font-size: 1.1rem;
                    line-height: 1.7;
                }

                .cta-actions {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 1rem;
                    justify-content: center;
                }

                .cta-primary,
                .cta-secondary {
                    padding: 0.9rem 2.5rem;
                    border-radius: 1rem;
                    font-weight: 700;
                    border: none;
                    cursor: pointer;
                }

                .cta-primary {
                    background: #ffffff;
                    color: #0f172a;
                }

                .cta-secondary {
                    background: transparent;
                    color: #ffffff;
                    border: 1px solid rgba(255, 255, 255, 0.2);
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
                {showModal && selectedJob && (
                    <div className="modal-backdrop">
                        <div className="modal-card">
                            <div className="modal-header">
                                <h2 className="modal-title">Apply for {selectedJob.title}</h2>
                                <p className="modal-subtitle">
                                    Complete your application for {selectedJob.employer?.name || "this company"}
                                </p>
                            </div>

                            <form onSubmit={handleApply}>
                                <div className="modal-section">
                                    <label className="modal-label">Upload Resume (PDF)</label>
                                    {resumeUrl ? (
                                        <div className="job-row" style={{ justifyContent: "space-between" }}>
                                            <div>
                                                <div style={{ fontWeight: 700 }}>Resume attached</div>
                                                <div style={{ color: "#64748b", fontSize: "0.85rem" }}>Ready to submit</div>
                                            </div>
                                            <button type="button" className="button-ghost" onClick={() => setResumeUrl("")}>Change</button>
                                        </div>
                                    ) : (
                                        <div className="modal-upload">
                                            <input
                                                type="file"
                                                accept="application/pdf"
                                                required
                                                onChange={async (e) => {
                                                    const file = e.target.files?.[0];
                                                    if (!file) return;
                                                    const formData = new FormData();
                                                    formData.append("file", file);
                                                    const res = await fetch("/api/upload", { method: "POST", body: formData });
                                                    if (res.ok) {
                                                        const data = await res.json();
                                                        setResumeUrl(data.url);
                                                    }
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>

                                {selectedJob.questions && (() => {
                                    try {
                                        const qs = JSON.parse(selectedJob.questions);
                                        if (Array.isArray(qs) && qs.length > 0) {
                                            return (
                                                <div className="modal-section">
                                                    <div style={{ fontWeight: 800, marginBottom: "1rem" }}>Screening Questions</div>
                                                    {qs.map((q: string, i: number) => (
                                                        <div key={i} style={{ marginBottom: "1rem" }}>
                                                            <label className="modal-label">{i + 1}. {q}</label>
                                                            <input
                                                                required
                                                                value={answers[q] || ""}
                                                                onChange={e => setAnswers(prev => ({ ...prev, [q]: e.target.value }))}
                                                                className="modal-input"
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            );
                                        }
                                    } catch (e) {
                                        return null;
                                    }
                                })()}

                                <div className="modal-actions">
                                    <button type="button" className="button-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                                    <button type="submit" className="button-primary" disabled={applying}>
                                        {applying ? "Submitting..." : "Submit Application"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

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
                                    <input placeholder="Role (e.g. Sommelier, Estate Manager)" />
                                </div>
                                <div className="search-divider"></div>
                                <div className="search-field">
                                    <span style={{ color: "#94a3b8" }}>Location</span>
                                    <input placeholder="Location (e.g. Maldives, Paris)" />
                                </div>
                                <button className="search-button">Search Roles</button>
                            </div>
                        </div>
                        <div className="trending">
                            <span style={{ textTransform: "uppercase", letterSpacing: "0.2em", fontSize: "0.6rem", fontWeight: 800 }}>Trending:</span>
                            <a href="#">Head Chef</a>
                            <a href="#">General Manager</a>
                            <a href="#">Guest Relations</a>
                            <a href="#">Yacht Crew</a>
                        </div>
                    </div>
                </section>

                <section className="section">
                    <div className="section-header">
                        <div>
                            <span className="section-kicker">Curation</span>
                            <h2 className="section-title">Elite Sectors</h2>
                        </div>
                        <a className="section-action" href="#">Explore All</a>
                    </div>
                    <div className="sector-grid">
                        {categories.map((cat, i) => (
                            <div key={i} className="card-lift">
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
                            <button className="filter-button">Remote Roles</button>
                            <button className="filter-button">Urgent Hire</button>
                        </div>
                    </div>

                    <div className="job-list">
                        {loading ? (
                            <div className="job-card">Loading featured roles...</div>
                        ) : jobs.length === 0 ? (
                            <div className="job-card">No jobs found. Check back soon.</div>
                        ) : jobs.map((job, i) => (
                            <div key={job.id} className="job-card card-lift">
                                <div className="job-row">
                                    <div className="job-logo">{job.employer?.name?.charAt(0) || "L"}</div>
                                    <div style={{ flex: 1 }}>
                                        <div className="job-title">{job.title}</div>
                                        <div className="job-tags">
                                            <span className="job-badge">{job.type}</span>
                                            {i === 0 && <span className="job-badge">Top Brand</span>}
                                            {i === 1 && <span className="job-badge">Urgent</span>}
                                        </div>
                                        <div className="job-meta" style={{ marginTop: "0.8rem" }}>
                                            <span>{job.employer?.name || "Company"}</span>
                                            <span>{job.location}</span>
                                            <span>Posted {new Date(job.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: "right" }}>
                                        <div className="job-salary">
                                            ₹{job.salaryMin ? (job.salaryMin / 100000).toFixed(1) : "NA"} - {job.salaryMax ? (job.salaryMax / 100000).toFixed(1) : "NA"} LPA
                                        </div>
                                        {appliedJobIds.has(job.id) ? (
                                            <button className="job-action" disabled>Applied</button>
                                        ) : (
                                            <button className="job-action" onClick={() => openApplyModal(job)}>
                                                View Details
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{ marginTop: "3rem", textAlign: "center" }}>
                        <button className="filter-button" style={{ padding: "1rem 2.5rem" }}>View All Opportunities</button>
                    </div>
                </section>

                <section className="logos">
                    <div className="logos-row">
                        <span>MARRIOTT</span>
                        <span>HILTON</span>
                        <span>FOUR SEASONS</span>
                        <span>HYATT</span>
                        <span>ACCOR</span>
                        <span>SHANGRI-LA</span>
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
