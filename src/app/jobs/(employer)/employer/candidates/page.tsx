"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

interface Application {
    id: string;
    name: string;
    email: string;
    status: string;
    createdAt: string;
    resumeUrl?: string;
    answers?: string;
    adminApproved: boolean;
    jobId: string;
    job?: {
        title: string;
        id: string;
    };
    applicant?: {
        name: string;
        email: string;
        phone?: string;
        skills?: string;
        education?: string;
        experience?: string;
        studentProfile?: {
            photoUrl?: string;
        };
    };
}

function CandidatesContent() {
    const searchParams = useSearchParams();
    const jobIdParam = searchParams.get('jobId');

    const [candidates, setCandidates] = useState<Application[]>([]);
    const [filteredCandidates, setFilteredCandidates] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedStatus, setSelectedStatus] = useState<string>("All");
    const [selectedJob, setSelectedJob] = useState<string>(jobIdParam || "All");
    const [jobs, setJobs] = useState<{ id: string; title: string }[]>([]);
    const [detailModalApp, setDetailModalApp] = useState<Application | null>(null);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        if (jobIdParam) {
            setSelectedJob(jobIdParam);
        }
    }, [jobIdParam]);
    useEffect(() => {
        async function fetchData() {
            try {
                // Fetch applications
                const appRes = await fetch('/api/applications/employer');
                if (appRes.ok) {
                    const data = await appRes.json();
                    setCandidates(data);
                    setFilteredCandidates(data);
                }

                // Fetch all employer jobs for the dropdown
                const jobsRes = await fetch('/api/jobs/employer');
                if (jobsRes.ok) {
                    const jobsData = await jobsRes.json();
                    setJobs(jobsData.map((j: any) => ({ id: j.id, title: j.title })));
                }
            } catch (error) {
                console.error("Failed to fetch data", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    useEffect(() => {
        // Apply filters
        let filtered = candidates;
        if (selectedStatus !== "All") {
            filtered = filtered.filter(c => c.status === selectedStatus);
        }
        if (selectedJob !== "All") {
            filtered = filtered.filter(c => c.jobId === selectedJob || c.job?.id === selectedJob);
        }
        setFilteredCandidates(filtered);
    }, [selectedStatus, selectedJob, candidates]);

    const getStatusStyle = (status: string) => {
        let color = 'var(--foreground)';
        let bg = 'var(--muted)';

        if (status === 'Applied') { color = '#1E40AF'; bg = '#EFF6FF'; }
        if (status === 'Shortlisted') { color = '#065F46'; bg = '#D1FAE5'; }
        if (status === 'Interview') { color = '#065F46'; bg = '#D1FAE5'; }
        if (status === 'Rejected') { color = '#991B1B'; bg = '#FEE2E2'; }

        return { color, backgroundColor: bg };
    };

    const handleStatusUpdate = async (appId: string, newStatus: string) => {
        setUpdating(true);
        try {
            const res = await fetch(`/api/applications/${appId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            if (res.ok) {
                // Update local state
                setCandidates(prev => prev.map(c => c.id === appId ? { ...c, status: newStatus } : c));
                if (detailModalApp?.id === appId) {
                    setDetailModalApp({ ...detailModalApp, status: newStatus });
                }
            } else {
                alert('Failed to update status');
            }
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Error updating status');
        } finally {
            setUpdating(false);
        }
    };

    const openDetailModal = async (app: Application) => {
        try {
            const res = await fetch(`/api/applications/${app.id}`);
            if (res.ok) {
                const fullData = await res.json();
                setDetailModalApp(fullData);
            }
        } catch (error) {
            console.error('Error fetching application details:', error);
        }
    };

    return (
        <>
            <style jsx>{`
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.5);
                    z-index: 50;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 1rem;
                }
                .modal-content {
                    background: white;
                    border-radius: 0.5rem;
                    padding: 1.5rem;
                    width: 90%;
                    max-width: 650px;
                    max-height: 90vh;
                    overflow-y: auto;
                    box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
                }
                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 1.5rem;
                }
                .modal-close-btn {
                    font-size: 1.5rem;
                    color: var(--muted-foreground);
                    cursor: pointer;
                    border: none;
                    background: none;
                    padding: 0;
                }
                .modal-title {
                    font-size: 1.4rem;
                    font-weight: 700;
                    color: var(--primary);
                    margin: 0;
                }
                .modal-subtitle {
                    color: var(--muted-foreground);
                    font-size: 0.875rem;
                    margin: 0.25rem 0 0;
                }
                .section-title {
                    font-size: 1rem;
                    font-weight: 600;
                    margin: 0 0 0.75rem;
                }
                .section {
                    margin-bottom: 1.5rem;
                }
                .info-grid {
                    display: grid;
                    gap: 0.5rem;
                    font-size: 0.875rem;
                }
                .answer-item {
                    padding: 0.75rem;
                    background: var(--muted);
                    border-radius: 0.5rem;
                }
                .answer-question {
                    font-weight: 600;
                    font-size: 0.875rem;
                    margin-bottom: 0.25rem;
                }
                .answer-text {
                    font-size: 0.8rem;
                    color: var(--muted-foreground);
                    white-space: pre-wrap;
                }
                .status-buttons {
                    display: flex;
                    gap: 0.5rem;
                    flex-wrap: wrap;
                }
                .modal-footer {
                    display: flex;
                    justify-content: flex-end;
                    padding-top: 1rem;
                    border-top: 1px solid var(--border);
                    margin-top: 1rem;
                }
                .page-container {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }
                .page-header {
                    margin-bottom: 0.5rem;
                }
                .page-title {
                    font-size: 1.75rem;
                    font-weight: 700;
                    color: var(--primary);
                    margin: 0;
                }
                .page-subtitle {
                    color: var(--muted-foreground);
                    margin: 0.5rem 0 0;
                    font-size: 0.875rem;
                }
                .filters {
                    display: flex;
                    gap: 1rem;
                    flex-wrap: wrap;
                    align-items: flex-end;
                }
                .filter-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.4rem;
                }
                .filter-label {
                    font-size: 0.8rem;
                    font-weight: 500;
                }
                .filter-select {
                    padding: 0.5rem 0.75rem;
                    border-radius: var(--radius);
                    border: 1px solid var(--border);
                    font-size: 0.85rem;
                    min-width: 180px;
                }
                .candidate-count {
                    font-size: 0.8rem;
                    color: var(--muted-foreground);
                    margin-left: auto;
                }
                .candidates-list {
                    display: grid;
                    gap: 1.5rem;
                }
                .candidate-card {
                    display: flex;
                    flex-direction: row;
                    align-items: stretch;
                    justify-content: space-between;
                    background: rgba(255, 255, 255, 0.9);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.5);
                    border-radius: 24px;
                    overflow: hidden;
                    transition: all 0.5s cubic-bezier(0.19, 1, 0.22, 1);
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
                    margin-bottom: 0.5rem;
                }
                .candidate-card:hover {
                    transform: translateY(-8px) scale(1.015);
                    box-shadow: 0 30px 50px -12px rgba(0, 0, 0, 0.15);
                    border-color: var(--primary);
                }
                .status-accent {
                    width: 10px;
                    flex-shrink: 0;
                }
                .card-content-wrapper {
                    display: flex;
                    flex: 1;
                    padding: 1.75rem 2.5rem;
                    align-items: center;
                    justify-content: space-between;
                    gap: 2rem;
                }
                .candidate-avatar {
                    width: 72px;
                    height: 72px;
                    border-radius: 22px;
                    background: linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 900;
                    font-size: 1.75rem;
                    color: var(--primary);
                    flex-shrink: 0;
                    overflow: hidden;
                    border: 4px solid white;
                    box-shadow: 0 15px 30px -5px rgba(0, 0, 0, 0.1);
                }
                .candidate-avatar img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                .candidate-info {
                    display: flex;
                    gap: 1.5rem;
                    align-items: center;
                    flex: 1;
                }
                .candidate-details {
                    flex: 1;
                }
                .candidate-name {
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: #1e293b;
                    margin: 0;
                    letter-spacing: -0.02em;
                }
                .job-pill {
                    display: inline-flex;
                    align-items: center;
                    background: #f0f7ff;
                    color: var(--primary);
                    font-size: 0.75rem;
                    font-weight: 700;
                    padding: 0.25rem 0.75rem;
                    border-radius: 8px;
                    margin-top: 0.5rem;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                .candidate-meta {
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                }
                .candidate-email {
                    font-size: 0.875rem;
                    color: #64748b;
                    font-weight: 500;
                }
                .status-badge {
                    font-size: 0.75rem;
                    padding: 0.4rem 1rem;
                    border-radius: 10px;
                    font-weight: 700;
                    letter-spacing: 0.02em;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
                }
                .candidate-date {
                    font-size: 0.75rem;
                    color: var(--muted-foreground);
                }

                @media (max-width: 768px) {
                    .modal-content {
                        padding: 1.25rem;
                        width: 95%;
                    }
                    .filters {
                        flex-direction: column;
                        align-items: stretch;
                    }
                    .filter-select {
                        width: 100%;
                    }
                    .candidate-count {
                        margin-left: 0;
                        margin-top: 0.5rem;
                    }
                    .candidate-card {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 0.75rem;
                    }
                    .candidate-info {
                        width: 100%;
                    }
                    .candidate-meta {
                        width: 100%;
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 0.5rem;
                    }
                    .status-bullets {
                        gap: 0.5rem;
                    }
                    .status-buttons {
                        width: 100%;
                    }
                    .status-buttons button {
                        flex: 1;
                    }
                }
                @media (max-width: 480px) {
                    .page-title {
                        font-size: 1.5rem;
                    }
                    .modal-title {
                        font-size: 1.2rem;
                    }
                    .candidate-name {
                        font-size: 0.95rem;
                    }
                    .candidate-avatar {
                        width: 40px;
                        height: 40px;
                        font-size: 1rem;
                    }
                }
            `}</style>

            {/* Detail Modal */}
            {detailModalApp && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <div>
                                <h2 className="modal-title">
                                    {detailModalApp.applicant?.name || detailModalApp.name}
                                </h2>
                                <p className="modal-subtitle">
                                    Applied for: <strong>{detailModalApp.job?.title}</strong>
                                </p>
                            </div>
                            <button
                                onClick={() => setDetailModalApp(null)}
                                className="modal-close-btn"
                                aria-label="Close"
                            >
                                ×
                            </button>
                        </div>

                        {detailModalApp.adminApproved === false && (
                            <div style={{ 
                                padding: '1rem', 
                                background: '#FFF7ED', 
                                border: '1px solid #FFEDD5', 
                                borderRadius: '0.5rem', 
                                marginBottom: '1.5rem',
                                color: '#9A3412',
                                fontSize: '0.875rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}>
                                ⚠️ <strong>Pending Admin Approval:</strong> Full profile details and resume are hidden until the Super Admin allows access.
                            </div>
                        )}

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            {/* Contact Information */}
                            <div className="section">
                                <h3 className="section-title">Contact Information</h3>
                                <div className="info-grid">
                                    <div><strong>Email:</strong> {detailModalApp.applicant?.email || detailModalApp.email}</div>
                                    {detailModalApp.applicant?.phone && (
                                        <div><strong>Phone:</strong> {detailModalApp.applicant.phone}</div>
                                    )}
                                </div>
                            </div>

                            {/* Resume */}
                            {detailModalApp.resumeUrl && (
                                <div className="section">
                                    <h3 className="section-title">Resume</h3>
                                    {(() => {
                                        const isData = detailModalApp.resumeUrl.startsWith('data:');
                                        const getExt = (url: string) => {
                                            const parts = url.split(';');
                                            if (parts.length < 2) return 'pdf';
                                            const mime = parts[0].split(':')[1];
                                            if (mime === 'application/pdf') return 'pdf';
                                            if (mime === 'image/jpeg') return 'jpg';
                                            if (mime === 'image/png') return 'png';
                                            return mime.split('/')[1] || 'pdf';
                                        };
                                        const ext = isData ? getExt(detailModalApp.resumeUrl) : 'pdf';
                                        const downloadName = `resume-${(detailModalApp.applicant?.name || detailModalApp.name || 'candidate').replace(/\s+/g, '-')}.${ext}`;
                                        return (
                                            <a
                                                href={detailModalApp.resumeUrl}
                                                download={downloadName}
                                                style={{ color: 'var(--primary)', textDecoration: 'underline', fontSize: '0.875rem', fontWeight: 600 }}
                                            >
                                                Download Resume
                                            </a>
                                        );
                                    })()}
                                </div>
                            )}

                            {/* Skills */}
                            {detailModalApp.applicant?.skills && (
                                <div className="section">
                                    <h3 className="section-title">Skills</h3>
                                    <p style={{ fontSize: '0.875rem', margin: 0 }}>{detailModalApp.applicant.skills}</p>
                                </div>
                            )}

                            {/* Education */}
                            {detailModalApp.applicant?.education && (
                                <div className="section">
                                    <h3 className="section-title">Education</h3>
                                    <p style={{ fontSize: '0.875rem', margin: 0, whiteSpace: 'pre-wrap' }}>{detailModalApp.applicant.education}</p>
                                </div>
                            )}

                            {/* Experience */}
                            {detailModalApp.applicant?.experience && (
                                <div className="section">
                                    <h3 className="section-title">Experience</h3>
                                    <p style={{ fontSize: '0.875rem', margin: 0, whiteSpace: 'pre-wrap' }}>{detailModalApp.applicant.experience}</p>
                                </div>
                            )}

                            {/* Screening Answers */}
                            {detailModalApp.answers && (() => {
                                try {
                                    const answers = JSON.parse(detailModalApp.answers);
                                    if (Object.keys(answers).length > 0) {
                                        return (
                                            <div className="section">
                                                <h3 className="section-title">Screening Questions</h3>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                                    {Object.entries(answers).map(([question, answer], i) => (
                                                        <div key={i} className="answer-item">
                                                            <div className="answer-question">{question}</div>
                                                            <div className="answer-text">{String(answer)}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    }
                                } catch (e) {
                                    return null;
                                }
                            })()}

                            {/* Status Update */}
                            <div className="section">
                                <h3 className="section-title">Update Status</h3>
                                <div className="status-buttons">
                                    {['Applied', 'Shortlisted', 'Interview', 'Rejected'].map(status => (
                                        <Button
                                            key={status}
                                            size="sm"
                                            variant={detailModalApp.status === status ? "primary" : "outline"}
                                            onClick={() => handleStatusUpdate(detailModalApp.id, status)}
                                            disabled={updating || detailModalApp.status === status}
                                        >
                                            {status}
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            <div className="modal-footer">
                                <Button variant="outline" size="sm" onClick={() => setDetailModalApp(null)}>Close</Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="page-container">
                <div className="page-header">
                    <h1 className="page-title">Candidates</h1>
                    <p className="page-subtitle">Review and manage job applications.</p>
                </div>

                {/* Filters */}
                <div className="filters">
                    <div className="filter-group">
                        <label className="filter-label">Filter by Job</label>
                        <select
                            value={selectedJob}
                            onChange={(e) => setSelectedJob(e.target.value)}
                            className="filter-select"
                        >
                            <option key="all-jobs" value="All">All Jobs</option>
                            {jobs.map((job, index) => (
                                <option key={job.id || `job-${index}`} value={job.id}>{job.title}</option>
                            ))}
                        </select>
                    </div>
                    <div className="filter-group">
                        <label className="filter-label">Filter by Status</label>
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="filter-select"
                        >
                            {["All", "Applied", "Shortlisted", "Interview", "Rejected"].map(status => (
                                <option key={status} value={status}>
                                    {status === "All" ? "All Statuses" : status}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="candidate-count">
                        Showing {filteredCandidates.length} of {candidates.length} applications
                    </div>
                </div>

                <div className="candidates-list">
                    {loading ? <p style={{ color: 'var(--muted-foreground)' }}>Loading candidates...</p> : filteredCandidates.length === 0 ? (
                        <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--muted-foreground)' }}>
                            {candidates.length === 0 ? 'No applications received yet.' : 'No applications match the selected filters.'}
                        </p>
                    ) : filteredCandidates.map((candidate) => (
                        <div key={candidate.id || candidate.email} className="candidate-card">
                            <div 
                                className="status-accent" 
                                style={{ backgroundColor: getStatusStyle(candidate.status).color }}
                            />
                            <div className="card-content-wrapper">
                                <div className="candidate-info">
                                    <div className="candidate-avatar">
                                        {candidate.applicant?.studentProfile?.photoUrl ? (
                                            <img 
                                                src={candidate.applicant.studentProfile.photoUrl} 
                                                alt={candidate.name}
                                                onError={(e) => {
                                                    (e.target as any).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.name)}&background=random`;
                                                }}
                                            />
                                        ) : (
                                            candidate.name.charAt(0).toUpperCase()
                                        )}
                                    </div>
                                    <div className="candidate-details">
                                        <h3 className="candidate-name">{candidate.name}</h3>
                                        <div className="job-pill">{candidate.job?.title || 'General Position'}</div>
                                    </div>
                                </div>

                                <div className="candidate-meta">
                                    <div className="candidate-email">{candidate.email}</div>
                                    <span className="status-badge" style={getStatusStyle(candidate.status)}>
                                        {candidate.status}
                                    </span>
                                    <div className="candidate-date">{new Date(candidate.createdAt).toLocaleDateString()}</div>
                                    <Button variant="outline" onClick={() => openDetailModal(candidate)}>View Details</Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default function CandidatesPage() {
    return (
        <Suspense fallback={<div>Loading candidates...</div>}>
            <CandidatesContent />
        </Suspense>
    );
}
