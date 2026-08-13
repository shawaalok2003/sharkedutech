"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthLayout } from "@/components/layout/AuthLayout";

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

    const title = step === 1 ? "Forgot Password" : step === 2 ? "Verify Reset Code" : step === 3 ? "Reset Password" : "Password Updated!";
    const subtitle = step === 1 ? "Enter your registered email to receive a password reset code" : step === 2 ? `Enter the 6-digit code sent to ${email}` : step === 3 ? "Enter your new password below" : "Your account password has been reset successfully.";

    return (
        <AuthLayout title={title} subtitle={subtitle}>
            {error && (
                <div style={{ padding: '0.85rem 1rem', borderRadius: '0.75rem', backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', color: '#DC2626', fontSize: '0.88rem', fontWeight: 500, marginBottom: '1.25rem' }}>
                    {error}
                </div>
            )}
            {message && step !== 4 && (
                <div style={{ padding: '0.85rem 1rem', borderRadius: '0.75rem', backgroundColor: '#F0F9FF', border: '1px solid #BAE6FD', color: '#0369A1', fontSize: '0.88rem', fontWeight: 500, marginBottom: '1.25rem' }}>
                    {message}
                </div>
            )}

            {step === 1 && (
                <form onSubmit={handleSendOTP} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem', color: '#0f172a' }}>Email Address</label>
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                            placeholder="name@example.com"
                            style={{ width: '100%', padding: '0.85rem 1rem', borderRadius: '0.75rem', border: '1px solid #cbd5e1', fontSize: '0.95rem', color: '#0f172a', outline: 'none', boxSizing: 'border-box' }} 
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={loading}
                        style={{ width: '100%', padding: '0.9rem', borderRadius: '0.75rem', background: '#001736', color: '#ffffff', fontWeight: 700, fontSize: '1rem', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', boxShadow: '0 10px 20px rgba(0, 23, 54, 0.15)' }}
                    >
                        {loading ? "Sending..." : "Send Reset Code"}
                    </button>
                </form>
            )}

            {step === 2 && (
                <form onSubmit={handleVerifyOTP} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem', color: '#0f172a' }}>6-Digit OTP</label>
                        <input 
                            type="text" 
                            value={otp} 
                            onChange={(e) => setOtp(e.target.value)} 
                            required 
                            maxLength={6}
                            placeholder="000000"
                            style={{ width: '100%', padding: '0.85rem 1rem', borderRadius: '0.75rem', border: '1px solid #cbd5e1', textAlign: 'center', fontSize: '1.4rem', letterSpacing: '0.4rem', color: '#0f172a', outline: 'none', boxSizing: 'border-box' }} 
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={loading}
                        style={{ width: '100%', padding: '0.9rem', borderRadius: '0.75rem', background: '#001736', color: '#ffffff', fontWeight: 700, fontSize: '1rem', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', boxShadow: '0 10px 20px rgba(0, 23, 54, 0.15)' }}
                    >
                        {loading ? "Verifying..." : "Verify OTP"}
                    </button>
                    <button 
                        type="button" 
                        onClick={handleSendOTP} 
                        style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', fontSize: '0.88rem', fontWeight: 700, textDecoration: 'underline' }}
                    >
                        Resend Code
                    </button>
                </form>
            )}

            {step === 3 && (
                <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem', color: '#0f172a' }}>New Password</label>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                            placeholder="••••••••"
                            style={{ width: '100%', padding: '0.85rem 1rem', borderRadius: '0.75rem', border: '1px solid #cbd5e1', fontSize: '0.95rem', color: '#0f172a', outline: 'none', boxSizing: 'border-box' }} 
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem', color: '#0f172a' }}>Confirm Password</label>
                        <input 
                            type="password" 
                            value={confirmPassword} 
                            onChange={(e) => setConfirmPassword(e.target.value)} 
                            required 
                            placeholder="••••••••"
                            style={{ width: '100%', padding: '0.85rem 1rem', borderRadius: '0.75rem', border: '1px solid #cbd5e1', fontSize: '0.95rem', color: '#0f172a', outline: 'none', boxSizing: 'border-box' }} 
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={loading}
                        style={{ width: '100%', padding: '0.9rem', borderRadius: '0.75rem', background: '#001736', color: '#ffffff', fontWeight: 700, fontSize: '1rem', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', boxShadow: '0 10px 20px rgba(0, 23, 54, 0.15)' }}
                    >
                        {loading ? "Updating..." : "Update Password"}
                    </button>
                </form>
            )}

            {step === 4 && (
                <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
                    <button 
                        onClick={() => router.push("/auth/signin")} 
                        style={{ width: '100%', padding: '0.9rem', borderRadius: '0.75rem', background: '#001736', color: '#ffffff', fontWeight: 700, fontSize: '1rem', border: 'none', cursor: 'pointer', boxShadow: '0 10px 20px rgba(0, 23, 54, 0.15)' }}
                    >
                        Return to Sign In
                    </button>
                </div>
            )}

            {step !== 4 && (
                <div style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid #f1f5f9', textAlign: 'center' }}>
                    <Link href="/auth/signin" style={{ color: '#2563eb', textDecoration: 'none', fontSize: '0.88rem', fontWeight: 700 }}>
                        ← Back to Sign In
                    </Link>
                </div>
            )}
        </AuthLayout>
    );
}
