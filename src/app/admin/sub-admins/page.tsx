"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

type SubAdmin = {
    id: string;
    email: string;
    name?: string;
    role: string;
    adminPermissions?: string;
    isInviteAccepted: boolean;
    inviteToken?: string;
    createdAt: string;
};

const ALL_PERMISSIONS = [
    { key: 'manage_jobs', label: 'Job Listings & Applications', desc: 'Manage jobs, view applicants, and approve employer postings' },
    { key: 'manage_colleges', label: 'Colleges Directory & Inquiries', desc: 'Manage college profiles, partner inquiries, and college admins' },
    { key: 'manage_admissions', label: 'Admissions Courses & Applications', desc: 'Manage admissions courses, student applications, and enrollment docs' },
    { key: 'manage_users', label: 'User Accounts & Roles', desc: 'Manage user profiles, accounts, and candidate/employer credentials' }
];

export default function SubAdminsPage() {
    const [subAdmins, setSubAdmins] = useState<SubAdmin[]>([]);
    const [loading, setLoading] = useState(true);
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [selectedPerms, setSelectedPerms] = useState<string[]>(['manage_jobs', 'manage_colleges', 'manage_admissions']);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [createdVerifyLink, setCreatedVerifyLink] = useState('');
    const [error, setError] = useState('');
    const [resendingEmail, setResendingEmail] = useState<string | null>(null);

    useEffect(() => {
        fetchSubAdmins();
    }, []);

    async function fetchSubAdmins() {
        try {
            const res = await fetch('/api/admin/sub-admins');
            if (res.ok) {
                const data = await res.json();
                setSubAdmins(data);
            }
        } catch (err) {
            console.error("Failed to fetch sub-admins", err);
        } finally {
            setLoading(false);
        }
    }

    const togglePermission = (key: string) => {
        if (selectedPerms.includes(key)) {
            setSelectedPerms(selectedPerms.filter(k => k !== key));
        } else {
            setSelectedPerms([...selectedPerms, key]);
        }
    };

    const handleGrantAccess = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setCreatedVerifyLink('');
        setError('');

        if (!email || !email.includes('@')) {
            setError('Please enter a valid email address.');
            return;
        }

        if (selectedPerms.length === 0) {
            setError('Please select at least one admin permission.');
            return;
        }

        setSubmitting(true);
        try {
            const res = await fetch('/api/admin/sub-admins', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, name, permissions: selectedPerms })
            });

            const data = await res.json();

            if (res.ok) {
                setMessage(data.message);
                if (data.verifyLink) {
                    setCreatedVerifyLink(data.verifyLink);
                }
                setEmail('');
                setName('');
                fetchSubAdmins();
            } else {
                setError(data.error || 'Failed to grant admin access');
            }
        } catch (err) {
            setError('An error occurred while granting admin access');
        } finally {
            setSubmitting(false);
        }
    };

    const handleResendEmail = async (subEmail: string) => {
        setResendingEmail(subEmail);
        try {
            const res = await fetch('/api/admin/sub-admins', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: subEmail })
            });
            const data = await res.json();
            if (res.ok) {
                alert(data.message);
                fetchSubAdmins();
            } else {
                alert(data.error || 'Failed to resend verification email');
            }
        } catch (err) {
            alert('Error resending email');
        } finally {
            setResendingEmail(null);
        }
    };

    const handleCopyLink = (sub: SubAdmin) => {
        const link = `${window.location.origin}/auth/verify-admin?token=${sub.inviteToken}&email=${encodeURIComponent(sub.email)}`;
        navigator.clipboard.writeText(link);
        alert(`Verification link copied to clipboard!\n\n${link}`);
    };

    const handleRevoke = async (id: string, adminEmail: string) => {
        if (!confirm(`Are you sure you want to revoke admin access for ${adminEmail}?`)) return;

        try {
            const res = await fetch(`/api/admin/sub-admins?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                fetchSubAdmins();
            } else {
                alert('Failed to revoke admin access');
            }
        } catch (err) {
            console.error("Revoke error", err);
        }
    };

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2.5rem' }}>
                <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.5rem' }}>
                    Role-Based Admin Access Management
                </h1>
                <p style={{ color: 'var(--muted-foreground)', fontSize: '1rem' }}>
                    Grant granular administrative permissions (Jobs, Colleges, Admissions, Users) to specific email addresses with automated email verification.
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
                {/* Form to Grant Admin Access */}
                <Card style={{ background: '#ffffff', borderRadius: '1.25rem', border: '1px solid #e2e8f0', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
                    <CardHeader>
                        <CardTitle style={{ fontSize: '1.25rem', color: '#001736' }}>
                            ➕ Grant Sub-Admin Access &amp; Invite
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {message && (
                            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', padding: '1rem', borderRadius: '10px', marginBottom: '1.25rem', fontSize: '0.9rem' }}>
                                <div style={{ fontWeight: 700, marginBottom: '0.5rem' }}>✅ {message}</div>
                                {createdVerifyLink && (
                                    <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #bbf7d0' }}>
                                        <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.825rem', fontWeight: 700, color: '#14532d' }}>
                                            🔗 Direct Verification Link (Copy &amp; share directly):
                                        </p>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <input 
                                                type="text" 
                                                readOnly 
                                                value={createdVerifyLink} 
                                                style={{ width: '100%', padding: '0.4rem 0.6rem', fontSize: '0.8rem', borderRadius: '6px', border: '1px solid #86efac', background: '#ffffff', color: '#1e293b' }} 
                                            />
                                            <button
                                                onClick={() => {
                                                    navigator.clipboard.writeText(createdVerifyLink);
                                                    alert('Verification link copied to clipboard!');
                                                }}
                                                style={{ padding: '0.4rem 0.8rem', background: '#166534', color: '#ffffff', border: 'none', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}
                                            >
                                                Copy Link
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        {error && (
                            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '0.85rem 1rem', borderRadius: '8px', marginBottom: '1.25rem', fontSize: '0.9rem' }}>
                                ❌ {error}
                            </div>
                        )}

                        <form onSubmit={handleGrantAccess}>
                            <div style={{ marginBottom: '1.25rem' }}>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: '#001736', marginBottom: '0.4rem' }}>
                                    Recipient Email Address *
                                </label>
                                <input 
                                    type="email" 
                                    required
                                    placeholder="e.g. admin.john@sharkedutech.com" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '0.95rem', boxSizing: 'border-box' }}
                                />
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: '#001736', marginBottom: '0.4rem' }}>
                                    Full Name (Optional)
                                </label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. John Doe" 
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '0.95rem', boxSizing: 'border-box' }}
                                />
                            </div>

                            <div style={{ marginBottom: '1.75rem' }}>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 800, color: '#001736', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    Define Granular Admin Permissions:
                                </label>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                                    {ALL_PERMISSIONS.map((perm) => (
                                        <label 
                                            key={perm.key}
                                            style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.85rem', borderRadius: '10px', border: selectedPerms.includes(perm.key) ? '1.5px solid #3b82f6' : '1px solid #e2e8f0', background: selectedPerms.includes(perm.key) ? '#eff6ff' : '#f8fafc', cursor: 'pointer', transition: 'all 0.2s ease' }}
                                        >
                                            <input 
                                                type="checkbox" 
                                                checked={selectedPerms.includes(perm.key)}
                                                onChange={() => togglePermission(perm.key)}
                                                style={{ marginTop: '0.2rem', width: '16px', height: '16px' }}
                                            />
                                            <div>
                                                <span style={{ fontWeight: 700, color: '#001736', fontSize: '0.95rem', display: 'block' }}>
                                                    {perm.label}
                                                </span>
                                                <span style={{ fontSize: '0.825rem', color: '#64748b' }}>
                                                    {perm.desc}
                                                </span>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <Button 
                                type="submit" 
                                disabled={submitting}
                                style={{ width: '100%', padding: '0.9rem', fontSize: '0.95rem', fontWeight: 800 }}
                            >
                                {submitting ? 'Sending Verification Email...' : '📧 Send Invitation & Grant Access'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Sub-Admin Info Box */}
                <div>
                    <Card style={{ background: 'linear-gradient(135deg, #000c1e 0%, #001736 100%)', color: '#ffffff', borderRadius: '1.25rem', border: '1px solid rgba(255,255,255,0.12)', padding: '1.75rem', marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fed488', marginBottom: '0.75rem' }}>
                            🛡️ Security &amp; Access Control Rules
                        </h3>
                        <ul style={{ paddingLeft: '1.25rem', margin: 0, fontSize: '0.9rem', color: '#cbd5e1', lineHeight: '1.75' }}>
                            <li>Every assigned admin receives an automated email verification link.</li>
                            <li>If email delivery is delayed, Super Admin can copy the verification link directly from the table.</li>
                            <li>Access becomes active only after verification by the assigned email address.</li>
                            <li>Super Admin can revoke or update assigned access permissions at any time.</li>
                        </ul>
                    </Card>
                </div>
            </div>

            {/* Existing Sub-Admins Table */}
            <Card style={{ background: '#ffffff', borderRadius: '1.25rem', border: '1px solid #e2e8f0', boxShadow: '0 10px 30px rgba(0,0,0,0.04)' }}>
                <CardHeader>
                    <CardTitle style={{ fontSize: '1.25rem', color: '#001736' }}>
                        📋 Active Sub-Admins &amp; Verification Status ({subAdmins.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                            Loading admin accounts...
                        </div>
                    ) : subAdmins.length === 0 ? (
                        <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                            No sub-admins configured yet.
                        </div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid #e2e8f0', background: '#f8fafc' }}>
                                        <th style={{ padding: '0.85rem 1rem', color: '#475569', fontWeight: 700 }}>Admin User</th>
                                        <th style={{ padding: '0.85rem 1rem', color: '#475569', fontWeight: 700 }}>Role</th>
                                        <th style={{ padding: '0.85rem 1rem', color: '#475569', fontWeight: 700 }}>Granted Permissions</th>
                                        <th style={{ padding: '0.85rem 1rem', color: '#475569', fontWeight: 700 }}>Verification Status</th>
                                        <th style={{ padding: '0.85rem 1rem', color: '#475569', fontWeight: 700, textAlign: 'right' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {subAdmins.map((sub) => {
                                        const perms = sub.adminPermissions ? sub.adminPermissions.split(',') : [];
                                        const isSuper = sub.role === 'SUPER_ADMIN';

                                        return (
                                            <tr key={sub.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                                <td style={{ padding: '1rem' }}>
                                                    <div style={{ fontWeight: 700, color: '#001736' }}>{sub.name || 'Admin User'}</div>
                                                    <div style={{ fontSize: '0.825rem', color: '#64748b' }}>{sub.email}</div>
                                                </td>
                                                <td style={{ padding: '1rem' }}>
                                                    <span style={{ padding: '0.25rem 0.65rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 800, background: isSuper ? '#dbeafe' : '#f1f5f9', color: isSuper ? '#1e40af' : '#475569' }}>
                                                        {isSuper ? '👑 SUPER ADMIN' : '🛡️ SUB ADMIN'}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '1rem' }}>
                                                    {isSuper ? (
                                                        <span style={{ color: '#059669', fontWeight: 700 }}>Full Platform Access</span>
                                                    ) : perms.length === 0 ? (
                                                        <span style={{ color: '#94a3b8' }}>None Assigned</span>
                                                    ) : (
                                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                                                            {perms.map(p => (
                                                                <span key={p} style={{ padding: '0.2rem 0.55rem', background: '#eff6ff', border: '1px solid #bfdbfe', color: '#1d4ed8', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600 }}>
                                                                    ✓ {p.replace('manage_', '')}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </td>
                                                <td style={{ padding: '1rem' }}>
                                                    {sub.isInviteAccepted ? (
                                                        <span style={{ color: '#166534', background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '0.25rem 0.65rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700 }}>
                                                            ✅ Email Verified &amp; Active
                                                        </span>
                                                    ) : (
                                                        <div>
                                                            <span style={{ color: '#92400e', background: '#fef3c7', border: '1px solid #fde68a', padding: '0.25rem 0.65rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700, display: 'inline-block', marginBottom: '0.4rem' }}>
                                                                ⏳ Pending Email Verification
                                                            </span>
                                                            <div style={{ display: 'flex', gap: '0.4rem' }}>
                                                                <button 
                                                                    onClick={() => handleResendEmail(sub.email)}
                                                                    disabled={resendingEmail === sub.email}
                                                                    style={{ background: '#eff6ff', border: '1px solid #bfdbfe', color: '#1d4ed8', padding: '0.25rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                                                                >
                                                                    {resendingEmail === sub.email ? 'Sending...' : '📧 Resend Email'}
                                                                </button>
                                                                {sub.inviteToken && (
                                                                    <button 
                                                                        onClick={() => handleCopyLink(sub)}
                                                                        style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', color: '#334155', padding: '0.25rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                                                                    >
                                                                        🔗 Copy Link
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                </td>
                                                <td style={{ padding: '1rem', textAlign: 'right' }}>
                                                    {!isSuper && (
                                                        <button 
                                                            onClick={() => handleRevoke(sub.id, sub.email)}
                                                            style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '0.4rem 0.85rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
                                                        >
                                                            Revoke Access
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
