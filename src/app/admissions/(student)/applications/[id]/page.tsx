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

// stepDetails will be dynamically set based on collegeId in the component

export default function ApplicationTrackingPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/admissions/applications/${id}`);
        if (res.ok) {
          setData(await res.json());
        }
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  }, [id]);

  const refresh = async () => {
    const res = await fetch(`/api/admissions/applications/${id}`);
    if (res.ok) setData(await res.json());
  };

  if (loading) return <div>Loading application...</div>;
  if (!data?.application) return <div>Application not found.</div>;

  const { application, requirements, documents } = data;
  const stepIndex = Math.min((application.step || 1) - 1, steps.length - 1);

  const getStatusColor = (status: string) => {
    if (status === 'Approved') return 'var(--success)';
    if (status === 'Rejected') return 'var(--error)';
    return 'var(--accent)';
  };

  return (
    <>
      <style jsx>{`
        .tracking-container {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .tracking-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 1rem;
          flex-wrap: wrap;
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
        .stage-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        .stage-actions {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
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
        .decision-box {
          padding: 1rem;
          border-radius: var(--radius);
          border-left: 4px solid var(--accent);
          background: var(--muted);
        }

        @media (max-width: 900px) {
          .timeline-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        @media (max-width: 768px) {
          .tracking-header {
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
          .stage-content {
            grid-template-columns: 1fr;
          }
          .details-grid {
            grid-template-columns: 1fr;
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
      <div className="tracking-container">
        <div className="tracking-header">
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.25rem' }}>Application Tracking</h1>
            <p style={{ color: 'var(--muted-foreground)', margin: 0 }}>
              {application.college?.name} • {application.course?.title || 'General Admission'}
            </p>
          </div>
          <div className="header-actions">
            <Button variant="outline" size="sm" onClick={refresh}>Refresh</Button>
            <Button variant="outline" size="sm" onClick={() => router.push(`/admissions/colleges/${application.collegeId}`)}>
              View College
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Status Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="timeline-grid">
              {steps.map((label, index) => (
                <div key={label} className="timeline-step" style={{ 
                  background: index <= stepIndex ? 'var(--success-light)' : 'var(--muted)',
                  borderColor: index <= stepIndex ? 'var(--success)' : 'var(--border)'
                }}>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem', color: index <= stepIndex ? 'var(--success)' : 'var(--muted-foreground)' }}>{label}</div>
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
            <CardTitle>Current Stage Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="stage-content">
              <div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--foreground)', marginBottom: '0.5rem' }}>
                  {steps[stepIndex]}
                </div>
                <p style={{ margin: 0, color: 'var(--muted-foreground)', lineHeight: 1.6 }}>
                  {stepIndex === 0 && 'Complete your personal profile and academic background so the college can verify your details.'}
                  {stepIndex === 1 && 'Upload required documents (ID, marksheets, certificates) for verification.'}
                  {stepIndex === 2 && 'Your application has been submitted and is queued for review by the college.'}
                  {stepIndex === 3 && 'Admissions team evaluates your profile, documents, and eligibility.'}
                  {stepIndex === 4 && 'College shares final decision or offer letter. Track your status here.'}
                </p>
              </div>
              <div className="stage-actions">
            {stepIndex === 0 && (
              <Button onClick={() => router.push('/admissions/profile')}>Update Profile</Button>
            )}
            {stepIndex === 1 && (
              <Button onClick={() => router.push('/admissions/documents')}>Upload Documents</Button>
            )}
            {stepIndex >= 2 && (
              <Button variant="outline" onClick={() => router.push(`/admissions/colleges/${application.collegeId}`)}>
                View College Profile
              </Button>
            )}
            {stepIndex === 3 && application.college?.email && (
              <Button variant="outline" onClick={() => window.open(`mailto:${application.college.email}?subject=Application%20Query%20-%20${application.id.slice(0,6)}`, '_blank')}>
                Contact College
              </Button>
            )}
            {stepIndex === 3 && !application.college?.email && (
              <Button variant="outline" onClick={() => router.push(`/admissions/colleges/${application.collegeId}`)}>
                College Details
              </Button>
            )}
            <Button variant="outline" onClick={() => router.push('/admissions/applications')}>All Applications</Button>
            <Button variant="outline" onClick={refresh}>Refresh Status</Button>
          </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Submitted Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="docs-grid">
              {requirements?.map((req: any) => {
                const submitted = documents?.some((d: any) => d.requirement?.id === req.id);
                return (
                  <div key={req.id} style={{ padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'white' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ fontSize: '0.875rem' }}>{req.name}</strong>
                      <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderRadius: '1rem', background: submitted ? 'var(--success-light)' : 'var(--warning-light)', color: submitted ? 'var(--success)' : 'var(--warning)' }}>
                        {submitted ? 'Submitted' : 'Pending'}
                      </span>
                    </div>
                    {req.description && <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginTop: '0.25rem' }}>{req.description}</div>}
                  </div>
                );
              })}
              {(!requirements || requirements.length === 0) && (
                <div style={{ padding: '1rem', color: 'var(--muted-foreground)', textAlign: 'center' }}>No documents required yet.</div>
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
              <div><strong>Intake Year:</strong> {application.intakeYear || 'Not provided'}</div>
              <div><strong>Qualification:</strong> {application.highestQualification || 'Not provided'}</div>
              <div><strong>Percentage/CGPA:</strong> {application.percentage || 'Not provided'}</div>
              <div><strong>Entrance Exam:</strong> {application.entranceExam || 'Not provided'}</div>
              <div><strong>Entrance Score:</strong> {application.entranceScore || 'Not provided'}</div>
              <div><strong>Status:</strong> {application.status}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Decision</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="decision-box" style={{ borderColor: getStatusColor(application.status) }}>
              <div style={{ fontSize: '0.95rem', marginBottom: '0.5rem' }}>
                Current decision: <strong style={{ color: getStatusColor(application.status) }}>{application.status}</strong>
              </div>
              <div style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>
                {application.status === 'Approved'
                  ? 'Congratulations! The college has approved your application.'
                  : application.status === 'Rejected'
                    ? 'Your application was not accepted. You can apply to other colleges.'
                    : 'Your application is still in progress.'}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
