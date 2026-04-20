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

    const getStatusColor = (status: string) => {
        if (status === "Approved") return "#10B981";
        if (status === "Rejected") return "#EF4444";
        return "#3B82F6";
    };

    const getProgressPercent = (status: string) => {
        const mapping: Record<string, number> = {
            "Pending": 20,
            "Profile Review": 20,
            "Documents Verification": 40,
            "Application Submitted": 60,
            "College Review": 80,
            "In Review": 80,
            "Approved": 100,
            "Rejected": 100
        };
        return mapping[status] || 20;
    };

    return (
        <>
            <style jsx>{`
                .dashboard-container {
                    padding: 3rem 2rem;
                    max-width: 1200px;
                    margin: 0 auto;
                }
                .header-section {
                    margin-bottom: 3rem;
                }
                .title {
                    font-size: 2.5rem;
                    font-weight: 800;
                    color: #0A1128;
                    letter-spacing: -0.02em;
                    margin-bottom: 0.5rem;
                }
                .subtitle {
                    color: #64748B;
                    font-size: 1.125rem;
                }
                
                .grid-layout {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
                    gap: 2rem;
                }
                
                .app-card {
                    background: white;
                    border: 1px solid #F1F5F9;
                    border-radius: 24px;
                    padding: 1.75rem;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                    overflow: hidden;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
                }
                .app-card:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.08);
                    border-color: #3B82F6;
                }
                
                .college-info {
                    display: flex;
                    gap: 1rem;
                    align-items: center;
                    margin-bottom: 1.5rem;
                }
                .logo-placeholder {
                    width: 48px;
                    height: 48px;
                    border-radius: 12px;
                    background: #F8FAFC;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.25rem;
                    border: 1px solid #E2E8F0;
                }
                .college-name {
                    font-size: 0.875rem;
                    font-weight: 700;
                    color: #64748B;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                .course-title {
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: #0A1128;
                    margin-bottom: 1rem;
                    line-height: 1.3;
                }
                
                .progress-wrapper {
                    margin-top: 1.5rem;
                }
                .progress-header {
                    display: flex;
                    justify-content: space-between;
                    font-size: 0.75rem;
                    font-weight: 700;
                    margin-bottom: 0.5rem;
                    color: #94A3B8;
                }
                .progress-bar-bg {
                    height: 8px;
                    background: #F1F5F9;
                    border-radius: 4px;
                    overflow: hidden;
                }
                .progress-bar-fill {
                    height: 100%;
                    background: #3B82F6;
                    border-radius: 4px;
                    transition: width 0.8s ease-out;
                }
                
                .status-footer {
                    margin-top: 1.5rem;
                    padding-top: 1.5rem;
                    border-top: 1px solid #F1F5F9;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .status-badge {
                    padding: 0.4rem 1rem;
                    border-radius: 9999px;
                    font-size: 0.75rem;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                .dot { width: 6px; height: 6px; border-radius: 50%; }

                .empty-state {
                    text-align: center;
                    padding: 5rem 2rem;
                    background: #F8FAFC;
                    border-radius: 32px;
                    border: 2px dashed #E2E8F0;
                }
                .btn-explore {
                    background: #0A1128;
                    color: white;
                    padding: 1rem 2.5rem;
                    border-radius: 12px;
                    font-weight: 700;
                    border: none;
                    cursor: pointer;
                    margin-top: 1.5rem;
                    transition: opacity 0.2s;
                }

                @media (max-width: 640px) {
                    .dashboard-container { padding: 2rem 1.5rem; }
                    .title { font-size: 2rem; }
                    .grid-layout { grid-template-columns: 1fr; }
                }
            `}</style>

            <div className="dashboard-container">
                <div className="header-section">
                    <h1 className="title">College Applications</h1>
                    <p className="subtitle">Track and manage your admission progress across multiple institutions.</p>
                </div>

                {applications.length > 0 ? (
                    <div className="grid-layout">
                        {applications.map((app) => {
                            const percent = getProgressPercent(app.status);
                            const statusColor = getStatusColor(app.status);
                            
                            return (
                                <div 
                                    key={app.id} 
                                    className="app-card"
                                    onClick={() => router.push(`/admissions/applications/${app.id}`)}
                                >
                                    <div className="college-info">
                                        <div className="logo-placeholder">
                                            {app.college?.logoUrl ? (
                                                <img src={app.college.logoUrl} alt="" style={{ width: "100%", height: "100%", borderRadius: "12px", objectFit: "cover" }} />
                                            ) : "🏫"}
                                        </div>
                                        <span className="college-name">{app.college?.name}</span>
                                    </div>
                                    
                                    <h3 className="course-title">{app.course?.title || "General Admission"}</h3>
                                    
                                    <div className="progress-wrapper">
                                        <div className="progress-header">
                                            <span>PROGRESS</span>
                                            <span>{percent}%</span>
                                        </div>
                                        <div className="progress-bar-bg">
                                            <div 
                                                className="progress-bar-fill" 
                                                style={{ width: `${percent}%`, backgroundColor: statusColor }}
                                            ></div>
                                        </div>
                                    </div>
                                    
                                    <div className="status-footer">
                                        <div className="status-badge" style={{ 
                                            background: `${statusColor}15`, 
                                            color: statusColor 
                                        }}>
                                            <span className="dot" style={{ backgroundColor: statusColor }}></span>
                                            {app.status}
                                        </div>
                                        <span style={{ fontSize: "0.75rem", color: "#94A3B8", fontWeight: 600 }}>
                                            STEP {app.step || 1}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="empty-state">
                        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎓</div>
                        <h3 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#0A1128" }}>No Applications Found</h3>
                        <p style={{ color: "#64748B", marginTop: "0.5rem" }}>You haven't applied to any courses yet. Start your journey today!</p>
                        <button className="btn-explore" onClick={() => router.push("/admissions")}>
                            Explore Courses
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
