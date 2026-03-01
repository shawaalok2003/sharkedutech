"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/Card";
import OTPInput from "@/components/auth/OTPInput";
import { signIn } from "next-auth/react";

type AuthStep = 'method' | 'password' | 'otp-email' | 'otp-verify';

function SignInContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const type = searchParams.get('type') || 'candidate';

    const isCandidate = type === 'candidate';
    const isEmployer = type === 'employer';
    const isAdmin = type === 'admin';

    // Default to password login as per user request
    const [authStep, setAuthStep] = useState<AuthStep>('password');

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [resendCountdown, setResendCountdown] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Dynamic Title
    const title = isCandidate ? "Candidate Login" : isEmployer ? "Employer Login" : isAdmin ? "Admin Login" : "Login";
    const showBackButton = isCandidate;

    // Step 1: Choose authentication method
    const handleMethodSelect = (method: 'password' | 'otp') => {
        setError(null);
        setAuthStep(method === 'password' ? 'password' : 'otp-email');
    };

    // Step 2: Password Login
    const handlePasswordLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError("Invalid email or password");
                setLoading(false);
                return;
            }

            // Get updated session
            const response = await fetch('/api/auth/session');
            const session = await response.json();

            // Redirect based on role
            if (session?.user?.role === 'ADMIN') {
                router.push("/admin");
            } else if (session?.user?.role === 'EMPLOYER') {
                router.push("/jobs/employer");
            } else {
                router.push("/jobs");
            }
            router.refresh();
        } catch (err) {
            setError('Login failed. Please try again.');
            setLoading(false);
        }
    };

    // Step 3: Send OTP via SMTP
    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const role = type === 'candidate' ? 'CANDIDATE' : type === 'employer' ? 'EMPLOYER' : 'ADMIN';
            const response = await fetch('/api/auth/otp/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, role }),
            });

            const result = await response.json();

            if (!response.ok) {
                setError(result.error || 'Failed to send OTP');
                setLoading(false);
                return;
            }

            setAuthStep('otp-verify');
            startResendCountdown();
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Step 4: Verify OTP
    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const response = await fetch('/api/auth/otp/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code: otp }),
            });

            const result = await response.json();

            if (!response.ok) {
                setError(result.error || 'Invalid OTP');
                setLoading(false);
                return;
            }

            const userData = result.user;

            // Sign in with NextAuth
            const signInResult = await signIn("credentials", {
                email: userData.email,
                password: '', // OTP users don't have passwords
                redirect: false,
            });

            if (signInResult?.error) {
                setError('Sign in failed');
                setLoading(false);
                return;
            }

            // Redirect based on role
            const role = userData.role;
            if (role === 'ADMIN') {
                router.push("/admin");
            } else if (role === 'EMPLOYER') {
                router.push("/jobs/employer");
            } else {
                router.push("/jobs");
            }
            router.refresh();
        } catch (err) {
            setError('Authentication failed. Please try again.');
            setLoading(false);
        }
    };

    const startResendCountdown = () => {
        setResendCountdown(60);
        const interval = setInterval(() => {
            setResendCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const handleResendOTP = async () => {
        if (resendCountdown > 0) return;
        setOtp("");
        await handleSendOTP(new Event('submit') as any);
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: '1rem' }}>
            <Card style={{ width: '100%', maxWidth: '450px' }}>
                <CardHeader>
                    <CardTitle style={{ textAlign: 'center', fontSize: '1.5rem', color: 'var(--primary)' }}>{title}</CardTitle>
                </CardHeader>
                <CardContent>
                    {error && (
                        <div style={{ padding: '0.75rem', borderRadius: '0.5rem', backgroundColor: '#FEF2F2', color: '#DC2626', fontSize: '0.875rem', marginBottom: '1rem' }}>
                            {error}
                        </div>
                    )}

                    {/* Method selection removed as per user request */}

                    {/* Step 2: Password Login */}
                    {authStep === 'password' && (
                        <form onSubmit={handlePasswordLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={loading}
                                    placeholder="your.email@example.com"
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        borderRadius: 'var(--radius)',
                                        border: `1px solid ${error ? '#DC2626' : 'var(--border)'}`,
                                        fontSize: '1rem',
                                        backgroundColor: loading ? '#F3F4F6' : 'white',
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                                    Password
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={loading}
                                    placeholder="••••••••"
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        borderRadius: 'var(--radius)',
                                        border: `1px solid ${error ? '#DC2626' : 'var(--border)'}`,
                                        fontSize: '1rem',
                                        backgroundColor: loading ? '#F3F4F6' : 'white',
                                    }}
                                />
                            </div>

                            <Button type="submit" className="w-full" disabled={loading || !email || !password}>
                                {loading ? 'Logging in...' : 'Login'}
                            </Button>
                        </form>
                    )}

                    {/* Step 3: OTP - Email */}
                    {authStep === 'otp-email' && (
                        <form onSubmit={handleSendOTP} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={loading}
                                    placeholder="your.email@example.com"
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        borderRadius: 'var(--radius)',
                                        border: `1px solid ${error ? '#DC2626' : 'var(--border)'}`,
                                        fontSize: '1rem',
                                        backgroundColor: loading ? '#F3F4F6' : 'white',
                                    }}
                                />
                                <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginTop: '0.25rem' }}>
                                    We'll send you a 6-digit verification code
                                </p>
                            </div>
                            <Button type="submit" className="w-full" disabled={loading || !email}>
                                {loading ? 'Sending...' : 'Send OTP'}
                            </Button>
                        </form>
                    )}

                    {/* Step 4: OTP - Verify */}
                    {authStep === 'otp-verify' && (
                        <form onSubmit={handleVerifyOTP} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div>
                                <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--muted-foreground)', marginBottom: '1rem' }}>
                                    We sent a code to <strong>{email}</strong>
                                </p>
                                <OTPInput
                                    value={otp}
                                    onChange={setOtp}
                                    disabled={loading}
                                    error={error || undefined}
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={loading || otp.length !== 6}>
                                {loading ? 'Verifying...' : 'Verify & Login'}
                            </Button>
                            <div style={{ textAlign: 'center' }}>
                                {resendCountdown > 0 ? (
                                    <p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
                                        Resend OTP in {resendCountdown}s
                                    </p>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleResendOTP}
                                        style={{ fontSize: '0.875rem', color: 'var(--primary)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                                    >
                                        Resend OTP
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={() => { setAuthStep('otp-email'); setOtp(""); setError(null); }}
                                    style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', background: 'none', border: 'none', cursor: 'pointer', marginLeft: '1rem' }}
                                >
                                    Change Email
                                </button>
                            </div>
                        </form>
                    )}
                </CardContent>
                <CardFooter style={{ display: 'flex', justifyContent: 'center', borderTop: '1px solid var(--border)', padding: '1rem' }}>
                    <p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
                        Don't have an account? <Link href="/auth/signup" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign Up</Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}

export default function SignInPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SignInContent />
        </Suspense>
    );
}
