"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import OTPInput from "@/components/auth/OTPInput";
import { sendOTP, verifyOTP } from "@/lib/supabase";
import { signIn } from "next-auth/react";

type SignupStep = 'form' | 'verify-otp';

export default function SignupPage() {
    const router = useRouter();
    const [step, setStep] = useState<SignupStep>('form');
    const [role, setRole] = useState<'CANDIDATE' | 'EMPLOYER' | 'ADMIN'>('CANDIDATE');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [otp, setOtp] = useState('');
    const [resendCountdown, setResendCountdown] = useState(0);
    
    // Form data
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        companyName: '',
        industry: '',
    });

    const inputStyle = {
        width: '100%',
        padding: '0.75rem',
        borderRadius: 'var(--radius)',
        border: '1px solid var(--border)',
        fontSize: '1rem',
        marginTop: '0.5rem',
    };

    const labelStyle = {
        fontSize: '0.875rem',
        fontWeight: 500,
        color: 'var(--foreground)',
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
        setError('');
        setLoading(true);

        const result = await sendOTP(formData.email);

        if (!result.success) {
            const errorMsg = result.error || 'Failed to send OTP';
            if (errorMsg.includes('rate') || errorMsg.includes('too many')) {
                setError('Too many requests. Please wait 60 seconds.');
                startResendCountdown();
            } else {
                setError(errorMsg);
            }
        } else {
            startResendCountdown();
        }
        setLoading(false);
    };

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Step 1: Send OTP first
        if (step === 'form') {
            const otpResult = await sendOTP(formData.email);

            if (!otpResult.success) {
                const errorMsg = otpResult.error || 'Failed to send OTP';
                if (errorMsg.includes('rate') || errorMsg.includes('too many')) {
                    setError('Too many requests. Please wait 60 seconds.');
                    startResendCountdown();
                } else {
                    setError(errorMsg);
                }
                setLoading(false);
                return;
            }

            setStep('verify-otp');
            startResendCountdown();
            setLoading(false);
            return;
        }

        // Step 2: Verify OTP then create account
        if (step === 'verify-otp') {
            const otpResult = await verifyOTP(formData.email, otp);

            if (!otpResult.success) {
                setError(otpResult.error || 'Invalid OTP');
                setLoading(false);
                return;
            }

            // Now create the account
            try {
                const res = await fetch('/api/auth/signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...formData, role }),
                });

                if (res.ok) {
                    const userData = await res.json();

                    // Auto-login user with NextAuth
                    await signIn("credentials", {
                        email: formData.email,
                        password: formData.password,
                        redirect: false,
                    });

                    // Redirect based on role
                    if (role === 'ADMIN') {
                        router.push("/admin");
                    } else if (role === 'EMPLOYER') {
                        router.push("/jobs/employer");
                    } else {
                        // Candidate - redirect to profile/dashboard
                        router.push("/candidate/dashboard");
                    }
                    router.refresh();
                } else {
                    const errorData = await res.json();
                    setError(errorData.error || 'Registration failed');
                }
            } catch (err) {
                setError('An error occurred. Please try again.');
            } finally {
                setLoading(false);
            }
        }
    }

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F3F4F6', padding: '2rem' }}>
            <Card style={{ width: '100%', maxWidth: '500px' }}>
                <CardHeader>
                    <CardTitle style={{ textAlign: 'center', fontSize: '1.5rem', color: 'var(--primary)' }}>Create an Account</CardTitle>
                </CardHeader>

                {step === 'form' ? (
                    <CardContent>
                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', padding: '0.25rem', backgroundColor: 'var(--muted)', borderRadius: 'var(--radius)' }}>
                            <button
                                type="button"
                                onClick={() => setRole('CANDIDATE')}
                                style={{
                                    flex: 1,
                                    padding: '0.5rem',
                                    borderRadius: 'calc(var(--radius) - 2px)',
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                    backgroundColor: role === 'CANDIDATE' ? 'white' : 'transparent',
                                    color: role === 'CANDIDATE' ? 'var(--primary)' : 'var(--muted-foreground)',
                                    boxShadow: role === 'CANDIDATE' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                I am a Candidate
                            </button>
                            <button
                                type="button"
                                onClick={() => setRole('EMPLOYER')}
                                style={{
                                    flex: 1,
                                    padding: '0.5rem',
                                    borderRadius: 'calc(var(--radius) - 2px)',
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                    backgroundColor: role === 'EMPLOYER' ? 'white' : 'transparent',
                                    color: role === 'EMPLOYER' ? 'var(--primary)' : 'var(--muted-foreground)',
                                    boxShadow: role === 'EMPLOYER' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                I am an Employer
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            {error && <div style={{ padding: '0.75rem', backgroundColor: '#FEE2E2', color: '#DC2626', borderRadius: 'var(--radius)', fontSize: '0.875rem' }}>{error}</div>}

                            <div>
                                <label htmlFor="name" style={labelStyle}>Full Name</label>
                                <input
                                    name="name"
                                    id="name"
                                    required
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    style={inputStyle}
                                />
                            </div>

                            <div>
                                <label htmlFor="email" style={labelStyle}>Email Address</label>
                                <input
                                    name="email"
                                    id="email"
                                    type="email"
                                    required
                                    placeholder="john@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    style={inputStyle}
                                />
                            </div>

                            <div>
                                <label htmlFor="password" style={labelStyle}>Password</label>
                                <input
                                    name="password"
                                    id="password"
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    style={inputStyle}
                                />
                            </div>

                            {role === 'EMPLOYER' && (
                                <>
                                    <div>
                                        <label htmlFor="companyName" style={labelStyle}>Company Name</label>
                                        <input
                                            name="companyName"
                                            id="companyName"
                                            required
                                            placeholder="Acme Corp"
                                            value={formData.companyName}
                                            onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                                            style={inputStyle}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="industry" style={labelStyle}>Industry</label>
                                        <input
                                            name="industry"
                                            id="industry"
                                            placeholder="Technology"
                                            value={formData.industry}
                                            onChange={(e) => setFormData({...formData, industry: e.target.value})}
                                            style={inputStyle}
                                        />
                                    </div>
                                </>
                            )}

                            <Button type="submit" size="lg" disabled={loading} style={{ marginTop: '0.5rem' }}>
                                {loading ? 'Sending OTP...' : 'Continue & Verify Email'}
                            </Button>

                            <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
                                Already have an account? <Link href="/auth/signin" style={{ color: 'var(--primary)', fontWeight: 600 }}>Log In</Link>
                            </p>
                        </form>
                    </CardContent>
                ) : (
                    <CardContent>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {error && <div style={{ padding: '0.75rem', backgroundColor: '#FEE2E2', color: '#DC2626', borderRadius: 'var(--radius)', fontSize: '0.875rem' }}>{error}</div>}

                            <div>
                                <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--muted-foreground)', marginBottom: '1rem' }}>
                                    We sent a 6-digit code to <strong>{formData.email}</strong>
                                </p>
                                <OTPInput
                                    value={otp}
                                    onChange={setOtp}
                                    disabled={loading}
                                    error={error || undefined}
                                />
                            </div>

                            <Button type="submit" size="lg" disabled={loading || otp.length !== 6} style={{ marginTop: '0.5rem' }}>
                                {loading ? 'Creating Account...' : 'Verify & Create Account'}
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
                                    onClick={() => { setStep('form'); setOtp(""); setError(''); }}
                                    style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', background: 'none', border: 'none', cursor: 'pointer', marginLeft: '1rem' }}
                                >
                                    Back
                                </button>
                            </div>
                        </form>
                    </CardContent>
                )}
            </Card>
        </div>
    );
}
