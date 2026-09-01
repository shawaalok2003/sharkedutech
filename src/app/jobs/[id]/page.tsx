"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function SingleJobDetailPage() {
    const params = useParams();
    const router = useRouter();
    const jobId = params?.id as string;

    const [job, setJob] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        async function fetchJob() {
            try {
                const res = await fetch(`/api/jobs/${jobId}`);
                if (res.ok) {
                    const data = await res.json();
                    setJob(data);
                }
            } catch (e) {
                console.error("Failed to load job detail", e);
            } finally {
                setLoading(false);
            }
        }
        if (jobId) fetchJob();

        try {
            const saved = localStorage.getItem('shark_saved_jobs_v1');
            if (saved && JSON.parse(saved).includes(jobId)) {
                setIsSaved(true);
            }
        } catch (e) {}
    }, [jobId]);

    const toggleSave = () => {
        try {
            const saved = localStorage.getItem('shark_saved_jobs_v1');
            let list = saved ? JSON.parse(saved) : [];
            if (list.includes(jobId)) {
                list = list.filter((id: string) => id !== jobId);
                setIsSaved(false);
            } else {
                list.push(jobId);
                setIsSaved(true);
            }
            localStorage.setItem('shark_saved_jobs_v1', JSON.stringify(list));
        } catch (e) {}
    };

    if (loading) {
        return <div style={{ padding: '4rem', textAlign: 'center', color: '#64748b' }}>Loading Job Details...</div>;
    }

    if (!job) {
        return (
            <div style={{ maxWidth: '800px', margin: '4rem auto', padding: '2rem', textAlign: 'center', background: '#ffffff', borderRadius: '1.25rem', border: '1px solid #e2e8f0' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>Job Posting Not Found</h2>
                <p style={{ color: '#64748b', margin: '1rem 0 2rem 0' }}>This vacancy may have been filled or moved.</p>
                <Link href="/jobs" style={{ background: '#2563eb', color: '#ffffff', padding: '0.75rem 1.75rem', borderRadius: '999px', fontWeight: 800, textDecoration: 'none' }}>
                    &larr; Browse Active Opportunities
                </Link>
            </div>
        );
    }

    const compName = job.companyName || job.employer?.name || "Luxury Hotel Partner";
    const compLogo = job.posterUrl || "/images/shark_edu_tech_logo-removebg-preview.png";

    return (
        <div style={{ maxWidth: '960px', margin: '0 auto', padding: '2rem 1.5rem', fontFamily: 'Inter, sans-serif', color: '#0f172a' }}>
            <Link href="/jobs" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#2563eb', fontWeight: 700, textDecoration: 'none', marginBottom: '1.5rem' }}>
                &larr; Back to All Jobs
            </Link>

            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '1.25rem', padding: '2.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid #f1f5f9' }}>
                    <img 
                        src={compLogo} 
                        alt={compName} 
                        style={{ width: '72px', height: '72px', borderRadius: '12px', objectFit: 'cover', border: '1px solid #e2e8f0' }}
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = "/images/shark_edu_tech_logo-removebg-preview.png";
                        }}
                    />
                    <div>
                        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.35rem 0' }}>{job.title}</h1>
                        <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#2563eb', marginBottom: '0.35rem' }}>
                            {compName} ☑️
                        </div>
                        <div style={{ fontSize: '0.9rem', color: '#64748b' }}>
                            📍 {job.location} &bull; Reposted recently
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
                    <span style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '0.4rem 0.9rem', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 600 }}>
                        💼 {job.type || 'Full-time'}
                    </span>
                    <span style={{ background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', padding: '0.4rem 0.9rem', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 600 }}>
                        🏷️ {job.category}
                    </span>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2.5rem' }}>
                    <Link href={`/jobs/apply/${job.id}`} style={{ background: '#2563eb', color: '#ffffff', padding: '0.85rem 2.5rem', borderRadius: '999px', fontSize: '1rem', fontWeight: 800, textDecoration: 'none', boxShadow: '0 6px 18px rgba(37, 99, 235, 0.28)' }}>
                        Apply Now ↗
                    </Link>
                    <button 
                        onClick={toggleSave}
                        style={{ background: isSaved ? '#f0fdf4' : '#ffffff', color: isSaved ? '#166534' : '#2563eb', border: `1.5px solid ${isSaved ? '#166534' : '#2563eb'}`, padding: '0.85rem 2rem', borderRadius: '999px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer' }}
                    >
                        {isSaved ? 'Saved ✓' : 'Save Job'}
                    </button>
                </div>

                <div style={{ fontSize: '0.975rem', color: '#334155', lineHeight: '1.75' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>About the job</h3>
                    <div style={{ whiteSpace: 'pre-line', marginBottom: '2rem' }}>{job.description}</div>

                    {job.requirements && (
                        <>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>Requirements</h3>
                            <div style={{ whiteSpace: 'pre-line', marginBottom: '2rem' }}>{job.requirements}</div>
                        </>
                    )}

                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>Benefits &amp; Perks</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                        <span style={{ background: '#f8fafc', padding: '0.45rem 0.9rem', borderRadius: '6px', fontSize: '0.875rem' }}>🏨 Duty Meals Provided</span>
                        <span style={{ background: '#f8fafc', padding: '0.45rem 0.9rem', borderRadius: '6px', fontSize: '0.875rem' }}>🏥 Health Insurance</span>
                        <span style={{ background: '#f8fafc', padding: '0.45rem 0.9rem', borderRadius: '6px', fontSize: '0.875rem' }}>📈 Performance Bonuses</span>
                        <span style={{ background: '#f8fafc', padding: '0.45rem 0.9rem', borderRadius: '6px', fontSize: '0.875rem' }}>✈️ Relocation Assistance</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
