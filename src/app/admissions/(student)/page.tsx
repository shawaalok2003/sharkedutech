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
    const { data: session, status } = useSession();
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
                    setCourses(await coursesRes.json());
                }
                if (collegesRes.ok) {
                    setColleges(await collegesRes.json());
                }
            } catch (error) {
                console.error("Failed to fetch data", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const filteredCourses = courses.filter(course => {
        const college = colleges.find(c => c.id === course.collegeId);
        const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (college?.name || "").toLowerCase().includes(searchTerm.toLowerCase());
        const matchesLocation = (college?.location || "").toLowerCase().includes(locationTerm.toLowerCase());
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
                    padding-bottom: 6rem;
                }

                .hero {
                    position: relative;
                    overflow: hidden;
                    padding: 8rem 1.5rem;
                    background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
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
                }

                .hero-top {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 4rem;
                }

                .hero-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.6rem 1.25rem;
                    border-radius: 9999px;
                    background: white;
                    border: 1px solid var(--border);
                    font-size: 0.75rem;
                    font-weight: 800;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    color: var(--primary);
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
                }

                .hero-title {
                    font-size: 4.5rem;
                    font-weight: 900;
                    line-height: 1.05;
                    letter-spacing: -0.04em;
                    margin-bottom: 1.5rem;
                    color: var(--primary);
                }

                .hero-subtitle {
                    font-size: 1.25rem;
                    color: #64748b;
                    max-width: 42rem;
                    margin: 0 auto 3rem;
                    line-height: 1.7;
                    font-weight: 500;
                }

                .profile-btn {
                    padding: 0.75rem 1.5rem;
                    background: var(--primary);
                    color: #ffffff;
                    border-radius: 14px;
                    font-weight: 700;
                    text-decoration: none;
                    display: flex;
                    align-items: center;
                    gap: 0.6rem;
                    transition: all 0.3s ease;
                    box-shadow: 0 10px 15px -3px rgba(0, 33, 71, 0.2);
                }

                .profile-btn:hover {
                    transform: translateY(-2px);
                    background: var(--primary-light);
                    box-shadow: 0 20px 25px -5px rgba(0, 33, 71, 0.25);
                }

                .search-shell {
                    max-width: 56rem;
                    margin: 0 auto;
                    background: rgba(255, 255, 255, 0.7);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.5);
                    border-radius: 24px;
                    box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.15);
                    padding: 0.5rem;
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
                    padding: 0.75rem 1.25rem;
                    background: white;
                    border-radius: 18px;
                    margin: 0.25rem;
                }

                .search-field input {
                    width: 100%;
                    border: none;
                    outline: none;
                    font-size: 1rem;
                    font-family: inherit;
                    color: var(--primary);
                    font-weight: 500;
                }

                .search-divider {
                    width: 1px;
                    height: 2rem;
                    background: var(--border);
                    margin: 0 0.5rem;
                }

                .section {
                    max-width: 72rem;
                    margin: 0 auto;
                    padding: 5rem 1.5rem;
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
                    align-items: center;
                    gap: 2rem;
                    transition: all 0.3s ease;
                }

                .job-card:hover {
                    border-color: #0f172a;
                    box-shadow: 0 15px 35px -15px rgba(15, 23, 42, 0.1);
                    transform: translateY(-2px);
                }

                .job-logo {
                    width: 5rem;
                    height: 5rem;
                    border-radius: 1.25rem;
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.5rem;
                    font-weight: 800;
                    color: #0f172a;
                    flex-shrink: 0;
                    overflow: hidden;
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
                    font-size: 1.5rem;
                    font-weight: 800;
                    margin-bottom: 0.5rem;
                    color: #0f172a;
                }

                .job-meta {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 1rem;
                    font-size: 0.9rem;
                    color: #64748b;
                    font-weight: 500;
                }

                .job-tags {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.5rem;
                    margin-top: 1rem;
                }

                .job-badge {
                    padding: 0.35rem 0.8rem;
                    border-radius: 9999px;
                    font-size: 0.65rem;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 0.12em;
                    background: #f1f5f9;
                    color: #0f172a;
                    border: 1px solid #e2e8f0;
                }

                .job-right {
                    text-align: right;
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    align-items: flex-end;
                }

                .job-salary {
                    font-size: 1.5rem;
                    font-weight: 800;
                    color: #0f172a;
                }

                .job-action {
                    padding: 0.85rem 2rem;
                    background: #0f172a;
                    color: #ffffff;
                    border-radius: 0.9rem;
                    border: none;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .job-action:hover {
                    background: #1e293b;
                    transform: scale(1.02);
                }

                .loading-shell {
                    padding: 8rem 0;
                    text-align: center;
                    color: #64748b;
                }

                @media (max-width: 768px) {
                    .hero { padding: 4rem 1.25rem; }
                    .hero-title { font-size: 2.25rem; margin-bottom: 1rem; }
                    .hero-subtitle { font-size: 1rem; margin-bottom: 2rem; }
                    .hero-top { flex-direction: column; gap: 1rem; margin-bottom: 2.5rem; }
                    .hero-badge, .profile-btn { width: 100%; justify-content: center; }
                    
                    .search-shell { background: transparent; border: none; box-shadow: none; padding: 0; }
                    .search-field { margin: 0 0 0.5rem 0; box-shadow: var(--shadow-sm); }
                    .search-divider { display: none; }
                    
                    .job-card { flex-direction: column; align-items: flex-start; text-align: left; padding: 1.5rem; }
                    .job-right { align-items: flex-start; text-align: left; width: 100%; border-top: 1px solid var(--border); pt: 1rem; }
                }

                .benefits-section {
                    background: #f8fafc;
                    border-bottom: 1px solid #e2e8f0;
                }
                .benefits-header {
                    text-align: center;
                    margin-bottom: 3rem;
                }
                .benefits-title {
                    font-size: 2.25rem;
                    font-weight: 800;
                    margin-bottom: 1rem;
                    color: #0f172a;
                }
                .benefits-subtitle {
                    color: #64748b;
                    font-size: 1.1rem;
                }
                .benefits-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 3rem;
                }
                .group-title {
                    font-size: 1.5rem;
                    font-weight: 700;
                    margin-bottom: 1.5rem;
                    color: #0f172a;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }
                .benefits-list {
                    list-style: none;
                    padding: 0;
                }
                .benefits-list li {
                    padding-left: 1.5rem;
                    position: relative;
                    margin-bottom: 1rem;
                    color: #475569;
                    font-weight: 500;
                    line-height: 1.5;
                }
                .benefits-list li::before {
                    content: "✓";
                    position: absolute;
                    left: 0;
                    color: #10b981;
                    font-weight: 900;
                }
                @media (max-width: 768px) {
                    .benefits-grid { grid-template-columns: 1fr; gap: 2rem; }
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
                            Explore world-class courses from top institutions. Start your journey toward global excellence today.
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
                    <div className="section">
                        <div className="benefits-header">
                            <h2 className="benefits-title">Why Choose Shark Edutech?</h2>
                            <p className="benefits-subtitle">We don't just provide education; we build world-class hospitality careers.</p>
                        </div>
                        
                        <div className="benefits-grid">
                            <div className="benefits-group">
                                <h3 className="group-title">Premium Facilities</h3>
                                <ul className="benefits-list">
                                    <li>Well-equipped Training Kitchen & Bakery</li>
                                    <li>Housekeeping Practice Room</li>
                                    <li>Grooming & personality development sessions</li>
                                    <li>Industry visits, workshops & seminars</li>
                                    <li>Internship & placement support through SHARK lifetime</li>
                                    <li>Education Loan at 0% interest</li>
                                    <li>Health insurance across all hospitals in India</li>
                                </ul>
                            </div>
                            <div className="benefits-group">
                                <h3 className="group-title">Our Achievements</h3>
                                <ul className="benefits-list">
                                    <li>Consistent student placements</li>
                                    <li>100% assured placement support</li>
                                    <li>Strong industry collaborations across India</li>
                                    <li>Industrial Training & Apprenticeship programs</li>
                                    <li>Positive recognition from hospitality partners</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>


                <main className="section">
                    {loading ? (
                        <div className="loading-shell">
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Fetching latest courses...</h2>
                        </div>
                    ) : (
                        <div className="job-list">
                            {filteredCourses.length > 0 ? (
                                filteredCourses.map(course => {
                                    const college = colleges.find(c => c.id === course.collegeId);
                                    return (
                                        <div key={course.id} className="job-card">
                                            <div className="job-logo">
                                                {college?.logoUrl ? (
                                                    <img src={college.logoUrl} alt={college.name} />
                                                ) : (
                                                    college?.name[0] || "H"
                                                )}
                                            </div>

                                            <div className="job-info">
                                                <h3 className="job-title">{course.title}</h3>
                                                <div className="job-meta">
                                                    <span>🏢 {college?.name}</span>
                                                    <span>📍 {college?.location}</span>
                                                    <span>🕒 {course.duration || "3 Years"}</span>
                                                </div>
                                                <div className="job-tags">
                                                    <span className="job-badge">{course.level || "Degree"}</span>
                                                    <span className="job-badge">{course.mode || "Regular"}</span>
                                                    {course.scholarshipAvailable && (
                                                        <span className="job-badge" style={{ background: '#ecfdf5', color: '#047857', borderColor: '#d1fae5' }}>
                                                            Scholarship
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="job-right">
                                                <div className="job-salary">
                                                    ₹{course.fee?.toLocaleString() || "TBD"}
                                                    <span style={{ fontSize: '0.8rem', color: '#64748b', marginLeft: '0.5rem', fontWeight: 600 }}>
                                                        Total Fee
                                                    </span>
                                                </div>
                                                <button
                                                    className="job-action"
                                                    onClick={() => router.push(`/admissions/colleges/${college?.id}#apply`)}
                                                >
                                                    Apply with One Click
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
                                    No courses found matching your criteria.
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </div>
        </>
    );
}
