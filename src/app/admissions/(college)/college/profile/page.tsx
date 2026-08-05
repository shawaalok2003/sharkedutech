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
    const [uploadProgress, setUploadProgress] = useState<string | null>(null);
    const [deletingPhotoId, setDeletingPhotoId] = useState<string | null>(null);
    const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);
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
                    loadExtras(data[0].id);
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
        async function loadExtras(collegeId: string) {
            const [photosRes, reqRes] = await Promise.all([
                fetch(`/api/admissions/college-photos?collegeId=${collegeId}`),
                fetch(`/api/admissions/requirements?collegeId=${collegeId}`)
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

    const uploadPhotos = async (files: File[]) => {
        if (!college?.id) return;
        setUploadingPhoto(true);
        try {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                setUploadProgress(`Uploading ${i + 1} of ${files.length}...`);
                const formData = new FormData();
                formData.append("file", file);
                const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
                if (!uploadRes.ok) {
                    alert(`Upload failed for ${file.name}`);
                    continue;
                }
                const { url } = await uploadRes.json();
                const saveRes = await fetch("/api/admissions/college-photos", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ url, collegeId: college.id })
                });
                if (saveRes.ok) {
                    const photo = await saveRes.json();
                    setPhotos(prev => [photo, ...prev]);
                }
            }
        } finally {
            setUploadingPhoto(false);
            setUploadProgress(null);
            if (photoInputRef.current) photoInputRef.current.value = "";
        }
    };

    const deletePhoto = async (photoId: string, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        if (!confirm("Are you sure you want to delete this photo?")) return;
        setDeletingPhotoId(photoId);
        try {
            const res = await fetch(`/api/admissions/college-photos/${photoId}`, { method: "DELETE" });
            if (res.ok) {
                setPhotos(prev => prev.filter(p => p.id !== photoId));
                setActivePhotoIndex(null);
            } else {
                alert("Failed to delete photo");
            }
        } catch (err) {
            console.error("Delete photo error:", err);
            alert("Error deleting photo");
        } finally {
            setDeletingPhotoId(null);
        }
    };

    const addRequirement = async () => {
        if (!reqForm.name.trim() || !college?.id) return;
        const res = await fetch("/api/admissions/requirements", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...reqForm, collegeId: college.id })
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
            const saved = await res.json();
            setCollege(saved);
            alert("Profile saved successfully!");
        } catch (err) {
            console.error("Failed to save changes:", err);
            setError("An unexpected error occurred while saving.");
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
                    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
                    gap: 0.75rem;
                }
                .photo-item {
                    position: relative;
                    border: 1px solid var(--border);
                    border-radius: 0.75rem;
                    overflow: hidden;
                    aspect-ratio: 4 / 3;
                    background: var(--muted);
                    cursor: pointer;
                }
                .photo-item img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.3s ease;
                }
                .photo-item:hover img {
                    transform: scale(1.05);
                }
                .photo-overlay {
                    position: absolute;
                    inset: 0;
                    background: rgba(0, 0, 0, 0.45);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    opacity: 0;
                    transition: opacity 0.2s ease;
                }
                .photo-item:hover .photo-overlay {
                    opacity: 1;
                }
                .action-btn {
                    background: rgba(255, 255, 255, 0.9);
                    color: #1e293b;
                    border: none;
                    border-radius: 50%;
                    width: 34px;
                    height: 34px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    font-size: 0.95rem;
                    transition: all 0.2s ease;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.15);
                }
                .action-btn:hover {
                    transform: scale(1.1);
                    background: #ffffff;
                }
                .action-btn.delete-btn {
                    background: #ef4444;
                    color: white;
                }
                .action-btn.delete-btn:hover {
                    background: #dc2626;
                }
                .lightbox-overlay {
                    position: fixed;
                    inset: 0;
                    z-index: 99999;
                    background: rgba(0, 0, 0, 0.9);
                    backdrop-filter: blur(10px);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 2rem;
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
                            <CardHeader style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <CardTitle>Campus Photos</CardTitle>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)', marginTop: '0.25rem' }}>
                                        {photos.length} photo{photos.length !== 1 ? 's' : ''} uploaded
                                    </p>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        disabled={uploadingPhoto}
                                        type="button"
                                        onClick={() => photoInputRef.current?.click()}
                                    >
                                        {uploadingPhoto ? (uploadProgress || "Uploading...") : "➕ Upload Photos"}
                                    </Button>
                                    <input
                                        ref={photoInputRef}
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        hidden
                                        onChange={(e) => {
                                            const files = e.target.files;
                                            if (files && files.length > 0) {
                                                uploadPhotos(Array.from(files));
                                            }
                                        }}
                                    />
                                </div>
                            </CardHeader>
                            <CardContent>
                                {photos.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: '2rem 1rem', border: '2px dashed var(--border)', borderRadius: '0.75rem', color: 'var(--muted-foreground)' }}>
                                        📷 No campus photos added yet. Click <strong>Upload Photos</strong> to add multiple images.
                                    </div>
                                ) : (
                                    <div className="photos-grid">
                                        {photos.map((photo, idx) => (
                                            <div key={photo.id} className="photo-item" onClick={() => setActivePhotoIndex(idx)}>
                                                <img src={photo.url} alt={`Campus photo ${idx + 1}`} />
                                                <div className="photo-overlay">
                                                    <button 
                                                        type="button" 
                                                        className="action-btn" 
                                                        title="View photo"
                                                        onClick={(e) => { e.stopPropagation(); setActivePhotoIndex(idx); }}
                                                    >
                                                        👁️
                                                    </button>
                                                    <button 
                                                        type="button" 
                                                        className="action-btn delete-btn" 
                                                        title="Delete photo"
                                                        disabled={deletingPhotoId === photo.id}
                                                        onClick={(e) => deletePhoto(photo.id, e)}
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
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

                {activePhotoIndex !== null && photos[activePhotoIndex] && (
                    <div className="lightbox-overlay" onClick={() => setActivePhotoIndex(null)}>
                        <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }} onClick={(e) => e.stopPropagation()}>
                            <span style={{ color: 'white', fontSize: '0.9rem', fontWeight: 600 }}>
                                Photo {activePhotoIndex + 1} of {photos.length}
                            </span>
                            <button 
                                type="button" 
                                style={{ background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', padding: '0.4rem 0.8rem', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}
                                onClick={(e) => deletePhoto(photos[activePhotoIndex].id, e)}
                            >
                                🗑️ Delete Photo
                            </button>
                            <button 
                                type="button" 
                                style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', borderRadius: '50%', width: '40px', height: '40px', fontSize: '1.2rem', cursor: 'pointer' }}
                                onClick={() => setActivePhotoIndex(null)}
                            >
                                ✕
                            </button>
                        </div>

                        {photos.length > 1 && (
                            <>
                                <button 
                                    type="button" 
                                    style={{ position: 'absolute', left: '1.5rem', background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', borderRadius: '50%', width: '48px', height: '48px', fontSize: '1.5rem', cursor: 'pointer' }}
                                    onClick={(e) => { e.stopPropagation(); setActivePhotoIndex((activePhotoIndex - 1 + photos.length) % photos.length); }}
                                >
                                    ❮
                                </button>
                                <button 
                                    type="button" 
                                    style={{ position: 'absolute', right: '1.5rem', background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', borderRadius: '50%', width: '48px', height: '48px', fontSize: '1.5rem', cursor: 'pointer' }}
                                    onClick={(e) => { e.stopPropagation(); setActivePhotoIndex((activePhotoIndex + 1) % photos.length); }}
                                >
                                    ❯
                                </button>
                            </>
                        )}

                        <div style={{ maxWidth: '90vw', maxHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={(e) => e.stopPropagation()}>
                            <img 
                                src={photos[activePhotoIndex].url} 
                                alt="Campus Full View" 
                                style={{ maxWidth: '100%', maxHeight: '80vh', borderRadius: '12px', objectFit: 'contain', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }} 
                            />
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
