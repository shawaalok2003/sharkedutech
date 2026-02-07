"use client";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type AdmissionApp = {
    id: string;
    status: string;
    createdAt: string;
    score?: string | null;
    student?: { name?: string };
    course?: { title?: string } | null;
};

const getStatusStyle = (status: string) => {
    if (status === 'Approved' || status === 'Shortlisted') {
        return { background: 'var(--success-light)', color: 'var(--success)' };
    }
    if (status === 'Rejected') {
        return { background: 'var(--error-light)', color: 'var(--error)' };
    }
    return { background: 'var(--warning-light)', color: 'var(--warning)' };
};

export default function ApplicationsPage() {
    const router = useRouter();
    const [applications, setApplications] = useState<AdmissionApp[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<string>('');

    const fetchApps = async () => {
        setLoading(true);
        const res = await fetch("/api/admissions/applications");
        if (res.ok) {
            const data = await res.json();
            setApplications(data);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchApps();
    }, []);

    const filteredApps = statusFilter 
        ? applications.filter(app => app.status === statusFilter) 
        : applications;

    const updateStatus = async (id: string, status: string) => {
        const res = await fetch(`/api/admissions/applications/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status })
        });
        if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            alert(data.error || "Failed to update status");
            return;
        }
        const updated = await res.json();
        setApplications(prev => prev.map(app => app.id === id ? { ...app, status: updated.status, step: updated.step } : app));
    };

    return (
        <>
            <style jsx>{`
                .page-header {
                    margin-bottom: 1.5rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 1rem;
                }
                .page-title {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: var(--primary);
                    margin: 0;
                }
                .header-actions {
                    display: flex;
                    gap: 0.5rem;
                    flex-wrap: wrap;
                }
                .filter-select {
                    padding: 0.5rem 1rem;
                    border-radius: var(--radius);
                    border: 1px solid var(--border);
                    font-size: 0.875rem;
                }
                .table-container {
                    overflow-x: auto;
                }
                .desktop-table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 0.875rem;
                }
                .desktop-table th {
                    padding: 0.75rem 1rem;
                    color: var(--muted-foreground);
                    font-weight: 600;
                    text-align: left;
                    background: var(--muted);
                    border-bottom: 1px solid var(--border);
                }
                .desktop-table td {
                    padding: 0.75rem 1rem;
                    border-bottom: 1px solid var(--border);
                }
                .status-badge {
                    padding: 0.25rem 0.6rem;
                    border-radius: 1rem;
                    font-size: 0.75rem;
                    font-weight: 600;
                }
                .action-cell {
                    display: flex;
                    gap: 0.5rem;
                }
                .mobile-cards {
                    display: none;
                    flex-direction: column;
                    gap: 1rem;
                }
                .mobile-card {
                    padding: 1rem;
                    border: 1px solid var(--border);
                    border-radius: var(--radius);
                    background: white;
                }
                .mobile-card-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 0.75rem;
                }
                .mobile-card-row {
                    display: flex;
                    justify-content: space-between;
                    font-size: 0.8rem;
                    margin-bottom: 0.5rem;
                }
                .mobile-card-actions {
                    display: flex;
                    gap: 0.5rem;
                    margin-top: 0.75rem;
                    padding-top: 0.75rem;
                    border-top: 1px solid var(--border);
                }
                .mobile-card-actions button {
                    flex: 1;
                }

                @media (max-width: 768px) {
                    .page-header {
                        flex-direction: column;
                        align-items: stretch;
                    }
                    .header-actions {
                        flex-direction: column;
                    }
                    .desktop-table {
                        display: none;
                    }
                    .mobile-cards {
                        display: flex;
                    }
                }
            `}</style>
            <div>
                <div className="page-header">
                    <h1 className="page-title">Student Applications</h1>
                    <div className="header-actions">
                        <select 
                            className="filter-select"
                            value={statusFilter} 
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="">All Statuses</option>
                            <option value="Pending">Pending</option>
                            <option value="In Review">In Review</option>
                            <option value="Shortlisted">Shortlisted</option>
                            <option value="Approved">Approved</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                        <Button variant="outline" size="sm" onClick={fetchApps}>Refresh</Button>
                        <Button variant="outline" size="sm" onClick={() => router.push('/admissions/college/courses')}>Manage Courses</Button>
                    </div>
                </div>

                <Card>
                    {/* Desktop Table */}
                    <div className="table-container">
                        <table className="desktop-table">
                            <thead>
                                <tr>
                                    <th>App ID</th>
                                    <th>Student</th>
                                    <th>Course</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>Loading...</td></tr>
                                ) : filteredApps.length === 0 ? (
                                    <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--muted-foreground)' }}>No applications found.</td></tr>
                                ) : filteredApps.map((row) => (
                                    <tr key={row.id}>
                                        <td style={{ color: 'var(--muted-foreground)' }}>#{row.id.slice(0, 6)}</td>
                                        <td style={{ fontWeight: 600 }}>{row.student?.name || "Student"}</td>
                                        <td>{row.course?.title || "General"}</td>
                                        <td style={{ color: 'var(--muted-foreground)' }}>{new Date(row.createdAt).toLocaleDateString()}</td>
                                        <td>
                                            <span className="status-badge" style={getStatusStyle(row.status)}>{row.status}</span>
                                        </td>
                                        <td>
                                            <div className="action-cell">
                                                <Button size="sm" variant="outline" onClick={() => router.push(`/admissions/college/applications/${row.id}`)}>View</Button>
                                                {row.status === 'Pending' && (
                                                    <Button size="sm" onClick={() => updateStatus(row.id, "Shortlisted")}>Shortlist</Button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Cards */}
                    <div className="mobile-cards">
                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--muted-foreground)' }}>Loading...</div>
                        ) : filteredApps.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--muted-foreground)' }}>No applications found.</div>
                        ) : filteredApps.map((row) => (
                            <div key={row.id} className="mobile-card">
                                <div className="mobile-card-header">
                                    <div>
                                        <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{row.student?.name || "Student"}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>#{row.id.slice(0, 6)}</div>
                                    </div>
                                    <span className="status-badge" style={getStatusStyle(row.status)}>{row.status}</span>
                                </div>
                                <div className="mobile-card-row">
                                    <span style={{ color: 'var(--muted-foreground)' }}>Course</span>
                                    <span>{row.course?.title || "General"}</span>
                                </div>
                                <div className="mobile-card-row">
                                    <span style={{ color: 'var(--muted-foreground)' }}>Date</span>
                                    <span>{new Date(row.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="mobile-card-actions">
                                    <Button size="sm" variant="outline" onClick={() => router.push(`/admissions/college/applications/${row.id}`)}>View</Button>
                                    {row.status === 'Pending' && (
                                        <Button size="sm" onClick={() => updateStatus(row.id, "Shortlisted")}>Shortlist</Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </>
    );
}
