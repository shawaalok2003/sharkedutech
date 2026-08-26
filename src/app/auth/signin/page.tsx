"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import OTPInput from "@/components/auth/OTPInput";
import { signIn } from "next-auth/react";
import { AuthLayout } from "@/components/layout/AuthLayout";

type AuthStep = 'method' | 'password' | 'otp-email' | 'otp-verify';

function SignInContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const type = searchParams.get('type') || 'candidate';

    const isCandidate = type === 'candidate';
    const isEmployer = type === 'employer';
    const isAdmin = type === 'admin';

    const [authStep, setAuthStep] = useState<AuthStep>('password');
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [resendCountdown, setResendCountdown] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const title = isCandidate ? "Candidate Login" : isEmployer ? "Employer Login" : isAdmin ? "Admin & Institution Login" : "Login";
    const subtitle = isCandidate 
        ? "Welcome back! Sign in to access your student dashboard and courses" 
        : isEmployer 
        ? "Welcome back! Manage your candidate pipeline and job postings" 
        : "Sign in to manage system administration settings";

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

            const response = await fetch('/api/auth/session');
            const session = await response.json();
            const userRole = session?.user?.role;

            if (userRole === 'ADMIN' || userRole === 'SUPER_ADMIN') {
                router.push("/admin");
            } else if (userRole === 'COLLEGE') {
                router.push("/admissions/college");
            } else if (userRole === 'EMPLOYER') {
                router.push("/jobs/employer");
            } else {
                router.push("/candidate/dashboard");
            }
            router.refresh();
        } catch (err) {
            setError('Login failed. Please try again.');
            setLoading(false);
        }
    };

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

            const signInResult = await signIn("credentials", {
                email: userData.email,
                password: '',
                redirect: false,
            });

            if (signInResult?.error) {
                setError('Sign in failed');
                setLoading(false);
                return;
            }

            const role = userData.role;
            if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
                router.push("/admin");
            } else if (role === 'COLLEGE') {
                router.push("/admissions/college");
            } else if (role === 'EMPLOYER') {
                router.push("/jobs/employer");
            } else {
                router.push("/candidate/dashboard");
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
        <AuthLayout title={title} subtitle={subtitle}>
            {error && (
                <div style={{ padding: '0.85rem 1rem', borderRadius: '0.75rem', backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', color: '#DC2626', fontSize: '0.88rem', fontWeight: 500, marginBottom: '1.5rem' }}>
                    {error}
                </div>
            )}

            {authStep === 'password' && (
                <form onSubmit={handlePasswordLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem', color: '#0f172a' }}>
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
                                padding: '0.85rem 1rem',
                                borderRadius: '0.75rem',
                                border: '1px solid #cbd5e1',
                                fontSize: '0.95rem',
                                color: '#0f172a',
                                outline: 'none',
                                boxSizing: 'border-box',
                            }}
                        />
                    </div>

                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <label style={{ fontWeight: 600, fontSize: '0.9rem', color: '#0f172a' }}>
                                Password
                            </label>
                            <Link 
                                href="/auth/forgot-password" 
                                style={{ fontSize: '0.85rem', color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}
                            >
                                Forgot Password?
                            </Link>
                        </div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                            placeholder="••••••••"
                            required
                            style={{
                                width: '100%',
                                padding: '0.85rem 1rem',
                                borderRadius: '0.75rem',
                                border: '1px solid #cbd5e1',
                                fontSize: '0.95rem',
                                color: '#0f172a',
                                outline: 'none',
                                boxSizing: 'border-box',
                            }}
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading || !email || !password}
                        style={{
                            width: '100%',
                            padding: '0.9rem',
                            borderRadius: '0.75rem',
                            background: '#001736',
                            color: '#ffffff',
                            fontWeight: 700,
                            fontSize: '1rem',
                            border: 'none',
                            cursor: (loading || !email || !password) ? 'not-allowed' : 'pointer',
                            marginTop: '0.5rem',
                            boxShadow: '0 10px 20px rgba(0, 23, 54, 0.15)'
                        }}
                    >
                        {loading ? 'Logging in...' : 'Sign In'}
                    </button>
                </form>
            )}

            {authStep === 'otp-email' && (
                <form onSubmit={handleSendOTP} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem', color: '#0f172a' }}>
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
                                padding: '0.85rem 1rem',
                                borderRadius: '0.75rem',
                                border: '1px solid #cbd5e1',
                                fontSize: '0.95rem',
                                color: '#0f172a',
                                outline: 'none',
                                boxSizing: 'border-box',
                            }}
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={loading || !email}
                        style={{
                            width: '100%',
                            padding: '0.9rem',
                            borderRadius: '0.75rem',
                            background: '#001736',
                            color: '#ffffff',
                            fontWeight: 700,
                            fontSize: '1rem',
                            border: 'none',
                            cursor: (loading || !email) ? 'not-allowed' : 'pointer',
                            boxShadow: '0 10px 20px rgba(0, 23, 54, 0.15)'
                        }}
                    >
                        {loading ? 'Sending Code...' : 'Send Login OTP'}
                    </button>
                </form>
            )}

            {authStep === 'otp-verify' && (
                <form onSubmit={handleVerifyOTP} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <p style={{ textAlign: 'center', fontSize: '0.88rem', color: '#64748b', marginBottom: '1.25rem' }}>
                            We sent a verification code to <strong>{email}</strong>
                        </p>
                        <OTPInput
                            value={otp}
                            onChange={setOtp}
                            disabled={loading}
                            error={error || undefined}
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={loading || otp.length !== 6}
                        style={{
                            width: '100%',
                            padding: '0.9rem',
                            borderRadius: '0.75rem',
                            background: '#001736',
                            color: '#ffffff',
                            fontWeight: 700,
                            fontSize: '1rem',
                            border: 'none',
                            cursor: (loading || otp.length !== 6) ? 'not-allowed' : 'pointer',
                            boxShadow: '0 10px 20px rgba(0, 23, 54, 0.15)'
                        }}
                    >
                        {loading ? 'Verifying...' : 'Verify & Login'}
                    </button>
                </form>
            )}

            {!isAdmin && (
                <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.88rem', color: '#64748b' }}>
                    <p>
                        Don't have an account?{' '}
                        <Link 
                            href={isEmployer ? "/auth/signup/employer" : "/auth/signup"} 
                            style={{ color: '#2563eb', fontWeight: 700, textDecoration: 'none' }}
                        >
                            Sign Up Now
                        </Link>
                    </p>
                    {isCandidate && (
                        <p>Are you a College Admin? <Link href="/admissions/auth/signin" style={{ color: '#001736', fontWeight: 700, textDecoration: 'none' }}>College Login</Link></p>
                    )}
                </div>
            )}
        </AuthLayout>
    );
}

export default function SignInPage() {
    return (
        <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>Loading...</div>}>
            <SignInContent />
        </Suspense>
    );
}
