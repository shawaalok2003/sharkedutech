"use client";

import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SuccessContent() {
    const searchParams = useSearchParams();
    const jobTitle = searchParams.get('job') || 'the position';

    return (
        <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            <Card style={{ maxWidth: '600px', width: '100%', textAlign: 'center', padding: '2rem' }}>
                <CardContent>
                    <div style={{
                        width: '80px', height: '80px', backgroundColor: '#ECFDF5',
                        color: '#059669', borderRadius: '50%', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem',
                        margin: '0 auto 1.5rem auto'
                    }}>
                        ✓
                    </div>

                    <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '1rem' }}>
                        Application Submitted!
                    </h1>

                    <p style={{ fontSize: '1.1rem', color: 'var(--muted-foreground)', marginBottom: '2rem', lineHeight: '1.6' }}>
                        Your application for <strong>{jobTitle}</strong> has been successfully sent to the employer.
                        They will review your profile and resume.
                    </p>

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link href="/candidate/dashboard">
                            <Button variant="outline" size="lg">View My Applications</Button>
                        </Link>
                        <Link href="/jobs">
                            <Button size="lg">Browse More Jobs</Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default function ApplicationSuccessPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SuccessContent />
        </Suspense>
    );
}
