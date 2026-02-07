import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('⚠️  Supabase credentials not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
    }
})

// Helper function to send OTP (code-based)
export async function sendOTP(email: string) {
    // In development, use mock OTP system (avoid Supabase rate limits)
    if (process.env.NODE_ENV === 'development') {
        console.log('🧪 DEV MODE: Mock OTP sent to', email);
        console.log('📧 Check your email for the magic link, or use any email to proceed');
        return { success: true, data: { user: { email } } };
    }

    const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
            emailRedirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback`,
        }
    })

    if (error) {
        console.error('Supabase OTP send error:', error)
        return { success: false, error: error.message }
    }

    return { success: true, data }
}

// Helper function to verify OTP
export async function verifyOTP(email: string, token: string) {
    // In development, auto-verify (skip Supabase rate limits)
    if (process.env.NODE_ENV === 'development') {
        console.log('✅ DEV MODE: OTP verified for', email);
        return { 
            success: true, 
            data: { 
                user: { 
                    email,
                    id: 'dev-user-' + email.split('@')[0]
                } 
            } 
        };
    }

    const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'email'
    })

    if (error) {
        console.error('Supabase OTP verify error:', error)
        return { success: false, error: error.message }
    }

    return { success: true, data }
}

// Helper function to sign out
export async function signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) {
        console.error('Supabase sign out error:', error)
        return { success: false, error: error.message }
    }
    return { success: true }
}

// Helper function to get current session
export async function getSession() {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) {
        console.error('Supabase get session error:', error)
        return { success: false, error: error.message, session: null }
    }
    return { success: true, session }
}

// Helper function to get current user
export async function getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) {
        console.error('Supabase get user error:', error)
        return { success: false, error: error.message, user: null }
    }
    return { success: true, user }
}
