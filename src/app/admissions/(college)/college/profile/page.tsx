"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useEffect, useState, useRef } from "react";

type College = {
    id: string;
    name: string;
    email?: string | null;
    phone?: string | null;
    address?: string | null;
    description?: string | null;
    website?: string | null;
    location?: string | null;
    logoUrl?: string | null;
    establishedYear?: number | null;
    accreditation?: string | null;
    affiliation?: string | null;
    ranking?: string | null;
    campusArea?: string | null;
    hostelAvailable?: boolean | null;
    placementRate?: string | null;
    avgPackage?: string | null;
    topRecruiters?: string | null;
    admissionProcess?: string | null;
    eligibility?: string | null;
    scholarships?: string | null;
    facilities?: string | null;
    brochureUrl?: string | null;
    applicationFee?: number | null;
    totalSeats?: number | null;
};

export default function InstituteProfilePage() {
    const [college, setCollege] = useState<College | null>(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [photos, setPhotos] = useState<any[]>([]);
    const [requirements, setRequirements] = useState<any[]>([]);
    const [reqForm, setReqForm] = useState({ name: "", description: "", required: true });
    const [uploadingPhoto, setUploadingPhoto] = useState(false);
    const [uploadingLogo, setUploadingLogo] = useState(false);
    const logoInputRef = useRef<HTMLInputElement>(null);
    const photoInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        async function loadCollege() {
            const res = await fetch("/api/admissions/colleges");
            if (res.ok) {
                const data = await res.json();
                if (data[0]) {
                    setCollege(data[0]);
                } else {
                    setCollege({
                        id: "",
                        name: "",
                        email: "",
                        phone: "",
                        address: "",
                        description: "",
                        website: "",
                        location: "",
                        logoUrl: "",
                        establishedYear: null,
                        accreditation: "",
                        affiliation: "",
                        ranking: "",
                        campusArea: "",
                        hostelAvailable: false,
                        placementRate: "",
                        avgPackage: "",
                        topRecruiters: "",
                        admissionProcess: "",
                        eligibility: "",
                        scholarships: "",
                        facilities: "",
                        brochureUrl: "",
                        applicationFee: null,
                        totalSeats: null
                    });
                }
            }
        }
        async function loadExtras() {
            const [photosRes, reqRes] = await Promise.all([
                fetch("/api/admissions/college-photos"),
                fetch("/api/admissions/requirements")
            ]);
            if (photosRes.ok) {
                const data = await photosRes.json();
                setPhotos(data);
            }
            if (reqRes.ok) {
                const data = await reqRes.json();
                setRequirements(data);
            }
        }
        loadCollege();
        loadExtras();
    }, []);

    const updateField = (field: keyof College, value: string) => {
        if (!college) return;
        setCollege({ ...college, [field]: value });
    };

    const updateNumberField = (field: keyof College, value: string) => {
        if (!college) return;
        setCollege({ ...college, [field]: value === "" ? null : Number(value) });
    };

    const updateBooleanField = (field: keyof College, value: boolean) => {
        if (!college) return;
        setCollege({ ...college, [field]: value });
    };

    const uploadLogo = async (file: File) => {
        setUploadingLogo(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
            if (!uploadRes.ok) {
                alert("Logo upload failed");
                return;
            }
            const { url } = await uploadRes.json();
            if (college) {
                setCollege({ ...college, logoUrl: url });
            }
        } finally {
            setUploadingLogo(false);
        }
    };

    const uploadPhoto = async (file: File) => {
        setUploadingPhoto(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
            if (!uploadRes.ok) {
                alert("Upload failed");
                return;
            }
            const { url } = await uploadRes.json();
            const saveRes = await fetch("/api/admissions/college-photos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url })
            });
            if (saveRes.ok) {
                const photo = await saveRes.json();
                setPhotos(prev => [photo, ...prev]);
            }
        } finally {
            setUploadingPhoto(false);
        }
    };

    const addRequirement = async () => {
        if (!reqForm.name.trim()) return;
        const res = await fetch("/api/admissions/requirements", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(reqForm)
        });
        if (res.ok) {
            const req = await res.json();
            setRequirements(prev => [...prev, req]);
            setReqForm({ name: "", description: "", required: true });
        }
    };

    const removeRequirement = async (id: string) => {
        const res = await fetch(`/api/admissions/requirements/${id}`, { method: "DELETE" });
        if (res.ok) {
            setRequirements(prev => prev.filter(r => r.id !== id));
        }
    };

    const saveChanges = async () => {
        setSaving(true);
        setError(null);
        try {
            if (!college?.name?.trim() || !college?.location?.trim()) {
                setError("Institute name and location are required.");
                return;
            }
            const url = college?.id ? `/api/admissions/colleges/${college.id}` : "/api/admissions/colleges";
            const method = college?.id ? "PUT" : "POST";
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(college)
            });
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                if (res.status === 401) {
                    setError("Please login as college admin to save.");
                } else if (res.status === 403) {
                    setError("You don’t have permission to save this profile.");
                } else {
                    setError(data.error || "Failed to save");
                }
                return;
            }
            if (!college?.id) {
                const created = await res.json();
                setCollege(created);
            }
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            <style jsx>{`
                .profile-container {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }
                .profile-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 1rem;
                }
                .profile-title {
                    font-size: 1.75rem;
                    font-weight: 700;
                    color: var(--primary);
                    margin: 0;
                }
                .main-grid {
                    display: grid;
                    grid-template-columns: 280px 1fr;
                    gap: 1.5rem;
                }
                .logo-section {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 1.5rem;
                }
                .logo-box {
                    width: 100px;
                    height: 100px;
                    border-radius: 12px;
                    background: var(--muted);
                    color: var(--primary);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.25rem;
                    font-weight: 700;
                    margin-bottom: 0.75rem;
                    border: 1px solid var(--border);
                    overflow: hidden;
                }
                .logo-box img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                .college-name {
                    font-size: 1.125rem;
                    font-weight: 600;
                    text-align: center;
                    margin: 0 0 0.25rem;
                }
                .college-location {
                    color: var(--muted-foreground);
                    margin: 0 0 1rem;
                    font-size: 0.875rem;
                }
                .details-form {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1.25rem;
                }
                .form-full {
                    grid-column: span 2;
                }
                .form-label {
                    display: block;
                    margin-bottom: 0.4rem;
                    font-weight: 500;
                    font-size: 0.875rem;
                }
                .form-input {
                    width: 100%;
                    padding: 0.65rem 0.75rem;
                    border-radius: var(--radius);
                    border: 1px solid var(--border);
                    font-size: 0.875rem;
                }
                .error-box {
                    margin-bottom: 1rem;
                    padding: 0.75rem 1rem;
                    border-radius: var(--radius);
                    background: var(--error-light);
                    color: var(--error);
                    border: 1px solid var(--error);
                }
                .extras-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1.5rem;
                }
                .photos-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
                    gap: 0.5rem;
                }
                .photo-item {
                    border: 1px solid var(--border);
                    border-radius: 0.5rem;
                    overflow: hidden;
                }
                .photo-item img {
                    width: 100%;
                    height: 80px;
                    object-fit: cover;
                }
                .req-form {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 0.75rem;
                    margin-bottom: 1rem;
                }
                .req-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0.75rem;
                    border-radius: 0.5rem;
                    border: 1px solid var(--border);
                    gap: 0.75rem;
                }
                .req-actions {
                    display: flex;
                    gap: 0.5rem;
                    align-items: center;
                    flex-shrink: 0;
                }

                @media (max-width: 1024px) {
                    .main-grid {
                        grid-template-columns: 1fr;
                    }
                    .logo-section {
                        flex-direction: row;
                        gap: 1.5rem;
                        justify-content: flex-start;
                    }
                    .logo-box {
                        margin-bottom: 0;
                    }
                }
                @media (max-width: 768px) {
                    .profile-header {
                        flex-direction: column;
                        align-items: stretch;
                    }
                    .profile-header button {
                        width: 100%;
                    }
                    .details-form {
                        grid-template-columns: 1fr;
                    }
                    .form-full {
                        grid-column: span 1;
                    }
                    .extras-grid {
                        grid-template-columns: 1fr;
                    }
                    .req-form {
                        grid-template-columns: 1fr;
                    }
                    .req-form textarea {
                        grid-column: span 1;
                    }
                    .logo-section {
                        flex-direction: column;
                        text-align: center;
                    }
                }
                @media (max-width: 480px) {
                    .profile-title {
                        font-size: 1.5rem;
                    }
                    .req-item {
                        flex-direction: column;
                        align-items: stretch;
                        text-align: center;
                    }
                    .req-actions {
                        justify-content: center;
                    }
                }
            `}</style>
            <div className="profile-container">
                <div className="profile-header">
                    <h1 className="profile-title">Institute Profile</h1>
                    <Button onClick={saveChanges} disabled={saving || !college}>{saving ? "Saving..." : "Save Changes"}</Button>
                </div>

                <div className="main-grid">
                    <Card>
                        <CardContent className="logo-section">
                            <div className="logo-box">
                                {college?.logoUrl ? (
                                    <img src={college.logoUrl} alt="Logo" />
                                ) : (
                                    college?.name?.slice(0, 3).toUpperCase() || "NEW"
                                )}
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <h2 className="college-name">{college?.name || "College"}</h2>
                                <p className="college-location">{college?.location || "Location"}</p>
                                <input 
                                    ref={logoInputRef}
                                    type="file" 
                                    accept="image/*" 
                                    hidden 
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) uploadLogo(file);
                                    }}
                                />
                                <Button 
                                    variant="outline" 
                                    size="sm"
                                    disabled={uploadingLogo}
                                    onClick={() => logoInputRef.current?.click()}
                                >
                                    {uploadingLogo ? "Uploading..." : "Update Logo"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Institute Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {error && (
                                <div className="error-box">{error}</div>
                            )}
                            <form className="details-form">
                                <div className="form-full">
                                    <label className="form-label">Institute Name</label>
                                    <input type="text" required value={college?.name || ""} onChange={(e) => updateField("name", e.target.value)} className="form-input" />
                                </div>
                                <div className="form-full">
                                    <label className="form-label">Location</label>
                                    <input type="text" required value={college?.location || ""} onChange={(e) => updateField("location", e.target.value)} className="form-input" />
                                </div>
                                <div>
                                    <label className="form-label">Established Year</label>
                                    <input type="number" value={college?.establishedYear ?? ""} onChange={(e) => updateNumberField("establishedYear", e.target.value)} className="form-input" />
                                </div>
                                <div>
                                    <label className="form-label">Campus Area</label>
                                    <input type="text" value={college?.campusArea || ""} onChange={(e) => updateField("campusArea", e.target.value)} placeholder="e.g., 25 acres" className="form-input" />
                                </div>
                                <div>
                                    <label className="form-label">Email Address</label>
                                    <input type="email" value={college?.email || ""} onChange={(e) => updateField("email", e.target.value)} className="form-input" />
                                </div>
                                <div>
                                    <label className="form-label">Contact Number</label>
                                    <input type="tel" value={college?.phone || ""} onChange={(e) => updateField("phone", e.target.value)} className="form-input" />
                                </div>
                                <div className="form-full">
                                    <label className="form-label">Address</label>
                                    <textarea rows={3} value={college?.address || ""} onChange={(e) => updateField("address", e.target.value)} className="form-input" />
                                </div>
                                <div className="form-full">
                                    <label className="form-label">Overview / Vision</label>
                                    <textarea rows={4} value={college?.description || ""} onChange={(e) => updateField("description", e.target.value)} className="form-input" />
                                </div>
                                <div>
                                    <label className="form-label">Accreditation</label>
                                    <input type="text" value={college?.accreditation || ""} onChange={(e) => updateField("accreditation", e.target.value)} placeholder="NAAC, NBA, etc." className="form-input" />
                                </div>
                                <div>
                                    <label className="form-label">Affiliation</label>
                                    <input type="text" value={college?.affiliation || ""} onChange={(e) => updateField("affiliation", e.target.value)} placeholder="University / Board" className="form-input" />
                                </div>
                                <div>
                                    <label className="form-label">Ranking</label>
                                    <input type="text" value={college?.ranking || ""} onChange={(e) => updateField("ranking", e.target.value)} placeholder="NIRF/State ranking" className="form-input" />
                                </div>
                                <div>
                                    <label className="form-label">Hostel Available</label>
                                    <select value={college?.hostelAvailable ? "yes" : "no"} onChange={(e) => updateBooleanField("hostelAvailable", e.target.value === "yes")} className="form-input">
                                        <option value="yes">Yes</option>
                                        <option value="no">No</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="form-label">Placement Rate</label>
                                    <input type="text" value={college?.placementRate || ""} onChange={(e) => updateField("placementRate", e.target.value)} placeholder="e.g., 92%" className="form-input" />
                                </div>
                                <div>
                                    <label className="form-label">Average Package</label>
                                    <input type="text" value={college?.avgPackage || ""} onChange={(e) => updateField("avgPackage", e.target.value)} placeholder="e.g., 6.5 LPA" className="form-input" />
                                </div>
                                <div className="form-full">
                                    <label className="form-label">Top Recruiters</label>
                                    <input type="text" value={college?.topRecruiters || ""} onChange={(e) => updateField("topRecruiters", e.target.value)} placeholder="Comma separated" className="form-input" />
                                </div>
                                <div className="form-full">
                                    <label className="form-label">Admission Process</label>
                                    <textarea rows={3} value={college?.admissionProcess || ""} onChange={(e) => updateField("admissionProcess", e.target.value)} className="form-input" />
                                </div>
                                <div className="form-full">
                                    <label className="form-label">Eligibility Criteria</label>
                                    <textarea rows={3} value={college?.eligibility || ""} onChange={(e) => updateField("eligibility", e.target.value)} className="form-input" />
                                </div>
                                <div className="form-full">
                                    <label className="form-label">Scholarships</label>
                                    <textarea rows={2} value={college?.scholarships || ""} onChange={(e) => updateField("scholarships", e.target.value)} className="form-input" />
                                </div>
                                <div className="form-full">
                                    <label className="form-label">Facilities</label>
                                    <input type="text" value={college?.facilities || ""} onChange={(e) => updateField("facilities", e.target.value)} placeholder="Library, Lab, Sports, Wi-Fi..." className="form-input" />
                                </div>
                                <div className="form-full">
                                    <label className="form-label">Website URL</label>
                                    <input type="url" value={college?.website || ""} onChange={(e) => updateField("website", e.target.value)} className="form-input" />
                                </div>
                                <div>
                                    <label className="form-label">Brochure URL</label>
                                    <input type="url" value={college?.brochureUrl || ""} onChange={(e) => updateField("brochureUrl", e.target.value)} className="form-input" />
                                </div>
                                <div>
                                    <label className="form-label">Application Fee</label>
                                    <input type="number" value={college?.applicationFee ?? ""} onChange={(e) => updateNumberField("applicationFee", e.target.value)} className="form-input" />
                                </div>
                                <div>
                                    <label className="form-label">Total Seats</label>
                                    <input type="number" value={college?.totalSeats ?? ""} onChange={(e) => updateNumberField("totalSeats", e.target.value)} className="form-input" />
                                </div>
                            </form>
                    </CardContent>
                    </Card>
                </div>
                
                {!college?.id ? (
                    <Card style={{ border: '2px dashed var(--muted)', opacity: 0.7 }}>
                        <CardContent style={{ padding: '3rem', textAlign: 'center' }}>
                            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔒</div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--primary)' }}>Unlock Extra Features</h3>
                            <p style={{ color: 'var(--muted-foreground)' }}>Please save your <strong>Institute Details</strong> above for the first time to enable Campus Photos and Admission Requirements.</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="extras-grid">
                    <Card>
                        <CardHeader>
                            <CardTitle>Campus Photos</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div style={{ marginBottom: '1rem' }}>
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    disabled={uploadingPhoto}
                                    type="button"
                                    onClick={() => photoInputRef.current?.click()}
                                >
                                    {uploadingPhoto ? "Uploading..." : "Upload Photo"}
                                </Button>
                                <input
                                    ref={photoInputRef}
                                    type="file"
                                    accept="image/*"
                                    hidden
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) uploadPhoto(file);
                                    }}
                                />
                            </div>
                            <div className="photos-grid">
                                {photos.map((photo) => (
                                    <div key={photo.id} className="photo-item">
                                        <img src={photo.url} alt="Campus" />
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
                            <div className="req-form">
                                <input placeholder="Document name" value={reqForm.name} onChange={(e) => setReqForm(prev => ({ ...prev, name: e.target.value }))} className="form-input" />
                                <select value={reqForm.required ? "yes" : "no"} onChange={(e) => setReqForm(prev => ({ ...prev, required: e.target.value === "yes" }))} className="form-input">
                                    <option value="yes">Required</option>
                                    <option value="no">Optional</option>
                                </select>
                                <textarea placeholder="Description" value={reqForm.description} onChange={(e) => setReqForm(prev => ({ ...prev, description: e.target.value }))} className="form-input" style={{ gridColumn: 'span 2' }} />
                                <Button size="sm" onClick={() => { addRequirement(); setReqForm({ name: '', description: '', required: true }); alert('Requirement added successfully!'); }} disabled={!reqForm.name.trim()}>Add Requirement</Button>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {requirements.map((req) => (
                                    <div key={req.id} className="req-item">
                                        <div>
                                            <strong style={{ fontSize: '0.875rem' }}>{req.name}</strong>
                                            {req.description && <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>{req.description}</div>}
                                        </div>
                                        <div className="req-actions">
                                            <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderRadius: '1rem', background: req.required ? 'var(--success-light)' : 'var(--muted)', color: req.required ? 'var(--success)' : 'var(--muted-foreground)' }}>
                                                {req.required ? 'Required' : 'Optional'}
                                            </span>
                                            <Button size="sm" variant="outline" onClick={() => removeRequirement(req.id)}>Remove</Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                    </div>
                )}
            </div>
        </>
    );
}
