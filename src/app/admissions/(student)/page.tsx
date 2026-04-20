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
                    padding: 0.4rem 1rem;
                    border-radius: 9999px;
                    background: #f1f5f9;
                    border: 1px solid #e2e8f0;
                    font-size: 0.7rem;
                    font-weight: 700;
                    letter-spacing: 0.15em;
                    text-transform: uppercase;
                    color: rgba(15, 23, 42, 0.65);
                }

                .hero-title {
                    font-size: 3.5rem;
                    font-weight: 800;
                    line-height: 1.05;
                    letter-spacing: -0.02em;
                    margin-bottom: 1.5rem;
                }

                .hero-subtitle {
                    font-size: 1.25rem;
                    color: #64748b;
                    max-width: 42rem;
                    margin: 0 auto 3rem;
                    line-height: 1.7;
                }

                .profile-btn {
                    padding: 0.75rem 1.5rem;
                    background: #0f172a;
                    color: #ffffff;
                    border-radius: 0.9rem;
                    font-weight: 700;
                    text-decoration: none;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    transition: transform 0.2s ease;
                }

                .profile-btn:hover {
                    transform: translateY(-2px);
                    background: #1e293b;
                }

                .search-shell {
                    max-width: 56rem;
                    margin: 0 auto;
                    background: #ffffff;
                    border: 1px solid #e2e8f0;
                    border-radius: 1.25rem;
                    box-shadow: 0 20px 30px -15px rgba(15, 23, 42, 0.1);
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
                    .hero-title { font-size: 2.5rem; }
                    .job-card { flex-direction: column; align-items: flex-start; text-align: left; }
                    .job-right { align-items: flex-start; text-align: left; width: 100%; }
                    .search-divider { display: none; }
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
