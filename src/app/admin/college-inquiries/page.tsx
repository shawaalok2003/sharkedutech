import { prisma } from '@/lib/prisma';
import { Card, CardContent } from "@/components/ui/Card";
import { CollegeInquiryItem } from '@/components/admin/CollegeInquiryItem';

export const dynamic = 'force-dynamic';

export default async function CollegeInquiriesPage() {
    const inquiries = await prisma.collegePartnerInquiry.findMany({
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div style={{ padding: '3rem', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ marginBottom: '3rem' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '0.5rem' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#002147', letterSpacing: '-0.04em' }}>College Partnership Inquiries</h1>
                    <div style={{ padding: '0.4rem 1rem', background: '#0062ff', color: 'white', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 800 }}>
                        {inquiries.filter(i => i.status === 'Pending').length} NEW
                    </div>
                </div>
                <p style={{ color: '#64748b', fontSize: '1.1rem', fontWeight: 500 }}>Review and manage institutional partnerships for the Shark Edutech platform.</p>
            </div>

            <div style={{ display: 'grid', gap: '2rem' }}>
                {inquiries.length === 0 ? (
                    <Card style={{ background: 'rgba(255, 255, 255, 0.5)', backdropFilter: 'blur(10px)', borderStyle: 'dashed' }}>
                        <CardContent style={{ padding: '5rem', textAlign: 'center', color: '#94a3b8' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📥</div>
                            <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>No partnership inquiries yet.</div>
                            <div style={{ fontSize: '0.9rem' }}>Incoming institutional applications will appear here.</div>
                        </CardContent>
                    </Card>
                ) : (
                    inquiries.map((inquiry) => (
                        <CollegeInquiryItem key={inquiry.id} inquiry={inquiry as any} />
                    ))
                )}
            </div>
        </div>
    );
}
