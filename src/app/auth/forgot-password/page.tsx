"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/Card";

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password, 4: Success
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const res = await fetch("/api/auth/otp/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to send OTP");

            setMessage("Verification code sent to your email!");
            setStep(2);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const res = await fetch("/api/auth/otp/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, code: otp }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Invalid OTP");

            setStep(3);
            setMessage("OTP Verified! Set your new password.");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, newPassword: password }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to reset password");

            setStep(4);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: '1rem' }}>
            <Card style={{ width: '100%', maxWidth: '450px' }}>
                <CardHeader>
                    <CardTitle style={{ textAlign: 'center', fontSize: '1.5rem', color: 'var(--primary)' }}>
                        {step === 1 && "Forgot Password"}
                        {step === 2 && "Enter OTP"}
                        {step === 3 && "Reset Password"}
                        {step === 4 && "Success!"}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {error && (
                        <div style={{ padding: '0.75rem', borderRadius: '0.5rem', backgroundColor: '#FEF2F2', color: '#DC2626', fontSize: '0.875rem', marginBottom: '1rem' }}>
                            {error}
                        </div>
                    )}
                    {message && step !== 4 && (
                        <div style={{ padding: '0.75rem', borderRadius: '0.5rem', backgroundColor: '#F0F9FF', color: '#0369A1', fontSize: '0.875rem', marginBottom: '1rem' }}>
                            {message}
                        </div>
                    )}

                    {step === 1 && (
                        <form onSubmit={handleSendOTP} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <p style={{ fontSize: '0.875rem', color: '#64748b', textAlign: 'center' }}>
                                Enter your email address and we'll send you a 6-digit code to reset your password.
                            </p>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Email Address</label>
                                <input 
                                    type="email" 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)} 
                                    required 
                                    placeholder="name@company.com"
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }} 
                                />
                            </div>
                            <Button type="submit" disabled={loading}>
                                {loading ? "Sending..." : "Send Reset Code"}
                            </Button>
                        </form>
                    )}

                    {step === 2 && (
                        <form onSubmit={handleVerifyOTP} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <p style={{ fontSize: '0.875rem', color: '#64748b', textAlign: 'center' }}>
                                A verification code has been sent to <strong>{email}</strong>.
                            </p>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>6-Digit OTP</label>
                                <input 
                                    type="text" 
                                    value={otp} 
                                    onChange={(e) => setOtp(e.target.value)} 
                                    required 
                                    maxLength={6}
                                    placeholder="000000"
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0', textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.5rem' }} 
                                />
                            </div>
                            <Button type="submit" disabled={loading}>
                                {loading ? "Verifying..." : "Verify OTP"}
                            </Button>
                            <button 
                                type="button" 
                                onClick={handleSendOTP} 
                                style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500 }}
                            >
                                Resend Code
                            </button>
                        </form>
                    )}

                    {step === 3 && (
                        <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>New Password</label>
                                <input 
                                    type="password" 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    required 
                                    placeholder="••••••••"
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }} 
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Confirm Password</label>
                                <input 
                                    type="password" 
                                    value={confirmPassword} 
                                    onChange={(e) => setConfirmPassword(e.target.value)} 
                                    required 
                                    placeholder="••••••••"
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }} 
                                />
                            </div>
                            <Button type="submit" disabled={loading}>
                                {loading ? "Updating..." : "Update Password"}
                            </Button>
                        </form>
                    )}

                    {step === 4 && (
                        <div style={{ textAlign: 'center', padding: '1rem' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Password Updated!</h3>
                            <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Your password has been reset successfully. You can now log in with your new credentials.</p>
                            <Button onClick={() => router.push("/auth/signin")} className="w-full">
                                Go to Login
                            </Button>
                        </div>
                    )}
                </CardContent>
                {step !== 4 && (
                    <CardFooter style={{ borderTop: '1px solid #e2e8f0', padding: '1.5rem', display: 'flex', justifyContent: 'center' }}>
                        <Link href="/auth/signin" style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500 }}>
                            Back to Sign In
                        </Link>
                    </CardFooter>
                )}
            </Card>
        </div>
    );
}
