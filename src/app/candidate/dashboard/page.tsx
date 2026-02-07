"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function CandidateDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        phone: '',
        skills: '',
        resumeUrl: '',
        education: '',
        experience: ''
    });
    const [applications, setApplications] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [appCount, setAppCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/signin");
            return;
        }

        async function fetchProfile() {
            try {
                const res = await fetch('/api/profile');
                if (res.ok) {
                    const data = await res.json();
                    setProfile({
                        name: data.name || '',
                        email: data.email || '',
                        phone: data.phone || '',
                        skills: data.skills || '',
                        resumeUrl: data.resumeUrl || '',
                        education: data.education || '',
                        experience: data.experience || ''
                    });
                }
            } catch (error) {
                console.error("Failed to fetch profile", error);
            } finally {
                setLoading(false);
            }
        }

        async function fetchStats() {
            try {
                const res = await fetch('/api/applications');
                if (res.ok) {
                    const data = await res.json();
                    setAppCount(data.length);
                    setApplications(data);
                }
            } catch (err) {
                console.error(err);
            }
        }

        async function fetchJobs() {
            try {
                const res = await fetch('/api/jobs?limit=6');
                if (res.ok) {
                    const data = await res.json();
                    setJobs(data);
                }
            } catch (err) {
                console.error("Failed to fetch jobs", err);
            }
        }

        if (session) {
            fetchProfile();
            fetchStats();
            fetchJobs();
        }
    }, [session, status, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setProfile(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch('/api/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profile),
            });

            if (res.ok) {
                alert('Profile updated successfully!');
            } else {
                alert('Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('An error occurred');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280', fontFamily: 'Manrope, sans-serif' }}>
            <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
                <div>Loading your dashboard...</div>
            </div>
        </div>
    );

    const interviewCount = applications.filter((a: any) => a.status === 'Interview').length;
    const offersCount = applications.filter((a: any) => a.status === 'Offer').length;

    const borderColors: { [key: string]: string } = {
        'teal': '#14b8a6',
        'warning': '#f59e0b',
        'blue': '#3b82f6',
        'purple': '#a855f7',
        'cyan': '#06b6d4'
    };
    
    const colorKeys = Object.keys(borderColors);

    return (
        <>
            <style jsx>{`
                @media (max-width: 768px) {
                    .dashboard-header { padding: 0.75rem 1rem !important; }
                    .dashboard-header-title { font-size: 1rem !important; }
                    .stats-grid { grid-template-columns: 1fr !important; }
                    .jobs-grid { grid-template-columns: 1fr !important; }
                    .profile-form { grid-template-columns: 1fr !important; }
                    .form-button { grid-column: span 1 !important; }
                    .welcome-section h2 { font-size: 1.5rem !important; }
                    .stat-card { padding: 1rem !important; }
                    .stat-number { font-size: 1.75rem !important; }
                    .table-container { font-size: 0.75rem !important; }
                }

                @media (max-width: 480px) {
                    .dashboard-header { padding: 0.5rem 0.75rem !important; }
                    .dashboard-main { padding: 1rem !important; }
                    .dashboard-header-title { font-size: 0.875rem !important; }
                    .dashboard-user-role { font-size: 0.65rem !important; }
                    .welcome-section h2 { font-size: 1.25rem !important; }
                    .welcome-section p { font-size: 0.75rem !important; }
                    .stat-card { padding: 0.75rem !important; }
                    .stat-number { font-size: 1.5rem !important; }
                    .stat-label { font-size: 0.65rem !important; }
                    .stat-emoji { font-size: 1.25rem !important; }
                    .jobs-grid { gap: 0.75rem !important; }
                    .job-card { padding: 1rem !important; }
                    .job-title { font-size: 0.875rem !important; }
                    .table-container { font-size: 0.7rem !important; }
                    .profile-section { padding: 1rem !important; }
                }

                @media (min-width: 1440px) {
                    .dashboard-main { max-width: 1440px !important; }
                }
            `}</style>
            <div style={{ 
                backgroundColor: '#f6f7f7', 
                minHeight: '100vh',
                fontFamily: 'Manrope, sans-serif'
            }}>
                {/* Header */}
                <header className="dashboard-header" style={{
                background: 'linear-gradient(to right, #151e29 0%, #1e3a5f 100%)',
                padding: '1rem 2rem',
                color: 'white',
                position: 'sticky',
                top: 0,
                zIndex: 50,
                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.2)'
            }}>
                <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '0.05em' }}>
                            🎯 Sharkedutech
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div style={{ textAlign: 'right' }}>
                            <p style={{ fontSize: '0.875rem', fontWeight: 700, margin: 0 }}>{profile.name || 'Candidate'}</p>
                            <p style={{ fontSize: '0.75rem', color: '#a8d8ea', margin: 0, fontWeight: 600 }}>CANDIDATE</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="dashboard-main" style={{ maxWidth: '1440px', margin: '0 auto', padding: '2rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
                    {/* Welcome Section */}
                    <section className="welcome-section">
                        <h2 style={{ fontSize: '2rem', fontWeight: 700, margin: 0, color: '#151e29' }}>
                            Welcome back, {profile.name || 'Candidate'}! 👋
                        </h2>
                        <p style={{ color: '#6b7280', marginTop: '0.5rem', margin: 0 }}>
                            You have <span style={{ color: '#151e29', fontWeight: 600 }}>{interviewCount} new interview requests</span> and {applications.length} active applications.
                        </p>
                    </section>

                    {/* Statistics Row */}
                    <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                        {/* Applied Card */}
                        <div className="stat-card" style={{
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            borderRadius: '0.75rem',
                            padding: '1.5rem',
                            color: 'white',
                            boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.3)',
                            transition: 'all 0.3s ease',
                            cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(16, 185, 129, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(16, 185, 129, 0.3)';
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <p className="stat-label" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>Applied</p>
                                    <p className="stat-number" style={{ fontSize: '2.25rem', fontWeight: 900, marginTop: '0.5rem', margin: 0 }}>{applications.length}</p>
                                </div>
                                <div className="stat-emoji" style={{ background: 'rgba(255,255,255,0.2)', padding: '0.5rem', borderRadius: '0.5rem', fontSize: '1.5rem' }}>📤</div>
                            </div>
                            <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'rgba(255,255,255,0.9)', margin: 0 }}>+{applications.length > 0 ? Math.floor(Math.random() * 20) : 0}% from last month</p>
                        </div>

                        {/* Interviews Card */}
                        <div className="stat-card" style={{
                            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                            borderRadius: '0.75rem',
                            padding: '1.5rem',
                            color: 'white',
                            boxShadow: '0 4px 6px -1px rgba(245, 158, 11, 0.3)',
                            transition: 'all 0.3s ease',
                            cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(245, 158, 11, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(245, 158, 11, 0.3)';
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <p className="stat-label" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>Interviews</p>
                                    <p className="stat-number" style={{ fontSize: '2.25rem', fontWeight: 900, marginTop: '0.5rem', margin: 0 }}>{interviewCount}</p>
                                </div>
                                <div className="stat-emoji" style={{ background: 'rgba(255,255,255,0.2)', padding: '0.5rem', borderRadius: '0.5rem', fontSize: '1.5rem' }}>📅</div>
                            </div>
                            <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'rgba(255,255,255,0.9)', margin: 0 }}>{interviewCount} scheduled this week</p>
                        </div>

                        {/* Offers Card */}
                        <div className="stat-card" style={{
                            background: 'linear-gradient(135deg, #151e29 0%, #1f2937 100%)',
                            borderRadius: '0.75rem',
                            padding: '1.5rem',
                            color: 'white',
                            boxShadow: '0 4px 6px -1px rgba(21, 30, 41, 0.3)',
                            transition: 'all 0.3s ease',
                            cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(21, 30, 41, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(21, 30, 41, 0.3)';
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <p className="stat-label" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>Offers</p>
                                    <p className="stat-number" style={{ fontSize: '2.25rem', fontWeight: 900, marginTop: '0.5rem', margin: 0 }}>{offersCount}</p>
                                </div>
                                <div className="stat-emoji" style={{ background: 'rgba(255,255,255,0.2)', padding: '0.5rem', borderRadius: '0.5rem', fontSize: '1.5rem' }}>🏆</div>
                            </div>
                            <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'rgba(255,255,255,0.9)', margin: 0 }}>{offersCount} pending response</p>
                        </div>
                    </div>

                    {/* Featured Jobs Section */}
                    {jobs.length > 0 && (
                        <section>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#151e29', margin: 0 }}>Featured Jobs for You</h3>
                                <button onClick={() => router.push('/jobs')} style={{
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                    color: '#10b981',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '0.5rem',
                                    transition: 'background-color 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(16, 185, 129, 0.1)'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                                    View All →
                                </button>
                            </div>

                            <div className="jobs-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                                {jobs.slice(0, 8).map((job: any, idx: number) => {
                                    const borderColor = borderColors[colorKeys[idx % colorKeys.length]];

                                    return (
                                        <div
                                            key={job.id}
                                            className="job-card"
                                            style={{
                                                backgroundColor: 'white',
                                                borderLeft: `4px solid ${borderColor}`,
                                                borderRadius: '0.75rem',
                                                padding: '1.25rem',
                                                boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1)',
                                                transition: 'all 0.3s ease',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                flexDirection: 'column'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform = 'translateY(-4px)';
                                                e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0,0,0,0.15)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = 'translateY(0)';
                                                e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0,0,0,0.1)';
                                            }}
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                                <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.5rem', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                                                    <span style={{ fontSize: '1.25rem' }}>🏢</span>
                                                </div>
                                                <span style={{ fontSize: '0.65rem', fontWeight: 700, backgroundColor: `${borderColor}20`, color: borderColor, padding: '0.25rem 0.5rem', borderRadius: '0.25rem', textTransform: 'uppercase', flexShrink: 0 }}>
                                                    {job.type || 'REMOTE'}
                                                </span>
                                            </div>

                                            <h4 className="job-title" style={{ fontSize: '1rem', fontWeight: 700, color: '#151e29', marginBottom: '0.25rem', margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                {job.title}
                                            </h4>
                                            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem', margin: 0 }}>
                                                {job.employer?.name || 'Company Name'}
                                            </p>

                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem', flex: 1 }}>
                                                <div style={{ fontSize: '0.75rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    📍 {job.location || 'Remote'}
                                                </div>
                                                {job.salaryMin && job.salaryMax && (
                                                    <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#059669' }}>
                                                        ₹{(job.salaryMin / 100000).toFixed(1)}L - ₹{(job.salaryMax / 100000).toFixed(1)}L
                                                    </div>
                                                )}
                                            </div>

                                            <button
                                                onClick={() => router.push(`/jobs/${job.id}`)}
                                                style={{
                                                    width: '100%',
                                                    padding: '0.5rem',
                                                    background: '#f5f5f5',
                                                    color: '#151e29',
                                                    fontWeight: 700,
                                                    fontSize: '0.75rem',
                                                    borderRadius: '0.25rem',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s',
                                                    marginTop: 'auto'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.backgroundColor = '#151e29';
                                                    e.currentTarget.style.color = 'white';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.backgroundColor = '#f5f5f5';
                                                    e.currentTarget.style.color = '#151e29';
                                                }}
                                            >
                                                Apply Now
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    )}

                    {/* Applications Table */}
                    {applications.length > 0 && (
                        <section style={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                            <div style={{ padding: '1.5rem', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#151e29', margin: 0 }}>Recent Applications</h3>
                            </div>

                            <div className="table-container" style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                                <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', minWidth: '500px' }}>
                                    <thead>
                                        <tr style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#9ca3af', fontWeight: 600, backgroundColor: '#f9fafb' }}>
                                            <th style={{ padding: '1.5rem' }}>Company</th>
                                            <th style={{ padding: '1.5rem' }}>Applied Date</th>
                                            <th style={{ padding: '1.5rem' }}>Status</th>
                                            <th style={{ padding: '1.5rem' }}>Next Step</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {applications.slice(0, 5).map((app: any) => (
                                            <tr key={app.id} style={{ borderTop: '1px solid #f3f4f6', transition: 'background-color 0.2s', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}>
                                                <td style={{ padding: '1.5rem' }}>
                                                    <div>
                                                        <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#151e29', margin: 0 }}>{app.job?.title || 'Job Title'}</p>
                                                        <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>Applied Position</p>
                                                    </div>
                                                </td>
                                                <td style={{ padding: '1.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
                                                    {new Date(app.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                                </td>
                                                <td style={{ padding: '1.5rem' }}>
                                                    <span style={{
                                                        padding: '0.375rem 0.75rem',
                                                        fontSize: '0.65rem',
                                                        fontWeight: 700,
                                                        borderRadius: '9999px',
                                                        textTransform: 'uppercase',
                                                        backgroundColor: app.status === 'Interview' ? '#dbeafe' : app.status === 'Offer' ? '#d1fae5' : app.status === 'Rejected' ? '#fee2e2' : '#f3f4f6',
                                                        color: app.status === 'Interview' ? '#1e40af' : app.status === 'Offer' ? '#065f46' : app.status === 'Rejected' ? '#991b1b' : '#6b7280'
                                                    }}>
                                                        {app.status || 'Applied'}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '1.5rem', fontSize: '0.875rem', color: '#151e29', fontStyle: 'italic' }}>Pending Review</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    )}

                    {/* Profile Section */}
                    <section className="profile-section" style={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid #f3f4f6' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#151e29', margin: 0 }}>Edit Profile</h3>
                            <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0.5rem 0 0 0' }}>Update your information to help employers find you</p>
                        </div>
                        <div style={{ padding: '1.5rem' }}>
                            <form onSubmit={handleSubmit} className="profile-form" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem', color: '#151e29' }}>Full Name</label>
                                    <input name="name" value={profile.name} onChange={handleChange} placeholder="Your full name" style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb', fontSize: '0.875rem', boxSizing: 'border-box', transition: 'border-color 0.2s' }} onFocus={(e) => e.currentTarget.style.borderColor = '#10b981'} onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem', color: '#151e29' }}>Email</label>
                                    <input name="email" value={profile.email} onChange={handleChange} disabled style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb', fontSize: '0.875rem', backgroundColor: '#f9fafb', cursor: 'not-allowed', boxSizing: 'border-box' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem', color: '#151e29' }}>Phone Number</label>
                                    <input name="phone" value={profile.phone} onChange={handleChange} placeholder="+91 98765 43210" style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb', fontSize: '0.875rem', boxSizing: 'border-box', transition: 'border-color 0.2s' }} onFocus={(e) => e.currentTarget.style.borderColor = '#10b981'} onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'} />
                                </div>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem', color: '#151e29' }}>Skills</label>
                                    <textarea name="skills" value={profile.skills} onChange={handleChange} placeholder="React, Node.js, TypeScript, etc." style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb', fontSize: '0.875rem', minHeight: '100px', fontFamily: 'inherit', boxSizing: 'border-box', transition: 'border-color 0.2s', resize: 'vertical' }} onFocus={(e) => e.currentTarget.style.borderColor = '#10b981'} onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'} />
                                </div>
                                <button type="submit" disabled={saving} className="form-button" style={{
                                    gridColumn: 'span 2',
                                    padding: '0.75rem 1.5rem',
                                    backgroundColor: '#10b981',
                                    color: 'white',
                                    fontWeight: 700,
                                    borderRadius: '0.5rem',
                                    border: 'none',
                                    cursor: saving ? 'not-allowed' : 'pointer',
                                    transition: 'background-color 0.2s',
                                    opacity: saving ? 0.7 : 1
                                }}
                                onMouseEnter={(e) => !saving && (e.currentTarget.style.backgroundColor = '#059669')}
                                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#10b981')}
                                >
                                    {saving ? 'Saving...' : 'Save Profile'}
                                </button>
                            </form>
                        </div>
                    </section>
                </div>
            </main>
        </div>
        </>
    );
}
