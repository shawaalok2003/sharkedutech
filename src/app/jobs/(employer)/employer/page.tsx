"use client";

import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EmployerDashboard() {
    const router = useRouter();
    const [stats, setStats] = useState({ activeJobs: 0, totalApplicants: 0, shortlisted: 0 });
    const [recentJobs, setRecentJobs] = useState<any[]>([]);

    useEffect(() => {
        async function fetchDashboardData() {
            try {
                const res = await fetch('/api/dashboard/stats');
                if (res.ok) {
                    const data = await res.json();
                    setStats(data.stats);
                    setRecentJobs(data.recentJobs);
                }
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            }
        }
        fetchDashboardData();
    }, []);

    return (
        <div>
            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: 700, color: 'var(--primary)' }}>Employer Dashboard</h1>
                    <p style={{ color: 'var(--muted-foreground)' }}>Manage job postings and screen candidates.</p>
                </div>
                <Button onClick={() => router.push('/jobs/employer/post')}>+ Post New Job</Button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
                <Card>
                    <CardHeader>
                        <CardTitle>Active Jobs</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary)' }}>{stats.activeJobs}</div>
                        <div style={{ color: 'var(--success)', fontSize: '0.875rem' }}>Live on public board</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Total Applicants</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--warning)' }}>{stats.totalApplicants}</div>
                        <div style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>Across all roles</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Shortlisted</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary)' }}>{stats.shortlisted}</div>
                        <div style={{ color: 'var(--success)', fontSize: '0.875rem' }}>Ready for interview</div>
                    </CardContent>
                </Card>
            </div>

            <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '1rem' }}>Recent Job Postings</h2>
            <div style={{ display: 'grid', gap: '1rem' }}>
                {recentJobs.length === 0 ? <p>No recent activity.</p> : recentJobs.map((job, idx) => (
                    <Card key={idx} style={{ flexDirection: 'row', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem' }}>
                        <div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--foreground)' }}>{job.title}</h3>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
                                <span>{job.location}</span>
                                <span>•</span>
                                <span>{job.type}</span>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>{job._count?.applications || 0}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>Applicants</div>
                            </div>
                            <div style={{
                                padding: '0.25rem 0.75rem',
                                borderRadius: '2rem',
                                backgroundColor: job.status === 'Active' ? '#ECFDF5' : '#FEF2F2',
                                color: job.status === 'Active' ? '#059669' : '#DC2626',
                                fontSize: '0.875rem',
                                fontWeight: 500
                            }}>
                                {job.status}
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
