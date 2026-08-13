"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Space_Grotesk } from "next/font/google";
import Link from "next/link";

const spaceGrotesk = Space_Grotesk({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
});

export default function AdmissionsCourseListingPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const [courses, setCourses] = useState<any[]>([]);
    const [colleges, setColleges] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [locationTerm, setLocationTerm] = useState("");

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const [coursesRes, collegesRes] = await Promise.all([
                    fetch('/api/admissions/courses'),
                    fetch('/api/admissions/colleges')
                ]);

                if (coursesRes.ok) {
                    const data = await coursesRes.json();
                    // Filter out dummy/test entries like 'e'
                    const validData = Array.isArray(data) ? data.filter(c => c.title && c.title.trim().length > 2) : [];
                    setCourses(validData);
                }
                if (collegesRes.ok) {
                    setColleges(await collegesRes.json());
                }
            } catch (error) {
                console.error("Failed to fetch admissions data", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    // Purely database-driven list from Admin Panel
    const filteredCourses = courses.filter(course => {
        const college = colleges.find(c => c.id === course.collegeId) || course.college;
        const collegeName = college?.name || course.collegeName || "";
        const location = college?.location || course.location || "";
        const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            collegeName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesLocation = location.toLowerCase().includes(locationTerm.toLowerCase());
        return matchesSearch && matchesLocation;
    });

    return (
        <>
            <style jsx>{`
                :global(body) {
                    background: #ffffff;
                }

                .page {
                    color: #0f172a;
                    padding-bottom: 4rem;
                }

                .hero {
                    position: relative;
                    overflow: hidden;
                    padding: 3rem 1.5rem 2rem;
                    background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
                    border-bottom: 1px solid #f1f5f9;
                }

                .hero-pattern {
                    position: absolute;
                    inset: 0;
                    background-image: radial-gradient(var(--primary) 0.5px, transparent 0.5px);
                    background-size: 32px 32px;
                    opacity: 0.05;
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

                .hero-top {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1.5rem;
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
                    margin: 0 auto 1.75rem;
                    line-height: 1.6;
                    font-weight: 500;
                }

                .profile-btn {
                    padding: 0.6rem 1.25rem;
                    background: #001736;
                    color: #ffffff;
                    border-radius: 12px;
                    font-weight: 700;
                    font-size: 0.88rem;
                    text-decoration: none;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 10px rgba(0, 23, 54, 0.15);
                }

                .profile-btn:hover {
                    transform: translateY(-2px);
                    background: #0f2b5c;
                    box-shadow: 0 10px 18px rgba(0, 23, 54, 0.2);
                }

                .search-shell {
                    max-width: 56rem;
                    margin: 0 auto;
                    background: rgba(255, 255, 255, 0.9);
                    backdrop-filter: blur(20px);
                    border: 1px solid #cbd5e1;
                    border-radius: 20px;
                    box-shadow: 0 15px 30px -10px rgba(15, 23, 42, 0.1);
                    padding: 0.4rem;
                }

                .search-row {
                    display: flex;
                    flex-wrap: wrap;
                    align-items: center;
                    gap: 0.25rem;
                }

                .search-field {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.6rem 1rem;
                    background: white;
                    border-radius: 14px;
                    margin: 0.25rem;
                }

                .search-field input {
                    width: 100%;
                    border: none;
                    outline: none;
                    font-size: 1rem;
                    font-family: inherit;
                    color: #001736;
                    font-weight: 500;
                }

                .search-divider {
                    width: 1px;
                    height: 2rem;
                    background: #cbd5e1;
                    margin: 0 0.5rem;
                }

                .section {
                    max-width: 72rem;
                    margin: 0 auto;
                    padding: 3rem 1.5rem;
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
                    align-items: center;
                    gap: 1.75rem;
                    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                    box-shadow: 0 4px 15px rgba(0, 23, 54, 0.03);
                }

                .job-card:hover {
                    border-color: #cbd5e1;
                    box-shadow: 0 16px 35px rgba(0, 23, 54, 0.09);
                    transform: translateY(-4px);
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
                    font-size: 1.75rem;
                    font-weight: 800;
                    color: #ffffff;
                    flex-shrink: 0;
                    overflow: hidden;
                    box-shadow: 0 6px 12px rgba(0, 23, 54, 0.1);
                }

                .job-logo img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .job-info {
                    flex: 1;
                }

                .job-title {
                    font-size: 1.35rem;
                    font-weight: 800;
                    margin-bottom: 0.4rem;
                    color: #001736;
                    letter-spacing: -0.02em;
                }

                .job-meta {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 1.25rem;
                    font-size: 0.88rem;
                    color: #64748b;
                    font-weight: 600;
                    margin-bottom: 0.6rem;
                }

                .job-tags {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.4rem;
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

                .job-right {
                    text-align: right;
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                    align-items: flex-end;
                    flex-shrink: 0;
                }

                .job-salary {
                    font-size: 1.4rem;
                    font-weight: 800;
                    color: #001736;
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

                .loading-shell {
                    padding: 6rem 0;
                    text-align: center;
                    color: #64748b;
                }

                @media (max-width: 768px) {
                    .hero { padding: 3rem 1.25rem; }
                    .hero-title { font-size: 2.25rem; margin-bottom: 1rem; }
                    .hero-subtitle { font-size: 1rem; margin-bottom: 1.5rem; }
                    .hero-top { flex-direction: column; gap: 1rem; margin-bottom: 1.5rem; }
                    .hero-badge, .profile-btn { width: 100%; justify-content: center; }
                    
                    .search-shell { background: transparent; border: none; box-shadow: none; padding: 0; }
                    .search-field { margin: 0 0 0.5rem 0; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
                    .search-divider { display: none; }
                    
                    .job-card { flex-direction: column; align-items: flex-start; text-align: left; padding: 1.5rem; }
                    .job-right { align-items: flex-start; text-align: left; width: 100%; border-top: 1px solid #e2e8f0; padding-top: 1rem; }
                }

                .benefits-section {
                    background: #f8fafc;
                    border-bottom: 1px solid #e2e8f0;
                    padding: 3rem 1.5rem;
                }
                .benefits-header {
                    text-align: center;
                    margin-bottom: 2rem;
                }
                .benefits-title {
                    font-size: 2rem;
                    font-weight: 800;
                    color: #001736;
                    margin-bottom: 0.5rem;
                }
                .benefits-subtitle {
                    color: #64748b;
                    font-size: 1.05rem;
                }
                .benefits-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 2rem;
                    max-width: 72rem;
                    margin: 0 auto;
                }
                @media (max-width: 768px) {
                    .benefits-grid { grid-template-columns: 1fr; }
                }
                .benefits-group {
                    background: #ffffff;
                    padding: 2rem;
                    border-radius: 1.25rem;
                    border: 1px solid #e2e8f0;
                    box-shadow: 0 4px 15px rgba(0, 23, 54, 0.02);
                }
                .group-title {
                    font-size: 1.25rem;
                    font-weight: 800;
                    color: #001736;
                    margin-bottom: 1.25rem;
                    border-bottom: 2px solid #f1f5f9;
                    padding-bottom: 0.75rem;
                }
                .benefits-list {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                    display: flex;
                    flex-direction: column;
                    gap: 0.85rem;
                }
                .benefits-list li {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    font-size: 0.95rem;
                    color: #334155;
                    font-weight: 500;
                }
                .benefits-list li::before {
                    content: "✓";
                    color: #166534;
                    font-weight: 800;
                    font-size: 1.1rem;
                }
            `}</style>

            <div className={`page ${spaceGrotesk.className}`}>
                <header className="hero">
                    <div className="hero-pattern"></div>
                    <div className="hero-inner">
                        <div className="hero-top">
                            <div className="hero-badge">Shark Edutech Admissions</div>
                            <Link href="/admissions/dashboard" className="profile-btn">
                                👤 My Profile
                            </Link>
                        </div>

                        <h1 className="hero-title">
                            Discover Your Future in <br />
                            <span style={{ color: "#94a3b8" }}>Luxury Hospitality</span>
                        </h1>
                        <p className="hero-subtitle">
                            Explore world-class courses from top hospitality colleges. Start your journey toward global excellence today.
                        </p>

                        <div className="search-shell">
                            <div className="search-row">
                                <div className="search-field">
                                    <span style={{ color: "#94a3b8" }}>Search</span>
                                    <input
                                        placeholder="Course title or college name..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <div className="search-divider"></div>
                                <div className="search-field">
                                    <span style={{ color: "#94a3b8" }}>Location</span>
                                    <input
                                        placeholder="City or state..."
                                        value={locationTerm}
                                        onChange={(e) => setLocationTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <section className="benefits-section">
                    <div className="benefits-header">
                        <h2 className="benefits-title">Why Choose Shark Edutech Admissions?</h2>
                        <p className="benefits-subtitle">We don't just provide admission; we build lifetime hospitality careers.</p>
                    </div>
                    
                    <div className="benefits-grid">
                        <div className="benefits-group">
                            <h3 className="group-title">Premium Facilities & Training</h3>
                            <ul className="benefits-list">
                                <li>Well-equipped Training Kitchen & Bakery</li>
                                <li>Housekeeping & Front Office Practice Labs</li>
                                <li>Grooming & personality development sessions</li>
                                <li>Industry visits, workshops & seminars</li>
                                <li>Internship & placement support through SHARK lifetime</li>
                                <li>Education Loan at 0% interest support</li>
                                <li>Health insurance across leading hospitals in India</li>
                            </ul>
                        </div>
                        <div className="benefits-group">
                            <h3 className="group-title">Our Career Achievements</h3>
                            <ul className="benefits-list">
                                <li>100% assured placement assistance in 5-star properties</li>
                                <li>Direct admission into top UGC & NCHMCT recognized colleges</li>
                                <li>Strong industry collaborations with Taj, Marriott, Hyatt & Oberoi</li>
                                <li>Industrial Training & Apprenticeship stipends</li>
                                <li>Positive global recognition from hospitality partners</li>
                            </ul>
                        </div>
                    </div>
                </section>

                <main className="section">
                    <div style={{ marginBottom: "2rem" }}>
                        <h2 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#001736", marginBottom: "0.4rem" }}>
                            Top Hospitality Colleges &amp; Courses ({filteredCourses.length})
                        </h2>
                        <p style={{ color: "#64748b", fontSize: "0.95rem" }}>
                            Apply to premier institutes with a single unified application directly managed by Admin.
                        </p>
                    </div>

                    {loading ? (
                        <div className="loading-shell">
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Fetching latest college admissions...</h2>
                        </div>
                    ) : (
                        <div className="job-list">
                            {filteredCourses.length > 0 ? (
                                filteredCourses.map((course: any) => {
                                    const college = colleges.find(c => c.id === course.collegeId) || course.college;
                                    const collegeName = college?.name || course.collegeName || "Premier Hospitality Institute";
                                    const location = college?.location || course.location || "India";
                                    const logo = college?.logoUrl || college?.coverImageUrl || course.logoUrl;
                                    const feeVal = course.fee ? (typeof course.fee === 'number' ? course.fee.toLocaleString() : course.fee) : "1,85,000";
                                    const targetCollegeId = college?.id || course.collegeId || "gims-kolkata";

                                    return (
                                        <div key={course.id} className="job-card">
                                            <div className="job-logo">
                                                {logo ? (
                                                    <img src={logo} alt={collegeName} />
                                                ) : (
                                                    <span>🎓</span>
                                                )}
                                            </div>

                                            <div className="job-info">
                                                <h3 className="job-title">{course.title}</h3>
                                                <div className="job-meta">
                                                    <span style={{ color: "#001736", fontWeight: 800 }}>🏢 {collegeName}</span>
                                                    <span>📍 {location}</span>
                                                    <span>🕒 {course.duration || "3 Years"}</span>
                                                </div>
                                                <div className="job-tags">
                                                    <span className="job-badge">{course.level || "Degree"}</span>
                                                    <span className="job-badge">{course.mode || "Full Time"}</span>
                                                    {(course.scholarshipAvailable || course.scholarship) && (
                                                        <span className="job-badge" style={{ background: '#ecfdf5', color: '#047857', borderColor: '#a7f3d0' }}>
                                                            Scholarship Available
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="job-right">
                                                <div className="job-salary">
                                                    ₹{feeVal}
                                                    <span style={{ fontSize: '0.8rem', color: '#64748b', marginLeft: '0.5rem', fontWeight: 600 }}>
                                                        Total Fee
                                                    </span>
                                                </div>
                                                <button
                                                    className="job-action"
                                                    onClick={() => router.push(`/admissions/colleges/${targetCollegeId}#apply`)}
                                                >
                                                    Apply with One Click →
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
                                    No college courses found matching your criteria.
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </div>
        </>
    );
}
