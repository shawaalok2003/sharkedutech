"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import OTPInput from "@/components/auth/OTPInput";
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
        padding: '1rem 1.25rem',
        borderRadius: '16px',
        border: '1px solid rgba(0, 33, 71, 0.1)',
        fontSize: '1rem',
        marginTop: '0.5rem',
        background: 'rgba(255, 255, 255, 0.8)',
        transition: 'all 0.3s ease',
        fontWeight: 500,
        color: '#002147',
    };

    const labelStyle = {
        fontSize: '0.85rem',
        fontWeight: 800,
        color: '#64748b',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        marginLeft: '0.5rem',
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
                body: JSON.stringify({ email: formData.email }),
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
                    body: JSON.stringify({ email: formData.email, role: 'CANDIDATE' }),
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
            } catch (err) {
                setError('Verification failed. Please try again.');
            } finally {
                setLoading(false);
            }
        }
    }

    return (
        <>
            <style jsx>{`
                .auth-page {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: radial-gradient(circle at 0% 0%, #001529 0%, #002147 50%, #003366 100%);
                    padding: 2rem;
                    position: relative;
                    overflow: hidden;
                }

                .auth-page::before {
                    content: '';
                    position: absolute;
                    width: 150%;
                    height: 150%;
                    background: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%230062ff' fill-opacity='0.05' d='M45.7,-77.7C58.3,-71.8,67.1,-57.4,74.5,-42.6C81.9,-27.9,87.9,-12.8,87.4,2.2C86.8,17.2,79.8,32.1,69.9,44.3C60,56.5,47.2,66.1,33,72.4C18.8,78.7,3.1,81.7,-13.4,79.8C-29.9,77.9,-47.1,71.1,-61.2,60.1C-75.3,49,-86.3,33.7,-90.6,17.1C-94.8,0.5,-92.3,-17.4,-84.6,-33.2C-76.8,-49.1,-63.9,-62.8,-49.1,-67.7C-34.3,-72.6,-17.2,-68.8,-0.1,-68.6C16.9,-68.4,33.1,-83.6,45.7,-77.7Z' transform='translate(100 100)' /%3E%3C/svg%3E") no-repeat center;
                    opacity: 0.3;
                    animation: rotate 60s linear infinite;
                    pointer-events: none;
                }

                @keyframes rotate {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }

                .glass-card {
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    border-radius: 40px;
                    width: 100%;
                    max-width: 500px;
                    padding: 3.5rem;
                    box-shadow: 0 40px 100px rgba(0, 0, 0, 0.4);
                    position: relative;
                    z-index: 1;
                    animation: slideUp 0.8s cubic-bezier(0.19, 1, 0.22, 1);
                }

                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .logo-box {
                    text-align: center;
                    margin-bottom: 2.5rem;
                }

                .title {
                    font-size: 2.25rem;
                    font-weight: 900;
                    color: #002147;
                    letter-spacing: -0.04em;
                    margin-bottom: 0.5rem;
                    text-align: center;
                }

                .subtitle {
                    text-align: center;
                    color: #64748b;
                    font-size: 1rem;
                    font-weight: 500;
                    margin-bottom: 3rem;
                }

                .form-container {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }

                .auth-button {
                    background: linear-gradient(135deg, #002147 0%, #0062ff 100%);
                    color: white;
                    padding: 1.25rem;
                    border-radius: 16px;
                    font-size: 1.1rem;
                    font-weight: 800;
                    border: none;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 10px 20px rgba(0, 98, 255, 0.2);
                    margin-top: 1rem;
                }

                .auth-button:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 20px 40px rgba(0, 98, 255, 0.3);
                }

                .auth-button:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                    transform: none;
                }

                .footer-links {
                    margin-top: 2.5rem;
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                    font-size: 0.95rem;
                    color: #64748b;
                    font-weight: 500;
                }

                .footer-links a {
                    color: #0062ff;
                    font-weight: 800;
                    text-decoration: none;
                }
            `}</style>

            <div className="auth-page">
                <div className="glass-card">
                    <div className="logo-box">
                        <img 
                            src="/images/shark_edu_tech_logo-removebg-preview.png" 
                            alt="Shark Edutech" 
                            style={{ height: '50px', objectFit: 'contain' }}
                        />
                    </div>

                    <h1 className="title">
                        {step === 'form' ? 'Join the Elite' : 'Verify Identity'}
                    </h1>
                    <p className="subtitle">
                        {step === 'form' ? 'Create your candidate account today' : `We've sent a code to ${formData.email}`}
                    </p>

                    {error && (
                        <div style={{ padding: '1rem', background: '#fef2f2', color: '#ef4444', borderRadius: '16px', border: '1px solid #fee2e2', fontSize: '0.9rem', fontWeight: 600, marginBottom: '2rem', textAlign: 'center' }}>
                            ⚠️ {error}
                        </div>
                    )}

                    {step === 'form' ? (
                        <form onSubmit={handleSubmit} className="form-container">
                            <div>
                                <label style={labelStyle}>Full Name</label>
                                <input
                                    required
                                    placeholder="e.g. Alexander Shaw"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    style={inputStyle}
                                    onFocus={(e) => e.target.style.borderColor = '#0062ff'}
                                    onBlur={(e) => e.target.style.borderColor = 'rgba(0, 33, 71, 0.1)'}
                                />
                            </div>

                            <div>
                                <label style={labelStyle}>Email Address</label>
                                <input
                                    type="email"
                                    required
                                    placeholder="name@company.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    style={inputStyle}
                                    onFocus={(e) => e.target.style.borderColor = '#0062ff'}
                                    onBlur={(e) => e.target.style.borderColor = 'rgba(0, 33, 71, 0.1)'}
                                />
                            </div>

                            <div>
                                <label style={labelStyle}>Secure Password</label>
                                <input
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    style={inputStyle}
                                    onFocus={(e) => e.target.style.borderColor = '#0062ff'}
                                    onBlur={(e) => e.target.style.borderColor = 'rgba(0, 33, 71, 0.1)'}
                                />
                            </div>

                            <button type="submit" className="auth-button" disabled={loading}>
                                {loading ? 'Securing Connection...' : 'Continue & Verify Email'}
                            </button>

                            <div className="footer-links">
                                <p>Building for Employers? <Link href="/auth/signup/employer">Create Account</Link></p>
                                <p>Already a member? <Link href="/auth/signin">Sign In</Link></p>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={handleSubmit} className="form-container">
                            <div style={{ marginBottom: '1.5rem' }}>
                                <OTPInput
                                    value={otp}
                                    onChange={setOtp}
                                    disabled={loading}
                                    error={error || undefined}
                                />
                            </div>

                            <button type="submit" className="auth-button" disabled={loading || otp.length !== 6}>
                                {loading ? 'Authenticating...' : 'Verify & Create Account'}
                            </button>

                            <div className="footer-links">
                                {resendCountdown > 0 ? (
                                    <p>Resend code in {resendCountdown}s</p>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleResendOTP}
                                        style={{ color: '#0062ff', fontWeight: 800, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                                    >
                                        Resend Verification Code
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={() => { setStep('form'); setOtp(""); setError(''); }}
                                    style={{ color: '#64748b', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600 }}
                                >
                                    ← Back to Registration
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </>
    );
}
