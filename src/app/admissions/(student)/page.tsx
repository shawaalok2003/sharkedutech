"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdmissionsPage() {
    const router = useRouter();
    const [applications, setApplications] = useState<any[]>([]);
    const [profileCompletion, setProfileCompletion] = useState(0);
    const [documents, setDocuments] = useState<any[]>([]);

    useEffect(() => {
        async function loadData() {
            const [appsRes, profileRes, docsRes] = await Promise.all([
                fetch("/api/admissions/applications"),
                fetch("/api/admissions/profile"),
                fetch("/api/admissions/documents")
            ]);
            if (appsRes.ok) {
                const apps = await appsRes.json();
                setApplications(apps);
            }
            if (profileRes.ok) {
                const profile = await profileRes.json();
                const fields = ["phone", "dob", "city", "address", "bio", "education"];
                const filled = fields.filter(f => profile?.[f]).length;
                setProfileCompletion(Math.round((filled / fields.length) * 100));
            }
            if (docsRes.ok) {
                const docs = await docsRes.json();
                setDocuments(docs);
            }
        }
        loadData();
    }, []);

    const refreshApplications = async () => {
        const res = await fetch("/api/admissions/applications");
        if (res.ok) {
            const apps = await res.json();
            setApplications(apps);
        }
    };

    const journeySteps = [
        {
            title: "Complete Profile",
            description: "Add personal, academic, and contact details",
            done: profileCompletion >= 70
        },
        {
            title: "Upload Documents",
            description: "ID, marksheets, photo, and certificates",
            done: documents.length > 0
        },
        {
            title: "Submit Application",
            description: "Apply to your preferred college/course",
            done: applications.length > 0
        },
        {
            title: "College Review",
            description: "Admission team evaluates your application",
            done: applications.some(app => ["In Review", "Approved", "Rejected", "Offer", "Waitlist"].includes(app.status))
        },
        {
            title: "Decision",
            description: "Offer, waitlist, or rejection decision",
            done: applications.some(app => ["Approved", "Rejected", "Offer", "Waitlist"].includes(app.status))
        }
    ];

    const activityFeed = [
        { text: "Transcript Verified", time: "2 hours ago", color: "#D4AF37" },
        { text: "New login detected", time: "Yesterday at 9:45 PM", color: "#CBD5E1" },
        { text: "Application Submitted", time: applications[0]?.createdAt ? new Date(applications[0].createdAt).toLocaleDateString() : "Recently", color: "#10B981" }
    ];

    return (
        <>
            <style jsx>{`
                * { box-sizing: border-box; }
                .layout-wrapper { 
                    min-height: 100vh; 
                    background: white;
                }
                
                /* Main Content */
                .main-content {
                    background: white;
                }
                
                /* Hero Section */
                .hero-banner {
                    background: #D4AF37;
                    border-radius: 24px;
                    padding: 3rem;
                    position: relative;
                    overflow: hidden;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 3rem;
                    box-shadow: 0 10px 30px -10px rgba(10, 25, 47, 0.08);
                    margin: 2rem auto;
                    max-width: 1400px;
                }
                .hero-pattern {
                    position: absolute;
                    inset: 0;
                    opacity: 0.1;
                    background-image: radial-gradient(#0A192F 1px, transparent 1px);
                    background-size: 24px 24px;
                    pointer-events: none;
                }
                .hero-content {
                    position: relative;
                    z-index: 10;
                    max-width: 42rem;
                }
                .hero-badge {
                    display: inline-block;
                    padding: 0.375rem 1rem;
                    background: rgba(10, 25, 47, 0.1);
                    border-radius: 9999px;
                    color: #0A192F;
                    font-size: 10px;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 0.2em;
                    margin-bottom: 1.5rem;
                }
                .hero-title {
                    color: #0A192F;
                    font-size: 3rem;
                    font-weight: 700;
                    letter-spacing: -0.03em;
                    margin-bottom: 1.5rem;
                    line-height: 1.2;
                }
                .hero-subtitle {
                    color: rgba(10, 25, 47, 0.7);
                    font-size: 1.125rem;
                    line-height: 1.6;
                    margin-bottom: 2rem;
                    max-width: 32rem;
                }
                .btn-navy {
                    background: #0A192F;
                    color: white;
                    padding: 1rem 2.5rem;
                    border-radius: 12px;
                    border: none;
                    font-weight: 700;
                    font-size: 0.875rem;
                    cursor: pointer;
                    transition: all 0.3s;
                    display: inline-flex;
                    align-items: center;
                    gap: 0.75rem;
                }
                .btn-navy:hover {
                    box-shadow: 0 10px 30px -10px rgba(10, 25, 47, 0.3);
                    transform: translateY(-2px);
                }
                .progress-widget {
                    position: relative;
                    z-index: 10;
                    background: white;
                    padding: 2rem;
                    border-radius: 24px;
                    box-shadow: 0 10px 30px -10px rgba(10, 25, 47, 0.08);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    min-width: 280px;
                }
                .progress-circle {
                    position: relative;
                    width: 144px;
                    height: 144px;
                    margin-bottom: 1.5rem;
                }
                .progress-circle svg {
                    transform: rotate(-90deg);
                }
                .progress-text {
                    position: absolute;
                    inset: 0;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                }
                .progress-value {
                    font-size: 2.25rem;
                    font-weight: 700;
                    color: #0A192F;
                }
                .progress-label {
                    font-size: 10px;
                    text-transform: uppercase;
                    font-weight: 800;
                    letter-spacing: 0.15em;
                    color: rgba(10, 25, 47, 0.4);
                }

                /* Content Grid */
                .content-section {
                    padding: 0 2rem 3rem 2rem;
                    display: grid;
                    grid-template-columns: 1fr 320px;
                    gap: 2rem;
                    max-width: 1400px;
                    margin: 0 auto;
                }
                .main-column { min-width: 0; }
                .side-column { display: flex; flex-direction: column; gap: 2rem; }
                
                /* Cards */
                .card {
                    background: white;
                    border-radius: 24px;
                    padding: 2rem;
                    border: 1px solid #f1f5f9;
                    box-shadow: 0 10px 30px -10px rgba(10, 25, 47, 0.08);
                    transition: all 0.3s;
                }
                .app-cards-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 2rem;
                    margin-top: 2rem;
                }
                .app-card {
                    background: white;
                    border-radius: 24px;
                    padding: 2rem;
                    border: 1px solid #f1f5f9;
                    box-shadow: 0 10px 30px -10px rgba(10, 25, 47, 0.08);
                    transition: all 0.3s;
                }
                .app-card:hover {
                    transform: scale(1.02);
                }
                .status-badge {
                    padding: 0.375rem 1rem;
                    border-radius: 9999px;
                    font-size: 10px;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 0.15em;
                }
                .status-progress { background: #0A192F; color: white; }
                .status-completed { background: #10B981; color: white; }
                .status-pending { background: #F59E0B; color: white; }
                
                .progress-bar {
                    width: 100%;
                    height: 8px;
                    background: #f1f5f9;
                    border-radius: 9999px;
                    overflow: hidden;
                }
                .progress-fill {
                    height: 100%;
                    border-radius: 9999px;
                    transition: width 0.3s;
                }
                .progress-navy { background: #0A192F; }
                .progress-emerald { background: #10B981; }

                /* Important Dates */
                .dates-widget {
                    background: #0A192F;
                    color: white;
                    padding: 2rem;
                    border-radius: 24px;
                    box-shadow: 0 10px 30px -10px rgba(10, 25, 47, 0.08);
                    position: relative;
                    overflow: hidden;
                }
                .dates-bg {
                    position: absolute;
                    top: -1rem;
                    right: -1rem;
                    opacity: 0.05;
                    font-size: 120px;
                }
                .date-item {
                    display: flex;
                    gap: 1.25rem;
                    margin-bottom: 2rem;
                }
                .date-box {
                    min-width: 56px;
                    height: 56px;
                    border-radius: 12px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                }
                .date-box-primary {
                    background: #D4AF37;
                    color: #0A192F;
                }
                .date-box-secondary {
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }
                
                .btn-outline-white {
                    width: 100%;
                    padding: 0.75rem;
                    background: transparent;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    color: white;
                    border-radius: 12px;
                    font-size: 0.75rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    cursor: pointer;
                    transition: all 0.3s;
                    margin-top: 1rem;
                }
                .btn-outline-white:hover {
                    background: rgba(255, 255, 255, 0.1);
                }

                /* Activity Feed */
                .activity-item {
                    display: flex;
                    gap: 1.25rem;
                    align-items: flex-start;
                    margin-bottom: 1.5rem;
                }
                .activity-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    margin-top: 0.5rem;
                    flex-shrink: 0;
                }

                /* Responsive */
                @media (max-width: 1280px) {
                    .content-section {
                        grid-template-columns: 1fr;
                    }
                    .side-column {
                        display: grid;
                        grid-template-columns: repeat(2, 1fr);
                        gap: 2rem;
                    }
                }
                @media (max-width: 1024px) {
                    .app-cards-grid {
                        grid-template-columns: 1fr;
                    }
                }
                @media (max-width: 768px) {
                    .hero-banner {
                        flex-direction: column;
                        margin: 0 1rem 1rem 1rem;
                        padding: 2rem;
                    }
                    .hero-title {
                        font-size: 2rem;
                    }
                    .content-section {
                        padding: 0 1rem 2rem 1rem;
                    }
                    .side-column {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
            <div className="layout-wrapper">
                {/* Main Content */}
                <main className="main-content">
                    {/* Hero Section */}
                    <section className="hero-banner">
                        <div className="hero-pattern"></div>
                        <div className="hero-content">
                            <span className="hero-badge">Welcome Back</span>
                            <h1 className="hero-title">Welcome back, Alex.</h1>
                            <p className="hero-subtitle">
                                Your journey to academic excellence is nearly complete. Review your outstanding tasks to finalize your submission.
                            </p>
                            <button className="btn-navy" onClick={() => router.push('/admissions/applications')}>
                                <span>Continue Application</span>
                                <span>→</span>
                            </button>
                        </div>
                        <div className="progress-widget">
                            <div className="progress-circle">
                                <svg width="144" height="144">
                                    <circle cx="72" cy="72" r="64" fill="transparent" stroke="#f1f5f9" strokeWidth="8"></circle>
                                    <circle 
                                        cx="72" 
                                        cy="72" 
                                        r="64" 
                                        fill="transparent" 
                                        stroke="#D4AF37" 
                                        strokeWidth="8" 
                                        strokeDasharray="402" 
                                        strokeDashoffset={402 - (402 * profileCompletion) / 100}
                                        strokeLinecap="round"
                                    ></circle>
                                </svg>
                                <div className="progress-text">
                                    <span className="progress-value">{profileCompletion}%</span>
                                    <span className="progress-label">Progress</span>
                                </div>
                            </div>
                            <p style={{ fontWeight: 700, textAlign: 'center', margin: 0, color: '#0A192F' }}>Application Status</p>
                            <p style={{ fontSize: '0.75rem', textAlign: 'center', marginTop: '0.25rem', color: 'rgba(10, 25, 47, 0.5)', fontWeight: 500 }}>
                                {journeySteps.filter(s => !s.done).length} steps remaining to submit
                            </p>
                        </div>
                    </section>

                    {/* Content Grid */}
                    <section className="content-section">
                        <div className="main-column">
                            {/* Applications Header */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0A192F', margin: 0 }}>Active Applications</h2>
                                <button 
                                    onClick={() => router.push('/admissions/applications')}
                                    style={{ 
                                        color: '#D4AF37', 
                                        fontSize: '0.875rem', 
                                        fontWeight: 700, 
                                        background: 'none', 
                                        border: 'none', 
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.25rem'
                                    }}
                                >
                                    View All <span>›</span>
                                </button>
                            </div>

                            {/* Applications Grid */}
                            {applications.length === 0 ? (
                                <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📋</div>
                                    <h3 style={{ fontWeight: 700, marginBottom: '0.5rem', color: '#0A192F' }}>No Applications Yet</h3>
                                    <p style={{ color: '#64748b', marginBottom: '2rem' }}>Start by browsing colleges and submitting your first application.</p>
                                    <button className="btn-navy" style={{ width: 'auto' }} onClick={() => router.push('/admissions/colleges')}>
                                        Browse Colleges →
                                    </button>
                                </div>
                            ) : (
                                <div className="app-cards-grid">
                                    {applications.slice(0, 2).map((app, idx) => (
                                        <div key={app.id} className="app-card">
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                                                <div style={{ 
                                                    height: '56px', 
                                                    width: '56px', 
                                                    borderRadius: '12px', 
                                                    background: '#f8fafc', 
                                                    border: '1px solid #f1f5f9',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '1.5rem'
                                                }}>
                                                    🏛️
                                                </div>
                                                <span className={`status-badge ${
                                                    app.status === 'Approved' ? 'status-completed' : 
                                                    app.status === 'Pending' ? 'status-pending' : 
                                                    'status-progress'
                                                }`}>
                                                    {app.status === 'Approved' ? 'Completed' : app.status === 'Pending' ? 'Pending' : 'In Progress'}
                                                </span>
                                            </div>
                                            <h4 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: '#0A192F' }}>
                                                {app.course?.title || "General Admission"}
                                            </h4>
                                            <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '2rem', fontWeight: 500 }}>
                                                {app.college?.name || "College"}
                                            </p>
                                            <div style={{ marginBottom: '1rem' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                                    <span style={{ color: '#64748b' }}>
                                                        {app.status === 'Approved' ? 'Submitted on' : 'Next Deadline'}
                                                    </span>
                                                    <span style={{ color: app.status === 'Approved' ? '#10B981' : '#0A192F' }}>
                                                        {app.createdAt ? new Date(app.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'TBD'}
                                                    </span>
                                                </div>
                                                <div className="progress-bar">
                                                    <div 
                                                        className={`progress-fill ${app.status === 'Approved' ? 'progress-emerald' : 'progress-navy'}`}
                                                        style={{ width: `${app.status === 'Approved' ? 100 : Math.min((app.step || 1) * 25, 75)}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Required Actions */}
                            <div className="card" style={{ marginTop: '2rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                                    <span style={{ color: '#D4AF37', fontSize: '1.25rem' }}>⚠️</span>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0A192F', margin: 0 }}>Required Actions</h3>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {documents.length === 0 && (
                                        <div style={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            justifyContent: 'space-between', 
                                            padding: '1.5rem', 
                                            background: '#f8fafc', 
                                            borderRadius: '16px', 
                                            borderLeft: '4px solid #D4AF37' 
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                                                <div style={{ 
                                                    height: '40px', 
                                                    width: '40px', 
                                                    borderRadius: '50%', 
                                                    background: 'rgba(212, 175, 55, 0.1)', 
                                                    display: 'flex', 
                                                    alignItems: 'center', 
                                                    justifyContent: 'center',
                                                    fontSize: '1.25rem'
                                                }}>
                                                    📄
                                                </div>
                                                <div>
                                                    <p style={{ fontWeight: 700, color: '#0A192F', fontSize: '0.875rem', margin: 0 }}>Upload Official Transcript</p>
                                                    <p style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500, margin: 0 }}>Required for application completion</p>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => router.push('/admissions/documents')}
                                                style={{ 
                                                    fontSize: '0.75rem', 
                                                    fontWeight: 800, 
                                                    color: '#D4AF37', 
                                                    textTransform: 'uppercase', 
                                                    letterSpacing: '0.1em',
                                                    background: 'none',
                                                    border: 'none',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                Upload Now
                                            </button>
                                        </div>
                                    )}
                                    {profileCompletion < 70 && (
                                        <div style={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            justifyContent: 'space-between', 
                                            padding: '1.5rem', 
                                            background: '#f8fafc', 
                                            borderRadius: '16px', 
                                            borderLeft: '4px solid #D4AF37' 
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                                                <div style={{ 
                                                    height: '40px', 
                                                    width: '40px', 
                                                    borderRadius: '50%', 
                                                    background: 'rgba(212, 175, 55, 0.1)', 
                                                    display: 'flex', 
                                                    alignItems: 'center', 
                                                    justifyContent: 'center',
                                                    fontSize: '1.25rem'
                                                }}>
                                                    👤
                                                </div>
                                                <div>
                                                    <p style={{ fontWeight: 700, color: '#0A192F', fontSize: '0.875rem', margin: 0 }}>Complete Your Profile</p>
                                                    <p style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500, margin: 0 }}>Add missing information to strengthen application</p>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => router.push('/admissions/profile')}
                                                style={{ 
                                                    fontSize: '0.75rem', 
                                                    fontWeight: 800, 
                                                    color: '#D4AF37', 
                                                    textTransform: 'uppercase', 
                                                    letterSpacing: '0.1em',
                                                    background: 'none',
                                                    border: 'none',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                Update Now
                                            </button>
                                        </div>
                                    )}
                                    {documents.length > 0 && profileCompletion >= 70 && (
                                        <div style={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            justifyContent: 'space-between', 
                                            padding: '1.5rem', 
                                            background: 'rgba(241, 245, 249, 0.5)', 
                                            borderRadius: '16px', 
                                            borderLeft: '4px solid #cbd5e1' 
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                                                <div style={{ 
                                                    height: '40px', 
                                                    width: '40px', 
                                                    borderRadius: '50%', 
                                                    background: 'rgba(203, 213, 225, 0.5)', 
                                                    display: 'flex', 
                                                    alignItems: 'center', 
                                                    justifyContent: 'center',
                                                    fontSize: '1.25rem'
                                                }}>
                                                    ✅
                                                </div>
                                                <div>
                                                    <p style={{ fontWeight: 700, color: '#64748b', fontSize: '0.875rem', margin: 0 }}>All Requirements Complete!</p>
                                                    <p style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500, margin: 0 }}>You're ready to submit applications</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Side Column */}
                        <div className="side-column">
                            {/* Important Dates */}
                            <div className="dates-widget">
                                <div className="dates-bg">📅</div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '2rem', position: 'relative', zIndex: 10 }}>Important Dates</h3>
                                <div style={{ position: 'relative', zIndex: 10 }}>
                                    <div className="date-item">
                                        <div className="date-box date-box-primary">
                                            <span style={{ fontSize: '10px', fontWeight: 800, lineHeight: 1, textTransform: 'uppercase' }}>Sep</span>
                                            <span style={{ fontSize: '1.25rem', fontWeight: 700, lineHeight: 1, marginTop: '0.25rem' }}>28</span>
                                        </div>
                                        <div>
                                            <p style={{ fontSize: '0.875rem', fontWeight: 700, color: 'white', margin: 0 }}>Virtual Open House</p>
                                            <p style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.5)', fontWeight: 500, marginTop: '0.25rem' }}>10:00 AM - 11:30 AM</p>
                                        </div>
                                    </div>
                                    <div className="date-item">
                                        <div className="date-box date-box-secondary">
                                            <span style={{ fontSize: '10px', fontWeight: 800, lineHeight: 1, textTransform: 'uppercase' }}>Oct</span>
                                            <span style={{ fontSize: '1.25rem', fontWeight: 700, lineHeight: 1, marginTop: '0.25rem' }}>12</span>
                                        </div>
                                        <div>
                                            <p style={{ fontSize: '0.875rem', fontWeight: 700, color: 'white', margin: 0 }}>Portfolio Workshop</p>
                                            <p style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.5)', fontWeight: 500, marginTop: '0.25rem' }}>02:00 PM - 04:00 PM</p>
                                        </div>
                                    </div>
                                </div>
                                <button className="btn-outline-white">View Academic Calendar</button>
                            </div>

                            {/* Activity Feed */}
                            <div className="card">
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0A192F', marginBottom: '2rem' }}>Activity Feed</h3>
                                <div>
                                    {activityFeed.map((item, idx) => (
                                        <div key={idx} className="activity-item">
                                            <div className="activity-dot" style={{ background: item.color }}></div>
                                            <div>
                                                <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0A192F', margin: 0 }}>{item.text}</p>
                                                <p style={{ fontSize: '11px', color: '#64748b', marginTop: '0.25rem', fontWeight: 500, fontStyle: 'italic' }}>{item.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </>
    );
}
