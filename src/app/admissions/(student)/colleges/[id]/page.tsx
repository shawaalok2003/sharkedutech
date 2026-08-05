'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function CollegeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const collegeId = params?.id as string;
  const [college, setCollege] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [form, setForm] = useState({
    courseId: '',
    intakeYear: '',
    highestQualification: '',
    percentage: '',
    entranceExam: '',
    entranceScore: '',
    notes: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);

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
          setCourses(await coursesRes.json());
        }
      } finally {
        setLoading(false);
      }
    }
    if (collegeId) load();
  }, [collegeId]);

  const courseOptions = useMemo(() => courses.filter(c => c.status === 'Active'), [courses]);

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleApply = async () => {
    setError(null);
    if (!collegeId) return;
    setApplying(true);
    try {
      const res = await fetch('/api/admissions/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          collegeId,
          courseId: form.courseId || null,
          intakeYear: form.intakeYear,
          highestQualification: form.highestQualification,
          percentage: form.percentage,
          entranceExam: form.entranceExam,
          entranceScore: form.entranceScore,
          notes: form.notes
        })
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Failed to apply');
        return;
      }
      const createdApp = await res.json();
      // Redirect to the tracking page for the newly created application
      router.push(`/admissions/applications/${createdApp.id}`);
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return <div style={{ color: 'var(--muted-foreground)' }}>Loading college details...</div>;
  }

  if (!college) {
    return <div style={{ color: 'var(--muted-foreground)' }}>College not found.</div>;
  }

  return (
    <>
      <style jsx>{`
        .detail-container {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          padding: 1rem;
        }

        .glass-hero {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.5);
          border-radius: 32px;
          padding: 3rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 2rem;
          box-shadow: 0 20px 40px rgba(0, 33, 71, 0.05);
        }

        .college-title {
          font-size: 2.5rem;
          font-weight: 900;
          color: #002147;
          letter-spacing: -0.04em;
          margin-bottom: 0.5rem;
        }

        .hero-meta {
            display: flex;
            gap: 1.5rem;
            color: #64748b;
            font-weight: 600;
            font-size: 1rem;
        }

        .main-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 2rem;
        }

        .info-card {
            background: white;
            border-radius: 24px;
            padding: 2.5rem;
            border: 1px solid #f1f5f9;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.02);
        }

        .section-title {
            font-size: 1.5rem;
            font-weight: 900;
            color: #002147;
            margin-bottom: 2rem;
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }

        .grid-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 2rem;
        }

        .stat-item {
            display: flex;
            flex-direction: column;
            gap: 0.4rem;
        }

        .stat-label {
            font-size: 0.75rem;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #94a3b8;
        }

        .stat-value {
            font-size: 1.1rem;
            font-weight: 700;
            color: #002147;
        }

        .apply-card {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 32px;
            padding: 3rem;
        }

        .apply-form {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          margin-bottom: 2.5rem;
        }

        .form-input {
          padding: 1rem 1.25rem;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          font-size: 1rem;
          font-weight: 500;
          transition: all 0.3s ease;
          background: white;
        }

        .form-input:focus {
          outline: none;
          border-color: #0062ff;
          box-shadow: 0 0 0 4px rgba(0, 98, 255, 0.1);
        }

        .permission-box {
            background: #ffffff;
            border: 1px solid #0062ff20;
            padding: 2rem;
            border-radius: 20px;
            margin-bottom: 2.5rem;
            display: flex;
            gap: 1.25rem;
            align-items: flex-start;
            transition: all 0.3s ease;
        }

        .permission-box.active {
            background: #f0f7ff;
            border-color: #0062ff;
        }

        .checkbox-custom {
            width: 24px;
            height: 24px;
            cursor: pointer;
            accent-color: #0062ff;
            flex-shrink: 0;
            margin-top: 2px;
        }

        .permission-text {
            font-size: 0.95rem;
            line-height: 1.6;
            color: #475569;
            font-weight: 500;
        }

        .permission-text strong {
            color: #002147;
            font-weight: 700;
        }

        .full-width {
          grid-column: span 2;
        }

        .photos-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1.25rem;
        }

        .photo-card {
          position: relative;
          border-radius: 20px;
          overflow: hidden;
          aspect-ratio: 4 / 3;
          background: #f1f5f9;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
        }

        .photo-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(0, 33, 71, 0.15);
        }

        .photo-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .photo-card:hover img {
          transform: scale(1.08);
        }

        .photo-card-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0, 33, 71, 0.75) 0%, transparent 60%);
          display: flex;
          align-items: flex-end;
          padding: 1rem;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .photo-card:hover .photo-card-overlay {
          opacity: 1;
        }

        .photo-view-badge {
          color: white;
          font-weight: 700;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .lightbox-overlay {
          position: fixed;
          inset: 0;
          z-index: 99999;
          background: rgba(0, 15, 35, 0.92);
          backdrop-filter: blur(12px);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }

        @media (max-width: 900px) {
          .main-grid { grid-template-columns: 1fr; }
          .glass-hero { flex-direction: column; text-align: center; padding: 2rem; }
          .hero-meta { justify-content: center; }
        }

        @media (max-width: 768px) {
          .apply-form { grid-template-columns: 1fr; }
          .full-width { grid-column: span 1; }
          .college-title { font-size: 1.75rem; }
          .photos-grid { grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); }
        }
      `}</style>
      <div className="detail-container">
        <div className="glass-hero">
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            {college.logoUrl ? (
              <div style={{ width: '100px', height: '100px', borderRadius: '24px', border: '1px solid rgba(0,0,0,0.05)', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', boxShadow: '0 8px 16px rgba(0,0,0,0.04)' }}>
                <img src={college.logoUrl} alt="Logo" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
              </div>
            ) : (
                <div style={{ width: '100px', height: '100px', borderRadius: '24px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem' }}>🏫</div>
            )}
            <div>
              <h1 className="college-title">{college.name}</h1>
              <div className="hero-meta">
                  <span>📍 {college.location}</span>
                  <span>📅 Est. {college.establishedYear || '—'}</span>
                  <span style={{ color: '#0062ff' }}>★ {college.ranking || 'Premier Institution'}</span>
              </div>
            </div>
          </div>
          <Link href="/admissions/colleges">
            <Button variant="outline" style={{ borderRadius: '12px', fontWeight: 700 }}>← All Colleges</Button>
          </Link>
        </div>

        <div className="main-grid">
          <div className="info-card">
              <h2 className="section-title"><span>🏛️</span> College Overview</h2>
              <p style={{ color: '#64748b', lineHeight: 1.8, marginBottom: '2.5rem', fontSize: '1.05rem' }}>{college.description || 'Welcome to this institution. Explore the campus and academic excellence.'}</p>
              
              <div className="grid-stats">
                <div className="stat-item">
                    <span className="stat-label">Accreditation</span>
                    <span className="stat-value">{college.accreditation || '—'}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">Affiliation</span>
                    <span className="stat-value">{college.affiliation || '—'}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">Campus Area</span>
                    <span className="stat-value">{college.campusArea || '—'}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">Hostel Facility</span>
                    <span className="stat-value">{college.hostelAvailable ? 'Available' : 'No'}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">Total Seats</span>
                    <span className="stat-value">{college.totalSeats ?? '—'}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">Application Fee</span>
                    <span className="stat-value">₹{college.applicationFee ?? 'Free'}</span>
                </div>
              </div>
          </div>

          <div className="info-card" style={{ background: 'linear-gradient(135deg, #002147 0%, #1e3a8a 100%)', color: 'white' }}>
              <h2 className="section-title" style={{ color: 'white' }}><span>🚀</span> Placement Hub</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div className="stat-item">
                      <span className="stat-label" style={{ color: 'rgba(255,255,255,0.6)' }}>Placement Rate</span>
                      <span className="stat-value" style={{ color: 'white', fontSize: '1.75rem' }}>{college.placementRate || '90% +'}</span>
                  </div>
                  <div className="stat-item">
                      <span className="stat-label" style={{ color: 'rgba(255,255,255,0.6)' }}>Average Package</span>
                      <span className="stat-value" style={{ color: '#00d2ff', fontSize: '1.5rem' }}>{college.avgPackage || '₹4.5 - 6.0 LPA'}</span>
                  </div>
                  <div className="stat-item">
                      <span className="stat-label" style={{ color: 'rgba(255,255,255,0.6)' }}>Top Partners</span>
                      <span className="stat-value" style={{ color: 'white', fontSize: '0.9rem' }}>{college.topRecruiters || 'Marriott, Hilton, Hyatt, Taj Hotels'}</span>
                  </div>
              </div>
          </div>
        </div>

      {college.photos?.length > 0 && (
        <Card style={{ borderRadius: '32px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <CardHeader style={{ padding: '2rem 2.5rem 1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <CardTitle style={{ fontSize: '1.5rem', fontWeight: 900, color: '#002147' }}>
                  📸 Campus Gallery
                </CardTitle>
                <CardDescription style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '0.2rem' }}>
                  Explore photos of the campus, facilities, and student life ({college.photos.length} photo{college.photos.length !== 1 ? 's' : ''})
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent style={{ padding: '1rem 2.5rem 2.5rem' }}>
            <div className="photos-grid">
              {college.photos.map((photo: any, idx: number) => (
                <div key={photo.id} className="photo-card" onClick={() => setActivePhotoIndex(idx)}>
                  <img src={photo.url} alt={`Campus photo ${idx + 1}`} />
                  <div className="photo-card-overlay">
                    <span className="photo-view-badge">🔍 View Photo</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Admission Process & Eligibility</CardTitle>
        </CardHeader>
        <CardContent>
          <p style={{ marginBottom: '0.75rem' }}><strong>Process:</strong> {college.admissionProcess || '—'}</p>
          <p style={{ margin: 0 }}><strong>Eligibility:</strong> {college.eligibility || '—'}</p>
        </CardContent>
      </Card>

      {college.requirements?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Required Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="docs-grid">
              {college.requirements.map((req: any) => (
                <div key={req.id} className="doc-item">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontSize: '1rem', color: 'var(--primary)' }}>{req.name}</strong>
                    <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderRadius: '1rem', background: req.required ? 'rgba(5, 150, 105, 0.1)' : 'var(--muted)', color: req.required ? '#059669' : 'var(--muted-foreground)' }}>
                      {req.required ? 'Required' : 'Optional'}
                    </span>
                  </div>
                  {req.description && (
                    <p style={{ margin: '0.5rem 0 0', fontSize: '0.8rem', color: 'var(--muted-foreground)', lineHeight: 1.4 }}>{req.description}</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Facilities</CardTitle>
        </CardHeader>
        <CardContent>
          <p style={{ margin: 0 }}>{college.facilities || '—'}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Courses Offered</CardTitle>
          <CardDescription>{courseOptions.length} active courses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="courses-grid">
            {courseOptions.map(course => (
              <div key={course.id} style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1rem', background: 'white' }}>
                <h4 style={{ fontWeight: 700, marginBottom: '0.25rem', color: 'var(--foreground)' }}>{course.title}</h4>
                <p style={{ color: 'var(--muted-foreground)', fontSize: '0.8rem', margin: 0 }}>
                  {course.level || 'Level'} • {course.duration || 'Duration'} • Fee: {course.fee ?? '—'}
                </p>
                <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--muted-foreground)' }}>
                  Eligibility: {course.eligibility || '—'}
                </p>
              </div>
            ))}
            {courseOptions.length === 0 && (
              <div style={{ padding: '1rem', color: 'var(--muted-foreground)', textAlign: 'center' }}>No courses available.</div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="apply-card" id="apply">
          <h2 className="section-title"><span>📝</span> Secure Application Portal</h2>
          <p style={{ color: '#64748b', marginBottom: '2.5rem', fontWeight: 500 }}>Submit your verified academic details to initiate the institutional review process.</p>
          
          <div className="apply-form">
            {error && (
              <div className="full-width" style={{ background: '#fef2f2', color: '#ef4444', padding: '1rem', borderRadius: '16px', border: '1px solid #fee2e2', fontWeight: 600 }}>
                ⚠️ {error}
              </div>
            )}
            <select className="form-input" value={form.courseId} onChange={(e) => handleChange('courseId', e.target.value)}>
              <option value="">Select Target Course (Highly Recommended)</option>
              {courseOptions.map(course => (
                <option key={course.id} value={course.id}>{course.title}</option>
              ))}
            </select>
            <input className="form-input" required placeholder="Target Intake Year (e.g., 2026)" value={form.intakeYear} onChange={(e) => handleChange('intakeYear', e.target.value)} />
            <input className="form-input" required placeholder="Your Highest Qualification" value={form.highestQualification} onChange={(e) => handleChange('highestQualification', e.target.value)} />
            <input className="form-input" required placeholder="Academic Percentage / CGPA" value={form.percentage} onChange={(e) => handleChange('percentage', e.target.value)} />
            <input className="form-input" placeholder="Entrance Exam Name (If any)" value={form.entranceExam} onChange={(e) => handleChange('entranceExam', e.target.value)} />
            <input className="form-input" placeholder="Obtained Score / Percentile" value={form.entranceScore} onChange={(e) => handleChange('entranceScore', e.target.value)} />
            <textarea className="form-input full-width" placeholder="Tell the admission committee about your career goals..." value={form.notes} onChange={(e) => handleChange('notes', e.target.value)} rows={4} />
          </div>

          <div className={`permission-box ${agreed ? 'active' : ''}`}>
              <input 
                type="checkbox" 
                id="permission" 
                className="checkbox-custom" 
                checked={agreed} 
                onChange={(e) => setAgreed(e.target.checked)} 
              />
              <label htmlFor="permission" className="permission-text">
                  I hereby authorize <strong>Shark Edutech</strong> to securely share my academic profile, identity documents, and contact information with <strong>{college.name}</strong> for the purpose of admission evaluation and institutional communication. I agree to the platform's <Link href="/terms" style={{ color: '#0062ff', fontWeight: 700 }}>Terms and Conditions</Link>.
              </label>
          </div>

          <Button 
            onClick={handleApply} 
            disabled={applying || !agreed}
            style={{ 
                padding: '1.5rem 4rem', 
                borderRadius: '16px', 
                fontSize: '1.1rem', 
                fontWeight: 800,
                background: agreed ? 'linear-gradient(135deg, #002147 0%, #0062ff 100%)' : '#e2e8f0',
                boxShadow: agreed ? '0 10px 30px rgba(0, 98, 255, 0.3)' : 'none'
            }}
          >
            {applying ? 'Processing Application...' : 'Confirm & Submit Application'}
          </Button>
      </div>

      {activePhotoIndex !== null && college.photos?.[activePhotoIndex] && (
        <div className="lightbox-overlay" onClick={() => setActivePhotoIndex(null)}>
          <div style={{ position: 'absolute', top: '2rem', right: '2rem', display: 'flex', gap: '1.5rem', alignItems: 'center' }} onClick={(e) => e.stopPropagation()}>
            <span style={{ color: 'white', fontSize: '1rem', fontWeight: 700, letterSpacing: '0.05em' }}>
              Photo {activePhotoIndex + 1} of {college.photos.length}
            </span>
            <button 
              type="button" 
              style={{ background: 'rgba(255, 255, 255, 0.15)', color: 'white', border: '1px solid rgba(255, 255, 255, 0.3)', borderRadius: '50%', width: '44px', height: '44px', fontSize: '1.3rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
              onClick={() => setActivePhotoIndex(null)}
            >
              ✕
            </button>
          </div>

          {college.photos.length > 1 && (
            <>
              <button 
                type="button" 
                style={{ position: 'absolute', left: '2rem', background: 'rgba(255, 255, 255, 0.15)', color: 'white', border: '1px solid rgba(255, 255, 255, 0.3)', borderRadius: '50%', width: '56px', height: '56px', fontSize: '1.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                onClick={(e) => { e.stopPropagation(); setActivePhotoIndex((activePhotoIndex - 1 + college.photos.length) % college.photos.length); }}
              >
                ❮
              </button>
              <button 
                type="button" 
                style={{ position: 'absolute', right: '2rem', background: 'rgba(255, 255, 255, 0.15)', color: 'white', border: '1px solid rgba(255, 255, 255, 0.3)', borderRadius: '50%', width: '56px', height: '56px', fontSize: '1.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                onClick={(e) => { e.stopPropagation(); setActivePhotoIndex((activePhotoIndex + 1) % college.photos.length); }}
              >
                ❯
              </button>
            </>
          )}

          <div style={{ maxWidth: '90vw', maxHeight: '82vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={(e) => e.stopPropagation()}>
            <img 
              src={college.photos[activePhotoIndex].url} 
              alt="Campus View" 
              style={{ maxWidth: '100%', maxHeight: '82vh', borderRadius: '24px', objectFit: 'contain', boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6)' }} 
            />
          </div>
        </div>
      )}
      </div>
    </>
  );
}
