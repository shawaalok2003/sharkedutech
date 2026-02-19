"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ApplicationsPage() {
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

    const completedSteps = journeySteps.filter(step => step.done).length;
    const progressPercent = Math.round((completedSteps / journeySteps.length) * 100);
    const progressLabel = completedSteps === journeySteps.length
        ? "Completed"
        : completedSteps >= 3
            ? "Under Review"
            : "In Progress";

    const interviewAt = applications[0]?.interviewAt ? new Date(applications[0].interviewAt) : null;
    const interviewDate = interviewAt
        ? interviewAt.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })
        : "Schedule Pending";
    const interviewTime = interviewAt
        ? interviewAt.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
        : "Time TBD";

    return (
        <>
            <style jsx>{`
                * { box-sizing: border-box; }
                .layout-wrapper { 
                    min-height: 100vh; 
                    background: #FFFFFF;
                }

                /* Main Content */
                .main-content {
                    overflow-y: auto;
                }
                .content-container {
                    max-width: 1024px;
                    margin: 0 auto;
                    padding: 4rem 3rem;
                }

                /* Header */
                .page-header {
                    margin-bottom: 4rem;
                }
                .header-flex {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    margin-bottom: 1.5rem;
                }
                .status-badge {
                    display: inline-block;
                    padding: 0.375rem 1rem;
                    border-radius: 9999px;
                    background: rgba(16, 185, 129, 0.1);
                    color: #10B981;
                    font-size: 11px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    margin-bottom: 1rem;
                }
                .page-title {
                    font-size: 3rem;
                    font-weight: 700;
                    letter-spacing: -0.02em;
                    color: #0A1128;
                    margin-bottom: 0.75rem;
                }
                .page-subtitle {
                    color: #64748b;
                    font-weight: 500;
                }
                .progress-stat {
                    text-align: right;
                }
                .progress-value {
                    font-size: 2.25rem;
                    font-weight: 700;
                    color: #0A1128;
                }
                .progress-label {
                    font-size: 10px;
                    color: #94a3b8;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.15em;
                }
                .global-progress-bar {
                    height: 6px;
                    width: 100%;
                    background: #f1f5f9;
                    border-radius: 9999px;
                    overflow: hidden;
                }
                .global-progress-fill {
                    height: 100%;
                    background: #10B981;
                    transition: width 0.5s;
                }

                /* Timeline */
                .timeline {
                    position: relative;
                }
                .timeline-line {
                    position: absolute;
                    left: 28px;
                    top: 0;
                    bottom: 0;
                    width: 1px;
                    background: #e2e8f0;
                }
                .timeline-progress {
                    position: absolute;
                    left: 28px;
                    top: 0;
                    width: 1px;
                    background: #10B981;
                }
                .timeline-steps {
                    display: flex;
                    flex-direction: column;
                    gap: 3rem;
                    position: relative;
                    z-index: 10;
                }
                .step-item {
                    display: flex;
                    gap: 2.5rem;
                }
                .step-icon {
                    width: 56px;
                    height: 56px;
                    border-radius: 50%;
                    background: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                    font-size: 1.5rem;
                }
                .step-completed .step-icon {
                    border: 1px solid #10B981;
                    color: #10B981;
                }
                .step-current .step-icon {
                    border: 2px solid #D4AF37;
                    color: #D4AF37;
                    box-shadow: 0 0 20px rgba(212, 175, 55, 0.2);
                }
                .step-pending .step-icon {
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    color: #94a3b8;
                }
                .step-content {
                    flex: 1;
                    background: white;
                    border: 1px solid #f1f5f9;
                    border-radius: 24px;
                    padding: 2rem;
                    box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.04);
                }
                .step-current .step-content {
                    border: 2px solid rgba(212, 175, 55, 0.2);
                }
                .step-pending {
                    opacity: 0.4;
                }
                .step-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 0.75rem;
                }
                .step-title {
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: #0A1128;
                }
                .step-date {
                    font-size: 10px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.15em;
                }
                .step-completed .step-date {
                    color: #10B981;
                }
                .step-description {
                    color: #64748b;
                    font-size: 0.875rem;
                    line-height: 1.6;
                }
                .priority-badge {
                    display: inline-block;
                    padding: 0.25rem 0.75rem;
                    border-radius: 4px;
                    background: rgba(212, 175, 55, 0.1);
                    color: #D4AF37;
                    font-size: 10px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.15em;
                    margin-bottom: 0.5rem;
                }
                .step-actions {
                    display: flex;
                    gap: 1rem;
                    margin-top: 2rem;
                }
                .btn-primary {
                    background: #0A1128;
                    color: white;
                    font-weight: 700;
                    padding: 0.875rem 2rem;
                    border-radius: 12px;
                    font-size: 0.875rem;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    border: none;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .btn-primary:hover {
                    background: #1a2238;
                }
                .btn-secondary {
                    border: 1px solid #e2e8f0;
                    color: #0A1128;
                    background: white;
                    font-weight: 700;
                    padding: 0.875rem 2rem;
                    border-radius: 12px;
                    font-size: 0.875rem;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .btn-secondary:hover {
                    background: #f8fafc;
                }

                /* Footer Card */
                .footer-card {
                    margin-top: 5rem;
                    padding: 2.5rem;
                    border-radius: 24px;
                    background: #f8fafc;
                    border: 1px solid #f1f5f9;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }
                .footer-title {
                    font-size: 1.125rem;
                    font-weight: 700;
                    margin-bottom: 0.5rem;
                }
                .footer-text {
                    font-size: 0.875rem;
                    color: #64748b;
                    line-height: 1.6;
                    max-width: 28rem;
                }

                /* Responsive */
                @media (max-width: 1024px) {
                    .content-container {
                        padding: 2rem 1.5rem;
                    }
                    .page-title {
                        font-size: 2rem;
                    }
                    .header-flex {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 1rem;
                    }
                    .footer-card {
                        flex-direction: column;
                        gap: 2rem;
                    }
                }
                @media (max-width: 768px) {
                    .step-item {
                        gap: 1.5rem;
                    }
                    .step-icon {
                        width: 48px;
                        height: 48px;
                    }
                    .timeline-line {
                        left: 24px;
                    }
                    .timeline-progress {
                        left: 24px;
                    }
                    .step-actions {
                        flex-direction: column;
                    }
                }
            `}</style>
            <div className="layout-wrapper">
                {/* Main Content */}
                <main className="main-content">
                    <div className="content-container">
                        {/* Header */}
                        <header className="page-header">
                            <div className="header-flex">
                                <div>
                                    <span className="status-badge">{progressLabel}</span>
                                    <h2 className="page-title">Application Progress</h2>
                                    <p className="page-subtitle">
                                        {applications.length > 0
                                            ? `${applications[0].course?.title || "General Admission"} · ${applications[0].college?.name || "Academic Institution"}`
                                            : "Masters of Architecture · Autumn Intake 2024"}
                                    </p>
                                </div>
                                <div className="progress-stat">
                                    <p className="progress-value">{progressPercent}%</p>
                                    <p className="progress-label">Global Progress</p>
                                </div>
                            </div>
                            <div className="global-progress-bar">
                                <div className="global-progress-fill" style={{ width: `${progressPercent}%` }}></div>
                            </div>
                        </header>

                        {/* Timeline */}
                        <div className="timeline">
                            <div className="timeline-line"></div>
                            <div className="timeline-progress" style={{ height: `${(journeySteps.filter(s => s.done).length / journeySteps.length) * 100}%` }}></div>
                            
                            <div className="timeline-steps">
                                <div className={`step-item ${journeySteps[0].done ? "step-completed" : journeySteps[2].done ? "step-pending" : "step-current"}`}>
                                    <div className="step-icon">
                                        {journeySteps[0].done ? "✓" : "📝"}
                                    </div>
                                    <div className="step-content">
                                        <div className="step-header">
                                            <h3 className="step-title">Initial Submission</h3>
                                            <span className="step-date">
                                                {applications.length > 0 && applications[0].createdAt
                                                    ? new Date(applications[0].createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                                                    : "Pending"}
                                            </span>
                                        </div>
                                        <p className="step-description">
                                            All core application forms, personal statements, and creative portfolios have been successfully received.
                                        </p>
                                        {applications.length > 0 && (
                                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.75rem", fontWeight: 600, color: "#94a3b8", marginTop: "1rem" }}>
                                                <span>📎</span>
                                                <span>Application_Form.pdf</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className={`step-item ${journeySteps[1].done ? "step-completed" : journeySteps[0].done ? "step-current" : "step-pending"}`}>
                                    <div className="step-icon">
                                        {journeySteps[1].done ? "✓" : "📋"}
                                    </div>
                                    <div className="step-content">
                                        <div className="step-header">
                                            <h3 className="step-title">Credential Verification</h3>
                                            <span className="step-date">
                                                {documents.length > 0 ? "Verified" : "In Progress"}
                                            </span>
                                        </div>
                                        <p className="step-description">
                                            Official transcripts and international degree equivalency reports are being processed by our registrar.
                                        </p>
                                    </div>
                                </div>

                                <div className={`step-item ${journeySteps[3].done ? "step-completed" : journeySteps[1].done ? "step-current" : "step-pending"}`}>
                                    <div className="step-icon">
                                        {journeySteps[3].done ? "✓" : "📅"}
                                    </div>
                                    <div className="step-content">
                                        <div className="step-header">
                                            <div>
                                                {!journeySteps[3].done && journeySteps[1].done && (
                                                    <span className="priority-badge">Priority Action</span>
                                                )}
                                                <h3 className="step-title" style={{ fontSize: journeySteps[1].done && !journeySteps[3].done ? "1.5rem" : "1.25rem" }}>
                                                    Faculty Interview
                                                </h3>
                                            </div>
                                            <div style={{ textAlign: "right" }}>
                                                <p style={{ fontSize: "0.875rem", fontWeight: 700, color: "#0A1128", margin: 0 }}>{interviewDate}</p>
                                                <p style={{ fontSize: "10px", color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", margin: 0 }}>{interviewTime}</p>
                                            </div>
                                        </div>
                                        <p className="step-description" style={{ marginBottom: journeySteps[1].done && !journeySteps[3].done ? "2rem" : "0" }}>
                                            A virtual panel interview has been scheduled with members of the Architecture Faculty. Please review the briefing document prior to the meeting.
                                        </p>
                                        {journeySteps[1].done && !journeySteps[3].done && (
                                            <div className="step-actions">
                                                <button className="btn-primary">
                                                    <span>📹</span>
                                                    <span>Launch Meeting</span>
                                                </button>
                                                <button className="btn-secondary">
                                                    Reschedule
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className={`step-item ${journeySteps[3].done ? "step-current" : "step-pending"}`}>
                                    <div className="step-icon">
                                        {journeySteps[4].done ? "✓" : "📊"}
                                    </div>
                                    <div className="step-content">
                                        <div className="step-header">
                                            <h3 className="step-title">Final Committee Review</h3>
                                            {!journeySteps[3].done && <span style={{ fontSize: "1.25rem", color: "#cbd5e1" }}>🔒</span>}
                                        </div>
                                        <p className="step-description">
                                            After the interview process, the admissions committee will convene for final deliberation of all candidates.
                                        </p>
                                    </div>
                                </div>

                                <div className="step-item step-pending">
                                    <div className="step-icon">
                                        {journeySteps[4].done ? "✓" : "🔔"}
                                    </div>
                                    <div className="step-content">
                                        <div className="step-header">
                                            <h3 className="step-title">Official Decision</h3>
                                            <span style={{ fontSize: "1.25rem", color: "#cbd5e1" }}>🔒</span>
                                        </div>
                                        <p className="step-description">
                                            Final results will be released through this portal and followed by an official paper packet via post.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Card */}
                        <footer className="footer-card">
                            <div>
                                <h4 className="footer-title">Technical Difficulties?</h4>
                                <p className="footer-text">
                                    If you encounter issues with the interview link or document upload, contact your admissions coordinator immediately.
                                </p>
                            </div>
                        </footer>
                    </div>
                </main>
            </div>
        </>
    );
}
