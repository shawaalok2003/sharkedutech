"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdmissionsPage() {
    const router = useRouter();
    const [applications, setApplications] = useState<any[]>([]);
    const [profileCompletion, setProfileCompletion] = useState(0);
    const [documents, setDocuments] = useState<any[]>([]);

    useEffect(() => {
        async function loadData() {
            const [appsRes, profileRes, docsRes] = await Promise.all([
                fetch("/api/admissions/applications"),
                fetch("/api/admissions/profile"),
                fetch("/api/admissions/documents")
            ]);
            if (appsRes.ok) {
                const apps = await appsRes.json();
                setApplications(apps);
            }
            if (profileRes.ok) {
                const profile = await profileRes.json();
                const fields = ["phone", "dob", "city", "address", "bio", "education"];
                const filled = fields.filter(f => profile?.[f]).length;
                setProfileCompletion(Math.round((filled / fields.length) * 100));
            }
            if (docsRes.ok) {
                const docs = await docsRes.json();
                setDocuments(docs);
            }
        }
        loadData();
    }, []);

    const refreshApplications = async () => {
        const res = await fetch("/api/admissions/applications");
        if (res.ok) {
            const apps = await res.json();
            setApplications(apps);
        }
    };

    const stepLabels = [
        "Profile Review",
        "Documents Verification",
        "Application Submitted",
        "College Review",
        "Decision & Offer"
    ];

    const journeySteps = [
        {
            title: "Complete Profile",
            description: "Add personal, academic, and contact details",
            done: profileCompletion >= 70
        },
        {
            title: "Upload Documents",
            description: "ID, marksheets, photo, and certificates",
            done: documents.length > 0
        },
        {
            title: "Submit Application",
            description: "Apply to your preferred college/course",
            done: applications.length > 0
        },
        {
            title: "College Review",
            description: "Admission team evaluates your application",
            done: applications.some(app => ["In Review", "Approved", "Rejected", "Offer", "Waitlist"].includes(app.status))
        },
        {
            title: "Decision",
            description: "Offer, waitlist, or rejection decision",
            done: applications.some(app => ["Approved", "Rejected", "Offer", "Waitlist"].includes(app.status))
        }
    ];

    return (
        <>
            <style jsx>{`
                .page-container {
                    background-color: var(--background-secondary, #f8fafc);
                    min-height: 100vh;
                    font-family: var(--font-sans);
                    padding: 1.5rem;
                }
                .hero-section {
                    background: linear-gradient(135deg, var(--primary, #002147) 0%, var(--primary-light, #163E75) 100%);
                    border-radius: var(--radius-lg);
                    padding: 3rem 2rem;
                    color: white;
                    margin-bottom: 2rem;
                    box-shadow: var(--shadow-lg);
                }
                .hero-title {
                    font-size: 2.25rem;
                    font-weight: 800;
                    margin-bottom: 0.5rem;
                    line-height: 1.2;
                }
                .hero-subtitle {
                    opacity: 0.9;
                    margin-bottom: 1.5rem;
                    font-size: 1rem;
                    max-width: 600px;
                    line-height: 1.5;
                }
                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 1.25rem;
                    margin-bottom: 2rem;
                }
                .stat-card {
                    border-radius: var(--radius-lg);
                    padding: 1.25rem;
                    color: white;
                    box-shadow: var(--shadow-md);
                    transition: all var(--transition-base);
                    cursor: pointer;
                }
                .stat-card:hover {
                    transform: translateY(-3px);
                    box-shadow: var(--shadow-xl);
                }
                .admissions-grid {
                    display: grid;
                    grid-template-columns: 1fr 320px;
                    gap: 1.5rem;
                }
                .main-content { min-width: 0; }
                .sidebar { display: flex; flex-direction: column; gap: 1.25rem; }
                .card {
                    background: white;
                    border-radius: var(--radius-lg);
                    padding: 1.25rem;
                    box-shadow: var(--shadow-sm);
                    border: 1px solid var(--border-light);
                    transition: all var(--transition-base);
                }
                .card:hover {
                    box-shadow: var(--shadow-md);
                }
                .app-card {
                    background: white;
                    border-radius: var(--radius-lg);
                    padding: 1.25rem;
                    box-shadow: var(--shadow-sm);
                    border: 1px solid var(--border-light);
                    transition: all var(--transition-base);
                    margin-bottom: 1rem;
                }
                .app-card:hover {
                    transform: translateY(-2px);
                    box-shadow: var(--shadow-lg);
                }
                .btn-primary {
                    width: 100%;
                    padding: 0.75rem;
                    background: linear-gradient(135deg, var(--accent, #10b981) 0%, var(--accent-dark, #059669) 100%);
                    color: white;
                    font-weight: 600;
                    font-size: 0.875rem;
                    border-radius: var(--radius);
                    border: none;
                    cursor: pointer;
                    transition: all var(--transition-base);
                }
                .btn-primary:hover {
                    opacity: 0.9;
                    transform: translateY(-1px);
                }
                .btn-secondary {
                    width: 100%;
                    padding: 0.6rem;
                    background: var(--muted);
                    color: var(--foreground);
                    font-weight: 600;
                    font-size: 0.8rem;
                    border-radius: var(--radius);
                    border: 1px solid var(--border);
                    cursor: pointer;
                    transition: all var(--transition-base);
                    margin-top: 0.5rem;
                }
                .btn-secondary:hover {
                    background: var(--border);
                }
                .quick-action-btn {
                    width: 100%;
                    padding: 0.75rem;
                    background: var(--muted);
                    color: var(--foreground);
                    font-weight: 600;
                    font-size: 0.875rem;
                    border-radius: var(--radius);
                    border: none;
                    cursor: pointer;
                    text-align: left;
                    transition: all var(--transition-base);
                }
                .quick-action-btn:hover {
                    background: var(--border);
                    transform: translateX(4px);
                }
                .help-widget {
                    background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
                    border-radius: var(--radius-lg);
                    padding: 1.5rem;
                    color: white;
                    text-align: center;
                    box-shadow: var(--shadow-md);
                }
                .help-btn {
                    width: 100%;
                    padding: 0.75rem;
                    background: rgba(255,255,255,0.15);
                    color: white;
                    font-weight: 600;
                    font-size: 0.875rem;
                    border-radius: var(--radius);
                    border: 1px solid rgba(255,255,255,0.3);
                    cursor: pointer;
                    transition: all var(--transition-base);
                    margin-top: 0.5rem;
                }
                .help-btn:hover {
                    background: rgba(255,255,255,0.25);
                }
                .status-badge {
                    font-size: 0.75rem;
                    padding: 0.375rem 0.75rem;
                    border-radius: 9999px;
                    font-weight: 600;
                }
                .status-pending {
                    background: var(--warning-light);
                    color: var(--warning);
                }
                .status-approved {
                    background: var(--success-light);
                    color: var(--success);
                }
                .status-rejected {
                    background: var(--error-light);
                    color: var(--error);
                }
                .progress-bar {
                    height: 8px;
                    background: var(--muted);
                    border-radius: 9999px;
                    overflow: hidden;
                }
                .progress-fill {
                    height: 100%;
                    background: linear-gradient(90deg, var(--accent) 0%, var(--accent-dark) 100%);
                    transition: width var(--transition-slow);
                }
                .step-indicator {
                    width: 28px;
                    height: 28px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.75rem;
                    font-weight: 700;
                    flex-shrink: 0;
                }
                .step-done {
                    background: var(--accent);
                    color: white;
                }
                .step-pending {
                    background: var(--muted);
                    color: var(--muted-foreground);
                }

                /* Tablet */
                @media (max-width: 1024px) {
                    .admissions-grid {
                        grid-template-columns: 1fr;
                    }
                    .sidebar {
                        display: grid;
                        grid-template-columns: repeat(2, 1fr);
                        gap: 1rem;
                    }
                    .help-widget {
                        grid-column: span 2;
                    }
                }

                /* Mobile */
                @media (max-width: 768px) {
                    .page-container { padding: 1rem; }
                    .hero-section { padding: 1.5rem; }
                    .hero-title { font-size: 1.5rem; }
                    .hero-subtitle { font-size: 0.875rem; }
                    .stats-grid {
                        grid-template-columns: 1fr;
                        gap: 1rem;
                    }
                    .sidebar {
                        grid-template-columns: 1fr;
                    }
                    .help-widget {
                        grid-column: span 1;
                    }
                    .app-card-grid {
                        grid-template-columns: 1fr !important;
                    }
                }

                /* Small Mobile */
                @media (max-width: 480px) {
                    .page-container { padding: 0.75rem; }
                    .hero-title { font-size: 1.25rem; }
                    .hero-subtitle { font-size: 0.8rem; margin-bottom: 1rem; }
                    .stat-card { padding: 1rem; }
                    .card, .app-card { padding: 1rem; }
                }
            `}</style>
            <div className="page-container">
                {/* Hero Section */}
                <div className="hero-section">
                    <h1 className="hero-title">Welcome to Admissions Portal 🎓</h1>
                    <p className="hero-subtitle">
                        Track your college applications and manage your admission journey with ease.
                    </p>
                    <button className="btn-primary" style={{ width: 'auto', padding: '0.75rem 1.5rem' }} onClick={() => router.push('/admissions/colleges')}>
                        Browse Colleges →
                    </button>
                </div>

                {/* Statistics Row */}
                <div className="stats-grid">
                    <div className="stat-card" style={{ background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>Applications</p>
                                <p style={{ fontSize: '2rem', fontWeight: 800, margin: '0.25rem 0 0' }}>{applications.length}</p>
                            </div>
                            <div style={{ background: 'rgba(255,255,255,0.2)', padding: '0.5rem', borderRadius: '0.5rem', fontSize: '1.25rem' }}>📝</div>
                        </div>
                        <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.9)', margin: 0 }}>Active submissions</p>
                    </div>

                    <div className="stat-card" style={{ background: 'linear-gradient(135deg, var(--secondary) 0%, var(--secondary-dark) 100%)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>In Review</p>
                                <p style={{ fontSize: '2rem', fontWeight: 800, margin: '0.25rem 0 0' }}>
                                    {applications.filter(app => app.status === 'Pending' || app.status === 'In Review').length}
                                </p>
                            </div>
                            <div style={{ background: 'rgba(255,255,255,0.2)', padding: '0.5rem', borderRadius: '0.5rem', fontSize: '1.25rem' }}>⏳</div>
                        </div>
                        <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.9)', margin: 0 }}>Awaiting decision</p>
                    </div>

                    <div className="stat-card" style={{ background: 'linear-gradient(135deg, var(--info) 0%, #1d4ed8 100%)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>Profile</p>
                                <p style={{ fontSize: '2rem', fontWeight: 800, margin: '0.25rem 0 0' }}>{profileCompletion}%</p>
                            </div>
                            <div style={{ background: 'rgba(255,255,255,0.2)', padding: '0.5rem', borderRadius: '0.5rem', fontSize: '1.25rem' }}>👤</div>
                        </div>
                        <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.9)', margin: 0 }}>Profile complete</p>
                    </div>
                </div>

                <div className="admissions-grid">
                    {/* Main Content - Applications */}
                    <div className="main-content">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--foreground)', margin: 0 }}>
                                My Applications 📚
                            </h2>
                            <button className="btn-secondary" style={{ width: 'auto', marginTop: 0 }} onClick={refreshApplications}>
                                🔄 Refresh
                            </button>
                        </div>

                        {applications.length === 0 ? (
                            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
                                <h3 style={{ marginBottom: '0.5rem', color: 'var(--foreground)' }}>No Applications Yet</h3>
                                <p style={{ color: 'var(--muted-foreground)', marginBottom: '1rem' }}>Start by browsing colleges and submitting your first application.</p>
                                <button className="btn-primary" style={{ width: 'auto', padding: '0.75rem 2rem' }} onClick={() => router.push('/admissions/colleges')}>
                                    Browse Colleges
                                </button>
                            </div>
                        ) : (
                            applications.map((app) => (
                                <div key={app.id} className="app-card">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                                        <div>
                                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--foreground)', marginBottom: '0.25rem' }}>
                                                {app.college?.name || "College"}
                                            </h3>
                                            <p style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)', margin: 0 }}>{app.course?.title || "General Admission"}</p>
                                        </div>
                                        <span className={`status-badge ${app.status === 'Approved' ? 'status-approved' : app.status === 'Rejected' ? 'status-rejected' : 'status-pending'}`}>
                                            {app.status}
                                        </span>
                                    </div>

                                    <div style={{ marginBottom: '0.75rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.8rem' }}>
                                            <span style={{ color: 'var(--muted-foreground)' }}>Progress</span>
                                            <span style={{ fontWeight: 600, color: 'var(--foreground)' }}>{Math.min((app.step || 1) * 25, 100)}%</span>
                                        </div>
                                        <div className="progress-bar">
                                            <div className="progress-fill" style={{ width: `${Math.min((app.step || 1) * 25, 100)}%` }}></div>
                                        </div>
                                    </div>

                                    <div className="app-card-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.75rem' }}>
                                        <div style={{ padding: '0.75rem', background: 'var(--muted)', borderRadius: 'var(--radius)' }}>
                                            <p style={{ fontSize: '0.7rem', color: 'var(--muted-foreground)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Current Stage</p>
                                            <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--foreground)', margin: '0.25rem 0 0 0' }}>
                                                {stepLabels[Math.min((app.step || 1) - 1, stepLabels.length - 1)]}
                                            </p>
                                        </div>
                                        <div style={{ padding: '0.75rem', background: 'var(--muted)', borderRadius: 'var(--radius)' }}>
                                            <p style={{ fontSize: '0.7rem', color: 'var(--muted-foreground)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Next Step</p>
                                            <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--foreground)', margin: '0.25rem 0 0 0' }}>
                                                {(app.step || 1) < stepLabels.length ? stepLabels[app.step || 1] : "Completed"}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <p style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
                                        Last updated: {app.updatedAt ? new Date(app.updatedAt).toLocaleString() : '—'}
                                    </p>

                                    <button className="btn-primary" style={{ marginTop: '1rem' }} onClick={() => router.push(`/admissions/applications/${app.id}`)}>
                                        Continue Application →
                                    </button>
                                    {app.collegeId && (
                                        <button className="btn-secondary" onClick={() => router.push(`/admissions/colleges/${app.collegeId}`)}>
                                            View College Profile
                                        </button>
                                    )}
                                </div>
                            ))
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="sidebar">
                        {/* Quick Actions */}
                        <div className="card">
                            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--foreground)', marginBottom: '1rem' }}>Quick Actions 🚀</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <button className="quick-action-btn" onClick={() => router.push('/admissions/profile')}>📝 Edit Profile</button>
                                <button className="quick-action-btn" onClick={() => router.push('/admissions/documents')}>📄 Upload Documents</button>
                                <button className="quick-action-btn" onClick={() => router.push('/admissions/colleges')}>🏫 Browse Colleges</button>
                                <button className="quick-action-btn" onClick={() => router.push('/admissions/applications')}>📋 All Applications</button>
                            </div>
                        </div>

                        {/* Admission Journey */}
                        <div className="card">
                            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--foreground)', marginBottom: '1rem' }}>Admission Steps ✅</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {journeySteps.map((step, index) => (
                                    <div key={step.title} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                                        <div className={`step-indicator ${step.done ? 'step-done' : 'step-pending'}`}>
                                            {step.done ? '✓' : index + 1}
                                        </div>
                                        <div>
                                            <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, color: 'var(--foreground)' }}>{step.title}</p>
                                            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>{step.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Help Widget */}
                        <div className="help-widget">
                            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💬</div>
                            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem', color: 'white' }}>Need Help?</h3>
                            <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)', marginBottom: '1rem' }}>
                                Our counselors are here to guide you.
                            </p>
                            <button className="help-btn" onClick={() => window.open('mailto:support@sharkedutech.com?subject=Admission%20Query', '_blank')}>
                                📧 Contact Support
                            </button>
                            <button className="help-btn" onClick={() => window.open('tel:+919876543210', '_blank')}>
                                📞 Call Helpline
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
