import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
    const userCount = await prisma.user.count();
    const jobCount = await prisma.job.count();
    const applicationCount = await prisma.application.count();
    const collegeCount = await prisma.college.count();
    const courseCount = await prisma.course.count();
    const admissionCount = await prisma.admissionApplication.count();

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.875rem', fontWeight: 700, color: 'var(--primary)' }}>Admin Dashboard</h1>
                <p style={{ color: 'var(--muted-foreground)' }}>System overview and statistics.</p>
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
            </div>
        </div>
    );
}
