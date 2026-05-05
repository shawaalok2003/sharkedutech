"use client";

import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ActiveJobsPage() {
    const router = useRouter();
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchJobs() {
            try {
                const res = await fetch('/api/jobs/employer');
                if (res.ok) {
                    const data = await res.json();
                    setJobs(data);
                }
            } catch (error) {
                console.error("Failed to fetch jobs", error);
            } finally {
                setLoading(false);
            }
        }
        fetchJobs();
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Active': return 'var(--success)';
            case 'Urgent': return 'var(--warning)';
            case 'Closed': return 'var(--muted-foreground)';
            default: return 'var(--primary)';
        }
    };

    return (
        <>
            <style jsx>{`
                .jobs-container {
                    display: flex;
                    flex-direction: column;
                    gap: 2rem;
                }
                .jobs-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 1.5rem;
                    flex-wrap: wrap;
                }
                .page-title {
                    font-size: 2.25rem;
                    font-weight: 800;
                    color: #1e293b;
                    margin: 0;
                    letter-spacing: -0.02em;
                }
                .page-subtitle {
                    color: #64748b;
                    margin: 0.5rem 0 0;
                    font-size: 1rem;
                    font-weight: 500;
                }
                .jobs-list {
                    display: grid;
                    gap: 1.5rem;
                }
                .job-card {
                    display: flex;
                    flex-direction: row;
                    align-items: stretch;
                    background: rgba(255, 255, 255, 0.9);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.5);
                    border-radius: 24px;
                    overflow: hidden;
                    transition: all 0.5s cubic-bezier(0.19, 1, 0.22, 1);
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
                }
                .job-card:hover {
                    transform: translateY(-8px) scale(1.01);
                    box-shadow: 0 30px 50px -12px rgba(0, 0, 0, 0.12);
                    border-color: var(--primary);
                }
                .status-accent {
                    width: 10px;
                    flex-shrink: 0;
                }
                .card-content-wrapper {
                    display: flex;
                    flex: 1;
                    padding: 2rem 2.5rem;
                    align-items: center;
                    justify-content: space-between;
                    gap: 2.5rem;
                }
                .job-info {
                    flex: 1;
                }
                .job-title-row {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    margin-bottom: 0.75rem;
                }
                .job-title {
                    font-size: 1.4rem;
                    font-weight: 700;
                    color: #1e293b;
                    margin: 0;
                    letter-spacing: -0.01em;
                }
                .status-pill {
                    font-size: 0.65rem;
                    font-weight: 800;
                    padding: 0.25rem 0.75rem;
                    border-radius: 8px;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    background: rgba(0,0,0,0.05);
                }
                .job-meta {
                    display: flex;
                    gap: 0.75rem;
                    flex-wrap: wrap;
                }
                .meta-pill {
                    background: #f0f7ff;
                    color: var(--primary);
                    font-size: 0.75rem;
                    font-weight: 600;
                    padding: 0.3rem 0.8rem;
                    border-radius: 8px;
                }
                .job-stats {
                    display: flex;
                    align-items: center;
                    gap: 3rem;
                }
                .stat-group {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    min-width: 80px;
                }
                .stat-value {
                    font-size: 2.25rem;
                    font-weight: 900;
                    color: var(--primary);
                    line-height: 1;
                }
                .stat-label {
                    font-size: 0.75rem;
                    font-weight: 700;
                    color: #64748b;
                    text-transform: uppercase;
                    margin-top: 0.5rem;
                    letter-spacing: 0.05em;
                }
                .job-actions {
                    display: flex;
                    gap: 0.75rem;
                }
                .post-btn-wrapper {
                    box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.2);
                    border-radius: 12px;
                    transition: transform 0.3s ease;
                }
                .post-btn-wrapper:hover {
                    transform: translateY(-2px);
                }

                @media (max-width: 1024px) {
                    .job-card {
                        flex-direction: column;
                        align-items: flex-start;
                    }
                    .job-stats {
                        width: 100%;
                        justify-content: space-between;
                    }
                    .job-actions {
                        flex-wrap: wrap;
                    }
                }
                @media (max-width: 768px) {
                    .jobs-header {
                        flex-direction: column;
                        align-items: stretch;
                    }
                    .jobs-header button {
                        width: 100%;
                    }
                    .job-card {
                        padding: 1rem;
                        gap: 0.75rem;
                    }
                    .job-title {
                        font-size: 1rem;
                    }
                    .job-stats {
                        gap: 1rem;
                        flex-direction: column;
                        width: 100%;
                    }
                    .applicant-count {
                        width: 100%;
                    }
                    .job-actions {
                        width: 100%;
                    }
                    .job-actions button {
                        flex: 1;
                    }
                }
                @media (max-width: 480px) {
                    .page-title {
                        font-size: 1.5rem;
                    }
                    .job-title {
                        font-size: 0.95rem;
                    }
                    .job-meta {
                        font-size: 0.75rem;
                    }
                    .count-number {
                        font-size: 1.25rem;
                    }
                }
            `}</style>
            <div className="jobs-container">
                <div className="jobs-header">
                    <div className="header-content">
                        <h1 className="page-title">Active Vacancies</h1>
                        <p className="page-subtitle">Strategize and manage your high-priority recruitment campaigns.</p>
                    </div>
                    <div className="post-btn-wrapper">
                        <Button onClick={() => router.push('/jobs/employer/post')} size="lg">+ Post New Job</Button>
                    </div>
                </div>

                <div className="jobs-list">
                    {loading ? <p style={{ color: 'var(--muted-foreground)' }}>Loading jobs...</p> : jobs.length === 0 ? <p style={{ color: 'var(--muted-foreground)' }}>No active jobs found.</p> : jobs.map((job) => (
                        <div key={job.id} className="job-card">
                            <div 
                                className="status-accent" 
                                style={{ backgroundColor: getStatusColor(job.status) }}
                            />
                            <div className="card-content-wrapper">
                                <div className="job-info">
                                    <div className="job-title-row">
                                        <h3 className="job-title">{job.title}</h3>
                                        <span className="status-pill" style={{ color: getStatusColor(job.status), background: `${getStatusColor(job.status)}15` }}>
                                            {job.status}
                                        </span>
                                    </div>
                                    <div className="job-meta">
                                        {job.companyName && <span className="meta-pill" style={{ background: '#fef3c7', color: '#92400e' }}>🏢 {job.companyName}</span>}
                                        <span className="meta-pill">{job.location}</span>
                                        <span className="meta-pill">{job.type}</span>
                                        <span className="meta-pill" style={{ background: '#f8fafc', color: '#64748b' }}>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                <div className="job-stats">
                                    <div className="stat-group">
                                        <div className="stat-value">{job._count?.applications || 0}</div>
                                        <div className="stat-label">Applicants</div>
                                    </div>
                                    <div className="job-actions">
                                        <Button variant="outline" size="sm" onClick={() => router.push(`/jobs/employer/edit/${job.id}`)}>Edit</Button>
                                        <Button variant="outline" size="sm" onClick={() => router.push(`/jobs/employer/candidates?jobId=${job.id}`)}>View Candidates</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
