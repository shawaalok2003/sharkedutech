import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
    const session = await getServerSession(authOptions as any);
    const user = (session as any)?.user;
    const role = user?.role;
    const isSuper = role === "SUPER_ADMIN";
    const userPerms: string[] = user?.adminPermissions ? user.adminPermissions.split(',') : [];

    const hasJobs = isSuper || userPerms.includes('manage_jobs');
    const hasColleges = isSuper || userPerms.includes('manage_colleges');
    const hasAdmissions = isSuper || userPerms.includes('manage_admissions');
    const hasUsers = isSuper || userPerms.includes('manage_users');

    let userCount = 0, jobCount = 0, applicationCount = 0, collegeCount = 0, courseCount = 0, admissionCount = 0, inquiryCount = 0;
    try {
        const [
            uC, jC, aC, colC, crsC, admC, inqC
        ] = await Promise.all([
            prisma.user.count(),
            prisma.job.count(),
            prisma.application.count(),
            prisma.college.count(),
            prisma.course.count(),
            prisma.admissionApplication.count(),
            prisma.collegePartnerInquiry.count()
        ]);
        userCount = uC;
        jobCount = jC;
        applicationCount = aC;
        collegeCount = colC;
        courseCount = crsC;
        admissionCount = admC;
        inquiryCount = inqC;
    } catch (e) {
        console.error('[AdminDashboard] DB error:', e);
    }

    return (
        <div>
            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: 700, color: 'var(--primary)' }}>Admin Dashboard</h1>
                    <p style={{ color: 'var(--muted-foreground)' }}>
                        {isSuper ? 'Super Admin System Overview and Analytics' : 'Assigned Sub-Admin Dashboard & Analytics'}
                    </p>
                </div>
                {hasJobs && (
                    <a href="/admin/approvals">
                        <Button>Manage Approvals</Button>
                    </a>
                )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                {hasUsers && (
                    <Card style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '1rem' }}>
                        <CardHeader>
                            <CardTitle style={{ fontSize: '1.1rem', color: '#475569' }}>Total Registered Users</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--primary)' }}>{userCount}</div>
                        </CardContent>
                    </Card>
                )}

                {hasJobs && (
                    <>
                        <Card style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '1rem' }}>
                            <CardHeader>
                                <CardTitle style={{ fontSize: '1.1rem', color: '#475569' }}>Total Active Jobs</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#f59e0b' }}>{jobCount}</div>
                            </CardContent>
                        </Card>

                        <Card style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '1rem' }}>
                            <CardHeader>
                                <CardTitle style={{ fontSize: '1.1rem', color: '#475569' }}>Job Applications</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#10b981' }}>{applicationCount}</div>
                            </CardContent>
                        </Card>
                    </>
                )}

                {hasColleges && (
                    <>
                        <Card style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '1rem' }}>
                            <CardHeader>
                                <CardTitle style={{ fontSize: '1.1rem', color: '#475569' }}>Partner Colleges</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#6366f1' }}>{collegeCount}</div>
                            </CardContent>
                        </Card>

                        <Card style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '1rem' }}>
                            <CardHeader>
                                <CardTitle style={{ fontSize: '1.1rem', color: '#475569' }}>College Inquiries</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#ec4899' }}>{inquiryCount}</div>
                            </CardContent>
                        </Card>
                    </>
                )}

                {hasAdmissions && (
                    <>
                        <Card style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '1rem' }}>
                            <CardHeader>
                                <CardTitle style={{ fontSize: '1.1rem', color: '#475569' }}>Offered Courses</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#8b5cf6' }}>{courseCount}</div>
                            </CardContent>
                        </Card>

                        <Card style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '1rem' }}>
                            <CardHeader>
                                <CardTitle style={{ fontSize: '1.1rem', color: '#475569' }}>Student Admissions</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#3b82f6' }}>{admissionCount}</div>
                            </CardContent>
                        </Card>
                    </>
                )}
            </div>
        </div>
    );
}
