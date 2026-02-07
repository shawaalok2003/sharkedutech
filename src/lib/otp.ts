import crypto from 'crypto';

export function generateOTP(): string {
    // Generate 6-digit OTP
    return crypto.randomInt(100000, 999999).toString();
}

export function getOTPExpiry(): Date {
    const expiryMinutes = parseInt(process.env.OTP_EXPIRY_MINUTES || '5');
    return new Date(Date.now() + expiryMinutes * 60 * 1000);
}

export function isOTPExpired(expiresAt: Date): boolean {
    return new Date() > expiresAt;
}

export function hashOTP(code: string): string {
    // Hash OTP for secure storage
    return crypto.createHash('sha256').update(code).digest('hex');
}

export function verifyOTP(code: string, hashedCode: string): boolean {
    return hashOTP(code) === hashedCode;
}
