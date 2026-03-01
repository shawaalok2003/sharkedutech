"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function DashboardDetailsPage() {
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
                .dashboard-container {
                    display: grid;
                    grid-template-columns: 320px 1fr;
                    gap: 2rem;
                    max-width: 1600px;
                    margin: 0 auto;
                }

                /* Profile Sidebar */
                .profile-sidebar {
                    position: sticky;
                    top: 2rem;
                    height: fit-content;
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }

                .profile-card {
                    background: white;
                    border-radius: 24px;
                    padding: 2rem;
                    border: 1px solid #f1f5f9;
                    box-shadow: 0 10px 30px -10px rgba(10, 25, 47, 0.05);
                    text-align: center;
                }

                .avatar {
                    width: 96px;
                    height: 96px;
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    border-radius: 50%;
                    margin: 0 auto 1.5rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 2.5rem;
                    color: #0A192F;
                }

                .profile-name {
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: #0A192F;
                    margin-bottom: 0.25rem;
                }

                .profile-email {
                    font-size: 0.875rem;
                    color: #64748b;
                    margin-bottom: 1.5rem;
                    word-break: break-all;
                }

                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 1rem;
                    margin-top: 2rem;
                }

                .stat-item {
                    background: #f8fafc;
                    padding: 1rem;
                    border-radius: 16px;
                    text-align: center;
                }

                .stat-value {
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: #007bff;
                    display: block;
                }

                .stat-label {
                    font-size: 0.75rem;
                    color: #64748b;
                    font-weight: 600;
                    text-transform: uppercase;
                    margin-top: 0.25rem;
                }

                /* Main Content Area */
                .main-dashboard {
                    display: flex;
                    flex-direction: column;
                    gap: 3rem;
                }

                .section-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    margin-bottom: 1.5rem;
                }

                .section-title-group h2 {
                    font-size: 1.875rem;
                    font-weight: 800;
                    color: #0A192F;
                    margin: 0 0 0.5rem 0;
                }

                .college-group {
                    background: white;
                    border-radius: 24px;
                    padding: 2.5rem;
                    border: 1px solid #f1f5f9;
                    box-shadow: 0 10px 30px -10px rgba(10, 25, 47, 0.05);
                }

                .college-header {
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                    padding-bottom: 1.5rem;
                    border-bottom: 1px solid #f1f5f9;
                    margin-bottom: 2rem;
                }

                .college-logo-mini {
                    width: 56px;
                    height: 56px;
                    background: #f8fafc;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.5rem;
                    border: 1px solid #e2e8f0;
                    flex-shrink: 0;
                }
                .college-logo-mini img { width: 100%; height: 100%; object-fit: cover; border-radius: 12px; }

                .college-name-small {
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: #0A192F;
                    margin: 0;
                }

                .college-loc-small {
                    font-size: 0.875rem;
                    color: #64748b;
                    margin-top: 0.25rem;
                }

                .courses-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                    gap: 1.5rem;
                }

                .course-card {
                    background: #f8fafc;
                    padding: 1.5rem;
                    border-radius: 20px;
                    border: 1px solid #e2e8f0;
                    transition: all 0.2s ease;
                }

                .course-card:hover {
                    border-color: #007bff;
                    background: white;
                    box-shadow: 0 10px 30px -10px rgba(0, 123, 255, 0.1);
                    transform: translateY(-2px);
                }

                .course-title {
                    font-size: 1.125rem;
                    font-weight: 700;
                    color: #0A192F;
                    margin: 0 0 1rem 0;
                }

                .course-meta {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.75rem;
                    margin-bottom: 1.5rem;
                }

                .meta-tag {
                    font-size: 10px;
                    font-weight: 700;
                    text-transform: uppercase;
                    padding: 0.25rem 0.625rem;
                    background: rgba(0, 123, 255, 0.08);
                    color: #007bff;
                    border-radius: 6px;
                }

                .fee-box {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-top: auto;
                    padding-top: 1rem;
                    border-top: 1px dashed #e2e8f0;
                }

                .fee-val {
                    font-size: 1.25rem;
                    font-weight: 800;
                    color: #0A192F;
                }

                .fee-label {
                    font-size: 0.75rem;
                    color: #64748b;
                    font-weight: 600;
                }

                .btn-apply {
                    width: 100%;
                    padding: 0.875rem;
                    background: #007bff;
                    color: white;
                    border: none;
                    border-radius: 12px;
                    font-weight: 700;
                    font-size: 0.9rem;
                    margin-top: 1.25rem;
                    cursor: pointer;
                    transition: background 0.2s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                }
                .btn-apply:hover { background: #0056b3; }

                /* Progress Circle Styles */
                .profile-progress-circle {
                    position: relative;
                    width: 120px;
                    height: 120px;
                    margin: 0 auto 1rem;
                }

                @media (max-width: 1200px) {
                    .dashboard-container { grid-template-columns: 1fr; }
                    .profile-sidebar { position: static; flex-direction: row; flex-wrap: wrap; }
                    .profile-card { flex: 1; min-width: 300px; }
                }

                @media (max-width: 768px) {
                    .dashboard-container { padding: 1rem; }
                    .profile-sidebar { flex-direction: column; }
                    .college-group { padding: 1.5rem; }
                    .section-title-group h2 { font-size: 1.5rem; }
                }
            `}</style>

            <div className="dashboard-container">
                {/* Profile Sidebar */}
                <aside className="profile-sidebar">
                    <div className="profile-card">
                        <div className="avatar">
                            {session?.user?.name ? session.user.name[0].toUpperCase() : "👤"}
                        </div>
                        <h2 className="profile-name">{session?.user?.name || "Candidate"}</h2>
                        <p className="profile-email">{session?.user?.email}</p>

                        <div className="profile-progress-circle">
                            <svg width="120" height="120">
                                <circle cx="60" cy="60" r="54" fill="transparent" stroke="#f1f5f9" strokeWidth="8"></circle>
                                <circle
                                    cx="60"
                                    cy="60"
                                    r="54"
                                    fill="transparent"
                                    stroke="#007bff"
                                    strokeWidth="8"
                                    strokeDasharray="339"
                                    strokeDashoffset={339 - (339 * profileCompletion) / 100}
                                    strokeLinecap="round"
                                ></circle>
                            </svg>
                            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0A192F' }}>{profileCompletion}%</span>
                                <span style={{ fontSize: '9px', fontWeight: 800, letterSpacing: '0.1em', color: '#64748b', textTransform: 'uppercase' }}>Profile</span>
                            </div>
                        </div>

                        <div className="stats-grid">
                            <div className="stat-item">
                                <span className="stat-value">{applications.length}</span>
                                <span className="stat-label">Applications</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-value">{documents.length}</span>
                                <span className="stat-label">Documents</span>
                            </div>
                        </div>

                        <button
                            onClick={() => router.push('/admissions/profile')}
                            style={{ width: '100%', padding: '1rem', border: '1px solid #e2e8f0', background: 'white', borderRadius: '12px', marginTop: '2rem', fontWeight: 700, color: '#0A192F', cursor: 'pointer' }}
                        >
                            Edit Profile
                        </button>
                    </div>

                    <div className="profile-card" style={{ textAlign: 'left', padding: '1.5rem' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0A192F', marginBottom: '1.25rem' }}>Next Deadlines</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ padding: '1rem', background: '#FFF1F2', borderRadius: '12px', border: '1px solid #FECDD3' }}>
                                <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#9F1239', margin: 0 }}>Document Upload</p>
                                <p style={{ fontSize: '0.75rem', color: '#E11D48', margin: '0.25rem 0 0 0' }}>Sep 28, 2026</p>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content Areas */}
                <main className="main-dashboard">
                    <section>
                        <div className="section-header">
                            <div className="section-title-group">
                                <h2>Available Courses</h2>
                                <p style={{ color: '#64748b', fontStyle: 'italic', fontWeight: 500, margin: 0 }}>Discover premium hospitality programs from top-rated colleges</p>
                            </div>
                        </div>

                        {loading ? (
                            <div style={{ padding: '4rem', textAlign: 'center', color: '#64748b' }}>
                                <div className="avatar" style={{ animation: 'pulse 1.5s infinite', border: 'none', background: '#f1f5f9' }}></div>
                                <p style={{ fontWeight: 600 }}>Loading real data from colleges...</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                                {colleges.map(college => {
                                    const collegeCourses = courses.filter(course => course.collegeId === college.id);
                                    if (collegeCourses.length === 0) return null;

                                    return (
                                        <div key={college.id} className="college-group">
                                            <div className="college-header">
                                                <div className="college-logo-mini">
                                                    {college.logoUrl ? (
                                                        <img src={college.logoUrl} alt={college.name} />
                                                    ) : (
                                                        college.name[0].toUpperCase()
                                                    )}
                                                </div>
                                                <div>
                                                    <h3 className="college-name-small">{college.name}</h3>
                                                    <p className="college-loc-small">📍 {college.location}</p>
                                                </div>
                                                <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                                                    <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#D4AF37' }}>★ {college.rating || "5.0"}</span>
                                                    <p style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>College Rating</p>
                                                </div>
                                            </div>

                                            <div className="courses-grid">
                                                {collegeCourses.map(course => (
                                                    <div key={course.id} className="course-card">
                                                        <h4 className="course-title">{course.title}</h4>
                                                        <div className="course-meta">
                                                            <span className="meta-tag">{course.level || "Degree"}</span>
                                                            <span className="meta-tag">{course.duration || "3 Years"}</span>
                                                            <span className="meta-tag">{course.mode || "Regular"}</span>
                                                        </div>
                                                        <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                            {course.description || "Comprehensive program focused on modern hospitality excellence and leadership."}
                                                        </p>
                                                        <div className="fee-box">
                                                            <div>
                                                                <span className="fee-label">Course Fee</span>
                                                                <div className="fee-val">₹{course.fee?.toLocaleString() || "TBD"}</div>
                                                            </div>
                                                            <Link href={`/admissions/colleges/${college.id}`}>
                                                                <span style={{ color: '#007bff', fontWeight: 700, fontSize: '0.75rem' }}>Learn More ›</span>
                                                            </Link>
                                                        </div>
                                                        <button
                                                            className="btn-apply"
                                                            onClick={() => router.push(`/admissions/apply/${course.id}`)}
                                                        >
                                                            Apply Now
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </section>
                </main>
            </div>

            <style jsx global>{`
                @keyframes pulse {
                    0% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.5; transform: scale(0.95); }
                    100% { opacity: 1; transform: scale(1); }
                }
            `}</style>
        </>
    );
}
