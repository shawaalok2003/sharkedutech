"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function CandidateApplicationsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/signin");
            return;
        }

        async function fetchApps() {
            try {
                const res = await fetch('/api/applications');
                if (res.ok) {
                    const data = await res.json();
                    setApplications(data);
                }
            } catch (err) {
                console.error("Failed to fetch applications:", err);
            } finally {
                setLoading(false);
            }
        }

        if (session) {
            fetchApps();
        }
    }, [session, status, router]);

    if (loading) {
        return (
            <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
                    <div>Loading your applications...</div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ 
            fontFamily: 'Manrope, sans-serif',
            maxWidth: '1200px', 
            margin: '0 auto', 
            padding: '2rem' 
        }}>
            <header style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem 0' }}>Job Applications</h1>
                <p style={{ color: '#64748b', margin: 0 }}>Track the status of all your applied job positions.</p>
            </header>

            <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                {applications.length === 0 ? (
                    <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.5rem 0' }}>No Applications Yet</h3>
                        <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>You haven't applied to any jobs. Explore the career portal to find your next opportunity!</p>
                        <button 
                            onClick={() => router.push('/jobs')}
                            style={{ background: '#0A192F', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}
                        >
                            Browse Jobs
                        </button>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                <tr>
                                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Job Position</th>
                                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Applied Date</th>
                                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {applications.map((app) => (
                                    <tr key={app.id} style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer', transition: 'background-color 0.15s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}>
                                        <td style={{ padding: '1.25rem 1.5rem' }}>
                                            <p style={{ margin: '0 0 0.25rem 0', fontWeight: 800, color: '#0f172a' }}>{app.job?.title || 'Unknown Position'}</p>
                                            <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b' }}>{app.job?.employer?.name || 'Unknown Company'}</p>
                                        </td>
                                        <td style={{ padding: '1.25rem 1.5rem', color: '#475569', fontSize: '0.875rem' }}>
                                            {new Date(app.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                                        </td>
                                        <td style={{ padding: '1.25rem 1.5rem' }}>
                                            <span style={{ 
                                                padding: '0.35rem 0.8rem', 
                                                borderRadius: '9999px', 
                                                fontSize: '0.7rem', 
                                                fontWeight: 800, 
                                                textTransform: 'uppercase', 
                                                letterSpacing: '0.1em',
                                                background: app.status === 'Interview' ? '#dbeafe' : app.status === 'Offer' ? '#d1fae5' : app.status === 'Rejected' ? '#fee2e2' : '#f1f5f9',
                                                color: app.status === 'Interview' ? '#1e40af' : app.status === 'Offer' ? '#065f46' : app.status === 'Rejected' ? '#991b1b' : '#475569'
                                            }}>
                                                {app.status || 'Applied'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
