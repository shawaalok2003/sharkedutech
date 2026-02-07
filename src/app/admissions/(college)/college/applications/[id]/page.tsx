'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const steps = [
  'Profile Review',
  'Documents Verification',
  'Application Submitted',
  'College Review',
  'Decision & Offer'
];

export default function AdminApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/admissions/applications/${id}`);
        if (res.ok) setData(await res.json());
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  }, [id]);

  const updateStatus = async (status: string) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/admissions/applications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error || 'Failed to update status');
        return;
      }
      const updated = await res.json();
      setData((prev: any) => ({
        ...prev,
        application: { ...prev.application, status: updated.status, step: updated.step }
      }));
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div style={{ padding: '2rem', color: 'var(--muted-foreground)' }}>Loading application...</div>;
  if (!data?.application) return <div style={{ padding: '2rem', color: 'var(--muted-foreground)' }}>Application not found.</div>;

  const { application, requirements, documents } = data;
  const stepIndex = Math.min((application.step || 1) - 1, steps.length - 1);

  return (
    <>
      <style jsx>{`
        .review-container {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .review-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .header-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--primary);
          margin-bottom: 0.25rem;
        }
        .header-actions {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        .timeline-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 0.5rem;
        }
        .timeline-step {
          padding: 0.75rem;
          border-radius: var(--radius);
          border: 1px solid var(--border);
          text-align: center;
        }
        .docs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 0.75rem;
        }
        .details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }
        .decision-buttons {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        @media (max-width: 900px) {
          .timeline-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        @media (max-width: 768px) {
          .review-header {
            flex-direction: column;
            align-items: stretch;
          }
          .header-actions {
            width: 100%;
          }
          .header-actions button {
            flex: 1;
          }
          .timeline-grid {
            grid-template-columns: 1fr 1fr;
          }
          .details-grid {
            grid-template-columns: 1fr;
          }
          .decision-buttons button {
            flex: 1;
          }
        }
        @media (max-width: 480px) {
          .timeline-grid {
            grid-template-columns: 1fr;
          }
          .docs-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
      <div className="review-container">
        <div className="review-header">
          <div>
            <h1 className="header-title">Application Review</h1>
            <p style={{ color: 'var(--muted-foreground)', margin: 0 }}>
              {application.student?.name || 'Student'} • {application.course?.title || 'General Admission'}
            </p>
          </div>
          <div className="header-actions">
            <Button variant="outline" size="sm" onClick={() => window.location.reload()}>Refresh</Button>
            <Button variant="outline" size="sm" onClick={() => router.push('/admissions/college/applications')}>Back</Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Tracking Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="timeline-grid">
              {steps.map((label, index) => (
                <div key={label} className="timeline-step" style={{ 
                  background: index <= stepIndex ? 'var(--success-light)' : 'var(--muted)',
                  borderColor: index <= stepIndex ? 'var(--success)' : 'var(--border)'
                }}>
                  <div style={{ fontWeight: 600, fontSize: '0.8rem', color: index <= stepIndex ? 'var(--success)' : 'var(--muted-foreground)' }}>{label}</div>
                  {index === stepIndex && (
                    <div style={{ fontSize: '0.7rem', color: 'var(--success)', marginTop: '0.25rem' }}>Current</div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Required Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="docs-grid">
              {requirements?.map((req: any) => {
                const doc = documents?.find((d: any) => d.requirement?.id === req.id);
                const submitted = !!doc;
                return (
                  <div key={req.id} style={{ padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'white' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                      <strong style={{ fontSize: '0.875rem' }}>{req.name}</strong>
                      <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderRadius: '1rem', background: submitted ? 'var(--success-light)' : 'var(--warning-light)', color: submitted ? 'var(--success)' : 'var(--warning)' }}>
                        {submitted ? 'Submitted' : 'Pending'}
                      </span>
                    </div>
                    {req.description && <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>{req.description}</div>}
                    {doc?.url && (
                      <a href={doc.url} target="_blank" rel="noreferrer" style={{ fontSize: '0.75rem', color: 'var(--accent)', marginTop: '0.25rem', display: 'inline-block' }}>View Document →</a>
                    )}
                  </div>
                );
              })}
              {(!requirements || requirements.length === 0) && (
                <div style={{ padding: '1rem', color: 'var(--muted-foreground)', textAlign: 'center' }}>No requirements defined.</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Applicant Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="details-grid">
              <div><strong>Name:</strong> {application.student?.name || '—'}</div>
              <div><strong>Email:</strong> {application.student?.email || '—'}</div>
              <div><strong>Intake Year:</strong> {application.intakeYear || 'Not provided'}</div>
              <div><strong>Qualification:</strong> {application.highestQualification || 'Not provided'}</div>
              <div><strong>Percentage/CGPA:</strong> {application.percentage || 'Not provided'}</div>
              <div><strong>Entrance Exam:</strong> {application.entranceExam || 'Not provided'}</div>
              <div><strong>Entrance Score:</strong> {application.entranceScore || 'Not provided'}</div>
              <div><strong>Current Status:</strong> <span style={{ fontWeight: 600, color: 'var(--accent)' }}>{application.status}</span></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Update Decision</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="decision-buttons">
              <Button size="sm" disabled={updating} onClick={() => updateStatus('In Review')} variant={application.status === 'In Review' ? 'primary' : 'outline'}>In Review</Button>
              <Button size="sm" disabled={updating} onClick={() => updateStatus('Shortlisted')} variant={application.status === 'Shortlisted' ? 'primary' : 'outline'}>Shortlisted</Button>
              <Button size="sm" disabled={updating} onClick={() => updateStatus('Approved')} style={application.status === 'Approved' ? { background: 'var(--success)' } : {}}>Approved</Button>
              <Button size="sm" disabled={updating} onClick={() => updateStatus('Rejected')} variant="outline" style={application.status === 'Rejected' ? { borderColor: 'var(--error)', color: 'var(--error)' } : {}}>Rejected</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
