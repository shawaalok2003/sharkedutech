"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useEffect, useState } from "react";

type Stats = {
    totalApplications: number;
    pending: number;
    shortlisted: number;
    accepted: number;
};

type AdmissionApp = {
    id: string;
    status: string;
    createdAt: string;
    student?: { name?: string };
    course?: { title?: string } | null;
};

export default function CollegeAdminPage() {
    const [stats, setStats] = useState<Stats>({ totalApplications: 0, pending: 0, shortlisted: 0, accepted: 0 });
    const [apps, setApps] = useState<AdmissionApp[]>([]);

    useEffect(() => {
        async function load() {
            const [statsRes, appsRes] = await Promise.all([
                fetch("/api/admissions/analytics"),
                fetch("/api/admissions/applications")
            ]);
            if (statsRes.ok) {
                const data = await statsRes.json();
                setStats(data);
            }
            if (appsRes.ok) {
                const data = await appsRes.json();
                setApps(data.slice(0, 5));
            }
        }
        load();
    }, []);

    return (
        <div>
            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: 700, color: 'var(--primary)' }}>Institute Dashboard</h1>
                    <p style={{ color: 'var(--muted-foreground)' }}>Overview of applications and course performance.</p>
                </div>
                <Button>+ Add New Course</Button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
                <Card>
                    <CardHeader>
                        <CardTitle>Total Applications</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary)' }}>{stats.totalApplications}</div>
                        <div style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>All time</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Pending Review</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--warning)' }}>{stats.pending}</div>
                        <div style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>Requires attention</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Shortlisted</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary)' }}>{stats.shortlisted}</div>
                        <div style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>Qualified students</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Accepted</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary)' }}>{stats.accepted}</div>
                        <div style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>Confirmed admissions</div>
                    </CardContent>
                </Card>
            </div>

            <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '1rem' }}>Recent Applications</h2>
            <Card>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                                <th style={{ padding: '1rem', color: 'var(--muted-foreground)', fontWeight: 500 }}>Applicant</th>
                                <th style={{ padding: '1rem', color: 'var(--muted-foreground)', fontWeight: 500 }}>Course</th>
                                <th style={{ padding: '1rem', color: 'var(--muted-foreground)', fontWeight: 500 }}>Date</th>
                                <th style={{ padding: '1rem', color: 'var(--muted-foreground)', fontWeight: 500 }}>Status</th>
                                <th style={{ padding: '1rem', color: 'var(--muted-foreground)', fontWeight: 500 }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {apps.map((row) => (
                                <tr key={row.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '1rem', fontWeight: 500 }}>{row.student?.name || "Student"}</td>
                                    <td style={{ padding: '1rem' }}>{row.course?.title || "General Admission"}</td>
                                    <td style={{ padding: '1rem', color: 'var(--muted-foreground)' }}>{new Date(row.createdAt).toLocaleDateString()}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '1rem',
                                            fontSize: '0.85rem',
                                            fontWeight: 500,
                                            backgroundColor: row.status === 'Shortlisted' ? '#ECFDF5' : row.status === 'Pending' ? '#FEF3C7' : '#FEF2F2',
                                            color: row.status === 'Shortlisted' ? '#059669' : row.status === 'Pending' ? '#D97706' : '#DC2626'
                                        }}>
                                            {row.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <Button size="sm" variant="outline">View</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
