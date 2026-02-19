"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import OTPInput from "@/components/auth/OTPInput";
import { signIn } from "next-auth/react";

type SignupStep = 'form' | 'verify-otp';

export default function EmployerSignupPage() {
    const router = useRouter();
    const [step, setStep] = useState<SignupStep>('form');
    const role = 'EMPLOYER';
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

        try {
            const response = await fetch('/api/auth/otp/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email, role }),
            });

            if (!response.ok) {
                const result = await response.json();
                setError(result.error || 'Failed to send OTP');
            } else {
                startResendCountdown();
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Step 1: Send OTP first
        if (step === 'form') {
            try {
                const response = await fetch('/api/auth/otp/send', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: formData.email, role }),
                });

                const result = await response.json();

                if (!response.ok) {
                    setError(result.error || 'Failed to send OTP');
                    setLoading(false);
                    return;
                }

                setStep('verify-otp');
                startResendCountdown();
            } catch (err) {
                setError('An error occurred. Please try again.');
            } finally {
                setLoading(false);
            }
            return;
        }

        // Step 2: Verify OTP then create account
        if (step === 'verify-otp') {
            try {
                const response = await fetch('/api/auth/otp/verify', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: formData.email, code: otp }),
                });

                const otpResult = await response.json();

                if (!response.ok) {
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

                        router.push("/jobs/employer");
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
            } catch (err) {
                setError('Verification failed. Please try again.');
            } finally {
                setLoading(false);
            }
        }
    }

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F0F9FF', padding: '2rem' }}>
            <Card style={{ width: '100%', maxWidth: '500px' }}>
                <CardHeader>
                    <CardTitle style={{ textAlign: 'center', fontSize: '1.5rem', color: '#0369A1' }}>Register as Employer</CardTitle>
                    <p style={{ textAlign: 'center', color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>Join our professional network to hire top talent</p>
                </CardHeader>

                {step === 'form' ? (
                    <CardContent>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            {error && <div style={{ padding: '0.75rem', backgroundColor: '#FEE2E2', color: '#DC2626', borderRadius: 'var(--radius)', fontSize: '0.875rem' }}>{error}</div>}

                            <div>
                                <label htmlFor="name" style={labelStyle}>Contact Person Name</label>
                                <input
                                    name="name"
                                    id="name"
                                    required
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    style={inputStyle}
                                />
                            </div>

                            <div>
                                <label htmlFor="email" style={labelStyle}>Work Email Address</label>
                                <input
                                    name="email"
                                    id="email"
                                    type="email"
                                    required
                                    placeholder="hr@company.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    style={inputStyle}
                                />
                            </div>

                            <div>
                                <label htmlFor="companyName" style={labelStyle}>Company Name</label>
                                <input
                                    name="companyName"
                                    id="companyName"
                                    required
                                    placeholder="Acme Corp"
                                    value={formData.companyName}
                                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
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
                                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
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
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    style={inputStyle}
                                />
                            </div>

                            <Button type="submit" size="lg" disabled={loading} style={{ marginTop: '0.5rem', backgroundColor: '#0369A1' }}>
                                {loading ? 'Sending OTP...' : 'Verify & Continue'}
                            </Button>

                            <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
                                Not an Employer? <Link href="/auth/signup" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign up as Candidate</Link>
                            </p>
                        </form>
                    </CardContent>
                ) : (
                    <CardContent>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {error && <div style={{ padding: '0.75rem', backgroundColor: '#FEE2E2', color: '#DC2626', borderRadius: 'var(--radius)', fontSize: '0.875rem' }}>{error}</div>}

                            <div>
                                <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--muted-foreground)', marginBottom: '1rem' }}>
                                    We sent a 6-digit verification code to <strong>{formData.email}</strong>
                                </p>
                                <OTPInput
                                    value={otp}
                                    onChange={setOtp}
                                    disabled={loading}
                                    error={error || undefined}
                                />
                            </div>

                            <Button type="submit" size="lg" disabled={loading || otp.length !== 6} style={{ marginTop: '0.5rem', backgroundColor: '#0369A1' }}>
                                {loading ? 'Creating Account...' : 'Complete Registration'}
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
                                        style={{ fontSize: '0.875rem', color: '#0369A1', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
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
