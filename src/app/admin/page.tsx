import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { LiveVideosAdminSection } from "@/components/admin/LiveVideosAdminSection";

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

    let userCount = 0, jobCount = 0, applicationCount = 0, collegeCount = 0, courseCount = 0, admissionCount = 0, inquiryCount = 0, consentCount = 0, liveVideoCount = 0, liveNowCount = 0;
    try {
        const [
            uC, jC, aC, colC, crsC, admC, inqC, csC, lvC, lnC
        ] = await Promise.all([
            prisma.user.count(),
            prisma.job.count(),
            prisma.application.count(),
            prisma.college.count(),
            prisma.course.count(),
            prisma.admissionApplication.count(),
            prisma.collegePartnerInquiry.count(),
            prisma.candidateConsentForm.count(),
            prisma.liveVideo.count(),
            prisma.liveVideo.count({ where: { isLiveNow: true } })
        ]);
        userCount = uC;
        jobCount = jC;
        applicationCount = aC;
        collegeCount = colC;
        courseCount = crsC;
        admissionCount = admC;
        inquiryCount = inqC;
        consentCount = csC;
        liveVideoCount = lvC;
        liveNowCount = lnC;
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

                        <a href="/admin/consent-forms" style={{ textDecoration: 'none' }}>
                            <Card style={{ background: '#ffffff', border: '1px solid #bfdbfe', borderTop: '4px solid #002147', borderRadius: '1rem', cursor: 'pointer', transition: 'transform 0.2s ease' }}>
                                <CardHeader>
                                    <CardTitle style={{ fontSize: '1.1rem', color: '#002147', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <span>Candidate Consent Forms</span>
                                        <span style={{ fontSize: '0.8rem', background: '#e0f2fe', color: '#0369a1', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>View all &rarr;</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#002147' }}>{consentCount}</div>
                                </CardContent>
                            </Card>
                        </a>

                        <a href="/admin/live-videos" style={{ textDecoration: 'none' }}>
                            <Card style={{
                                background: liveNowCount > 0 ? 'linear-gradient(135deg, #ffffff 0%, #fef2f2 100%)' : '#ffffff',
                                border: liveNowCount > 0 ? '1px solid #fca5a5' : '1px solid #e2e8f0',
                                borderTop: liveNowCount > 0 ? '4px solid #ef4444' : '4px solid #002147',
                                borderRadius: '1rem',
                                cursor: 'pointer',
                                transition: 'transform 0.2s ease'
                            }}>
                                <CardHeader>
                                    <CardTitle style={{ fontSize: '1.1rem', color: liveNowCount > 0 ? '#991b1b' : '#002147', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <span>📺 Live Streams & Videos</span>
                                        <span style={{
                                            fontSize: '0.8rem',
                                            background: liveNowCount > 0 ? '#fee2e2' : '#f1f5f9',
                                            color: liveNowCount > 0 ? '#b91c1c' : '#475569',
                                            padding: '0.2rem 0.5rem',
                                            borderRadius: '4px',
                                            fontWeight: 700
                                        }}>
                                            {liveNowCount > 0 ? '🔴 LIVE NOW' : 'Manage &rarr;'}
                                        </span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div style={{ fontSize: '2.25rem', fontWeight: 800, color: liveNowCount > 0 ? '#dc2626' : '#002147' }}>
                                        {liveVideoCount}
                                    </div>
                                </CardContent>
                            </Card>
                        </a>
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

            {/* Embedded Live Streaming & Video Manager in Main Admin Panel */}
            <div style={{ marginTop: '2.5rem', paddingTop: '2rem', borderTop: '2px solid #e2e8f0' }}>
                <LiveVideosAdminSection />
            </div>
        </div>
    );
}
