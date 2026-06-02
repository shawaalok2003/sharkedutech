"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { Space_Grotesk } from "next/font/google";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

const spaceGrotesk = Space_Grotesk({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
});

interface Job {
    id: string;
    title: string;
    type: string;
    companyName?: string;
    location: string;
    salaryMin: number;
    salaryMax: number;
    description: string;
    questions?: string;
    employer: { name: string };
}

export default function JobApplyPage() {
    const { id } = useParams();
    const { data: session, status } = useSession();
    const router = useRouter();

    const [job, setJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);
    const [resumeUrl, setResumeUrl] = useState("");
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push(`/auth/signin?callbackUrl=/jobs/apply/${id}`);
            return;
        }

        async function fetchJob() {
            try {
                const res = await fetch(`/api/jobs/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setJob(data);
                } else {
                    setError("Job not found");
                }
            } catch (err) {
                setError("Failed to load job details");
            } finally {
                setLoading(false);
            }
        }

        if (id) fetchJob();

        // Check if user already has a resume in their profile
        fetch("/api/profile")
            .then((res) => res.json())
            .then((data) => {
                if (data.resumeUrl) setResumeUrl(data.resumeUrl);
            })
            .catch(() => { });
    }, [id, status, router]);

    const handleApply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!resumeUrl) {
            alert("Please upload your resume");
            return;
        }

        setApplying(true);
        try {
            const res = await fetch("/api/applications", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    jobId: id,
                    resumeUrl,
                    answers: JSON.stringify(answers),
                }),
            });

            if (res.ok) {
                router.push("/applications/success");
            } else {
                const data = await res.json();
                alert(data.error || "Failed to submit application");
            }
        } catch (err) {
            alert("An error occurred. Please try again.");
        } finally {
            setApplying(false);
        }
    };

    if (loading) {
        return (
            <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc" }}>
                <div style={{ textAlign: "center", color: "#64748b" }}>Loading application flow...</div>
            </div>
        );
    }

    if (error || !job) {
        return (
            <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc" }}>
                <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "1rem" }}>{error || "Job not found"}</div>
                    <Link href="/jobs">
                        <Button>Back to Careers</Button>
                    </Link>
                </div>
            </div>
        );
    }

    const screeningQuestions = job.questions ? JSON.parse(job.questions) : [];

    return (
        <div className={spaceGrotesk.className} style={{ minHeight: "100vh", background: "#f8fafc", padding: "4rem 1.5rem" }}>
            <style jsx>{`
                .container {
                    max-width: 1200px;
                    margin: 0 auto;
                }
                .split-layout {
                    display: grid;
                    grid-template-columns: 1.2fr 1fr;
                    gap: 2.5rem;
                    align-items: start;
                }
                .job-details-panel {
                    background: #ffffff;
                    border: 1px solid #e2e8f0;
                    border-radius: 2rem;
                    padding: 2.5rem;
                    box-shadow: 0 20px 25px -5px rgba(15, 23, 42, 0.08);
                }
                .details-section h3 {
                    font-size: 1.25rem;
                    font-weight: 800;
                    color: #0f172a;
                    margin-top: 0;
                    margin-bottom: 1rem;
                    border-bottom: 2px solid #f1f5f9;
                    padding-bottom: 0.5rem;
                }
                .details-text {
                    font-size: 0.95rem;
                    color: #475569;
                    line-height: 1.7;
                    white-space: pre-wrap;
                }
                .header {
                    margin-bottom: 3rem;
                }
                .back-link {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: #64748b;
                    text-decoration: none;
                    font-size: 0.9rem;
                    font-weight: 600;
                    margin-bottom: 1.5rem;
                    transition: color 0.2s;
                }
                .back-link:hover {
                    color: #0f172a;
                }
                .card {
                    background: #ffffff;
                    border: 1px solid #e2e8f0;
                    border-radius: 2rem;
                    padding: 2.5rem;
                    box-shadow: 0 20px 25px -5px rgba(15, 23, 42, 0.08);
                }
                .job-summary {
                    padding-bottom: 2rem;
                    border-bottom: 1px solid #f1f5f9;
                    margin-bottom: 2.5rem;
                }
                .title {
                    font-size: 2.2rem;
                    font-weight: 800;
                    color: #0f172a;
                    margin-bottom: 0.75rem;
                }
                .company {
                    font-size: 1.1rem;
                    color: #64748b;
                    font-weight: 600;
                }
                .meta {
                    display: flex;
                    gap: 1.5rem;
                    margin-top: 1.5rem;
                    font-size: 0.9rem;
                    color: #64748b;
                    font-weight: 500;
                }
                .section {
                    margin-bottom: 2.5rem;
                }
                .section-title {
                    font-size: 1.25rem;
                    font-weight: 800;
                    color: #0f172a;
                    margin-bottom: 1.5rem;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }
                .label {
                    display: block;
                    font-size: 0.95rem;
                    font-weight: 700;
                    color: #1e293b;
                    margin-bottom: 0.75rem;
                }
                .upload-box {
                    border: 2px dashed #e2e8f0;
                    border-radius: 1.5rem;
                    padding: 3rem;
                    text-align: center;
                    background: #f8fafc;
                    transition: all 0.2s;
                }
                .upload-box:hover {
                    border-color: #0f172a;
                    background: #f1f5f9;
                }
                .input {
                    width: 100%;
                    padding: 1rem;
                    border: 1px solid #e2e8f0;
                    border-radius: 0.75rem;
                    font-size: 1rem;
                    margin-bottom: 1.5rem;
                    transition: border-color 0.2s;
                }
                .input:focus {
                    outline: none;
                    border-color: #0f172a;
                }
                .submit-btn {
                    width: 100%;
                    padding: 1.25rem;
                    background: #0f172a;
                    color: white;
                    border: none;
                    border-radius: 1rem;
                    font-size: 1.1rem;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .submit-btn:hover {
                    background: #1e293b;
                    transform: translateY(-2px);
                }
                .submit-btn:disabled {
                    background: #94a3b8;
                    cursor: not-allowed;
                    transform: none;
                }
                @media (max-width: 968px) {
                    .split-layout {
                        grid-template-columns: 1fr;
                        gap: 2rem;
                    }
                }
            `}</style>

            <div className="container">
                <div className="header">
                    <Link href="/jobs" className="back-link">
                        ← Back to Careers
                    </Link>
                    <div className="job-summary">
                        <div className="company">{job.companyName || job.employer.name}</div>
                        <h1 className="title">{job.title}</h1>
                        <div className="meta">
                            <span>📍 {job.location}</span>
                            <span>•</span>
                            <span>💼 {job.type}</span>
                            <span>•</span>
                            <span style={{ color: "#0f172a", fontWeight: 700 }}>
                                ₹{job.salaryMin ? (job.salaryMin / 100000).toFixed(1) : "NA"}L - {job.salaryMax ? (job.salaryMax / 100000).toFixed(1) : "NA"}L
                            </span>
                        </div>
                    </div>
                </div>

                <div className="split-layout">
                    <div className="job-details-panel">
                        <div className="details-section">
                            <h3>Job Description</h3>
                            <div className="details-text">{job.description}</div>
                        </div>
                        {job.requirements && (
                            <div className="details-section" style={{ marginTop: "2rem" }}>
                                <h3>Requirements</h3>
                                <div className="details-text">{job.requirements}</div>
                            </div>
                        )}
                    </div>

                    <form onSubmit={handleApply} className="card" style={{ marginTop: 0 }}>
                        <div className="section">
                            <h2 className="section-title">
                                <span style={{ width: 8, height: 8, borderRadius: 999, background: "#0f172a" }}></span>
                                Resume Attachment
                            </h2>
                            {resumeUrl ? (
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.5rem", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "1rem" }}>
                                    <div>
                                        <div style={{ fontWeight: 700, color: "#166534" }}>Resume Ready</div>
                                        <div style={{ fontSize: "0.85rem", color: "#15803d" }}>Your document is attached and secure.</div>
                                    </div>
                                    <Button variant="ghost" size="sm" type="button" onClick={() => setResumeUrl("")}>Change</Button>
                                </div>
                            ) : (
                                <div className="upload-box">
                                    <label style={{ cursor: "pointer" }}>
                                        <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>📄</div>
                                        <div style={{ fontWeight: 700, marginBottom: "0.5rem" }}>Upload your Resume (PDF)</div>
                                        <div style={{ fontSize: "0.85rem", color: "#64748b" }}>We'll pull your details from here.</div>
                                        <input
                                            type="file"
                                            accept="application/pdf"
                                            style={{ display: "none" }}
                                            required
                                            onChange={async (e) => {
                                                const file = e.target.files?.[0];
                                                if (!file) return;
                                                const formData = new FormData();
                                                formData.append("file", file);
                                                try {
                                                    const res = await fetch("/api/upload", { method: "POST", body: formData });
                                                    if (res.ok) {
                                                        const data = await res.json();
                                                        setResumeUrl(data.url);
                                                    }
                                                } catch (err) {
                                                    alert("Upload failed. Please try again.");
                                                }
                                            }}
                                        />
                                    </label>
                                </div>
                            )}
                        </div>

                        {screeningQuestions.length > 0 && (
                            <div className="section">
                                <h2 className="section-title">
                                    <span style={{ width: 8, height: 8, borderRadius: 999, background: "#0f172a" }}></span>
                                    Screening Questions
                                </h2>
                                {screeningQuestions.map((q: string, i: number) => (
                                    <div key={i}>
                                        <label className="label">{q}</label>
                                        <input
                                            required
                                            value={answers[q] || ""}
                                            onChange={(e) => setAnswers((prev) => ({ ...prev, [q]: e.target.value }))}
                                            className="input"
                                            placeholder="Type your answer here..."
                                        />
                                    </div>
                                ))}
                            </div>
                        )}

                        <button type="submit" className="submit-btn" disabled={applying || !resumeUrl}>
                            {applying ? "Perfecting Application..." : "Submit Application"}
                        </button>
                        <p style={{ textAlign: "center", color: "#64748b", fontSize: "0.8rem", marginTop: "1.5rem" }}>
                            By submitting, you agree to our Terms of Service.
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
