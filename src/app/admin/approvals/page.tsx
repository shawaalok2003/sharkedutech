"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function AdminApprovalsPage() {
    const [jobApps, setJobApps] = useState<any[]>([]);
    const [admissionApps, setAdmissionApps] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [actioning, setActioning] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/approve');
            if (res.ok) {
                const data = await res.json();
                setJobApps(data.jobApps);
                setAdmissionApps(data.admissionApps);
            }
        } catch (error) {
            console.error("Failed to fetch approvals", error);
        } finally {
            setLoading(false);
        }
    }

    async function handleApproval(type: 'JOB_APP' | 'ADMISSION_APP', id: string, approved: boolean) {
        setActioning(id);
        try {
            const res = await fetch('/api/admin/approve', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type, id, approved })
            });

            if (res.ok) {
                if (type === 'JOB_APP') {
                    setJobApps(prev => prev.map(app => app.id === id ? { ...app, adminApproved: approved } : app));
                } else {
                    setAdmissionApps(prev => prev.map(app => app.id === id ? { ...app, adminApproved: approved } : app));
                }
            }
        } catch (error) {
            console.error("Action failed", error);
        } finally {
            setActioning(null);
        }
    }

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '2rem', color: 'var(--primary)' }}>Application Approvals</h1>
            
            <section style={{ marginBottom: '4rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem' }}>Job Applications</h2>
                <div style={{ display: 'grid', gap: '1rem' }}>
                    {loading ? <p>Loading...</p> : jobApps.length === 0 ? <p>No job applications.</p> : jobApps.map(app => (
                        <Card key={app.id}>
                            <CardContent style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem' }}>
                                <div>
                                    <h3 style={{ fontWeight: 600, fontSize: '1.1rem' }}>{app.applicant.name}</h3>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--muted-foreground)' }}>
                                        Applied for: <strong>{app.job.title}</strong> at {app.job.employer.companyName}
                                    </p>
                                    <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>
                                        Status: <span style={{ color: app.adminApproved ? 'var(--success, #22c55e)' : 'var(--warning, #f59e0b)', fontWeight: 600 }}>
                                            {app.adminApproved ? 'Approved - Employer can view profile' : 'Pending Admin Approval'}
                                        </span>
                                    </p>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    {!app.adminApproved ? (
                                        <Button 
                                            onClick={() => handleApproval('JOB_APP', app.id, true)}
                                            disabled={actioning === app.id}
                                        >
                                            {actioning === app.id ? 'Processing...' : 'Allow Profile Access'}
                                        </Button>
                                    ) : (
                                        <Button 
                                            variant="outline" 
                                            onClick={() => handleApproval('JOB_APP', app.id, false)}
                                            disabled={actioning === app.id}
                                        >
                                            Revoke Access
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            <section>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem' }}>College Admissions</h2>
                <div style={{ display: 'grid', gap: '1rem' }}>
                    {loading ? <p>Loading...</p> : admissionApps.length === 0 ? <p>No admission applications.</p> : admissionApps.map(app => (
                        <Card key={app.id}>
                            <CardContent style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem' }}>
                                <div>
                                    <h3 style={{ fontWeight: 600, fontSize: '1.1rem' }}>{app.student.name}</h3>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--muted-foreground)' }}>
                                        Applied for: <strong>{app.course?.title || 'General'}</strong> at {app.college.name}
                                    </p>
                                    <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>
                                        Status: <span style={{ color: app.adminApproved ? 'var(--success, #22c55e)' : 'var(--warning, #f59e0b)', fontWeight: 600 }}>
                                            {app.adminApproved ? 'Approved - College can view profile' : 'Pending Admin Approval'}
                                        </span>
                                    </p>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    {!app.adminApproved ? (
                                        <Button 
                                            onClick={() => handleApproval('ADMISSION_APP', app.id, true)}
                                            disabled={actioning === app.id}
                                        >
                                            {actioning === app.id ? 'Processing...' : 'Allow Profile Access'}
                                        </Button>
                                    ) : (
                                        <Button 
                                            variant="outline" 
                                            onClick={() => handleApproval('ADMISSION_APP', app.id, false)}
                                            disabled={actioning === app.id}
                                        >
                                            Revoke Access
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>
        </div>
    );
}
