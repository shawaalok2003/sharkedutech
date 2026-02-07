"use client";

import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Doc = {
    id: string;
    name: string;
    type: string;
    size?: string;
    status: string;
    url: string;
    requirement?: { id: string; name: string; collegeId: string } | null;
};

export default function DocumentsPage() {
    const router = useRouter();
    const [docs, setDocs] = useState<Doc[]>([]);
    const [colleges, setColleges] = useState<any[]>([]);
    const [requirements, setRequirements] = useState<any[]>([]);
    const [selectedCollegeId, setSelectedCollegeId] = useState<string>("");
    const [selectedRequirementId, setSelectedRequirementId] = useState<string>("");
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const refreshDocs = async () => {
        const res = await fetch("/api/admissions/documents");
        if (res.ok) setDocs(await res.json());
    };

    useEffect(() => {
        async function fetchDocs() {
            const [docsRes, collegesRes] = await Promise.all([
                fetch("/api/admissions/documents"),
                fetch("/api/admissions/colleges")
            ]);
            if (docsRes.ok) {
                const data = await docsRes.json();
                setDocs(data);
            }
            if (collegesRes.ok) {
                const collegesData = await collegesRes.json();
                setColleges(collegesData);
                if (collegesData[0]?.id) setSelectedCollegeId(collegesData[0].id);
            }
        }
        fetchDocs();
    }, []);

    useEffect(() => {
        async function fetchRequirements() {
            if (!selectedCollegeId) return;
            const res = await fetch(`/api/admissions/requirements?collegeId=${selectedCollegeId}`);
            if (res.ok) {
                const data = await res.json();
                setRequirements(data);
            }
        }
        fetchRequirements();
    }, [selectedCollegeId]);

    const handleUpload = async (file: File) => {
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
            if (!uploadRes.ok) {
                alert("Upload failed");
                return;
            }
            const { url } = await uploadRes.json();
            const saveRes = await fetch("/api/admissions/documents", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: file.name,
                    type: file.type.includes("pdf") ? "PDF" : "IMG",
                    size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
                    url,
                    requirementId: selectedRequirementId || null
                })
            });
            if (saveRes.ok) {
                const doc = await saveRes.json();
                setDocs(prev => [doc, ...prev]);
            }
        } finally {
            setUploading(false);
        }
    };

    return (
        <>
            <style jsx>{`
                .docs-page {
                    max-width: 1400px;
                    margin: 0 auto;
                }
                
                .page-header {
                    margin-bottom: 2rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    gap: 1.5rem;
                }
                
                .page-title {
                    font-size: 1.875rem;
                    font-weight: 700;
                    color: var(--primary);
                    margin: 0;
                }
                
                .page-subtitle {
                    color: var(--muted-foreground);
                    margin: 0.25rem 0 0 0;
                }
                
                .actions-bar {
                    display: flex;
                    gap: 0.75rem;
                    flex-wrap: wrap;
                    align-items: center;
                }
                
                .filter-select {
                    padding: 0.6rem 1rem;
                    border-radius: var(--radius);
                    border: 1px solid var(--border);
                    font-size: 0.9rem;
                    background: var(--background);
                    min-width: 150px;
                    cursor: pointer;
                    transition: border-color 0.2s ease;
                }
                
                .filter-select:focus {
                    outline: none;
                    border-color: var(--primary);
                }
                
                .requirements-section {
                    margin-bottom: 1.5rem;
                    background: var(--background-secondary, #F9FAFB);
                    padding: 1.25rem;
                    border-radius: var(--radius-lg, 0.75rem);
                    border: 1px solid var(--border);
                }
                
                .requirements-title {
                    margin: 0 0 1rem 0;
                    font-size: 1rem;
                    font-weight: 700;
                    color: var(--foreground);
                }
                
                .requirements-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
                    gap: 0.75rem;
                }
                
                .requirement-card {
                    padding: 0.875rem;
                    border-radius: 0.5rem;
                    border: 1px solid #E5E7EB;
                    background: white;
                }
                
                .requirement-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    gap: 0.5rem;
                }
                
                .requirement-name {
                    font-weight: 600;
                    font-size: 0.9rem;
                }
                
                .requirement-status {
                    font-size: 0.75rem;
                    font-weight: 500;
                    padding: 0.2rem 0.5rem;
                    border-radius: 4px;
                }
                
                .status-submitted {
                    background: #ECFDF5;
                    color: #059669;
                }
                
                .status-pending {
                    background: #FFFBEB;
                    color: #D97706;
                }
                
                .requirement-desc {
                    margin: 0.5rem 0 0 0;
                    color: var(--muted-foreground);
                    font-size: 0.8rem;
                }
                
                .docs-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                    gap: 1.5rem;
                }
                
                .doc-preview {
                    height: 150px;
                    background-color: #F3F4F6;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 3.5rem;
                    border-radius: var(--radius) var(--radius) 0 0;
                }
                
                .doc-content {
                    padding: 1rem;
                }
                
                .doc-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 0.5rem;
                    gap: 0.5rem;
                }
                
                .doc-name {
                    font-weight: 600;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    flex: 1;
                }
                
                .doc-status {
                    font-size: 0.75rem;
                    padding: 0.15rem 0.5rem;
                    border-radius: 4px;
                    font-weight: 500;
                    white-space: nowrap;
                }
                
                .doc-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-size: 0.8rem;
                    color: var(--muted-foreground);
                }
                
                .doc-download {
                    font-size: 0.8rem;
                    color: var(--primary);
                    font-weight: 500;
                    text-decoration: none;
                    transition: opacity 0.2s;
                }
                
                .doc-download:hover {
                    opacity: 0.8;
                }
                
                .doc-type-tag {
                    margin-top: 0.5rem;
                    font-size: 0.8rem;
                    color: var(--muted-foreground);
                }
                
                .empty-state {
                    grid-column: 1 / -1;
                    text-align: center;
                    padding: 4rem 2rem;
                    background: var(--background);
                    border-radius: var(--radius);
                    border: 2px dashed var(--border);
                }
                
                .empty-icon {
                    font-size: 4rem;
                    margin-bottom: 1rem;
                }
                
                .empty-title {
                    font-size: 1.25rem;
                    font-weight: 600;
                    color: var(--foreground);
                    margin: 0 0 0.5rem 0;
                }
                
                .empty-text {
                    color: var(--muted-foreground);
                    margin: 0;
                }
                
                @media (max-width: 1024px) {
                    .page-header {
                        flex-direction: column;
                        align-items: stretch;
                    }
                    
                    .actions-bar {
                        width: 100%;
                    }
                    
                    .filter-select {
                        flex: 1;
                        min-width: 120px;
                    }
                }
                
                @media (max-width: 768px) {
                    .page-title {
                        font-size: 1.5rem;
                    }
                    
                    .actions-bar {
                        flex-direction: column;
                    }
                    
                    .filter-select {
                        width: 100%;
                    }
                    
                    .requirements-grid {
                        grid-template-columns: 1fr;
                    }
                    
                    .docs-grid {
                        grid-template-columns: 1fr;
                        gap: 1rem;
                    }
                    
                    .doc-preview {
                        height: 120px;
                        font-size: 3rem;
                    }
                }
                
                @media (max-width: 480px) {
                    .page-title {
                        font-size: 1.25rem;
                    }
                    
                    .requirements-section {
                        padding: 1rem;
                    }
                    
                    .empty-state {
                        padding: 2rem 1rem;
                    }
                    
                    .empty-icon {
                        font-size: 3rem;
                    }
                }
            `}</style>
            
            <div className="docs-page">
                <div className="page-header">
                    <div>
                        <h1 className="page-title">My Documents</h1>
                        <p className="page-subtitle">Manage your educational and personal documents.</p>
                    </div>
                    <div className="actions-bar">
                        <select 
                            value={selectedCollegeId} 
                            onChange={(e) => setSelectedCollegeId(e.target.value)} 
                            className="filter-select"
                        >
                            <option value="">Select College</option>
                            {colleges.map((college) => (
                                <option key={college.id} value={college.id}>{college.name}</option>
                            ))}
                        </select>
                        <select 
                            value={selectedRequirementId} 
                            onChange={(e) => setSelectedRequirementId(e.target.value)} 
                            className="filter-select"
                        >
                            <option value="">Document Type (optional)</option>
                            {requirements.map((req) => (
                                <option key={req.id} value={req.id}>{req.name}</option>
                            ))}
                        </select>
                        <Button onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                            {uploading ? "Uploading..." : "Upload New"}
                        </Button>
                        <Button variant="outline" onClick={refreshDocs}>Refresh</Button>
                        <Button variant="outline" onClick={() => router.push('/admissions/applications')}>Applications</Button>
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        hidden
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleUpload(file);
                        }}
                    />
                </div>

                {requirements.length > 0 && (
                    <div className="requirements-section">
                        <h3 className="requirements-title">Required Documents</h3>
                        <div className="requirements-grid">
                            {requirements.map((req) => {
                                const submitted = docs.some(d => d.requirement?.id === req.id);
                                return (
                                    <div key={req.id} className="requirement-card">
                                        <div className="requirement-header">
                                            <strong className="requirement-name">{req.name}</strong>
                                            <span className={`requirement-status ${submitted ? 'status-submitted' : 'status-pending'}`}>
                                                {submitted ? 'Submitted' : 'Pending'}
                                            </span>
                                        </div>
                                        {req.description && <p className="requirement-desc">{req.description}</p>}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                <div className="docs-grid">
                    {docs.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">📁</div>
                            <h3 className="empty-title">No documents uploaded yet</h3>
                            <p className="empty-text">Upload your first document using the button above.</p>
                        </div>
                    ) : (
                        docs.map((doc) => (
                            <Card key={doc.id}>
                                <div className="doc-preview">
                                    {doc.type === 'PDF' ? '📄' : '🖼️'}
                                </div>
                                <CardContent className="doc-content">
                                    <div className="doc-header">
                                        <div className="doc-name" title={doc.name}>{doc.name}</div>
                                        <span 
                                            className="doc-status"
                                            style={{ 
                                                backgroundColor: doc.status === 'Verified' ? '#ECFDF5' : '#FFFBEB', 
                                                color: doc.status === 'Verified' ? '#059669' : '#D97706' 
                                            }}
                                        >
                                            {doc.status}
                                        </span>
                                    </div>
                                    <div className="doc-footer">
                                        <span>{doc.type} • {doc.size}</span>
                                        <a href={doc.url} target="_blank" rel="noreferrer" className="doc-download">
                                            Download
                                        </a>
                                    </div>
                                    {doc.requirement?.name && (
                                        <div className="doc-type-tag">
                                            Type: {doc.requirement.name}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </>
    );
}
