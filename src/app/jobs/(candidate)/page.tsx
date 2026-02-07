"use client";

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from 'next/link';
import { useRouter } from "next/navigation";

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
                @media (max-width: 768px) {
                    .job-grid { grid-template-columns: 1fr !important; }
                    .hero-section { padding: 2rem 1rem !important; }
                    .hero-title { font-size: 1.75rem !important; }
                    .search-bar { flex-direction: column !important; }
                    .search-divider { display: none !important; }
                    .job-card { padding: 1rem !important; }
                    .sidebar { display: none !important; }
                    .categories-grid { grid-template-columns: repeat(2, 1fr) !important; }
                }

                @media (max-width: 480px) {
                    .hero-title { font-size: 1.5rem !important; }
                    .hero-subtitle { font-size: 0.9rem !important; }
                    .categories-grid { grid-template-columns: 1fr !important; }
                }
            `}</style>
            <div style={{ position: 'relative', backgroundColor: '#f6f7f7', minHeight: '100vh', fontFamily: 'Manrope, sans-serif' }}>
            {/* Application Modal Overlay */}
            {showModal && selectedJob && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 50,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', padding: '2rem', width: '90%', maxWidth: '500px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--primary)' }}>Apply for {selectedJob.title}</h2>
                        <form onSubmit={handleApply}>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Resume (PDF)</label>
                                {resumeUrl ? (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                        <a href={resumeUrl} target="_blank" style={{ color: 'var(--primary)', fontWeight: 500, fontSize: '0.9rem' }}>View Attached Resume</a>
                                        <button type="button" onClick={() => setResumeUrl('')} style={{ fontSize: '0.8rem', color: '#DC2626' }}>(Remove)</button>
                                    </div>
                                ) : (
                                    <input
                                        type="file"
                                        accept="application/pdf"
                                        required
                                        onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (!file) return;
                                            const formData = new FormData();
                                            formData.append('file', file);
                                            const res = await fetch('/api/upload', { method: 'POST', body: formData });
                                            if (res.ok) {
                                                const data = await res.json();
                                                setResumeUrl(data.url);
                                            }
                                        }}
                                        style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.25rem' }}
                                    />
                                )}
                                <p style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '0.25rem' }}>Upload your resume just for this application.</p>
                            </div>

                            {selectedJob.questions && (() => {
                                try {
                                    const qs = JSON.parse(selectedJob.questions);
                                    if (Array.isArray(qs) && qs.length > 0) {
                                        return (
                                            <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#F9FAFB', borderRadius: '0.5rem' }}>
                                                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Screening Questions</h3>
                                                {qs.map((q: string, i: number) => (
                                                    <div key={i} style={{ marginBottom: '1rem' }}>
                                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 500 }}>{q}</label>
                                                        <input
                                                            required
                                                            value={answers[q] || ''}
                                                            onChange={e => setAnswers(prev => ({ ...prev, [q]: e.target.value }))}
                                                            style={{ width: '100%', padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #d1d5db' }}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        );
                                    }
                                } catch (e) { return null; }
                            })()}

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                                <Button type="button" variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button>
                                <Button type="submit" disabled={applying}>{applying ? 'Submitting...' : 'Submit Application'}</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Hero Section */}
            <div className="hero-section" style={{
                background: 'linear-gradient(135deg, #151e29 0%, #1e3a5f 100%)',
                borderRadius: '0.75rem',
                padding: '3rem 2rem',
                color: 'white',
                marginBottom: '2.5rem',
                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.2)'
            }}>
                <h1 className="hero-title" style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Find Your Dream Career 🎯</h1>
                <p className="hero-subtitle" style={{ opacity: 0.9, marginBottom: '2rem', fontSize: '1.1rem', maxWidth: '600px' }}>
                    Connect with top-tier hospitality brands and launch your journey in the world of luxury.
                </p>

                <div className="search-bar" style={{
                    background: 'white',
                    padding: '0.75rem',
                    borderRadius: '0.75rem',
                    display: 'flex',
                    gap: '1rem',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                    flexWrap: 'wrap'
                }}>
                    <div style={{ flex: 2, minWidth: '200px' }}>
                        <input
                            type="text"
                            placeholder="🔍 Job title or keyword..."
                            style={{ width: '100%', padding: '0.75rem', border: 'none', outline: 'none', fontSize: '1rem' }}
                        />
                    </div>
                    <div className="search-divider" style={{ width: '1px', background: '#e5e7eb', margin: '0.5rem 0' }}></div>
                    <div style={{ flex: 1, minWidth: '150px' }}>
                        <select style={{ width: '100%', padding: '0.75rem', border: 'none', outline: 'none', color: '#6b7280', fontSize: '1rem', backgroundColor: 'transparent' }}>
                            <option>📍 Select Location</option>
                            <option>Mumbai</option>
                            <option>Delhi</option>
                            <option>Bangalore</option>
                        </select>
                    </div>
                    <button style={{
                        minWidth: '150px',
                        padding: '0.75rem 1.5rem',
                        backgroundColor: '#10b981',
                        color: 'white',
                        fontWeight: 700,
                        borderRadius: '0.5rem',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#059669'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
                    >
                        Search Jobs
                    </button>
                </div>

                <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', fontSize: '0.9rem', opacity: 0.9, flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        <span>🔥 Popular:</span>
                        <span style={{ cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.5)' }}>Front Desk</span>
                        <span style={{ cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.5)' }}>Sous Chef</span>
                        <span style={{ cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.5)' }}>Manager</span>
                    </div>
                    <button onClick={() => router.push('/jobs/employer')} style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: 'rgba(255,255,255,0.15)',
                        color: 'white',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        borderRadius: '0.5rem',
                        border: '1px solid rgba(255,255,255,0.3)',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.25)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)'}
                    >
                        💼 Employer Login
                    </button>
                </div>
            </div>

            {/* Categories Section */}
            <div style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#151e29', marginBottom: '1.5rem' }}>Browse by Category</h2>
                <div className="categories-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    {categories.map((cat, i) => (
                        <div key={i} style={{
                            background: 'white',
                            padding: '1.5rem',
                            borderRadius: '0.75rem',
                            cursor: 'pointer',
                            transition: 'all 0.3s',
                            boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1)',
                            border: '1px solid #f3f4f6'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-4px)';
                            e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0,0,0,0.15)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0,0,0,0.1)';
                        }}
                        >
                            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{cat.icon}</div>
                            <div style={{ fontSize: '1rem', fontWeight: 600, color: '#151e29', marginBottom: '0.25rem' }}>{cat.name}</div>
                            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{cat.count} positions</div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="job-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '2rem' }}>

                {/* Main Content - Job Listings */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#151e29' }}>Featured Opportunities 💼</h2>
                        <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>{jobs.length} positions available</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>Loading amazing opportunities...</div>
                        ) : jobs.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: 'white', borderRadius: '0.75rem' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
                                <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>No jobs found. Check back soon!</p>
                            </div>
                        ) : jobs.map((job) => (
                            <div key={job.id} className="job-card" style={{
                                backgroundColor: 'white',
                                borderRadius: '0.75rem',
                                padding: '1.5rem',
                                boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1)',
                                transition: 'all 0.3s',
                                cursor: 'pointer',
                                border: '1px solid #f3f4f6'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0,0,0,0.15)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0,0,0,0.1)';
                            }}
                            >
                                <div style={{ display: 'flex', gap: '1.5rem' }}>
                                    {/* Logo Box */}
                                    <div style={{
                                        width: '64px',
                                        height: '64px',
                                        borderRadius: '12px',
                                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: 700,
                                        color: 'white',
                                        fontSize: '1.5rem',
                                        flexShrink: 0,
                                        boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.3)'
                                    }}>
                                        {job.employer?.name?.charAt(0) || "🏢"}
                                    </div>

                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', gap: '1rem' }}>
                                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#151e29' }}>{job.title}</h3>
                                            <span style={{ fontSize: '1rem', color: '#10b981', fontWeight: 700, whiteSpace: 'nowrap' }}>
                                                ₹{job.salaryMin ? (job.salaryMin / 100000).toFixed(1) : 'NA'} - {job.salaryMax ? (job.salaryMax / 100000).toFixed(1) : 'NA'} LPA
                                            </span>
                                        </div>

                                        <div style={{ fontSize: '0.95rem', color: '#6b7280', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <span style={{ fontWeight: 600, color: '#151e29' }}>{job.employer?.name || "Company"}</span>
                                            <span>•</span>
                                            <span>📍 {job.location}</span>
                                        </div>

                                        <div style={{ fontSize: '0.875rem', color: '#374151', marginBottom: '1rem', lineHeight: '1.6' }}>
                                            {job.description?.substring(0, 150)}...
                                        </div>

                                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                                            <span style={{
                                                fontSize: '0.75rem',
                                                padding: '0.375rem 0.75rem',
                                                borderRadius: '9999px',
                                                backgroundColor: '#dbeafe',
                                                color: '#1e40af',
                                                fontWeight: 600
                                            }}>
                                                {job.type}
                                            </span>
                                            <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                                                Posted {new Date(job.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                            </span>
                                            {appliedJobIds.has(job.id) ? (
                                                <button disabled style={{
                                                    marginLeft: 'auto',
                                                    padding: '0.5rem 1rem',
                                                    backgroundColor: '#f3f4f6',
                                                    color: '#6b7280',
                                                    fontWeight: 600,
                                                    fontSize: '0.875rem',
                                                    borderRadius: '0.5rem',
                                                    border: 'none',
                                                    cursor: 'not-allowed'
                                                }}>
                                                    ✅ Applied
                                                </button>
                                            ) : (
                                                <button onClick={() => openApplyModal(job)} style={{
                                                    marginLeft: 'auto',
                                                    padding: '0.5rem 1rem',
                                                    backgroundColor: '#10b981',
                                                    color: 'white',
                                                    fontWeight: 700,
                                                    fontSize: '0.875rem',
                                                    borderRadius: '0.5rem',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s'
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#059669'}
                                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
                                                >
                                                    Apply Now →
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sidebar Widgets */}
                <div className="sidebar" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {/* Application Status Widget */}
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '0.75rem',
                        padding: '1.5rem',
                        boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1)',
                        border: '1px solid #f3f4f6'
                    }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#151e29', marginBottom: '1.5rem' }}>My Activity 📊</h3>
                        {session ? (
                            <>
                                <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid #f3f4f6' }}>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#10b981' }}>{appliedJobIds.size}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 600 }}>Applied</div>
                                    </div>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f59e0b' }}>0</div>
                                        <div style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 600 }}>Review</div>
                                    </div>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#3b82f6' }}>0</div>
                                        <div style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 600 }}>Interview</div>
                                    </div>
                                </div>
                                <button onClick={() => window.location.href = '/candidate/dashboard'} style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    backgroundColor: '#f3f4f6',
                                    color: '#151e29',
                                    fontWeight: 600,
                                    fontSize: '0.875rem',
                                    borderRadius: '0.5rem',
                                    border: 'none',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e5e7eb'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                                >
                                    View Dashboard →
                                </button>
                            </>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '1rem' }}>
                                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔐</div>
                                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
                                    Sign in to track your applications
                                </p>
                                <button onClick={() => window.location.href = '/auth/signin'} style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    backgroundColor: '#10b981',
                                    color: 'white',
                                    fontWeight: 700,
                                    fontSize: '0.875rem',
                                    borderRadius: '0.5rem',
                                    border: 'none',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#059669'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
                                >
                                    Sign In
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Promo Widget */}
                    <div style={{
                        background: 'linear-gradient(135deg, #151e29 0%, #1f2937 100%)',
                        borderRadius: '0.75rem',
                        padding: '1.5rem',
                        color: 'white',
                        textAlign: 'center',
                        boxShadow: '0 4px 6px -1px rgba(21, 30, 41, 0.3)'
                    }}>
                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⭐</div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: '#FCD34D' }}>Go Premium</h3>
                        <p style={{ fontSize: '0.85rem', color: '#9CA3AF', marginBottom: '1rem' }}>
                            Get highlighted to top employers and access exclusive listings.
                        </p>
                        <button style={{
                            width: '100%',
                            padding: '0.75rem',
                            backgroundColor: 'rgba(255,255,255,0.15)',
                            color: 'white',
                            fontWeight: 700,
                            fontSize: '0.875rem',
                            borderRadius: '0.5rem',
                            border: '1px solid rgba(255,255,255,0.3)',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.25)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)';
                        }}
                        >
                            Upgrade Now
                        </button>
                    </div>
                </div>

            </div>
            </div>
        </>
    );
}
