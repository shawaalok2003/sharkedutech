import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export default async function CollegeInquiriesPage() {
    const inquiries = await prisma.collegePartnerInquiry.findMany({
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div style={{ padding: '2rem' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>College Partnership Inquiries</h1>
                <p style={{ color: 'var(--muted-foreground)' }}>Review institutions interested in joining the platform.</p>
            </div>

            <div style={{ display: 'grid', gap: '1.5rem' }}>
                {inquiries.length === 0 ? (
                    <Card>
                        <CardContent style={{ padding: '3rem', textAlign: 'center', color: 'var(--muted-foreground)' }}>
                            No inquiries found.
                        </CardContent>
                    </Card>
                ) : (
                    inquiries.map((inquiry) => (
                        <Card key={inquiry.id}>
                            <CardHeader style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <CardTitle style={{ fontSize: '1.25rem', color: 'var(--primary)' }}>{inquiry.collegeName}</CardTitle>
                                    <div style={{ fontSize: '0.9rem', color: 'var(--muted-foreground)' }}>📍 {inquiry.location}</div>
                                </div>
                                <div style={{ 
                                    padding: '0.25rem 0.75rem', 
                                    borderRadius: '9999px', 
                                    fontSize: '0.8rem', 
                                    fontWeight: 600,
                                    backgroundColor: inquiry.status === 'Pending' ? '#FEF3C7' : '#DCFCE7',
                                    color: inquiry.status === 'Pending' ? '#92400E' : '#166534'
                                }}>
                                    {inquiry.status}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>Contact Person</div>
                                        <div style={{ color: 'var(--foreground)' }}>{inquiry.contactPerson}</div>
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>Official Email</div>
                                        <div style={{ color: 'var(--foreground)' }}>{inquiry.officialEmail}</div>
                                    </div>
                                    <div style={{ gridColumn: 'span 2', fontSize: '0.8rem', color: 'var(--muted-foreground)', marginTop: '0.5rem', borderTop: '1px solid var(--border)', paddingTop: '0.5rem' }}>
                                        Submitted on: {new Date(inquiry.createdAt).toLocaleString()}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
