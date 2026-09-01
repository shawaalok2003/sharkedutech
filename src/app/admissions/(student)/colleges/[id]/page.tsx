'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

const defaultFacilities = [
    { title: "Well-equipped Training Kitchen & Bakery", desc: "State-of-the-art culinary stations & pastry preparation labs.", icon: "🍳" },
    { title: "Housekeeping & Front Office Practice Labs", desc: "Real-world mock hotel suites and Opera PMS front desk software.", icon: "🛏️" },
    { title: "Grooming & Personality Development", desc: "5-star luxury etiquette, body language & professional grooming sessions.", icon: "👔" },
    { title: "Industry Visits, Workshops & Seminars", desc: "Regular campus masterclasses by Taj, Marriott & Hyatt Directors.", icon: "🏬" },
    { title: "SHARK Lifetime Internship & Placement Support", desc: "Guaranteed placement support across your entire hospitality career.", icon: "♾️" },
    { title: "Education Loan at 0% Interest Support", desc: "Seamless financial assistance with zero-interest EMI options.", icon: "💳" },
    { title: "Health Insurance Support Across India", desc: "Comprehensive medical coverage across leading network hospitals.", icon: "🏥" }
];

const defaultAchievements = [
    { title: "100% Assured Placement Assistance", desc: "Guaranteed placement support in 5-star luxury hotels & resorts.", icon: "⭐" },
    { title: "Direct Admission into Recognized Colleges", desc: "UGC & NCHMCT accredited Degree & Diploma programs.", icon: "🎓" },
    { title: "Strong Industry Collaborations", desc: "Official tie-ups with Taj, Marriott, Hyatt, Oberoi & ITC Hotels.", icon: "🤝" },
    { title: "Industrial Training Stipends", desc: "Monthly paid stipends during 6-month hotel internships.", icon: "💰" },
    { title: "Positive Global Recognition", desc: "Verified international career pathways in UAE, Maldives & USA.", icon: "🌐" }
];

export default function CollegeDetailPage() {
    const params = useParams();
    const router = useRouter();
    const collegeId = params?.id as string;

    const [college, setCollege] = useState<any>(null);
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState<any>(null);

    const [form, setForm] = useState({
        studentName: '',
        phone: '',
        email: '',
        courseId: '',
        highestQualification: '12th Pass / HSC',
        percentage: '',
        notes: ''
    });

    useEffect(() => {
        async function load() {
            try {
                const [collegeRes, coursesRes] = await Promise.all([
                    fetch(`/api/admissions/colleges/${collegeId}`),
                    fetch(`/api/admissions/courses?collegeId=${collegeId}`)
                ]);
                if (collegeRes.ok) {
                    setCollege(await collegeRes.json());
                }
                if (coursesRes.ok) {
                    const cData = await coursesRes.json();
                    setCourses(cData);
                    if (cData.length > 0) {
                        setForm(f => ({ ...f, courseId: cData[0].id }));
                        setSelectedCourse(cData[0]);
                    }
                }
            } finally {
                setLoading(false);
            }
        }
        if (collegeId) load();
    }, [collegeId]);

    const handleApply = async (e: React.FormEvent) => {
        e.preventDefault();
        setApplying(true);
        try {
            const res = await fetch('/api/admissions/applications', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    collegeId,
                    courseId: form.courseId || (courses[0]?.id || null),
                    intakeYear: '2026',
                    highestQualification: form.highestQualification,
                    percentage: form.percentage,
                    notes: `Student: ${form.studentName}, Phone: ${form.phone}, Email: ${form.email}. ${form.notes}`
                })
            });
            if (res.ok) {
                const created = await res.json();
                alert("🎉 Admission application submitted successfully! Our counselors will contact you shortly.");
                router.push(`/admissions/applications/${created.id}`);
            } else {
                alert("Failed to submit application. Please try again.");
            }
        } catch (err) {
            console.error("Application error:", err);
        } finally {
            setApplying(false);
        }
    };

    if (loading) return <div style={{ padding: '4rem', textAlign: 'center', color: '#64748b' }}>Loading College Details...</div>;

    const name = college?.name || "Accredited Hospitality College";
    const location = college?.city ? `${college.city}, ${college.state}` : "Pan India Campus";
    const accreditation = college?.accreditation || "UGC & NCHMCT Recognized";
    const campusImage = college?.coverPhoto || college?.logoUrl || "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80";

    return (
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem', fontFamily: 'Inter, sans-serif', color: '#0f172a' }}>
            {/* Back Button */}
            <Link href="/admissions" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#2563eb', fontWeight: 700, textDecoration: 'none', marginBottom: '1.5rem' }}>
                &larr; Back to Admissions Explorer
            </Link>

            {/* Hero Card */}
            <div style={{ position: 'relative', borderRadius: '1.5rem', overflow: 'hidden', height: '360px', marginBottom: '2.5rem', border: '1px solid #e2e8f0', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
                <img src={campusImage} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.4) 60%, transparent 100%)', padding: '2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', color: '#ffffff' }}>
                    <span style={{ background: '#2563eb', color: '#ffffff', fontSize: '0.75rem', fontWeight: 800, padding: '0.3rem 0.75rem', borderRadius: '999px', display: 'inline-block', width: 'fit-content', marginBottom: '0.75rem' }}>
                        {accreditation}
                    </span>
                    <h1 style={{ fontSize: '2.4rem', fontWeight: 800, margin: '0 0 0.5rem 0', color: '#ffffff' }}>{name}</h1>
                    <div style={{ fontSize: '1rem', color: '#cbd5e1', display: 'flex', gap: '1.5rem' }}>
                        <span>📍 {location}</span>
                        <span>🎓 {courses.length} Accredited Programs Offered</span>
                        <span>⭐ 100% Assured Placement Support</span>
                    </div>
                </div>
            </div>

            {/* Main Content Split Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '2.5rem', alignItems: 'start' }}>
                <div>
                    {/* Overview */}
                    <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '1.25rem', padding: '2rem', marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>Institute Overview</h2>
                        <p style={{ fontSize: '0.975rem', color: '#334155', lineHeight: '1.7' }}>
                            {college?.description || `${name} is a premier hospitality management institute committed to producing world-class hotel managers, executive chefs, and front office leaders. Equipped with modern culinary labs, mock hotel suites, and NAAC/UGC recognition.`}
                        </p>
                    </div>

                    {/* Premium Facilities & Training */}
                    <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '1.25rem', padding: '2rem', marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
                            🏛️ Premium Facilities &amp; Training
                        </h2>
                        <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '1.5rem' }}>
                            World-class infrastructure designed to prepare candidates for immediate placement in 5-star luxury hotels.
                        </p>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                            {defaultFacilities.map((f, i) => (
                                <div key={i} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '1rem', padding: '1.25rem' }}>
                                    <div style={{ fontSize: '1.5rem', marginBottom: '0.4rem' }}>{f.icon}</div>
                                    <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.35rem 0' }}>{f.title}</h3>
                                    <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0, lineHeight: '1.5' }}>{f.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Our Career Achievements */}
                    <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '1.25rem', padding: '2rem', marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
                            🏆 Our Career Achievements
                        </h2>
                        <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '1.5rem' }}>
                            Verified placement statistics &amp; direct industry partnerships with luxury 5-star hotel chains.
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {defaultAchievements.map((a, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '0.85rem', padding: '1.15rem' }}>
                                    <div style={{ fontSize: '1.75rem', flexShrink: 0 }}>{a.icon}</div>
                                    <div>
                                        <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1e40af' }}>{a.title}</div>
                                        <div style={{ fontSize: '0.875rem', color: '#3b82f6', marginTop: '0.2rem' }}>{a.desc}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Offered Courses */}
                    <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '1.25rem', padding: '2rem' }}>
                        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.5rem' }}>
                            🎓 Offered Programs &amp; Degree Courses ({courses.length})
                        </h2>

                        {courses.length === 0 ? (
                            <div style={{ color: '#64748b' }}>No courses listed for this college yet.</div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                {courses.map((c) => (
                                    <div key={c.id} style={{ border: '1px solid #e2e8f0', borderRadius: '1rem', padding: '1.25rem', background: '#ffffff' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>{c.title}</h3>
                                            <span style={{ background: '#dcfce7', color: '#15803d', fontWeight: 800, fontSize: '0.8rem', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>
                                                {c.duration || '3 Years'}
                                            </span>
                                        </div>
                                        <p style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '0.85rem' }}>{c.description}</p>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#2563eb' }}>
                                                💰 {c.fee ? `Fee: ₹${Number(c.fee).toLocaleString()}` : '0% Interest EMI Available'}
                                            </span>
                                            <button 
                                                onClick={() => {
                                                    setForm(f => ({ ...f, courseId: c.id }));
                                                    setSelectedCourse(c);
                                                    window.scrollTo({ top: 400, behavior: 'smooth' });
                                                }}
                                                style={{ background: '#2563eb', color: '#ffffff', border: 'none', padding: '0.5rem 1.25rem', borderRadius: '999px', fontWeight: 800, cursor: 'pointer' }}
                                            >
                                                Select &amp; Apply Now
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Direct Admission Form */}
                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '1.25rem', padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', position: 'sticky', top: '90px' }}>
                    <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
                        📋 Apply for Direct Admission
                    </h2>
                    <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.5rem' }}>
                        Submit your details to secure seat reservation &amp; 0% loan assistance.
                    </p>

                    <form onSubmit={handleApply} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>Full Student Name</label>
                            <input 
                                type="text" 
                                required
                                placeholder="Enter your full name"
                                value={form.studentName}
                                onChange={(e) => setForm({ ...form, studentName: e.target.value })}
                                style={{ width: '100%', padding: '0.7rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem', boxSizing: 'border-box' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>WhatsApp / Mobile Number</label>
                            <input 
                                type="tel" 
                                required
                                placeholder="+91 98765 43210"
                                value={form.phone}
                                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                style={{ width: '100%', padding: '0.7rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem', boxSizing: 'border-box' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>Email Address</label>
                            <input 
                                type="email" 
                                required
                                placeholder="student@gmail.com"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                style={{ width: '100%', padding: '0.7rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem', boxSizing: 'border-box' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>Select Program / Course</label>
                            <select 
                                value={form.courseId}
                                onChange={(e) => setForm({ ...form, courseId: e.target.value })}
                                style={{ width: '100%', padding: '0.7rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem', background: '#ffffff', boxSizing: 'border-box' }}
                            >
                                {courses.map(c => (
                                    <option key={c.id} value={c.id}>{c.title}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>Highest Qualification</label>
                            <select 
                                value={form.highestQualification}
                                onChange={(e) => setForm({ ...form, highestQualification: e.target.value })}
                                style={{ width: '100%', padding: '0.7rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem', background: '#ffffff', boxSizing: 'border-box' }}
                            >
                                <option value="10th Pass">10th Pass</option>
                                <option value="12th Pass / HSC">12th Pass / HSC</option>
                                <option value="Graduation">Graduate Degree</option>
                            </select>
                        </div>

                        <button 
                            type="submit" 
                            disabled={applying}
                            style={{ background: '#2563eb', color: '#ffffff', border: 'none', padding: '0.85rem', borderRadius: '999px', fontSize: '1rem', fontWeight: 800, cursor: 'pointer', marginTop: '0.5rem', boxShadow: '0 6px 18px rgba(37, 99, 235, 0.25)' }}
                        >
                            {applying ? 'Submitting Application...' : 'Submit Direct Application ↗'}
                        </button>

                        <div style={{ fontSize: '0.75rem', color: '#64748b', textAlign: 'center', marginTop: '0.5rem' }}>
                            🔒 Includes 0% Education Loan &amp; Lifetime SHARK Placement Guarantee
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
