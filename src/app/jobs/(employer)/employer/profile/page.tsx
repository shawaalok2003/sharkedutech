"use client";

import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useState, useEffect, useRef } from "react";

export default function CompanyProfilePage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        companyName: '',
        industry: '',
        size: '',
        website: '',
        description: '',
        address: '',
        companyLogo: ''
    });
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        async function fetchProfile() {
            try {
                const res = await fetch('/api/profile');
                if (res.ok) {
                    const data = await res.json();
                    setFormData({
                        name: data.name || '',
                        email: data.email || '',
                        phone: data.phone || '',
                        companyName: data.companyName || '',
                        industry: data.industry || '',
                        size: data.size || '',
                        website: data.website || '',
                        description: data.description || '',
                        address: data.address || '',
                        companyLogo: data.companyLogo || ''
                    });
                }
            } catch (error) {
                console.error("Failed to fetch profile", error);
            } finally {
                setLoading(false);
            }
        }
        fetchProfile();
    }, []);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch('/api/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                alert('Profile updated successfully!');
            } else {
                alert('Failed to update profile.');
            }
        } catch (error) {
            console.error("Failed to update profile", error);
            alert('An error occurred.');
        } finally {
            setSaving(false);
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validations
        if (file.size > 2 * 1024 * 1024) {
            alert("File size must be less than 2MB");
            return;
        }

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Upload failed");
            }

            const { url } = await res.json();

            setFormData(prev => ({ ...prev, companyLogo: url }));
            alert("Logo uploaded successfully! Don't forget to Save Changes.");
        } catch (error: any) {
            console.error("Upload error details:", error);
            alert("Failed to upload logo: " + error.message);
        } finally {
            setUploading(false);
        }
    };

    const inputStyle = {
        width: '100%',
        padding: '0.75rem',
        borderRadius: 'var(--radius)',
        border: '1px solid var(--border)',
        fontSize: '1rem',
        marginTop: '0.5rem',
    };

    const labelStyle = {
        fontSize: '0.875rem',
        fontWeight: 500,
        color: 'var(--foreground)',
    };

    if (loading) return <div style={{ padding: '2rem', color: 'var(--muted-foreground)' }}>Loading profile...</div>;

    return (
        <>
            <style jsx>{`
                .profile-wrapper {
                    max-width: 900px;
                    margin: 0 auto;
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }
                .profile-header {
                    margin-bottom: 1rem;
                }
                .profile-title {
                    font-size: 1.75rem;
                    font-weight: 700;
                    color: var(--primary);
                    margin: 0;
                }
                .profile-subtitle {
                    color: var(--muted-foreground);
                    margin-top: 0.5rem;
                    font-size: 0.875rem;
                }
                .logo-section {
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                    padding-bottom: 1.5rem;
                    border-bottom: 1px solid var(--border);
                }
                .logo-circle {
                    width: 90px;
                    height: 90px;
                    border-radius: 50%;
                    background: var(--muted);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--muted-foreground);
                    font-weight: 600;
                    flex-shrink: 0;
                }
                .form-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem;
                }
                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.4rem;
                }
                .form-group-full {
                    grid-column: span 2;
                }
                .form-label {
                    font-size: 0.8rem;
                    font-weight: 500;
                    color: var(--foreground);
                }
                .form-input {
                    padding: 0.65rem 0.75rem;
                    border-radius: var(--radius);
                    border: 1px solid var(--border);
                    font-size: 0.875rem;
                    font-family: inherit;
                }
                .form-input:focus {
                    outline: none;
                    border-color: var(--primary);
                }
                .textarea {
                    min-height: 140px;
                    resize: vertical;
                }
                .form-actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: 0.75rem;
                    margin-top: 1.5rem;
                }

                @media (max-width: 768px) {
                    .profile-wrapper {
                        gap: 1rem;
                    }
                    .logo-section {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 1rem;
                    }
                    .form-grid {
                        grid-template-columns: 1fr;
                    }
                    .form-group-full {
                        grid-column: span 1;
                    }
                    .form-actions {
                        flex-direction: column;
                    }
                    .form-actions button {
                        width: 100%;
                    }
                }
                @media (max-width: 480px) {
                    .profile-title {
                        font-size: 1.5rem;
                    }
                    .logo-circle, .logo-img {
                        width: 80px;
                        height: 80px;
                    }
                }
                .logo-img {
                    width: 90px;
                    height: 90px;
                    border-radius: 50%;
                    object-fit: cover;
                    border: 1px solid var(--border);
                }
                .upload-hint {
                    font-size: 0.75rem;
                    color: var(--muted-foreground);
                    margin-top: 0.25rem;
                }
            `}</style>
            <div className="profile-wrapper">
                <div className="profile-header">
                    <h1 className="profile-title">Company Profile</h1>
                    <p className="profile-subtitle">Update your company details and branding.</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Company Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div className="logo-section">
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    onChange={handleLogoUpload} 
                                    accept="image/*" 
                                    style={{ display: 'none' }} 
                                />
                                {formData.companyLogo ? (
                                    <img src={formData.companyLogo} alt="Logo" className="logo-img" />
                                ) : (
                                    <div className="logo-circle">
                                        {formData.companyName ? formData.companyName.charAt(0).toUpperCase() : 'C'}
                                    </div>
                                )}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <Button 
                                        variant="outline" 
                                        type="button" 
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={uploading}
                                    >
                                        {uploading ? 'Uploading...' : 'Upload New Logo'}
                                    </Button>
                                    <span className="upload-hint">Recommended: Square image, max 2MB</span>
                                </div>
                            </div>

                            <section>
                                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Account Contact Details</h3>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label htmlFor="name" className="form-label">Full Name / Contact Person</label>
                                        <input id="name" value={formData.name} onChange={handleChange} className="form-input" placeholder="e.g. John Doe" />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="email" className="form-label">Work Email</label>
                                        <input id="email" value={formData.email} readOnly className="form-input" style={{ backgroundColor: '#F9FAFB', cursor: 'not-allowed' }} title="Email cannot be changed" />
                                    </div>
                                </div>
                                <div className="form-grid" style={{ marginTop: '1rem' }}>
                                    <div className="form-group">
                                        <label htmlFor="phone" className="form-label">Contact Number</label>
                                        <input id="phone" value={formData.phone} onChange={handleChange} className="form-input" placeholder="+91 1234567890" />
                                    </div>
                                </div>
                            </section>

                            <section style={{ marginTop: '1rem' }}>
                                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Company Details</h3>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label htmlFor="companyName" className="form-label">Company Name</label>
                                        <input id="companyName" value={formData.companyName} onChange={handleChange} className="form-input" />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="industry" className="form-label">Industry</label>
                                        <input id="industry" value={formData.industry} onChange={handleChange} className="form-input" placeholder="e.g. Hospitality, Tourism" />
                                    </div>
                                </div>

                                <div className="form-grid" style={{ marginTop: '1rem' }}>
                                    <div className="form-group">
                                        <label htmlFor="website" className="form-label">Website</label>
                                        <input id="website" value={formData.website} onChange={handleChange} className="form-input" placeholder="https://example.com" />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="size" className="form-label">Company Size</label>
                                        <input id="size" value={formData.size} onChange={handleChange} className="form-input" placeholder="e.g. 50-100 employees" />
                                    </div>
                                </div>

                                <div className="form-group form-group-full" style={{ marginTop: '1rem' }}>
                                    <label htmlFor="description" className="form-label">About Company</label>
                                    <textarea id="description" value={formData.description} onChange={handleChange} className="form-input textarea" />
                                </div>

                                <div className="form-group form-group-full" style={{ marginTop: '1rem' }}>
                                    <label htmlFor="address" className="form-label">Headquarters Address</label>
                                    <input id="address" value={formData.address} onChange={handleChange} className="form-input" />
                                </div>
                            </section>

                            <div className="form-actions">
                                <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
