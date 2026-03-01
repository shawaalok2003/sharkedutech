"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function AdmissionsPage() {
    const router = useRouter();
    const { data: session } = useSession();
    const [applications, setApplications] = useState<any[]>([]);
    const [profileCompletion, setProfileCompletion] = useState(0);
    const [documents, setDocuments] = useState<any[]>([]);
    const [colleges, setColleges] = useState<any[]>([]);
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            setLoading(true);
            try {
                const [appsRes, profileRes, docsRes, collegesRes, coursesRes] = await Promise.all([
                    fetch("/api/admissions/applications"),
                    fetch("/api/admissions/profile"),
                    fetch("/api/admissions/documents"),
                    fetch("/api/admissions/colleges"),
                    fetch("/api/admissions/courses")
                ]);

                if (appsRes.ok) setApplications(await appsRes.json());
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
        loadData();
    }, []);

    return (
        <>
            <style jsx>{`
                * { box-sizing: border-box; }
                .layout-wrapper { 
                    min-height: 100vh; 
                    background: white;
                }
                
                /* Main Content */
                .main-content {
                    background: white;
                }
                
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
                    margin: 2rem auto;
                    max-width: 1400px;
                }
                .hero-pattern {
                    position: absolute;
                    inset: 0;
                    opacity: 0.1;
                    background-image: radial-gradient(#0A192F 1px, transparent 1px);
                    background-size: 24px 24px;
                    pointer-events: none;
                }
                .hero-content {
                    position: relative;
                    z-index: 10;
                    max-width: 42rem;
                }
                .hero-badge {
                    display: inline-block;
                    padding: 0.375rem 1rem;
                    background: rgba(10, 25, 47, 0.1);
                    border-radius: 9999px;
                    color: #0A192F;
                    font-size: 10px;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 0.2em;
                    margin-bottom: 1.5rem;
                }
                .hero-title {
                    color: #0A192F;
                    font-size: 3rem;
                    font-weight: 700;
                    letter-spacing: -0.03em;
                    margin-bottom: 1.5rem;
                    line-height: 1.2;
                }
                .hero-subtitle {
                    color: rgba(10, 25, 47, 0.7);
                    font-size: 1.125rem;
                    line-height: 1.6;
                    margin-bottom: 2rem;
                    max-width: 32rem;
                }
                .hero-actions {
                    display: flex;
                    gap: 1rem;
                }
                .btn-navy {
                    background: #0A192F;
                    color: white;
                    padding: 1rem 2.5rem;
                    border-radius: 12px;
                    border: none;
                    font-weight: 700;
                    font-size: 0.875rem;
                    cursor: pointer;
                    transition: all 0.3s;
                    display: inline-flex;
                    align-items: center;
                    gap: 0.75rem;
                }
                .btn-navy:hover {
                    box-shadow: 0 10px 30px -10px rgba(10, 25, 47, 0.3);
                    transform: translateY(-2px);
                }
                .btn-outline-navy {
                    background: transparent;
                    color: #0A192F;
                    padding: 1rem 2.5rem;
                    border-radius: 12px;
                    border: 2px solid #0A192F;
                    font-weight: 700;
                    font-size: 0.875rem;
                    cursor: pointer;
                    transition: all 0.3s;
                    display: inline-flex;
                    align-items: center;
                    gap: 0.75rem;
                }
                .btn-outline-navy:hover {
                    background: rgba(10, 25, 47, 0.05);
                }

                .progress-widget {
                    position: relative;
                    z-index: 10;
                    background: white;
                    padding: 2rem;
                    border-radius: 24px;
                    box-shadow: 0 10px 30px -10px rgba(10, 25, 47, 0.08);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    min-width: 280px;
                }
                .progress-circle {
                    position: relative;
                    width: 144px;
                    height: 144px;
                    margin-bottom: 1.5rem;
                }
                .progress-circle svg {
                    transform: rotate(-90deg);
                }
                .progress-text {
                    position: absolute;
                    inset: 0;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                }
                .progress-value {
                    font-size: 2.25rem;
                    font-weight: 700;
                    color: #0A192F;
                }
                .progress-label {
                    font-size: 10px;
                    text-transform: uppercase;
                    font-weight: 800;
                    letter-spacing: 0.15em;
                    color: rgba(10, 25, 47, 0.4);
                }

                /* Content Grid */
                .content-section {
                    padding: 0 2rem 3rem 2rem;
                    display: grid;
                    grid-template-columns: 1fr 340px;
                    gap: 2.5rem;
                    max-width: 1400px;
                    margin: 0 auto;
                }
                .main-column { min-width: 0; }
                .side-column { display: flex; flex-direction: column; gap: 2rem; }
                
                /* Job-style Course Cards */
                .course-card-alt {
                    background: #ffffff;
                    border: 1px solid #e2e8f0;
                    border-radius: 1.5rem;
                    padding: 2rem;
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                    margin-bottom: 1.5rem;
                    transition: all 0.3s ease;
                }
                .course-card-alt:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 15px 40px -20px rgba(15, 23, 42, 0.15);
                    border-color: #0f172a;
                }
                .course-row-alt {
                    display: flex;
                    gap: 1.5rem;
                    align-items: center;
                }
                .college-logo-alt {
                    width: 4rem;
                    height: 4rem;
                    border-radius: 0.75rem;
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.25rem;
                    font-weight: 800;
                    color: #0f172a;
                    flex-shrink: 0;
                }
                .college-logo-alt img { width: 100%; height: 100%; object-fit: cover; border-radius: 0.75rem; }
                
                .course-info-alt { flex: 1; }
                .course-title-alt {
                    font-size: 1.375rem;
                    font-weight: 800;
                    color: #0f172a;
                    margin: 0 0 0.25rem 0;
                }
                .college-name-alt {
                    font-size: 0.9rem;
                    color: #64748b;
                    font-weight: 600;
                }

                .course-tags-alt {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.5rem;
                    margin: 1.25rem 0;
                }
                .badge-alt {
                    padding: 0.35rem 0.8rem;
                    border-radius: 9999px;
                    font-size: 0.65rem;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    background: #f1f5f9;
                    color: #0f172a;
                    border: 1px solid #e2e8f0;
                }

                .course-footer-alt {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-top: 1.25rem;
                    border-top: 1px solid #f1f5f9;
                }
                .price-tag-alt {
                    font-size: 1.25rem;
                    font-weight: 800;
                    color: #0f172a;
                }
                .btn-apply-alt {
                    padding: 0.75rem 1.75rem;
                    background: #0f172a;
                    color: white;
                    border: none;
                    border-radius: 0.75rem;
                    font-weight: 700;
                    cursor: pointer;
                    transition: background 0.2s;
                }
                .btn-apply-alt:hover { background: #1e293b; }

                /* Cards */
                .card {
                    background: white;
                    border-radius: 24px;
                    padding: 2rem;
                    border: 1px solid #f1f5f9;
                    box-shadow: 0 10px 30px -10px rgba(10, 25, 47, 0.08);
                }

                /* Activity Feed */
                .activity-item {
                    display: flex;
                    gap: 1.25rem;
                    align-items: flex-start;
                    margin-bottom: 1.5rem;
                }
                .activity-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    margin-top: 0.5rem;
                    flex-shrink: 0;
                }

                /* Responsive */
                @media (max-width: 1200px) {
                    .content-section {
                        grid-template-columns: 1fr;
                    }
                    .side-column {
                        display: grid;
                        grid-template-columns: repeat(2, 1fr);
                        gap: 2rem;
                    }
                }
                @media (max-width: 768px) {
                    .hero-banner {
                        flex-direction: column;
                        margin: 1rem;
                        padding: 2rem;
                    }
                    .hero-title { font-size: 2.25rem; }
                    .content-section { padding: 1rem; }
                    .side-column { grid-template-columns: 1fr; }
                    .hero-actions { flex-direction: column; width: 100%; }
                    .btn-navy, .btn-outline-navy { width: 100%; justify-content: center; }
                }
            `}</style>

            <div className={`layout-wrapper`}>
                <main className="main-content">
                    {/* Hero Section */}
                    <section className="hero-banner">
                        <div className="hero-pattern"></div>
                        <div className="hero-content">
                            <span className="hero-badge">Welcome Candidate</span>
                            <h1 className="hero-title">Welcome back, {session?.user?.name || "Student"}.</h1>
                            <p className="hero-subtitle">
                                Your journey to hospitality excellence continues. Explore courses, complete your profile, and apply to top institutions.
                            </p>
                            <div className="hero-actions">
                                <button className="btn-navy" onClick={() => router.push('/admissions')}>
                                    <span>Browse All Courses</span>
                                    <span>→</span>
                                </button>
                                <button className="btn-outline-navy" onClick={() => router.push('/admissions/profile')}>
                                    <span>👤 My Profile</span>
                                </button>
                            </div>
                        </div>
                        <div className="progress-widget">
                            <div className="progress-circle">
                                <svg width="144" height="144">
                                    <circle cx="72" cy="72" r="64" fill="transparent" stroke="#f1f5f9" strokeWidth="8"></circle>
                                    <circle
                                        cx="72"
                                        cy="72"
                                        r="64"
                                        fill="transparent"
                                        stroke="#0A192F"
                                        strokeWidth="8"
                                        strokeDasharray="402"
                                        strokeDashoffset={402 - (402 * profileCompletion) / 100}
                                        strokeLinecap="round"
                                    ></circle>
                                </svg>
                                <div className="progress-text">
                                    <span className="progress-value">{profileCompletion}%</span>
                                    <span className="progress-label">Profile</span>
                                </div>
                            </div>
                            <p style={{ fontWeight: 700, textAlign: 'center', margin: 0, color: '#0A192F' }}>Application Readiness</p>
                        </div>
                    </section>

                    {/* Content Grid */}
                    <section className="content-section">
                        <div className="main-column">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                <div>
                                    <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Featured Programs</h2>
                                    <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.25rem' }}>Top-rated hospitality courses curated for you</p>
                                </div>
                                <button className="btn-outline-navy" style={{ padding: '0.625rem 1.25rem', fontSize: '0.75rem' }} onClick={() => router.push('/admissions/colleges')}>
                                    Explore All
                                </button>
                            </div>

                            {loading ? (
                                <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>Loading courses...</div>
                            ) : (
                                <div className="featured-courses-list">
                                    {courses.slice(0, 5).map(course => {
                                        const college = colleges.find(c => c.id === course.collegeId);
                                        return (
                                            <div key={course.id} className="course-card-alt">
                                                <div className="course-row-alt">
                                                    <div className="college-logo-alt">
                                                        {college?.logoUrl ? (
                                                            <img src={college.logoUrl} alt={college.name} />
                                                        ) : (
                                                            college?.name[0] || "H"
                                                        )}
                                                    </div>
                                                    <div className="course-info-alt">
                                                        <h3 className="course-title-alt">{course.title}</h3>
                                                        <div className="college-name-alt">{college?.name || "Institute of Hospitality"} • {college?.location || "India"}</div>
                                                    </div>
                                                </div>

                                                <div className="course-tags-alt">
                                                    <span className="badge-alt">{course.level || "Degree"}</span>
                                                    <span className="badge-alt">{course.duration || "3 Years"}</span>
                                                    <span className="badge-alt">{course.mode || "Regular"}</span>
                                                    {course.scholarshipAvailable && <span className="badge-alt" style={{ background: '#ecfdf5', color: '#047857', borderColor: '#d1fae5' }}>Scholarship</span>}
                                                </div>

                                                <p style={{ fontSize: '0.95rem', color: '#475569', lineHeight: '1.6', margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                    {course.description || "Master the art of hospitality management with world-class training and global placement opportunities."}
                                                </p>

                                                <div className="course-footer-alt">
                                                    <div className="price-tag-alt">₹{course.fee?.toLocaleString() || "TBD"} <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>(Total Fee)</span></div>
                                                    <button className="btn-apply-alt" onClick={() => router.push(`/admissions/apply/${course.id}`)}>
                                                        Apply with One Click
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Side Column */}
                        <div className="side-column">
                            {/* Stats Info */}
                            <div className="card">
                                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0A192F', marginBottom: '1.5rem' }}>Quick Stats</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '16px', textAlign: 'center' }}>
                                        <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0A192F', display: 'block' }}>{applications.length}</span>
                                        <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Apps</span>
                                    </div>
                                    <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '16px', textAlign: 'center' }}>
                                        <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0A192F', display: 'block' }}>{documents.length}</span>
                                        <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Docs</span>
                                    </div>
                                </div>
                            </div>

                            {/* Activity Feed */}
                            <div className="card">
                                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0A192F', marginBottom: '1.5rem' }}>Recent Activity</h3>
                                <div>
                                    <div className="activity-item">
                                        <div className="activity-dot" style={{ background: '#D4AF37' }}></div>
                                        <div>
                                            <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0A192F', margin: 0 }}>Profile Updated</p>
                                            <p style={{ fontSize: '10px', color: '#64748b', marginTop: '0.25rem' }}>Successfully synced</p>
                                        </div>
                                    </div>
                                    <div className="activity-item">
                                        <div className="activity-dot" style={{ background: '#10B981' }}></div>
                                        <div>
                                            <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0A192F', margin: 0 }}>New Course Added</p>
                                            <p style={{ fontSize: '10px', color: '#64748b', marginTop: '0.25rem' }}>Recently added by College</p>
                                        </div>
                                    </div>
                                </div>
                                <button style={{ width: '100%', padding: '0.75rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', color: '#0A192F' }}>
                                    View Timeline
                                </button>
                            </div>

                            {/* Help Box */}
                            <div style={{ background: '#0A192F', padding: '2rem', borderRadius: '24px', color: 'white' }}>
                                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.75rem' }}>Need Help?</h3>
                                <p style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.7)', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                                    Our admission experts are available to guide you through the process.
                                </p>
                                <button style={{ width: '100%', padding: '0.875rem', background: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, color: '#0A192F', cursor: 'pointer' }}>
                                    Contact Support
                                </button>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </>
    );
}
