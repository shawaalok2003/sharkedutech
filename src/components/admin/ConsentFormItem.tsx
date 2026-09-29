"use client";

import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/Card";
import { toast } from "react-hot-toast";

interface ConsentItemProps {
    form: {
        id: string;
        fullName: string;
        phone: string;
        email: string;
        qualification: string;
        address: string;
        amountPaid: string | null;
        receiptNumber: string | null;
        checklist: string | null;
        cvUrl?: string | null;
        photoUrl?: string | null;
        educationCertUrl?: string | null;
        idProofUrl?: string | null;
        experienceCertUrl?: string | null;
        documents?: string | null;
        termsAgreed: boolean;
        refundPolicyAgreed: boolean;
        genuineDocsAgreed: boolean;
        declarationAgreed: boolean;
        signatureName: string | null;
        status: string;
        adminRemarks: string | null;
        createdAt: Date | string;
    };
    onDelete?: (id: string) => void;
}

export function ConsentFormItem({ form: initialForm, onDelete }: ConsentItemProps) {
    const [form, setForm] = useState(initialForm);
    const [loading, setLoading] = useState<string | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [remarks, setRemarks] = useState(initialForm.adminRemarks || '');

    const handleStatusUpdate = async (newStatus: 'Approved' | 'Conditional (Training Req.)' | 'Pending') => {
        setLoading(newStatus);
        try {
            const res = await fetch(`/api/admin/candidate-consent/${form.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus, adminRemarks: remarks })
            });

            if (!res.ok) throw new Error('Failed to update status');

            const updated = await res.json();
            setForm(updated);
            toast.success(`Form marked as ${newStatus} & notification email sent to ${form.email}!`);
        } catch (error) {
            toast.error('Failed to update status. Please try again.');
        } finally {
            setLoading(null);
        }
    };

    const handleDelete = async () => {
        if (!confirm(`Are you sure you want to delete the consent form for ${form.fullName}?`)) return;
        setLoading('delete');
        try {
            const res = await fetch(`/api/admin/candidate-consent/${form.id}`, {
                method: 'DELETE'
            });

            if (!res.ok) throw new Error('Failed to delete form');
            toast.success('Form deleted successfully');
            if (onDelete) onDelete(form.id);
        } catch (error) {
            toast.error('Failed to delete consent form.');
        } finally {
            setLoading(null);
        }
    };

    let checklistItems: string[] = [];
    try {
        if (form.checklist) {
            checklistItems = JSON.parse(form.checklist);
        }
    } catch (e) {
        checklistItems = [];
    }

    const uploadedDocsList = [
        { key: 'cv', label: 'Updated CV / Resume', url: form.cvUrl, icon: '📄' },
        { key: 'photo', label: 'Passport-size Photograph', url: form.photoUrl, icon: '🖼️' },
        { key: 'certificates', label: 'Educational & Hospitality Certificates', url: form.educationCertUrl, icon: '🎓' },
        { key: 'idProof', label: 'Identity Proof (Aadhaar / PAN / Passport)', url: form.idProofUrl, icon: '🪪' },
        { key: 'experience', label: 'Experience / Relieving Certificates', url: form.experienceCertUrl, icon: '💼' },
    ];
    const uploadedCount = uploadedDocsList.filter(d => Boolean(d.url)).length;

    const statusBadgeColors = {
        Pending: { bg: '#FEF3C7', text: '#92400E', border: '#FDE68A' },
        Approved: { bg: '#D1FAE5', text: '#065F46', border: '#A7F3D0' },
        'Conditional (Training Req.)': { bg: '#DBEAFE', text: '#1E40AF', border: '#BFDBFE' }
    };

    const currentBadge = statusBadgeColors[form.status as keyof typeof statusBadgeColors] || statusBadgeColors.Pending;
    const refCode = `SHARK-CF-${form.id.slice(-6).toUpperCase()}`;

    return (
        <>
            <Card style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '14px',
                boxShadow: '0 4px 15px rgba(0, 33, 71, 0.05)',
                padding: '1.5rem',
                position: 'relative'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#002147', margin: 0 }}>
                                {form.fullName}
                            </h3>
                            <span style={{
                                background: currentBadge.bg,
                                color: currentBadge.text,
                                border: `1px solid ${currentBadge.border}`,
                                padding: '0.2rem 0.65rem',
                                borderRadius: '999px',
                                fontSize: '0.75rem',
                                fontWeight: 800
                            }}>
                                {form.status}
                            </span>
                        </div>
                        <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0 }}>
                            Ref: <strong>{refCode}</strong> &bull; Submitted: {new Date(form.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <button
                            onClick={() => setShowDetailModal(true)}
                            style={{
                                padding: '0.45rem 0.9rem',
                                background: '#f8fafc',
                                border: '1px solid #cbd5e1',
                                borderRadius: '8px',
                                color: '#0f172a',
                                fontWeight: 700,
                                fontSize: '0.825rem',
                                cursor: 'pointer'
                            }}
                        >
                            🔍 View Full Submission
                        </button>

                        <button
                            onClick={() => handleStatusUpdate('Approved')}
                            disabled={loading !== null || form.status === 'Approved'}
                            style={{
                                padding: '0.45rem 0.9rem',
                                background: form.status === 'Approved' ? '#e2e8f0' : '#10b981',
                                border: 'none',
                                borderRadius: '8px',
                                color: form.status === 'Approved' ? '#94a3b8' : '#ffffff',
                                fontWeight: 700,
                                fontSize: '0.825rem',
                                cursor: form.status === 'Approved' ? 'default' : 'pointer'
                            }}
                        >
                            ✔ Approve
                        </button>

                        <button
                            onClick={() => handleStatusUpdate('Conditional (Training Req.)')}
                            disabled={loading !== null || form.status === 'Conditional (Training Req.)'}
                            style={{
                                padding: '0.45rem 0.9rem',
                                background: form.status === 'Conditional (Training Req.)' ? '#e2e8f0' : '#2563eb',
                                border: 'none',
                                borderRadius: '8px',
                                color: form.status === 'Conditional (Training Req.)' ? '#94a3b8' : '#ffffff',
                                fontWeight: 700,
                                fontSize: '0.825rem',
                                cursor: form.status === 'Conditional (Training Req.)' ? 'default' : 'pointer'
                            }}
                        >
                            ⚡ Conditional
                        </button>

                        <button
                            onClick={handleDelete}
                            disabled={loading !== null}
                            style={{
                                padding: '0.45rem 0.75rem',
                                background: 'transparent',
                                border: '1px solid #fca5a5',
                                borderRadius: '8px',
                                color: '#ef4444',
                                fontWeight: 700,
                                fontSize: '0.825rem',
                                cursor: 'pointer'
                            }}
                        >
                            🗑
                        </button>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', background: '#f8fafc', padding: '1rem', borderRadius: '10px', fontSize: '0.875rem' }}>
                    <div>
                        <span style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Contact Info</span>
                        <div style={{ fontWeight: 600, color: '#0f172a' }}>📞 {form.phone}</div>
                        <div style={{ color: '#0284c7', textDecoration: 'none' }}>✉️ {form.email}</div>
                    </div>
                    <div>
                        <span style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Qualification</span>
                        <div style={{ fontWeight: 600, color: '#0f172a' }}>🎓 {form.qualification}</div>
                    </div>
                    <div>
                        <span style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Payment Details</span>
                        <div style={{ fontWeight: 600, color: '#0f172a' }}>
                            {form.amountPaid ? `₹ ${form.amountPaid}` : 'Not Specified'}
                            {form.receiptNumber ? ` (Receipt: ${form.receiptNumber})` : ''}
                        </div>
                    </div>
                    <div>
                        <span style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Digital Signature</span>
                        <div style={{ fontWeight: 700, color: '#0f172a', fontStyle: 'italic' }}>✍️ {form.signatureName || form.fullName}</div>
                    </div>
                </div>

                {/* Uploaded Documents Quick Access Strip */}
                <div style={{ marginTop: '0.85rem', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.775rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>
                            📎 Attached Documents ({uploadedCount}/5):
                        </span>
                        {uploadedCount > 0 ? (
                            uploadedDocsList.filter(d => Boolean(d.url)).map(d => (
                                <a
                                    key={d.key}
                                    href={d.url!}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.25rem',
                                        padding: '0.25rem 0.55rem',
                                        background: '#eff6ff',
                                        border: '1px solid #bfdbfe',
                                        borderRadius: '6px',
                                        color: '#1d4ed8',
                                        fontSize: '0.75rem',
                                        fontWeight: 700,
                                        textDecoration: 'none'
                                    }}
                                >
                                    <span>{d.icon}</span>
                                    <span>{d.label.split(' ')[0]}</span>
                                    <span>↗</span>
                                </a>
                            ))
                        ) : (
                            <span style={{ fontSize: '0.775rem', color: '#94a3b8', fontStyle: 'italic' }}>No document files attached</span>
                        )}
                    </div>

                    {uploadedCount > 0 && (
                        <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700 }}>
                            ✔ Ready for verification
                        </span>
                    )}
                </div>
            </Card>

            {/* View Full Submission Modal */}
            {showDetailModal && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0, 15, 35, 0.75)',
                    backdropFilter: 'blur(5px)',
                    zIndex: 99999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '1.5rem'
                }} onClick={() => setShowDetailModal(false)}>
                    <div style={{
                        background: '#ffffff',
                        borderRadius: '16px',
                        maxWidth: '750px',
                        width: '100%',
                        maxHeight: '90vh',
                        overflowY: 'auto',
                        padding: '2rem',
                        position: 'relative',
                        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.3)'
                    }} onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={() => setShowDetailModal(false)}
                            style={{
                                position: 'absolute',
                                top: '1.25rem',
                                right: '1.25rem',
                                border: 'none',
                                background: '#f1f5f9',
                                color: '#475569',
                                width: '2rem',
                                height: '2rem',
                                borderRadius: '50%',
                                cursor: 'pointer',
                                fontWeight: 800
                            }}
                        >
                            ✕
                        </button>

                        <div style={{ borderBottom: '2px solid #002147', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#b45309', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                Shark International Edutech Pvt. Ltd.
                            </span>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#002147', margin: '0.25rem 0' }}>
                                Candidate Registration &amp; Consent Form Record
                            </h2>
                            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
                                Reference Number: <strong>{refCode}</strong> &bull; Recorded on {new Date(form.createdAt).toLocaleString('en-IN')}
                            </p>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                            <div>
                                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Full Legal Name</label>
                                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>{form.fullName}</div>
                            </div>
                            <div>
                                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Phone / WhatsApp</label>
                                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>{form.phone}</div>
                            </div>
                            <div>
                                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Email Address</label>
                                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0284c7' }}>{form.email}</div>
                            </div>
                            <div>
                                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Highest Qualification</label>
                                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>{form.qualification}</div>
                            </div>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Permanent Residential Address</label>
                                <div style={{ fontSize: '0.95rem', color: '#1e293b' }}>{form.address}</div>
                            </div>
                            <div>
                                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Registration Amount Paid</label>
                                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>{form.amountPaid ? `₹ ${form.amountPaid}` : 'None specified'}</div>
                            </div>
                            <div>
                                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Official Receipt / Ref Number</label>
                                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>{form.receiptNumber || 'None specified'}</div>
                            </div>
                        </div>

                        {/* Uploaded Documents Detailed Grid */}
                        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#002147', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                    📁 Uploaded Documents (Clause 1.3 Checklist)
                                </div>
                                <span style={{ fontSize: '0.75rem', background: uploadedCount > 0 ? '#dcfce7' : '#f1f5f9', color: uploadedCount > 0 ? '#15803d' : '#64748b', padding: '0.2rem 0.55rem', borderRadius: '4px', fontWeight: 700 }}>
                                    {uploadedCount} of 5 Files Attached
                                </span>
                            </div>

                            <div style={{ display: 'grid', gap: '0.75rem' }}>
                                {uploadedDocsList.map(doc => {
                                    const hasFile = Boolean(doc.url);
                                    return (
                                        <div
                                            key={doc.key}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                padding: '0.75rem 1rem',
                                                background: hasFile ? '#ffffff' : '#f1f5f9',
                                                border: hasFile ? '1px solid #cbd5e1' : '1px dashed #cbd5e1',
                                                borderRadius: '8px',
                                                gap: '0.75rem',
                                                flexWrap: 'wrap'
                                            }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                                                <span style={{ fontSize: '1.35rem' }}>{doc.icon}</span>
                                                <div>
                                                    <div style={{ fontSize: '0.875rem', fontWeight: 700, color: hasFile ? '#0f172a' : '#64748b' }}>
                                                        {doc.label}
                                                    </div>
                                                    <div style={{ fontSize: '0.725rem', color: hasFile ? '#10b981' : '#94a3b8', fontWeight: 600 }}>
                                                        {hasFile ? '✔ Uploaded & Available' : '⚪ Not Uploaded by Candidate'}
                                                    </div>
                                                </div>
                                            </div>

                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                {hasFile ? (
                                                    <>
                                                        {doc.key === 'photo' && doc.url && (
                                                            <img
                                                                src={doc.url}
                                                                alt="Photo"
                                                                style={{ width: 36, height: 36, borderRadius: '4px', objectFit: 'cover', border: '1px solid #cbd5e1' }}
                                                            />
                                                        )}
                                                        <a
                                                            href={doc.url!}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            style={{
                                                                display: 'inline-flex',
                                                                alignItems: 'center',
                                                                gap: '0.3rem',
                                                                padding: '0.4rem 0.8rem',
                                                                background: '#002147',
                                                                color: '#ffffff',
                                                                borderRadius: '6px',
                                                                fontSize: '0.775rem',
                                                                fontWeight: 700,
                                                                textDecoration: 'none'
                                                            }}
                                                        >
                                                            👀 View / Open
                                                        </a>
                                                        <a
                                                            href={doc.url!}
                                                            download
                                                            style={{
                                                                display: 'inline-flex',
                                                                alignItems: 'center',
                                                                gap: '0.3rem',
                                                                padding: '0.4rem 0.8rem',
                                                                background: '#f8fafc',
                                                                border: '1px solid #cbd5e1',
                                                                color: '#0f172a',
                                                                borderRadius: '6px',
                                                                fontSize: '0.775rem',
                                                                fontWeight: 700,
                                                                textDecoration: 'none'
                                                            }}
                                                        >
                                                            ⬇ Download
                                                        </a>
                                                    </>
                                                ) : (
                                                    <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontStyle: 'italic' }}>
                                                        Not attached
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {checklistItems.length > 0 && (
                            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '10px', marginBottom: '1.5rem' }}>
                                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#002147', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                                    Document Checklist Submitted
                                </div>
                                <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.85rem', color: '#334155' }}>
                                    {checklistItems.map((doc, idx) => (
                                        <li key={idx} style={{ marginBottom: '0.25rem' }}>✔ {doc}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div style={{ background: '#fefce8', border: '1px solid #fef08a', padding: '1rem', borderRadius: '10px', marginBottom: '1.5rem', fontSize: '0.85rem', color: '#854d0e' }}>
                            <div style={{ fontWeight: 800, marginBottom: '0.25rem' }}>Explicit Declarations Confirmed:</div>
                            <div>✔ Agreed to all 15 clauses of Terms &amp; Conditions</div>
                            <div>✔ Acknowledged 3-Month Placement &amp; 100% Refund Policy Guarantee</div>
                            <div>✔ Certified authenticity of all credentials and records</div>
                            <div style={{ marginTop: '0.5rem', fontWeight: 700 }}>
                                Digital Signature: <em>{form.signatureName || form.fullName}</em>
                            </div>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.35rem' }}>
                                Admin Verification Remarks
                            </label>
                            <textarea
                                value={remarks}
                                onChange={(e) => setRemarks(e.target.value)}
                                placeholder="Add notes (e.g. verified HM marksheet, interview scheduled with Lemon Tree Candolim)..."
                                style={{
                                    width: '100%',
                                    padding: '0.65rem',
                                    borderRadius: '8px',
                                    border: '1px solid #cbd5e1',
                                    fontSize: '0.85rem'
                                }}
                                rows={2}
                            />
                            <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '0.35rem 0 0 0' }}>
                                📧 Changing status will automatically send an official branded notification email with your remarks to <strong>{form.email}</strong>.
                            </p>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <a
                                href="/Candidate_Consent_Form.pdf"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    fontSize: '0.85rem',
                                    color: '#2563eb',
                                    fontWeight: 700,
                                    textDecoration: 'none'
                                }}
                            >
                                📄 View Blank Official PDF Form
                            </a>

                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button
                                    onClick={() => handleStatusUpdate('Approved')}
                                    style={{
                                        padding: '0.6rem 1.25rem',
                                        background: '#10b981',
                                        color: '#ffffff',
                                        fontWeight: 800,
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Approve Form
                                </button>
                                <button
                                    onClick={() => setShowDetailModal(false)}
                                    style={{
                                        padding: '0.6rem 1.25rem',
                                        background: '#002147',
                                        color: '#ffffff',
                                        fontWeight: 800,
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
