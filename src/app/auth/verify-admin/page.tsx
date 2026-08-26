"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

function VerifyAdminForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    const [loading, setLoading] = useState(true);
    const [valid, setValid] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!token || !email) {
            setError('Invalid or missing verification parameters.');
            setLoading(false);
            return;
        }

        async function checkToken() {
            try {
                const res = await fetch(`/api/auth/verify-admin?token=${encodeURIComponent(token!)}&email=${encodeURIComponent(email!)}`);
                const data = await res.json();

                if (res.ok && data.valid) {
                    setValid(true);
                    setUser(data.user);
                } else {
                    setError(data.error || 'Invalid or expired admin verification link.');
                }
            } catch (err) {
                setError('Failed to verify admin invitation link.');
            } finally {
                setLoading(false);
            }
        }

        checkToken();
    }, [token, email]);

    const handleActivate = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password && password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        if (password && password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setSubmitting(true);
        try {
            const res = await fetch('/api/auth/verify-admin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, email, password })
            });

            const data = await res.json();
            if (res.ok && data.success) {
                setSuccessMessage(data.message);
                setTimeout(() => {
                    router.push('/auth/signin?verified=true');
                }, 2000);
            } else {
                setError(data.error || 'Failed to activate admin account.');
            }
        } catch (err) {
            setError('An error occurred during account activation.');
        } finally {
            setSubmitting(false);
        }
    };

    const permLabels: Record<string, string> = {
        manage_jobs: "Job Listings & Applications",
        manage_colleges: "Colleges Directory & Partner Inquiries",
        manage_admissions: "Admissions Courses & Student Applications",
        manage_users: "User Accounts & Role Management"
    };

    const permissionsList = user?.adminPermissions ? user.adminPermissions.split(',') : [];

    return (
        <div style={{ background: '#ffffff', color: '#001736', width: '100%', maxWidth: '520px', borderRadius: '1.5rem', padding: '3rem 2.5rem', boxShadow: '0 30px 70px rgba(0,0,0,0.5)' }}>
            {/* Brand Logo */}
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <Link href="/">
                    <Image src="/images/shark_edu_tech_logo-removebg-preview.png" alt="Shark Edutech" width={220} height={58} style={{ objectFit: 'contain' }} priority />
                </Link>
            </div>

            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, textAlign: 'center', marginBottom: '0.5rem', color: '#001736' }}>
                🔐 Admin Access Verification
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.95rem', textAlign: 'center', marginBottom: '2rem' }}>
                Verify your email address to activate role-based administrative access.
            </p>

            {loading && (
                <div style={{ textAlign: 'center', padding: '2rem 0', color: '#3b82f6', fontWeight: 600 }}>
                    ⏳ Verifying admin invitation token...
                </div>
            )}

            {error && !loading && (
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '1rem', borderRadius: '10px', fontSize: '0.95rem', marginBottom: '1.5rem', textAlign: 'center' }}>
                    ❌ {error}
                </div>
            )}

            {successMessage && (
                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', padding: '1.25rem', borderRadius: '10px', fontSize: '1rem', fontWeight: 700, marginBottom: '1.5rem', textAlign: 'center' }}>
                    🎉 {successMessage}
                    <p style={{ fontSize: '0.85rem', fontWeight: 400, margin: '0.5rem 0 0 0' }}>Redirecting to login page...</p>
                </div>
            )}

            {valid && !successMessage && (
                <form onSubmit={handleActivate}>
                    <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '1.75rem' }}>
                        <p style={{ fontSize: '0.85rem', fontWeight: 800, color: '#001736', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                            Verified Email Address:
                        </p>
                        <p style={{ fontWeight: 700, fontSize: '1.05rem', color: '#2563eb', margin: '0 0 1rem 0' }}>{email}</p>

                        <p style={{ fontSize: '0.85rem', fontWeight: 800, color: '#001736', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                            Granted Admin Permissions:
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                            {permissionsList.map((perm: string) => (
                                <span key={perm} style={{ background: '#dbeafe', color: '#1e40af', border: '1px solid #bfdbfe', padding: '0.35rem 0.75rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700 }}>
                                    ✓ {permLabels[perm] || perm}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div style={{ marginBottom: '1.25rem' }}>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: '#001736', marginBottom: '0.5rem' }}>
                            Create New Admin Password (Optional)
                        </label>
                        <input 
                            type="password" 
                            placeholder="Enter password (min 6 chars)" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ width: '100%', padding: '0.85rem 1rem', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '0.95rem', boxSizing: 'border-box' }}
                        />
                    </div>

                    {password.length > 0 && (
                        <div style={{ marginBottom: '1.75rem' }}>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: '#001736', marginBottom: '0.5rem' }}>
                                Confirm Admin Password
                            </label>
                            <input 
                                type="password" 
                                placeholder="Confirm password" 
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                style={{ width: '100%', padding: '0.85rem 1rem', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '0.95rem', boxSizing: 'border-box' }}
                            />
                        </div>
                    )}

                    <button 
                        type="submit" 
                        disabled={submitting}
                        style={{ width: '100%', background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', color: '#ffffff', border: 'none', padding: '0.95rem', borderRadius: '10px', fontSize: '1rem', fontWeight: 800, cursor: 'pointer', boxShadow: '0 8px 20px rgba(37, 99, 235, 0.3)' }}
                    >
                        {submitting ? 'Activating Admin Access...' : 'Verify Email & Activate Admin Access →'}
                    </button>
                </form>
            )}
        </div>
    );
}

export default function VerifyAdminPage() {
    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #000c1e 0%, #001736 50%, #002b5b 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem', color: '#ffffff' }}>
            <Suspense fallback={<div style={{ color: '#ffffff', fontWeight: 700 }}>Loading verification portal...</div>}>
                <VerifyAdminForm />
            </Suspense>
        </div>
    );
}
