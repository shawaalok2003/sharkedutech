import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
    const userCount = await prisma.user.count();
    const jobCount = await prisma.job.count();
    const applicationCount = await prisma.application.count();
    const collegeCount = await prisma.college.count();
    const courseCount = await prisma.course.count();
    const admissionCount = await prisma.admissionApplication.count();
    const inquiryCount = await prisma.collegePartnerInquiry.count();

    return (
        <div>
            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: 700, color: 'var(--primary)' }}>Admin Dashboard</h1>
                    <p style={{ color: 'var(--muted-foreground)' }}>System overview and statistics.</p>
                </div>
                <a href="/admin/approvals">
                    <Button>Manage Approvals</Button>
                </a>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
                <Card>
                    <CardHeader>
                        <CardTitle>Total Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary)' }}>{userCount}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Total Jobs</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--secondary)' }}>{jobCount}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Job Applications</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--success, #22c55e)' }}>{applicationCount}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Total Colleges</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--accent, #6366f1)' }}>{collegeCount}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Total Courses</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--warning, #f59e0b)' }}>{courseCount}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Admissions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--info, #3b82f6)' }}>{admissionCount}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>College Inquiries</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div style={{ fontSize: '2rem', fontWeight: 700, color: '#ec4899' }}>{inquiryCount}</div>
                    </CardContent>
                </Card>
            </div>

            <div style={{ marginTop: '2rem' }}>
                <Card style={{ borderLeft: '4px solid var(--secondary)' }}>
                    <CardHeader>
                        <CardTitle>Compliance & Privacy Policy</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul style={{ listStyle: 'none', padding: 0, color: 'var(--foreground)' }}>
                            <li style={{ marginBottom: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                                🛡️ <strong>Employer Restrictions:</strong> Employers are barred from accessing student data without explicit permission.
                            </li>
                            <li style={{ marginBottom: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                                📝 <strong>CV Sharing:</strong> Student agreement is mandatory before sharing CVs with multiple employer houses.
                            </li>
                            <li style={{ display: 'flex', gap: '0.5rem' }}>
                                ✅ <strong>Policy Status:</strong> Policies are active and reflected in Terms & Privacy pages.
                            </li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
