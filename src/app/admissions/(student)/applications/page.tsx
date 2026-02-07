"use client";

import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type AdmissionApp = {
    id: string;
    status: string;
    step: number;
    createdAt: string;
    collegeId?: string;
    college?: { id?: string; name?: string };
    course?: { title?: string } | null;
};

export default function ApplicationsPage() {
    const router = useRouter();
    const [applications, setApplications] = useState<AdmissionApp[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchApps() {
            try {
                const res = await fetch("/api/admissions/applications");
                if (res.ok) {
                    const data = await res.json();
                    setApplications(data);
                }
            } finally {
                setLoading(false);
            }
        }
        fetchApps();
    }, []);

    const getStatusStyle = (status: string) => {
        if (status === 'Approved' || status === 'Accepted') {
            return { background: 'var(--success-light)', color: 'var(--success)' };
        }
        if (status === 'Rejected') {
            return { background: 'var(--error-light)', color: 'var(--error)' };
        }
        if (status === 'Pending' || status === 'In Review') {
            return { background: 'var(--warning-light)', color: 'var(--warning)' };
        }
        return { background: 'var(--info-light)', color: 'var(--info)' };
    };

    return (
        <>
            <style jsx>{`
                .page-container {
                    padding: 0;
                }
                .page-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1.5rem;
                    flex-wrap: wrap;
                    gap: 1rem;
                }
                .app-list {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                .app-card-content {
                    padding: 1.25rem;
                    display: grid;
                    grid-template-columns: 1fr auto auto;
                    align-items: center;
                    gap: 1rem;
                }
                .app-info { min-width: 0; }
                .app-status {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    min-width: 120px;
                }
                .app-actions {
                    display: flex;
                    gap: 0.5rem;
                    flex-wrap: wrap;
                }
                .status-badge {
                    padding: 0.5rem 1rem;
                    border-radius: 2rem;
                    font-size: 0.8rem;
                    font-weight: 600;
                    margin-bottom: 0.25rem;
                }
                .progress-bar {
                    height: 4px;
                    width: 100%;
                    background: var(--muted);
                    border-radius: 0 0 var(--radius) var(--radius);
                    overflow: hidden;
                }
                .progress-fill {
                    height: 100%;
                    transition: width var(--transition-slow);
                }
                .empty-state {
                    text-align: center;
                    padding: 3rem 1.5rem;
                    background: white;
                    border-radius: var(--radius-lg);
                    border: 1px solid var(--border);
                }

                @media (max-width: 768px) {
                    .app-card-content {
                        grid-template-columns: 1fr;
                        text-align: center;
                    }
                    .app-info { text-align: left; }
                    .app-status {
                        flex-direction: row;
                        justify-content: space-between;
                        width: 100%;
                        padding: 0.75rem;
                        background: var(--muted);
                        border-radius: var(--radius);
                    }
                    .app-actions {
                        width: 100%;
                    }
                    .app-actions button {
                        flex: 1;
                    }
                }
            `}</style>
            <div className="page-container">
                <div className="page-header">
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)', margin: 0 }}>My Applications</h1>
                    <Button variant="outline" onClick={() => router.push('/admissions/colleges')}>+ Apply to New College</Button>
                </div>

                {loading ? (
                    <div style={{ color: 'var(--muted-foreground)', padding: '2rem', textAlign: 'center' }}>Loading applications...</div>
                ) : applications.length === 0 ? (
                    <div className="empty-state">
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
                        <h3 style={{ marginBottom: '0.5rem', color: 'var(--foreground)' }}>No Applications Yet</h3>
                        <p style={{ color: 'var(--muted-foreground)', marginBottom: '1rem' }}>Start exploring colleges and submit your first application.</p>
                        <Button onClick={() => router.push('/admissions/colleges')}>Browse Colleges</Button>
                    </div>
                ) : (
                    <div className="app-list">
                        {applications.map((app) => (
                            <Card key={app.id} style={{ overflow: 'hidden' }}>
                                <div className="app-card-content">
                                    <div className="app-info">
                                        <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginBottom: '0.25rem' }}>#{app.id.slice(0, 6)}</div>
                                        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--foreground)', marginBottom: '0.25rem' }}>{app.college?.name || "College"}</h3>
                                        <p style={{ color: 'var(--primary)', fontSize: '0.875rem', margin: 0 }}>{app.course?.title || "General Admission"}</p>
                                    </div>

                                    <div className="app-status">
                                        <span className="status-badge" style={getStatusStyle(app.status)}>{app.status}</span>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
                                            {new Date(app.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>

                                    <div className="app-actions">
                                        <Button variant="outline" size="sm" onClick={() => router.push(`/admissions/applications/${app.id}`)}>View Timeline</Button>
                                        {app.collegeId && <Button variant="outline" size="sm" onClick={() => router.push(`/admissions/colleges/${app.collegeId}`)}>College</Button>}
                                    </div>
                                </div>
                                <div className="progress-bar">
                                    <div className="progress-fill" style={{ 
                                        width: `${Math.min(app.step * 25, 100)}%`, 
                                        backgroundColor: app.status === 'Approved' ? 'var(--success)' : 'var(--accent)' 
                                    }}></div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
