"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function UnifiedCandidateDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();

    // Jobs State
    const [jobApplications, setJobApplications] = useState<any[]>([]);
    const [jobs, setJobs] = useState<any[]>([]);

    // Admissions State
    const [collegeApplications, setCollegeApplications] = useState<any[]>([]);
    const [profileCompletion, setProfileCompletion] = useState(0);
    const [documents, setDocuments] = useState<any[]>([]);
    const [colleges, setColleges] = useState<any[]>([]);
    const [courses, setCourses] = useState<any[]>([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/signin");
            return;
        }

        async function loadData() {
            try {
                const [
                    jobAppsRes, jobsRes,
                    colAppsRes, profileRes, docsRes, collegesRes, coursesRes
                ] = await Promise.all([
                    fetch('/api/applications'),
                    fetch('/api/jobs?limit=4'),
                    fetch("/api/admissions/applications"),
                    fetch("/api/admissions/profile"),
                    fetch("/api/admissions/documents"),
                    fetch("/api/admissions/colleges"),
                    fetch("/api/admissions/courses")
                ]);

                if (jobAppsRes.ok) setJobApplications(await jobAppsRes.json());
                if (jobsRes.ok) setJobs(await jobsRes.json());
                if (colAppsRes.ok) setCollegeApplications(await colAppsRes.json());

                if (profileRes.ok) {
                    const profile = await profileRes.json();
                    const fields = ["phone", "dob", "city", "address", "bio", "education"];
                    const filled = fields.filter(f => profile?.[f]).length;
                    setProfileCompletion(Math.round((filled / fields.length) * 100));
                }
                if (docsRes.ok) setDocuments(await docsRes.json());
                if (collegesRes.ok) setColleges(await collegesRes.json());
                if (coursesRes.ok) setCourses(await coursesRes.json());
            } catch (error) {
                console.error("Failed to load dashboard data:", error);
            } finally {
                setLoading(false);
            }
        }

        if (session) {
            loadData();
        }
    }, [session, status, router]);

    if (loading) return (
        <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280' }}>
            <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
                <div>Configuring your workspace...</div>
            </div>
        </div>
    );

    const interviewCount = jobApplications.filter((a: any) => a.status === 'Interview').length;
    const offersCount = jobApplications.filter((a: any) => a.status === 'Offer').length;

    return (
        <>
            <style jsx>{`
                * { box-sizing: border-box; }
                .layout-wrapper { min-height: 100vh; background: #f8fafc; font-family: 'Manrope', sans-serif; }
                
                /* Hero Section */
                .hero-banner {
                    background: #D4AF37;
                    border-radius: 24px;
                    padding: 3rem;
                    position: relative;
                    overflow: hidden;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 3rem;
                    box-shadow: 0 10px 30px -10px rgba(10, 25, 47, 0.08);
                    margin: 0 auto 2rem auto;
                }
                .hero-pattern {
                    position: absolute;
                    inset: 0;
                    opacity: 0.1;
                    background-image: radial-gradient(#0A192F 1px, transparent 1px);
                    background-size: 24px 24px;
                    pointer-events: none;
                }
                .hero-content { position: relative; z-index: 10; max-width: 42rem; }
                .hero-badge { display: inline-block; padding: 0.375rem 1rem; background: rgba(10, 25, 47, 0.1); border-radius: 9999px; color: #0A192F; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.2em; margin-bottom: 1.5rem; }
                .hero-title { color: #0A192F; font-size: 2.5rem; font-weight: 800; letter-spacing: -0.03em; margin-bottom: 1rem; line-height: 1.2; }
                .hero-subtitle { color: rgba(10, 25, 47, 0.8); font-size: 1.125rem; line-height: 1.6; margin-bottom: 2rem; max-width: 32rem; }
                .hero-actions { display: flex; gap: 1rem; }
                .btn-navy { background: #0A192F; color: white; padding: 0.8rem 2rem; border-radius: 12px; border: none; font-weight: 700; font-size: 0.875rem; cursor: pointer; transition: all 0.3s; display: inline-flex; align-items: center; gap: 0.75rem; }
                .btn-navy:hover { box-shadow: 0 10px 30px -10px rgba(10, 25, 47, 0.3); transform: translateY(-2px); }
                .btn-outline-navy { background: transparent; color: #0A192F; padding: 0.8rem 2rem; border-radius: 12px; border: 2px solid #0A192F; font-weight: 700; font-size: 0.875rem; cursor: pointer; transition: all 0.3s; }
                .btn-outline-navy:hover { background: rgba(10, 25, 47, 0.05); }

                .progress-widget { position: relative; z-index: 10; background: white; padding: 1.5rem; border-radius: 24px; display: flex; flex-direction: column; align-items: center; min-width: 220px; box-shadow: 0 10px 30px -10px rgba(0,0,0,0.1); }
                .progress-circle { position: relative; width: 120px; height: 120px; margin-bottom: 1rem; }
                .progress-circle svg { transform: rotate(-90deg); }
                .progress-text { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
                .progress-value { font-size: 1.75rem; font-weight: 800; color: #0A192F; }
                .progress-label { font-size: 9px; text-transform: uppercase; font-weight: 800; letter-spacing: 0.15em; color: rgba(10, 25, 47, 0.4); }

                /* Stats Grid */
                .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; margin-bottom: 2rem; }
                .stat-card { background: white; padding: 1.5rem; border-radius: 16px; border: 1px solid #e2e8f0; border-left: 4px solid #10b981; display: flex; align-items: center; gap: 1rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); transition: transform 0.2s; cursor: pointer; }
                .stat-card:hover { transform: translateY(-3px); box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); }
                .stat-icon { font-size: 2rem; padding: 1rem; background: #f8fafc; border-radius: 12px; }
                
                /* Content Grid */
                .content-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
                .panel { background: white; border-radius: 24px; padding: 2rem; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
                .panel-header { display: flex; justify-content: space-between; alignItems: center; margin-bottom: 1.5rem; border-bottom: 1px solid #f1f5f9; padding-bottom: 1rem; }
                
                .app-item { display: flex; justify-content: space-between; align-items: center; padding: 1rem; border: 1px solid #f1f5f9; border-radius: 12px; margin-bottom: 1rem; transition: background 0.2s; }
                .app-item:hover { background: #f8fafc; }
                .status-badge { padding: 0.35rem 0.8rem; border-radius: 9999px; font-size: 0.65rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; }

                @media (max-width: 1024px) {
                    .hero-banner { flex-direction: column; text-align: center; }
                    .content-grid { grid-template-columns: 1fr; }
                    .hero-actions { justify-content: center; }
                }
                @media (max-width: 600px) {
                    .hero-banner { padding: 1.5rem; margin: 1rem 0; }
                    .hero-title { font-size: 1.75rem; }
                    .hero-actions { flex-direction: column; }
                    .panel { padding: 1.5rem; }
                }
            `}</style>
            <div className="layout-wrapper">
                {/* Hero Section */}
                <section className="hero-banner">
                    <div className="hero-pattern"></div>
                    <div className="hero-content">
                        <span className="hero-badge">Student Dashboard</span>
                        <h1 className="hero-title">Welcome back, {session?.user?.name || "Student"}.</h1>
                        <p className="hero-subtitle">
                           Manage your collegiate applications, track your dream job statuses, and update your personal portfolio—all in one place.
                        </p>
                        <div className="hero-actions">
                            <button className="btn-navy" onClick={() => router.push('/jobs')}>Explore Careers →</button>
                            <button className="btn-outline-navy" onClick={() => router.push('/admissions')}>Find Courses</button>
                        </div>
                    </div>
                    <div className="progress-widget">
                        <div className="progress-circle">
                            <svg width="120" height="120">
                                <circle cx="60" cy="60" r="54" fill="transparent" stroke="#f1f5f9" strokeWidth="8"></circle>
                                <circle
                                    cx="60" cy="60" r="54" fill="transparent" stroke="#0A192F" strokeWidth="8"
                                    strokeDasharray="339" strokeDashoffset={339 - (339 * profileCompletion) / 100} strokeLinecap="round"
                                ></circle>
                            </svg>
                            <div className="progress-text">
                                <span className="progress-value">{profileCompletion}%</span>
                                <span className="progress-label">Profile</span>
                            </div>
                        </div>
                        <p style={{ fontWeight: 800, margin: 0, color: '#0A192F', fontSize: '0.875rem' }}>Account Readiness</p>
                    </div>
                </section>

                {/* Quick Stats Grid */}
                <div className="stats-grid">
                    <div className="stat-card" style={{ borderLeftColor: '#3b82f6' }} onClick={() => router.push('#applications')}>
                        <div className="stat-icon">📈</div>
                        <div>
                            <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Job Apps</p>
                            <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>{jobApplications.length}</p>
                        </div>
                    </div>
                    <div className="stat-card" style={{ borderLeftColor: '#f59e0b' }}>
                        <div className="stat-icon">🏆</div>
                        <div>
                            <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Interviews</p>
                            <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>{interviewCount}</p>
                        </div>
                    </div>
                    <div className="stat-card" style={{ borderLeftColor: '#8b5cf6' }} onClick={() => router.push('/admissions/applications')}>
                        <div className="stat-icon">🎓</div>
                        <div>
                            <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>College Apps</p>
                            <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>{collegeApplications.length}</p>
                        </div>
                    </div>
                    <div className="stat-card" style={{ borderLeftColor: '#10b981' }} onClick={() => router.push('/admissions/documents')}>
                        <div className="stat-icon">📄</div>
                        <div>
                            <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Documents</p>
                            <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>{documents.length}</p>
                        </div>
                    </div>
                </div>

                {/* Applications Split View */}
                <div className="content-grid" id="applications">
                    <div className="panel">
                        <div className="panel-header">
                            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>Job Applications</h3>
                            <button onClick={() => router.push('/jobs')} style={{ background: 'none', border: 'none', color: '#3b82f6', fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem' }}>Find More</button>
                        </div>
                        {jobApplications.length === 0 ? (
                            <p style={{ color: '#64748b', textAlign: 'center', padding: '2rem 0' }}>No job applications yet.</p>
                        ) : (
                            jobApplications.slice(0, 5).map(app => (
                                <div key={app.id} className="app-item">
                                    <div>
                                        <p style={{ margin: '0 0 0.25rem 0', fontWeight: 800, color: '#0f172a' }}>{app.job?.title || 'Unknown Job'}</p>
                                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>{new Date(app.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <span className="status-badge" style={{
                                        background: app.status === 'Interview' ? '#dbeafe' : app.status === 'Offer' ? '#d1fae5' : app.status === 'Rejected' ? '#fee2e2' : '#f1f5f9',
                                        color: app.status === 'Interview' ? '#1e40af' : app.status === 'Offer' ? '#065f46' : app.status === 'Rejected' ? '#991b1b' : '#475569'
                                    }}>
                                        {app.status || 'Applied'}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="panel">
                        <div className="panel-header">
                            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>College Applications</h3>
                            <button onClick={() => router.push('/admissions/applications')} style={{ background: 'none', border: 'none', color: '#8b5cf6', fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem' }}>View All</button>
                        </div>
                        {collegeApplications.length === 0 ? (
                            <p style={{ color: '#64748b', textAlign: 'center', padding: '2rem 0' }}>No college applications yet.</p>
                        ) : (
                            collegeApplications.slice(0, 5).map(app => {
                                const matchedCourse = courses.find(c => c.id === app.courseId);
                                return (
                                <div key={app.id} className="app-item">
                                    <div>
                                        <p style={{ margin: '0 0 0.25rem 0', fontWeight: 800, color: '#0f172a' }}>{matchedCourse?.title || 'Course Application'}</p>
                                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>{new Date(app.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <span className="status-badge" style={{ background: '#f3e8ff', color: '#6b21a8' }}>
                                        {app.status || 'Pending'}
                                    </span>
                                </div>
                                );
                            })
                        )}
                    </div>
                </div>

            </div>
        </>
    );
}
