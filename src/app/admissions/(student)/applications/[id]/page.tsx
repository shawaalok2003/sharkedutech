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
  const [isUploading, setIsUploading] = useState<string | null>(null);

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

  const handleFileUpload = async (file: File, requirementId: string, requirementName: string) => {
    setIsUploading(requirementId);
    try {
      // 1. Upload file
      const formData = new FormData();
      formData.append('file', file);
      
      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!uploadRes.ok) throw new Error('Upload failed');
      const { url } = await uploadRes.json();

      // 2. Save document record
      const docRes = await fetch('/api/admissions/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: requirementName,
          type: file.type,
          size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
          url,
          requirementId,
          status: 'Submitted'
        })
      });

      if (!docRes.ok) throw new Error('Failed to save document');
      
      await refresh();
      alert('Document uploaded successfully!');
    } catch (error) {
      console.error(error);
      alert('Something went wrong during upload.');
    } finally {
      setIsUploading(null);
    }
  };

  if (loading) return <div>Loading application...</div>;
  if (!data?.application) return <div>Application not found.</div>;

  const { application, requirements, documents } = data;
  
  // Map application status to progress percentage
  const statusToPercent: Record<string, number> = {
    'Pending': 20,
    'Profile Review': 20,
    'Documents Verification': 40,
    'Application Submitted': 60,
    'College Review': 80,
    'In Review': 80,
    'Shortlisted': 80,
    'Approved': 100,
    'Rejected': 100,
  };

  const progressPercent = statusToPercent[application.status] || 20;
  const progressLabel = application.status === 'Approved' ? 'Completed' : 
                       ['Rejected', 'Offer', 'Waitlist'].includes(application.status) ? 'Finalized' : 
                       progressPercent >= 60 ? 'Under Review' : 'In Progress';

  const journeySteps = [
    {
      title: "Initial Submission",
      description: "All core application forms and personal details have been successfully received.",
      icon: "📝",
      done: true,
      id: 1
    },
    {
      title: "Credential Verification",
      description: "Upload and verify your required documents like ID cards and certificates.",
      icon: "📋",
      done: application.step >= 2,
      id: 2
    },
    {
      title: "Faculty Review",
      description: "Admissions team and faculty members evaluate your eligibility and profile.",
      icon: "🔍",
      done: application.step >= 3,
      id: 3
    },
    {
      title: "Decision & Offer",
      description: "Final committee deliberation and official admission decision packet.",
      icon: "🔔",
      done: application.step >= 5,
      id: 4
    }
  ];

  return (
    <>
      <style jsx>{`
        .layout-wrapper { min-height: 100vh; background: #FFFFFF; }
        .content-container { max-width: 1024px; margin: 0 auto; padding: 2rem 1.5rem; }
        
        /* Header */
        .page-header { margin-bottom: 3rem; }
        .header-flex { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 1.5rem; }
        .status-badge { display: inline-block; padding: 0.375rem 1rem; border-radius: 9999px; background: rgba(16, 185, 129, 0.1); color: #10B981; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 1rem; }
        .page-title { font-size: 2.5rem; font-weight: 700; color: #0A1128; margin-bottom: 0.5rem; }
        .page-subtitle { color: #64748b; font-weight: 500; font-size: 1.1rem; }
        .progress-stat { text-align: right; }
        .progress-value { font-size: 2rem; font-weight: 700; color: #0A1128; }
        .progress-label { font-size: 10px; color: #94a3b8; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; }
        .global-progress-bar { height: 6px; width: 100%; background: #f1f5f9; border-radius: 9999px; overflow: hidden; margin-top: 0.5rem; }
        .global-progress-fill { height: 100%; background: #10B981; transition: width 0.5s; }

        /* Timeline */
        .timeline { position: relative; margin-top: 2rem; }
        .timeline-line { position: absolute; left: 28px; top: 0; bottom: 0; width: 1px; background: #e2e8f0; }
        .timeline-progress { position: absolute; left: 28px; top: 0; width: 1px; background: #10B981; transition: height 0.5s; }
        .timeline-steps { display: flex; flex-direction: column; gap: 2.5rem; position: relative; z-index: 10; }
        .step-item { display: flex; gap: 2rem; }
        .step-icon { width: 56px; height: 56px; border-radius: 50%; background: white; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 1.25rem; border: 1px solid #e2e8f0; transition: all 0.3s; }
        .step-completed .step-icon { border-color: #10B981; color: #10B981; }
        .step-current .step-icon { border: 2px solid #D4AF37; color: #D4AF37; box-shadow: 0 0 20px rgba(212, 175, 55, 0.2); }
        .step-content { flex: 1; background: white; border: 1px solid #f1f5f9; border-radius: 20px; padding: 1.5rem; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03); }
        .step-title { font-size: 1.15rem; font-weight: 700; color: #0A1128; margin-bottom: 0.5rem; }
        .step-description { color: #64748b; font-size: 0.9rem; line-height: 1.5; }
        
        /* Docs Grid */
        .docs-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 1rem; margin-top: 1.5rem; }
        .doc-card { padding: 1rem; border-radius: 12px; border: 1px solid #f1f5f9; background: #fafafa; }

        .details-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; margin-top: 3rem; padding: 2rem; background: #f8fafc; border-radius: 24px; }
        .detail-item { display: flex; flex-direction: column; gap: 0.25rem; }
        .detail-label { font-size: 0.75rem; color: #94a3b8; font-weight: 600; text-transform: uppercase; }
        .detail-value { font-size: 1rem; font-weight: 600; color: #0A1128; }

        @media (max-width: 768px) {
          .header-flex { flex-direction: column; align-items: flex-start; gap: 1rem; }
          .step-item { gap: 1rem; }
          .step-icon { width: 44px; height: 44px; font-size: 1rem; }
          .timeline-line, .timeline-progress { left: 22px; }
          .page-title { font-size: 1.8rem; }
        }
      `}</style>

      <div className="layout-wrapper">
        <main className="content-container">
          <header className="page-header">
            <div className="header-flex">
              <div>
                <span className="status-badge">{progressLabel}</span>
                <h1 className="page-title">Application Progress</h1>
                <p className="page-subtitle">
                  {application.course?.title || 'General Admission'} · {application.college?.name}
                </p>
              </div>
              <div className="progress-stat">
                <p className="progress-value">{progressPercent}%</p>
                <p className="progress-label">Global Progress</p>
              </div>
            </div>
            <div className="global-progress-bar">
              <div className="global-progress-fill" style={{ width: `${progressPercent}%` }}></div>
            </div>
            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
              <Button variant="outline" size="sm" onClick={refresh}>Refresh Status</Button>
              <Button variant="outline" size="sm" onClick={() => router.push('/admissions/applications')}>All Applications</Button>
            </div>
          </header>

          <div className="timeline">
            <div className="timeline-line"></div>
            <div className="timeline-progress" style={{ 
              height: `${((journeySteps.filter(s => s.done).length - 1) / (journeySteps.length - 1)) * 100}%` 
            }}></div>
            
            <div className="timeline-steps">
              {journeySteps.map((step, index) => {
                const isCurrent = (index === 0 && application.step === 1) || 
                                (index === 1 && application.step === 2) ||
                                (index === 2 && (application.step === 3 || application.step === 4)) ||
                                (index === 3 && application.step >= 5);
                
                return (
                  <div key={step.id} className={`step-item ${step.done ? 'step-completed' : ''} ${isCurrent ? 'step-current' : ''}`}>
                    <div className="step-icon">
                      {step.done ? '✓' : step.icon}
                    </div>
                    <div className="step-content">
                      <h3 className="step-title">{step.title}</h3>
                      <p className="step-description">{step.description}</p>
                      
                      {/* Integrated Documents Section in Step 2 */}
                      {index === 1 && (
                        <div className="docs-grid">
                          {requirements?.map((req: any) => {
                            const doc = documents?.find((d: any) => d.requirement?.id === req.id);
                            const submitted = !!doc;
                            return (
                              <div key={req.id} className="doc-card">
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                  <strong style={{ fontSize: '0.85rem' }}>{req.name}</strong>
                                  <span style={{ fontSize: '0.65rem', padding: '0.2rem 0.6rem', borderRadius: '1rem', background: submitted ? '#ecfdf5' : '#fff7ed', color: submitted ? '#10b981' : '#f97316', fontWeight: 700 }}>
                                    {submitted ? 'SUBMITTED' : 'PENDING'}
                                  </span>
                                </div>
                                {submitted ? (
                                  <a href={doc.url} target="_blank" rel="noreferrer" style={{ fontSize: '0.75rem', color: '#3b82f6', fontWeight: 600 }}>View Document →</a>
                                ) : (
                                  <div style={{ marginTop: '0.5rem' }}>
                                    <input id={`file-${req.id}`} type="file" hidden accept=".pdf,image/*" onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) handleFileUpload(file, req.id, req.name);
                                    }} />
                                    <Button variant="outline" size="sm" style={{ width: '100%', fontSize: '0.7rem', height: '2.25rem' }} disabled={isUploading === req.id} onClick={() => document.getElementById(`file-${req.id}`)?.click()}>
                                      {isUploading === req.id ? 'Uploading...' : 'Upload File'}
                                    </Button>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Decision UI in Last Step */}
                      {index === 3 && application.status === 'Approved' && (
                        <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#ecfdf5', borderRadius: '12px', border: '1px solid #10b981' }}>
                          <h4 style={{ color: '#065f46', margin: '0 0 0.25rem 0', fontSize: '1rem' }}>Admission Approved! 🎉</h4>
                          <p style={{ color: '#047857', fontSize: '0.85rem', margin: 0 }}>Congratulations! The college has issued an offer. Check your email for next steps.</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="details-grid">
            <div className="detail-item">
              <span className="detail-label">Intake Year</span>
              <span className="detail-value">{application.intakeYear || '2024'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Qualification</span>
              <span className="detail-value">{application.highestQualification || 'Not provided'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Entrance Score</span>
              <span className="detail-value">{application.entranceScore || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Current Status</span>
              <span className="detail-value" style={{ color: '#3b82f6' }}>{application.status}</span>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
