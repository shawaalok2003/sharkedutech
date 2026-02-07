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
                    gap: 1.5rem;
                }
                .jobs-header {
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
                    margin: 0;
                }
                .page-subtitle {
                    color: var(--muted-foreground);
                    margin: 0.5rem 0 0;
                    font-size: 0.875rem;
                }
                .jobs-list {
                    display: grid;
                    gap: 1rem;
                }
                .job-card {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: space-between;
                    padding: 1.25rem;
                    gap: 1.25rem;
                }
                .job-info {
                    flex: 1;
                }
                .job-title {
                    font-size: 1.15rem;
                    font-weight: 600;
                    color: var(--foreground);
                    margin: 0;
                }
                .job-header {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    margin-bottom: 0.5rem;
                    flex-wrap: wrap;
                }
                .status-badge {
                    font-size: 0.7rem;
                    padding: 0.2rem 0.6rem;
                    border-radius: 999px;
                    background: rgba(0,0,0,0.05);
                    font-weight: 600;
                }
                .job-meta {
                    display: flex;
                    gap: 1rem;
                    font-size: 0.8rem;
                    color: var(--muted-foreground);
                    flex-wrap: wrap;
                }
                .job-stats {
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                    flex-shrink: 0;
                }
                .applicant-count {
                    text-align: center;
                }
                .count-number {
                    font-size: 1.5rem;
                    font-weight: 700;
                }
                .count-label {
                    font-size: 0.7rem;
                    color: var(--muted-foreground);
                }
                .job-actions {
                    display: flex;
                    gap: 0.5rem;
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
                        <h1 className="page-title">Active Jobs</h1>
                        <p className="page-subtitle">Manage your current job listings.</p>
                    </div>
                    <Button onClick={() => router.push('/jobs/employer/post')}>+ Post New Job</Button>
                </div>

                <div className="jobs-list">
                    {loading ? <p style={{ color: 'var(--muted-foreground)' }}>Loading jobs...</p> : jobs.length === 0 ? <p style={{ color: 'var(--muted-foreground)' }}>No active jobs found.</p> : jobs.map((job) => (
                        <Card key={job.id} className="job-card">
                            <div className="job-info">
                                <div className="job-header">
                                    <h3 className="job-title">{job.title}</h3>
                                    <span className="status-badge" style={{ color: getStatusColor(job.status) }}>
                                        {job.status}
                                    </span>
                                </div>
                                <div className="job-meta">
                                    <span>{job.location}</span>
                                    <span>•</span>
                                    <span>{job.type}</span>
                                    <span>•</span>
                                    <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <div className="job-stats">
                                <div className="applicant-count">
                                    <div className="count-number">{job._count?.applications || 0}</div>
                                    <div className="count-label">Applicants</div>
                                </div>
                                <div className="job-actions">
                                    <Button variant="outline" size="sm">Edit</Button>
                                    <Button variant="outline" size="sm" onClick={() => router.push('/jobs/employer/candidates')}>View Candidates</Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </>
    );
}
