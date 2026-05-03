"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/Card";

function ResetPasswordContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, newPassword, token }),
            });

            const result = await response.json();

            if (!response.ok) {
                setError(result.error || 'Failed to reset password');
                return;
            }

            setSuccess(true);
            setTimeout(() => {
                router.push('/auth/signin');
            }, 3000);
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: '1rem' }}>
            <Card style={{ width: '100%', maxWidth: '450px' }}>
                <CardHeader>
                    <CardTitle style={{ textAlign: 'center', fontSize: '1.5rem', color: 'var(--primary)' }}>Reset Password</CardTitle>
                </CardHeader>
                <CardContent>
                    {success ? (
                        <div style={{ textAlign: 'center', padding: '2rem' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Password Reset!</h3>
                            <p style={{ color: 'var(--muted-foreground)' }}>Your password has been updated. Redirecting to login...</p>
                        </div>
                    ) : (
                        <form onSubmit={handleReset} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {error && (
                                <div style={{ padding: '0.75rem', borderRadius: '0.5rem', backgroundColor: '#FEF2F2', color: '#DC2626', fontSize: '0.875rem' }}>
                                    {error}
                                </div>
                            )}

                            {token ? (
                                <div style={{ padding: '1rem', backgroundColor: '#F0F9FF', borderRadius: 'var(--radius)', border: '1px solid #BAE6FD', marginBottom: '0.5rem' }}>
                                    <p style={{ fontSize: '0.875rem', color: '#0369A1', fontWeight: 500 }}>
                                        🛡️ Secure Reset Link Active
                                    </p>
                                    <p style={{ fontSize: '0.75rem', color: '#0C4A6E', marginTop: '0.25rem' }}>
                                        You are resetting your password using a direct link from the administrator.
                                    </p>
                                </div>
                            ) : (
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="your.email@example.com"
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            borderRadius: 'var(--radius)',
                                            border: '1px solid var(--border)',
                                            fontSize: '1rem',
                                        }}
                                    />
                                </div>
                            )}

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        borderRadius: 'var(--radius)',
                                        border: '1px solid var(--border)',
                                        fontSize: '1rem',
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                                    Confirm New Password
                                </label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        borderRadius: 'var(--radius)',
                                        border: '1px solid var(--border)',
                                        fontSize: '1rem',
                                    }}
                                />
                            </div>

                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? 'Resetting...' : 'Reset Password'}
                            </Button>
                        </form>
                    )}
                </CardContent>
                <CardFooter style={{ display: 'flex', justifyContent: 'center', borderTop: '1px solid var(--border)', padding: '1rem' }}>
                    <Link href="/auth/signin" style={{ fontSize: '0.875rem', color: 'var(--primary)', fontWeight: 600 }}>
                        Back to Login
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ResetPasswordContent />
        </Suspense>
    );
}
