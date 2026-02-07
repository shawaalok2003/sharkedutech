import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

if (!accountSid || !authToken || !twilioPhoneNumber) {
    console.warn('Twilio credentials not configured. OTP functionality will not work.');
}

export const twilioClient = accountSid && authToken
    ? twilio(accountSid, authToken)
    : null;

export async function sendOTP(phone: string, code: string): Promise<boolean> {
    // Test mode - just log to console
    if (process.env.NODE_ENV === 'development' && !twilioClient) {
        console.log(`\n📱 SMS OTP for ${phone}: ${code}\n`);
        console.log('⚠️  Twilio not configured - OTP logged to console for testing\n');
        return true;
    }

    if (!twilioClient || !twilioPhoneNumber) {
        console.error('Twilio not configured');
        return false;
    }

    try {
        await twilioClient.messages.create({
            body: `Your Sharkedutech verification code is: ${code}. Valid for 5 minutes.`,
            from: twilioPhoneNumber,
            to: phone
        });
        console.log(`✅ SMS sent to ${phone}`);
        return true;
    } catch (error) {
        console.error('Twilio SMS error:', error);
        // Fallback to console in development
        if (process.env.NODE_ENV === 'development') {
            console.log(`\n📱 SMS OTP for ${phone}: ${code} (Twilio failed, showing in console)\n`);
            return true;
        }
        return false;
    }
}

export function formatPhoneNumber(phone: string): string {
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '');

    // Add +91 for Indian numbers if not present
    if (cleaned.length === 10) {
        return `+91${cleaned}`;
    }

    // Add + if not present
    if (!phone.startsWith('+')) {
        return `+${cleaned}`;
    }

    return `+${cleaned}`;
}

export function validatePhoneNumber(phone: string): boolean {
    const cleaned = phone.replace(/\D/g, '');
    // Indian phone numbers are 10 digits
    // International format with country code
    return cleaned.length >= 10 && cleaned.length <= 15;
}
