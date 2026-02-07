"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useEffect, useState } from "react";

type Course = {
    id: string;
    title: string;
    duration?: string | null;
    seats?: number | null;
    status: string;
    collegeId?: string;
    level?: string | null;
    fee?: number | null;
    description?: string | null;
    code?: string | null;
    mode?: string | null;
    eligibility?: string | null;
    admissionCriteria?: string | null;
    intakeMonth?: string | null;
    applicationDeadline?: string | null;
    syllabusUrl?: string | null;
    scholarshipAvailable?: boolean | null;
    placementSupport?: boolean | null;
    feesBreakup?: string | null;
};

type College = {
    id: string;
    name: string;
};

export default function CoursesPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [colleges, setColleges] = useState<College[]>([]);
    const [selectedCollegeId, setSelectedCollegeId] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState("");
    const [duration, setDuration] = useState("");
    const [seats, setSeats] = useState(0);
    const [level, setLevel] = useState("");
    const [fee, setFee] = useState(0);
    const [description, setDescription] = useState("");
    const [code, setCode] = useState("");
    const [mode, setMode] = useState("");
    const [eligibility, setEligibility] = useState("");
    const [admissionCriteria, setAdmissionCriteria] = useState("");
    const [intakeMonth, setIntakeMonth] = useState("");
    const [applicationDeadline, setApplicationDeadline] = useState("");
    const [syllabusUrl, setSyllabusUrl] = useState("");
    const [scholarshipAvailable, setScholarshipAvailable] = useState(false);
    const [placementSupport, setPlacementSupport] = useState(false);
    const [feesBreakup, setFeesBreakup] = useState("");
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        async function fetchData() {
            const [coursesRes, collegesRes] = await Promise.all([
                fetch("/api/admissions/courses"),
                fetch("/api/admissions/colleges")
            ]);
            if (coursesRes.ok) {
                const data = await coursesRes.json();
                setCourses(data);
            }
            if (collegesRes.ok) {
                const collegesData = await collegesRes.json();
                setColleges(collegesData);
                if (collegesData[0]?.id) setSelectedCollegeId(collegesData[0].id);
            }
            setLoading(false);
        }
        fetchData();
    }, []);

    const createCourse = async () => {
        setCreating(true);
        try {
            if (!selectedCollegeId) {
                alert("Please select a college");
                return;
            }
            const res = await fetch("/api/admissions/courses", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    level,
                    duration,
                    seats,
                    fee,
                    status: "Active",
                    description,
                    collegeId: selectedCollegeId,
                    code,
                    mode,
                    eligibility,
                    admissionCriteria,
                    intakeMonth,
                    applicationDeadline,
                    syllabusUrl,
                    scholarshipAvailable,
                    placementSupport,
                    feesBreakup
                })
            });
            if (res.ok) {
                const data = await res.json();
                setCourses(prev => [data, ...prev]);
                setTitle("");
                setDuration("");
                setSeats(0);
                setLevel("");
                setFee(0);
                setDescription("");
                setCode("");
                setMode("");
                setEligibility("");
                setAdmissionCriteria("");
                setIntakeMonth("");
                setApplicationDeadline("");
                setSyllabusUrl("");
                setScholarshipAvailable(false);
                setPlacementSupport(false);
                setFeesBreakup("");
            }
        } finally {
            setCreating(false);
        }
    };

    return (
        <>
            <style jsx>{`
                .courses-container {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }
                .page-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    gap: 1rem;
                    flex-wrap: wrap;
                }
                .header-content {
                    flex: 1;
                }
                .page-title {
                    font-size: 1.75rem;
                    font-weight: 700;
                    color: var(--primary);
                    margin: 0 0 0.25rem;
                }
                .page-subtitle {
                    color: var(--muted-foreground);
                    margin: 0;
                    font-size: 0.875rem;
                }
                .courses-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                    gap: 1.25rem;
                }
                .course-card-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    gap: 0.75rem;
                }
                .status-badge {
                    font-size: 0.7rem;
                    padding: 0.25rem 0.5rem;
                    border-radius: 4px;
                    white-space: nowrap;
                }
                .course-stats {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-top: 0.75rem;
                    gap: 0.5rem;
                    flex-wrap: wrap;
                }
                .create-form-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 0.75rem;
                }
                .form-input {
                    padding: 0.65rem 0.75rem;
                    border-radius: var(--radius);
                    border: 1px solid var(--border);
                    font-size: 0.875rem;
                }
                .form-full {
                    grid-column: span 2;
                }
                .checkbox-label {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.875rem;
                    cursor: pointer;
                }

                @media (max-width: 768px) {
                    .page-header {
                        flex-direction: column;
                        align-items: stretch;
                    }
                    .page-header button {
                        width: 100%;
                    }
                    .courses-grid {
                        grid-template-columns: 1fr;
                    }
                    .create-form-grid {
                        grid-template-columns: 1fr;
                    }
                    .form-full {
                        grid-column: span 1;
                    }
                    .course-stats {
                        flex-direction: column;
                        align-items: stretch;
                    }
                    .course-stats button {
                        width: 100%;
                    }
                }
                @media (max-width: 480px) {
                    .page-title {
                        font-size: 1.5rem;
                    }
                    .course-card-header {
                        flex-direction: column;
                    }
                }
            `}</style>
            <div className="courses-container">
                <div className="page-header">
                    <div className="header-content">
                        <h1 className="page-title">Manage Courses</h1>
                        <p className="page-subtitle">Add or update your institute's course offerings.</p>
                    </div>
                    <Button onClick={createCourse} disabled={creating || !title}>+ Add New Course</Button>
                </div>

                <div className="courses-grid">
                    {loading ? (
                        <div style={{ color: 'var(--muted-foreground)' }}>Loading courses...</div>
                    ) : courses.map((course) => (
                        <Card key={course.id}>
                            <CardHeader>
                                <div className="course-card-header">
                                    <CardTitle style={{ fontSize: '1rem' }}>{course.title}</CardTitle>
                                    <span className="status-badge" style={{
                                        backgroundColor: course.status === 'Active' ? 'var(--success-light)' : 'var(--muted)',
                                        color: course.status === 'Active' ? 'var(--success)' : 'var(--muted-foreground)'
                                    }}>{course.status}</span>
                                </div>
                                <CardDescription style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>
                                    Duration: {course.duration || "-"} • Level: {course.level || "-"}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="course-stats">
                                    <div style={{ fontWeight: 600, color: 'var(--primary)', fontSize: '0.875rem' }}>
                                        {course.seats ?? 0} Seats • ₹{course.fee ?? 0}
                                    </div>
                                    <Button variant="outline" size="sm">Edit</Button>
                                </div>
                                {course.eligibility && (
                                    <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--muted-foreground)', margin: '0.75rem 0 0' }}>
                                        Eligibility: {course.eligibility}
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Create Course</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="create-form-grid">
                            <select value={selectedCollegeId} onChange={(e) => setSelectedCollegeId(e.target.value)} className="form-input">
                                <option value="">Select College</option>
                                {colleges.map(college => (
                                    <option key={college.id} value={college.id}>{college.name}</option>
                                ))}
                            </select>
                            <input placeholder="Course title" value={title} onChange={(e) => setTitle(e.target.value)} className="form-input" />
                            <input placeholder="Course code" value={code} onChange={(e) => setCode(e.target.value)} className="form-input" />
                            <input placeholder="Level (UG/PG/Diploma)" value={level} onChange={(e) => setLevel(e.target.value)} className="form-input" />
                            <input placeholder="Duration" value={duration} onChange={(e) => setDuration(e.target.value)} className="form-input" />
                            <input type="number" placeholder="Seats" value={seats} onChange={(e) => setSeats(Number(e.target.value))} className="form-input" />
                            <input type="number" placeholder="Fee" value={fee} onChange={(e) => setFee(Number(e.target.value))} className="form-input" />
                            <input placeholder="Mode (Full-time/Part-time)" value={mode} onChange={(e) => setMode(e.target.value)} className="form-input" />
                            <input placeholder="Intake Month" value={intakeMonth} onChange={(e) => setIntakeMonth(e.target.value)} className="form-input" />
                            <input placeholder="Application Deadline" value={applicationDeadline} onChange={(e) => setApplicationDeadline(e.target.value)} className="form-input" />
                            <input placeholder="Syllabus URL" value={syllabusUrl} onChange={(e) => setSyllabusUrl(e.target.value)} className="form-input" />
                            <input placeholder="Eligibility" value={eligibility} onChange={(e) => setEligibility(e.target.value)} className="form-input" />
                            <input placeholder="Admission Criteria" value={admissionCriteria} onChange={(e) => setAdmissionCriteria(e.target.value)} className="form-input" />
                            <textarea placeholder="Course description" value={description} onChange={(e) => setDescription(e.target.value)} className={`form-input ${' form-full'}`} />
                            <textarea placeholder="Fees breakup" value={feesBreakup} onChange={(e) => setFeesBreakup(e.target.value)} className={`form-input ${' form-full'}`} />
                            <label className="checkbox-label">
                                <input type="checkbox" checked={scholarshipAvailable} onChange={(e) => setScholarshipAvailable(e.target.checked)} />
                                Scholarship Available
                            </label>
                            <label className="checkbox-label">
                                <input type="checkbox" checked={placementSupport} onChange={(e) => setPlacementSupport(e.target.checked)} />
                                Placement Support
                            </label>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
