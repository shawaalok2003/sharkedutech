"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./AdmissionsExplorer.module.css";

let globalCoursesCache: any[] | null = null;
let globalCollegesCache: any[] | null = null;

const accreditationFilters = ["All Accreditations", "NCHMCT", "UGC Approved", "AICTE", "NAAC A+"];
const courseLevelFilters = ["All Courses", "Bachelor Degree", "Diploma", "Master Degree", "Certification"];

export default function AdmissionsExplorerPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const [courses, setCourses] = useState<any[]>(() => globalCoursesCache || []);
    const [colleges, setColleges] = useState<any[]>(() => globalCollegesCache || []);
    const [loading, setLoading] = useState<boolean>(() => !globalCoursesCache || globalCoursesCache.length === 0);

    // Filters
    const [searchTerm, setSearchTerm] = useState("");
    const [locationTerm, setLocationTerm] = useState("");
    const [selectedAccreditation, setSelectedAccreditation] = useState("All Accreditations");
    const [selectedLevel, setSelectedLevel] = useState("All Courses");

    useEffect(() => {
        let isMounted = true;

        async function fetchData() {
            try {
                const [coursesRes, collegesRes] = await Promise.all([
                    fetch('/api/admissions/courses'),
                    fetch('/api/admissions/colleges')
                ]);

                if (coursesRes.ok) {
                    const data = await coursesRes.json();
                    const validData = Array.isArray(data) ? data.filter(c => c.title && c.title.trim().length > 2) : [];
                    if (isMounted) {
                        globalCoursesCache = validData;
                        setCourses(validData);
                    }
                }
                if (collegesRes.ok) {
                    const collegesData = await collegesRes.json();
                    if (isMounted) {
                        globalCollegesCache = collegesData;
                        setColleges(collegesData);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch admissions data", error);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        fetchData();

        return () => {
            isMounted = false;
        };
    }, []);

    // Filter courses & colleges
    const filteredCourses = courses.filter(course => {
        const college = colleges.find(c => c.id === course.collegeId) || course.college || {};
        const titleLower = (course.title || "").toLowerCase();
        const collegeNameLower = (college.name || course.collegeName || "").toLowerCase();
        const locLower = (college.city || college.state || course.location || "").toLowerCase();

        const matchesSearch = searchTerm === "" || 
            titleLower.includes(searchTerm.toLowerCase()) ||
            collegeNameLower.includes(searchTerm.toLowerCase());

        const matchesLocation = locationTerm === "" || 
            locLower.includes(locationTerm.toLowerCase());

        const matchesAccreditation = selectedAccreditation === "All Accreditations" ||
            (college.accreditation && college.accreditation.toLowerCase().includes(selectedAccreditation.toLowerCase())) ||
            (course.description && course.description.toLowerCase().includes(selectedAccreditation.toLowerCase()));

        const matchesLevel = selectedLevel === "All Courses" ||
            titleLower.includes(selectedLevel.toLowerCase()) ||
            (course.degreeType && course.degreeType.toLowerCase().includes(selectedLevel.toLowerCase()));

        return matchesSearch && matchesLocation && matchesAccreditation && matchesLevel;
    });

    return (
        <div className={styles.container}>
            {/* Header Banner */}
            <div className={styles.heroHeader}>
                <div className={styles.heroBadge}>🎓 SHARK EDUTECH ADMISSIONS PORTAL</div>
                <h1 className={styles.heroTitle}>
                    Direct Admission into Top UGC &amp; NCHMCT Recognized Colleges
                </h1>
                <p className={styles.heroSubtitle}>
                    100% Assured Placement Assistance in 5-Star Hotel Properties, 0% Interest Education Loan Support &amp; Lifetime Career Support.
                </p>
                
                <div className={styles.highlightsBar}>
                    <span>✅ 100% Assured Placement</span>
                    <span>✅ Taj, Marriott &amp; Hyatt Tie-ups</span>
                    <span>✅ 0% Interest Loan Support</span>
                    <span>✅ Lifetime Placement Support</span>
                </div>
            </div>

            {/* Split Explorer View */}
            <div className={styles.splitLayout}>
                {/* Left Column: Filter Controls */}
                <div className={styles.filterPane}>
                    <h3 className={styles.filterPaneTitle}>🔍 Filter Admissions</h3>
                    
                    <div className={styles.filterGroup}>
                        <label className={styles.filterLabel}>College or Course Name</label>
                        <input 
                            type="text" 
                            placeholder="e.g. B.Sc. Hotel Management, IHM"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={styles.filterInput}
                        />
                    </div>

                    <div className={styles.filterGroup}>
                        <label className={styles.filterLabel}>City / Location</label>
                        <input 
                            type="text" 
                            placeholder="e.g. Kolkata, Delhi, Bengaluru"
                            value={locationTerm}
                            onChange={(e) => setLocationTerm(e.target.value)}
                            className={styles.filterInput}
                        />
                    </div>

                    <div className={styles.filterGroup}>
                        <label className={styles.filterLabel}>Accreditation &amp; Affiliation</label>
                        <select 
                            value={selectedAccreditation}
                            onChange={(e) => setSelectedAccreditation(e.target.value)}
                            className={styles.filterSelect}
                        >
                            {accreditationFilters.map(a => (
                                <option key={a} value={a}>{a}</option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.filterGroup}>
                        <label className={styles.filterLabel}>Course Level</label>
                        <select 
                            value={selectedLevel}
                            onChange={(e) => setSelectedLevel(e.target.value)}
                            className={styles.filterSelect}
                        >
                            {courseLevelFilters.map(l => (
                                <option key={l} value={l}>{l}</option>
                            ))}
                        </select>
                    </div>

                    <button 
                        onClick={() => {
                            setSearchTerm("");
                            setLocationTerm("");
                            setSelectedAccreditation("All Accreditations");
                            setSelectedLevel("All Courses");
                        }}
                        className={styles.resetBtn}
                    >
                        Reset All Filters
                    </button>
                </div>

                {/* Right Column: College Courses Cards List */}
                <div className={styles.listingsPane}>
                    <div className={styles.listingsHeader}>
                        <h2 className={styles.listingsTitle}>Available Hospitality &amp; Hotel Management Programs</h2>
                        <span className={styles.listingsCount}>{filteredCourses.length} accredited courses found</span>
                    </div>

                    {loading ? (
                        <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
                            ⏳ Loading accredited college courses...
                        </div>
                    ) : filteredCourses.length === 0 ? (
                        <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b', background: '#ffffff', borderRadius: '1rem', border: '1px solid #e2e8f0' }}>
                            No courses match your search criteria. Click <strong>Reset All Filters</strong> to view all programs.
                        </div>
                    ) : (
                        <div className={styles.coursesGrid}>
                            {filteredCourses.map((course) => {
                                const college = colleges.find(c => c.id === course.collegeId) || course.college || {};
                                const collegeName = college.name || course.collegeName || "Accredited Hospitality Institute";
                                const location = college.city ? `${college.city}, ${college.state}` : (course.location || "Pan India");

                                return (
                                    <div key={course.id} className={styles.courseCard}>
                                        <div className={styles.cardHeaderRow}>
                                            <div>
                                                <span className={styles.accreditationBadge}>
                                                    {college.accreditation || "UGC & NCHMCT Recognized"}
                                                </span>
                                                <h3 className={styles.courseTitle}>{course.title}</h3>
                                                <div className={styles.collegeNameText}>🎓 {collegeName}</div>
                                            </div>
                                        </div>

                                        <div className={styles.cardMetaRow}>
                                            <span>📍 {location}</span>
                                            <span>⏱️ {course.duration || '3 Years'}</span>
                                            <span>💰 {course.fee ? `₹${Number(course.fee).toLocaleString()} Total` : 'Stipend / Loan Available'}</span>
                                        </div>

                                        <p className={styles.courseDesc}>
                                            {course.description || "Comprehensive degree/diploma program covering Front Office, F&B Service, Food Production, Housekeeping, and 5-Star Hotel Internship."}
                                        </p>

                                        <div className={styles.cardPerksRow}>
                                            <span>🍳 Training Kitchen Lab</span>
                                            <span>💳 0% Interest Loan</span>
                                            <span>⭐ 100% Placement Support</span>
                                        </div>

                                        <div className={styles.cardFooterRow}>
                                            <Link href={`/admissions/colleges/${college.id || course.collegeId || '1'}`} className={styles.viewDetailBtn}>
                                                View College Details &amp; Apply ↗
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
