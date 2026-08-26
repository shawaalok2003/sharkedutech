"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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

// Global in-memory cache for instant client navigation
let globalCollegeDashCache: { stats: Stats; apps: AdmissionApp[] } | null = null;

export default function CollegeAdminPage() {
    const router = useRouter();
    const [stats, setStats] = useState<Stats>(() => globalCollegeDashCache?.stats || { totalApplications: 0, pending: 0, shortlisted: 0, accepted: 0 });
    const [apps, setApps] = useState<AdmissionApp[]>(() => globalCollegeDashCache?.apps || []);

    useEffect(() => {
        let isMounted = true;

        if (!globalCollegeDashCache) {
            try {
                const stored = sessionStorage.getItem('shark_college_dash_cache_v2');
                if (stored) {
                    const parsed = JSON.parse(stored);
                    if (parsed && typeof parsed === 'object') {
                        globalCollegeDashCache = parsed;
                        setStats(parsed.stats || { totalApplications: 0, pending: 0, shortlisted: 0, accepted: 0 });
                        setApps(parsed.apps || []);
                    }
                }
            } catch (e) {}
        }

        async function load() {
            try {
                const [statsRes, appsRes] = await Promise.all([
                    fetch("/api/admissions/analytics"),
                    fetch("/api/admissions/applications")
                ]);

                let newStats = { totalApplications: 0, pending: 0, shortlisted: 0, accepted: 0 };
                let newApps: AdmissionApp[] = [];

                if (statsRes.ok) {
                    newStats = await statsRes.json();
                }
                if (appsRes.ok) {
                    const data = await appsRes.json();
                    newApps = data.slice(0, 5);
                }

                if (isMounted) {
                    setStats(newStats);
                    setApps(newApps);
                    const cacheObj = { stats: newStats, apps: newApps };
                    globalCollegeDashCache = cacheObj;
                    try {
                        sessionStorage.setItem('shark_college_dash_cache_v2', JSON.stringify(cacheObj));
                    } catch (e) {}
                }
            } catch (err) {
                console.error("Failed to load college analytics:", err);
            }
        }
        load();

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <div>
            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <h1 style={{ fontSize: '1.875rem', fontWeight: 700, color: 'var(--primary)' }}>Institute Dashboard</h1>
                        <Link href="/" style={{ color: 'var(--primary)', fontSize: '0.875rem', textDecoration: 'underline' }}>View Website</Link>
                    </div>
                    <p style={{ color: 'var(--muted-foreground)' }}>Overview of applications and course performance.</p>
                </div>
                <Button onClick={() => router.push('/admissions/college/courses')}>+ Add New Course</Button>
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
