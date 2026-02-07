"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

function CallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const handleCallback = async () => {
            try {
                // Check for error in URL
                const errorCode = searchParams.get('error_code');
                if (errorCode) {
                    const errorDescription = searchParams.get('error_description');
                    setError(errorDescription || 'Authentication failed');
                    setLoading(false);
                    return;
                }

                // Handle Supabase session from callback
                const { data: { session }, error: sessionError } = await supabase.auth.getSession();

                if (sessionError) {
                    setError(sessionError.message);
                    setLoading(false);
                    return;
                }

                if (session?.user) {
                    // Sync with Prisma database
                    const syncRes = await fetch('/api/auth/supabase-sync', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            email: session.user.email,
                            supabaseId: session.user.id,
                        }),
                    });

                    if (!syncRes.ok) {
                        setError('Failed to sync user data');
                        setLoading(false);
                        return;
                    }

                    const userData = await syncRes.json();

                    // Redirect based on role
                    const role = userData.role;
                    if (role === 'ADMIN') {
                        router.push("/admin");
                    } else if (role === 'EMPLOYER') {
                        router.push("/jobs/employer");
                    } else {
                        router.push("/jobs");
                    }
                } else {
                    setError('No session found');
                    setLoading(false);
                }
            } catch (err) {
                console.error('Callback error:', err);
                setError('An error occurred during authentication');
                setLoading(false);
            }
        };

        handleCallback();
    }, [router, searchParams]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle>Processing Authentication...</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-600">Please wait while we complete your login.</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-red-600">Authentication Error</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-gray-600">{error}</p>
                        <button
                            onClick={() => router.push("/auth/signin")}
                            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Try Again
                        </button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return null;
}

export default function AuthCallbackPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CallbackContent />
        </Suspense>
    );
}
