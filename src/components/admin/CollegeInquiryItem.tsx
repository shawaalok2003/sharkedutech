"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { toast } from "react-hot-toast";

interface InquiryProps {
    inquiry: {
        id: string;
        collegeName: string;
        location: string;
        contactPerson: string;
        officialEmail: string;
        status: string;
        createdAt: Date | string;
    };
}

export function CollegeInquiryItem({ inquiry: initialInquiry }: InquiryProps) {
    const [inquiry, setInquiry] = useState(initialInquiry);
    const [loading, setLoading] = useState<string | null>(null);

    const handleAction = async (action: 'Approved' | 'Rejected') => {
        setLoading(action);
        try {
            const res = await fetch(`/api/admin/college-inquiries/${inquiry.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: action })
            });

            if (!res.ok) throw new Error('Failed to update status');
            
            const updated = await res.json();
            setInquiry(updated);
            toast.success(`Inquiry ${action} successfully`);
        } catch (error) {
            toast.error('An error occurred. Please try again.');
        } finally {
            setLoading(null);
        }
    };

    const statusColors = {
        Pending: { bg: '#FFF7ED', text: '#9A3412', glow: 'rgba(251, 146, 60, 0.2)' },
        Approved: { bg: '#F0FDF4', text: '#166534', glow: 'rgba(34, 197, 94, 0.2)' },
        Rejected: { bg: '#FEF2F2', text: '#991B1B', glow: 'rgba(239, 68, 68, 0.2)' }
    };

    const colors = statusColors[inquiry.status as keyof typeof statusColors] || statusColors.Pending;

    return (
        <Card style={{ 
            background: 'rgba(255, 255, 255, 0.7)', 
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.5)',
            boxShadow: '0 10px 30px rgba(0, 33, 71, 0.05)',
            transition: 'all 0.3s ease',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', backgroundColor: colors.text }} />
            <CardHeader style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 2rem' }}>
                <div>
                    <CardTitle style={{ fontSize: '1.5rem', fontWeight: 900, color: '#002147', letterSpacing: '-0.02em' }}>{inquiry.collegeName}</CardTitle>
                    <div style={{ fontSize: '1rem', color: '#64748b', fontWeight: 600 }}>📍 {inquiry.location}</div>
                </div>
                <div style={{ 
                    padding: '0.5rem 1.25rem', 
                    borderRadius: '9999px', 
                    fontSize: '0.8rem', 
                    fontWeight: 800,
                    letterSpacing: '0.05em',
                    backgroundColor: colors.bg,
                    color: colors.text,
                    boxShadow: `0 0 15px ${colors.glow}`,
                    textTransform: 'uppercase'
                }}>
                    {inquiry.status}
                </div>
            </CardHeader>
            <CardContent style={{ padding: '0 2rem 2rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
                    <div>
                        <div style={{ fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', color: '#94a3b8', marginBottom: '0.5rem' }}>Representative</div>
                        <div style={{ color: '#002147', fontWeight: 700, fontSize: '1.1rem' }}>{inquiry.contactPerson}</div>
                    </div>
                    <div>
                        <div style={{ fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', color: '#94a3b8', marginBottom: '0.5rem' }}>Institutional Contact</div>
                        <div style={{ color: '#002147', fontWeight: 700, fontSize: '1.1rem' }}>{inquiry.officialEmail}</div>
                    </div>
                    <div style={{ alignSelf: 'center' }}>
                         <div style={{ fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', color: '#94a3b8', marginBottom: '0.5rem' }}>Submitted Date</div>
                         <div style={{ color: '#64748b', fontWeight: 600 }}>{new Date(inquiry.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem' }}>
                    {inquiry.status === 'Pending' && (
                        <>
                            <Button 
                                onClick={() => handleAction('Approved')}
                                disabled={!!loading}
                                style={{ background: '#22c55e', color: 'white', fontWeight: 700, borderRadius: '12px' }}
                            >
                                {loading === 'Approved' ? 'Processing...' : 'Approve Institution'}
                            </Button>
                            <Button 
                                onClick={() => handleAction('Rejected')}
                                disabled={!!loading}
                                variant="ghost"
                                style={{ color: '#ef4444', fontWeight: 700, borderRadius: '12px', border: '1px solid #fee2e2' }}
                            >
                                {loading === 'Rejected' ? 'Processing...' : 'Decline'}
                            </Button>
                        </>
                    )}
                    <a href={`mailto:${inquiry.officialEmail}`} style={{ textDecoration: 'none', marginLeft: 'auto' }}>
                        <Button variant="outline" style={{ borderRadius: '12px', fontWeight: 700 }}>
                            Send Direct Email
                        </Button>
                    </a>
                </div>
            </CardContent>
        </Card>
    );
}
