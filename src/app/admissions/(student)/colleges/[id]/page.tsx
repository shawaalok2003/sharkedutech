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
          gap: 1.25rem;
        }
        .detail-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .college-title {
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--primary);
          margin-bottom: 0.25rem;
        }
        .main-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 1.25rem;
        }
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }
        .photos-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1rem;
        }
        .photo-card {
          border-radius: var(--radius);
          overflow: hidden;
          border: 1px solid var(--border);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          aspect-ratio: 16/9;
          position: relative;
        }
        .photo-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
        }
        .docs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 1rem;
        }
        .doc-item {
          padding: 1.25rem;
          border-radius: var(--radius);
          border: 1px solid var(--border);
          background: white;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          position: relative;
        }
        .doc-item::before {
          content: "📄";
          font-size: 1.25rem;
          margin-bottom: 0.25rem;
        }
        .courses-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 1rem;
        }
        .apply-form {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        .form-input {
          padding: 0.75rem;
          border-radius: var(--radius);
          border: 1px solid var(--border);
          font-size: 0.9rem;
          transition: all var(--transition-base);
        }
        .form-input:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(0, 33, 71, 0.1);
        }
        .full-width {
          grid-column: span 2;
        }

        @media (max-width: 900px) {
          .main-grid {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 768px) {
          .detail-header {
            flex-direction: column;
            align-items: stretch;
          }
          .college-title {
            font-size: 1.5rem;
          }
          .info-grid {
            grid-template-columns: 1fr;
          }
          .apply-form {
            grid-template-columns: 1fr;
          }
          .full-width {
            grid-column: span 1;
          }
        }
        @media (max-width: 480px) {
          .photos-grid {
            grid-template-columns: 1fr 1fr;
          }
          .docs-grid {
            grid-template-columns: 1fr;
          }
          .courses-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
      <div className="detail-container">
        <div className="detail-header">
          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
            {college.logoUrl && (
              <div style={{ width: '80px', height: '80px', borderRadius: '12px', border: '1px solid var(--border)', overflow: 'hidden', flexShrink: 0, background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src={college.logoUrl} alt="Logo" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
              </div>
            )}
            <div>
              <h1 className="college-title">{college.name}</h1>
              <p style={{ color: 'var(--muted-foreground)', margin: 0 }}>📍 {college.location} • Est. {college.establishedYear || '—'}</p>
            </div>
          </div>
          <Link href="/admissions/colleges">
            <Button variant="outline" size="sm">← Back</Button>
          </Link>
        </div>

        <div className="main-grid">
          <Card>
            <CardHeader>
              <CardTitle>College Overview</CardTitle>
              <CardDescription>{college.description || 'No description provided yet.'}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="info-grid">
                <div><strong>Accreditation:</strong> {college.accreditation || '—'}</div>
                <div><strong>Affiliation:</strong> {college.affiliation || '—'}</div>
                <div><strong>Ranking:</strong> {college.ranking || '—'}</div>
                <div><strong>Campus Area:</strong> {college.campusArea || '—'}</div>
                <div><strong>Hostel:</strong> {college.hostelAvailable ? 'Available' : 'Not Available'}</div>
                <div><strong>Total Seats:</strong> {college.totalSeats ?? '—'}</div>
                <div><strong>Application Fee:</strong> {college.applicationFee ?? '—'}</div>
                <div><strong>Website:</strong> {college.website ? <a href={college.website} target="_blank" style={{ color: 'var(--accent)' }}>Visit</a> : '—'}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Placements & Scholarships</CardTitle>
            </CardHeader>
            <CardContent style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div><strong>Placement Rate:</strong> {college.placementRate || '—'}</div>
              <div><strong>Average Package:</strong> {college.avgPackage || '—'}</div>
              <div><strong>Top Recruiters:</strong> {college.topRecruiters || '—'}</div>
              <div><strong>Scholarships:</strong> {college.scholarships || '—'}</div>
            </CardContent>
          </Card>
        </div>

      {college.photos?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Campus Photos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="photos-grid">
              {college.photos.map((photo: any) => (
                <div key={photo.id} className="photo-card">
                  <img src={photo.url} alt="Campus" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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

      <Card id="apply">
        <CardHeader>
          <CardTitle>Apply to this College</CardTitle>
          <CardDescription>Fill in your academic details for transparency and faster review.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="apply-form">
            {error && (
              <div className="full-width" style={{ background: 'var(--error-light)', color: 'var(--error)', padding: '0.75rem 1rem', borderRadius: 'var(--radius)', border: '1px solid var(--error)' }}>
                {error}
              </div>
            )}
            <select className="form-input" value={form.courseId} onChange={(e) => handleChange('courseId', e.target.value)}>
              <option value="">Select course (optional)</option>
              {courseOptions.map(course => (
                <option key={course.id} value={course.id}>{course.title}</option>
              ))}
            </select>
            <input className="form-input" required placeholder="Intake Year (e.g., 2026)" value={form.intakeYear} onChange={(e) => handleChange('intakeYear', e.target.value)} />
            <input className="form-input" required placeholder="Highest Qualification" value={form.highestQualification} onChange={(e) => handleChange('highestQualification', e.target.value)} />
            <input className="form-input" required placeholder="Percentage / CGPA" value={form.percentage} onChange={(e) => handleChange('percentage', e.target.value)} />
            <input className="form-input" placeholder="Entrance Exam (optional)" value={form.entranceExam} onChange={(e) => handleChange('entranceExam', e.target.value)} />
            <input className="form-input" placeholder="Entrance Score (optional)" value={form.entranceScore} onChange={(e) => handleChange('entranceScore', e.target.value)} />
            <textarea className="form-input full-width" placeholder="Additional Notes" value={form.notes} onChange={(e) => handleChange('notes', e.target.value)} rows={3} />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleApply} disabled={applying}>
            {applying ? 'Submitting...' : 'Submit Application'}
          </Button>
        </CardFooter>
      </Card>
      </div>
    </>
  );
}
