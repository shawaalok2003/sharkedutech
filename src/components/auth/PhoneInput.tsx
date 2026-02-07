"use client";

import { useState } from "react";

interface PhoneInputProps {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
    error?: string;
}

export default function PhoneInput({ value, onChange, disabled, error }: PhoneInputProps) {
    const [countryCode, setCountryCode] = useState("+91");

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Only allow digits
        const cleaned = e.target.value.replace(/\D/g, '');
        onChange(cleaned);
    };

    const formatDisplay = (phone: string) => {
        // Format as: 98765 43210
        if (phone.length <= 5) return phone;
        return `${phone.slice(0, 5)} ${phone.slice(5, 10)}`;
    };

    return (
        <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                Phone Number
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
                <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    disabled={disabled}
                    style={{
                        padding: '0.75rem',
                        borderRadius: 'var(--radius)',
                        border: `1px solid ${error ? '#DC2626' : 'var(--border)'}`,
                        fontSize: '1rem',
                        width: '100px',
                        backgroundColor: disabled ? '#F3F4F6' : 'white',
                    }}
                >
                    <option value="+91">🇮🇳 +91</option>
                    <option value="+1">🇺🇸 +1</option>
                    <option value="+44">🇬🇧 +44</option>
                    <option value="+971">🇦🇪 +971</option>
                </select>
                <input
                    type="tel"
                    value={formatDisplay(value)}
                    onChange={handlePhoneChange}
                    disabled={disabled}
                    placeholder="98765 43210"
                    maxLength={11} // 10 digits + 1 space
                    style={{
                        flex: 1,
                        padding: '0.75rem',
                        borderRadius: 'var(--radius)',
                        border: `1px solid ${error ? '#DC2626' : 'var(--border)'}`,
                        fontSize: '1rem',
                        backgroundColor: disabled ? '#F3F4F6' : 'white',
                    }}
                />
            </div>
            {error && (
                <p style={{ color: '#DC2626', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                    {error}
                </p>
            )}
            <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginTop: '0.25rem' }}>
                We'll send you a verification code
            </p>
        </div>
    );
}
