"use client";

import { useState, useRef, useEffect } from "react";

interface OTPInputProps {
    length?: number;
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
    error?: string;
}

export default function OTPInput({
    length = 6,
    value,
    onChange,
    disabled,
    error
}: OTPInputProps) {
    const [otp, setOtp] = useState<string[]>(Array(length).fill(''));
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        // Update internal state when value prop changes
        if (value.length === 0) {
            setOtp(Array(length).fill(''));
        }
    }, [value, length]);

    const handleChange = (index: number, digit: string) => {
        if (disabled) return;

        // Only allow single digit
        const newDigit = digit.replace(/\D/g, '').slice(-1);

        const newOtp = [...otp];
        newOtp[index] = newDigit;
        setOtp(newOtp);

        // Update parent
        onChange(newOtp.join(''));

        // Auto-focus next input
        if (newDigit && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            // Focus previous input on backspace if current is empty
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
        const newOtp = Array(length).fill('');

        for (let i = 0; i < pastedData.length; i++) {
            newOtp[i] = pastedData[i];
        }

        setOtp(newOtp);
        onChange(newOtp.join(''));

        // Focus last filled input or last input
        const lastIndex = Math.min(pastedData.length, length - 1);
        inputRefs.current[lastIndex]?.focus();
    };

    return (
        <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                Enter Verification Code
            </label>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                {otp.map((digit, index) => (
                    <input
                        key={index}
                        ref={(el) => { inputRefs.current[index] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onPaste={handlePaste}
                        disabled={disabled}
                        style={{
                            width: '3rem',
                            height: '3.5rem',
                            textAlign: 'center',
                            fontSize: '1.5rem',
                            fontWeight: 600,
                            borderRadius: 'var(--radius)',
                            border: `2px solid ${error ? '#DC2626' : digit ? 'var(--primary)' : 'var(--border)'}`,
                            backgroundColor: disabled ? '#F3F4F6' : 'white',
                            transition: 'border-color 0.2s',
                        }}
                        onFocus={(e) => e.target.select()}
                    />
                ))}
            </div>
            {error && (
                <p style={{ color: '#DC2626', fontSize: '0.875rem', marginTop: '0.5rem', textAlign: 'center' }}>
                    {error}
                </p>
            )}
        </div>
    );
}
