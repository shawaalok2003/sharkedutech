"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";

export default function ProfilePage() {
    const { data: session } = useSession();
    const studentName = session?.user?.name || "Student";
    const initials = studentName.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2) || "ST";

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [form, setForm] = useState({
        phone: "",
        dob: "",
        city: "",
        address: "",
        bio: "",
        education: "",
        photoUrl: ""
    });
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        async function loadProfile() {
            const res = await fetch("/api/admissions/profile");
            if (res.ok) {
                const data = await res.json();
                setForm({
                    phone: data.phone || "",
                    dob: data.dob ? new Date(data.dob).toISOString().split("T")[0] : "",
                    city: data.city || "",
                    address: data.address || "",
                    bio: data.bio || "",
                    education: data.education || "",
                    photoUrl: data.photoUrl || ""
                });
            }
        }
        loadProfile();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const saveProfile = async (nextForm: typeof form) => {
        const res = await fetch("/api/admissions/profile", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(nextForm)
        });
        if (!res.ok) {
            alert("Failed to save profile");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await saveProfile(form);
            alert("Profile updated successfully!");
        } finally {
            setSaving(false);
        }
    };

    const handlePhotoUpload = async (file: File) => {
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
            const nextForm = { ...form, photoUrl: url };
            setForm(nextForm);
            setSaving(true);
            await saveProfile(nextForm);
            alert("Photo uploaded and profile updated!");
        } finally {
            setSaving(false);
            setUploading(false);
        }
    };

    return (
        <>
            <style jsx>{`
                .profile-page {
                    max-width: 1200px;
                    margin: 0 auto;
                }
                
                .page-title {
                    font-size: 1.875rem;
                    font-weight: 700;
                    color: var(--primary);
                    margin-bottom: 1.5rem;
                }
                
                .profile-grid {
                    display: grid;
                    grid-template-columns: 280px 1fr;
                    gap: 2rem;
                }
                
                .avatar-section {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 2rem;
                }
                
                .avatar {
                    width: 120px;
                    height: 120px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, var(--primary), var(--primary-dark, #001530));
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 2.5rem;
                    font-weight: 600;
                    margin-bottom: 1rem;
                    overflow: hidden;
                    box-shadow: 0 4px 20px rgba(0, 33, 71, 0.2);
                }
                
                .avatar img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                
                .student-name {
                    font-size: 1.25rem;
                    font-weight: 600;
                    color: var(--foreground);
                }
                
                .student-role {
                    color: var(--muted-foreground);
                    margin-bottom: 1.5rem;
                }
                
                .upload-label {
                    width: 100%;
                }
                
                .form-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1.5rem;
                }
                
                .form-group {
                    display: flex;
                    flex-direction: column;
                }
                
                .form-group.full-width {
                    grid-column: span 2;
                }
                
                .form-label {
                    display: block;
                    margin-bottom: 0.5rem;
                    font-weight: 500;
                    color: var(--foreground);
                }
                
                .form-input {
                    width: 100%;
                    padding: 0.75rem;
                    border-radius: var(--radius);
                    border: 1px solid var(--border);
                    font-size: 0.95rem;
                    transition: border-color 0.2s ease, box-shadow 0.2s ease;
                    background: var(--background);
                }
                
                .form-input:focus {
                    outline: none;
                    border-color: var(--primary);
                    box-shadow: 0 0 0 3px rgba(0, 33, 71, 0.1);
                }
                
                .form-actions {
                    grid-column: span 2;
                    display: flex;
                    justify-content: flex-end;
                    gap: 1rem;
                    padding-top: 1rem;
                }
                
                @media (max-width: 1024px) {
                    .profile-grid {
                        grid-template-columns: 220px 1fr;
                        gap: 1.5rem;
                    }
                    
                    .avatar-section {
                        padding: 1.5rem;
                    }
                    
                    .avatar {
                        width: 100px;
                        height: 100px;
                        font-size: 2rem;
                    }
                }
                
                @media (max-width: 768px) {
                    .page-title {
                        font-size: 1.5rem;
                        text-align: center;
                    }
                    
                    .profile-grid {
                        grid-template-columns: 1fr;
                        gap: 1.5rem;
                    }
                    
                    .avatar-section {
                        padding: 1.5rem;
                    }
                    
                    .avatar {
                        width: 100px;
                        height: 100px;
                        font-size: 2rem;
                    }
                    
                    .form-grid {
                        grid-template-columns: 1fr;
                        gap: 1rem;
                    }
                    
                    .form-group.full-width {
                        grid-column: span 1;
                    }
                    
                    .form-actions {
                        grid-column: span 1;
                        flex-direction: column-reverse;
                    }
                    
                    .form-actions button {
                        width: 100%;
                    }
                }
                
                @media (max-width: 480px) {
                    .page-title {
                        font-size: 1.25rem;
                        margin-bottom: 1rem;
                    }
                    
                    .avatar-section {
                        padding: 1rem;
                    }
                    
                    .avatar {
                        width: 80px;
                        height: 80px;
                        font-size: 1.75rem;
                    }
                    
                    .form-input {
                        padding: 0.625rem;
                        font-size: 0.9rem;
                    }
                }
            `}</style>
            
            <div className="profile-page">
                <h1 className="page-title">My Profile</h1>

                <div className="profile-grid">
                    <Card>
                        <CardContent className="avatar-section">
                            <div className="avatar">
                                {form.photoUrl ? (
                                    <img src={form.photoUrl} alt={studentName} />
                                ) : (
                                    initials
                                )}
                            </div>
                            <h2 className="student-name">{studentName}</h2>
                            <p className="student-role">Student Profile</p>
                            <label className="upload-label">
                                <Button 
                                    className="w-full" 
                                    variant="outline" 
                                    disabled={uploading}
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    {uploading ? "Uploading..." : "Upload Photo"}
                                </Button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    hidden
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) handlePhotoUpload(file);
                                    }}
                                />
                            </label>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Personal Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="form-grid">
                                <div className="form-group">
                                    <label className="form-label">Phone Number</label>
                                    <input name="phone" type="tel" value={form.phone} onChange={handleChange} className="form-input" placeholder="Enter phone number" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Date of Birth</label>
                                    <input name="dob" type="date" value={form.dob} onChange={handleChange} className="form-input" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">City</label>
                                    <input name="city" type="text" value={form.city} onChange={handleChange} className="form-input" placeholder="Enter your city" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Address</label>
                                    <input name="address" type="text" value={form.address} onChange={handleChange} className="form-input" placeholder="Enter your address" />
                                </div>
                                <div className="form-group full-width">
                                    <label className="form-label">Bio / Career Objective</label>
                                    <textarea name="bio" rows={4} value={form.bio} onChange={handleChange} className="form-input" placeholder="Tell us about yourself and your career goals..." />
                                </div>
                                <div className="form-group full-width">
                                    <label className="form-label">Education</label>
                                    <textarea name="education" rows={3} value={form.education} onChange={handleChange} className="form-input" placeholder="Your educational background..." />
                                </div>
                                <div className="form-actions">
                                    <Button variant="ghost" type="button">Cancel</Button>
                                    <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
