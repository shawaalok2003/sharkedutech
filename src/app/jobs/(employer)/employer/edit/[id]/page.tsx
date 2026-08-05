"use client";

import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditJobPage() {
    const router = useRouter();
    const params = useParams();
    const jobId = params?.id as string;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [form, setForm] = useState({
        title: '',
        companyName: '',
        type: 'Full-Time',
        category: 'Front Office',
        customCategory: '',
        location: '',
        salaryMin: '',
        salaryMax: '',
        description: '',
        requirements: '',
        status: 'Active'
    });

    const [isCustomCategory, setIsCustomCategory] = useState(false);

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

    const standardCategories = [
        "Front Office", "Back Office", "Guest Relations", "Concierge", "Reservations",
        "F&B Service", "Food Production", "Banquet & Events", "Bar & Mixology", "Pastry & Bakery", "Stewarding",
        "Housekeeping", "Laundry", "Engineering & Maintenance",
        "Spa & Wellness", "Recreation & Activities",
        "Sales & Marketing", "HR & Admin", "Accounts & Finance", "Purchasing & Stores", "Security", "IT & Systems"
    ];

    useEffect(() => {
        async function fetchJob() {
            if (!jobId) return;
            try {
                const res = await fetch(`/api/jobs/${jobId}`);
                if (res.ok) {
                    const data = await res.json();
                    const isStandard = standardCategories.includes(data.category);
                    setForm({
                        title: data.title || '',
                        companyName: data.companyName || '',
                        type: data.type || 'Full-Time',
                        category: isStandard ? data.category : '__custom__',
                        customCategory: isStandard ? '' : (data.category || ''),
                        location: data.location || '',
                        salaryMin: data.salaryMin !== null && data.salaryMin !== undefined ? String(data.salaryMin) : '',
                        salaryMax: data.salaryMax !== null && data.salaryMax !== undefined ? String(data.salaryMax) : '',
                        description: data.description || '',
                        requirements: data.requirements || '',
                        status: data.status || 'Active'
                    });
                    setIsCustomCategory(!isStandard);
                } else {
                    setError("Job not found");
                }
            } catch (err) {
                console.error("Failed to load job details:", err);
                setError("Failed to load job details");
            } finally {
                setLoading(false);
            }
        }
        fetchJob();
    }, [jobId]);

    const handleChange = (field: string, value: string) => {
        setForm(prev => ({ ...prev, [field]: value }));
        if (field === 'category') {
            setIsCustomCategory(value === '__custom__');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        const resolvedCategory = (form.category === '__custom__' && form.customCategory.trim()) 
            ? form.customCategory.trim() 
            : form.category;

        const payload = {
            title: form.title,
            companyName: form.companyName,
            type: form.type,
            category: resolvedCategory,
            location: form.location,
            salaryMin: form.salaryMin ? Number(form.salaryMin) : null,
            salaryMax: form.salaryMax ? Number(form.salaryMax) : null,
            description: form.description,
            requirements: form.requirements,
            status: form.status
        };

        try {
            const res = await fetch(`/api/jobs/${jobId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                alert("Job updated successfully!");
                router.push('/jobs/employer/active');
            } else {
                const errData = await res.json();
                setError(errData.error || "Failed to update job");
            }
        } catch (err) {
            console.error("Failed to save job updates:", err);
            setError("An error occurred while saving changes.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this job vacancy? This action cannot be undone.")) {
            return;
        }

        setDeleting(true);
        try {
            const res = await fetch(`/api/jobs/${jobId}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                alert("Job deleted successfully.");
                router.push('/jobs/employer/active');
            } else {
                const errData = await res.json();
                alert(`Failed to delete job: ${errData.error || 'Unknown error'}`);
            }
        } catch (err) {
            console.error("Delete job error:", err);
            alert("An error occurred while deleting the job.");
        } finally {
            setDeleting(false);
        }
    };

    if (loading) {
        return <div style={{ padding: '2rem', color: 'var(--muted-foreground)' }}>Loading job details...</div>;
    }

    if (error && !form.title) {
        return (
            <div style={{ maxWidth: '800px', margin: '2rem auto', textAlign: 'center' }}>
                <h2 style={{ color: '#ef4444' }}>⚠️ {error}</h2>
                <Button style={{ marginTop: '1rem' }} onClick={() => router.push('/jobs/employer/active')}>Back to Active Jobs</Button>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '3rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: 700, color: 'var(--primary)' }}>Edit Job Vacancy</h1>
                    <p style={{ color: 'var(--muted-foreground)', marginTop: '0.25rem' }}>Update details for "{form.title}"</p>
                </div>
                <Button variant="outline" onClick={() => router.push('/jobs/employer/active')}>← Back</Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Job Information</CardTitle>
                </CardHeader>
                <CardContent>
                    {error && (
                        <div style={{ marginBottom: '1rem', padding: '0.75rem 1rem', background: '#fef2f2', border: '1px solid #fee2e2', color: '#ef4444', borderRadius: 'var(--radius)', fontWeight: 600 }}>
                            ⚠️ {error}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label htmlFor="title" style={labelStyle}>Job Title</label>
                                <input 
                                    name="title" 
                                    id="title" 
                                    required 
                                    value={form.title}
                                    onChange={(e) => handleChange('title', e.target.value)}
                                    placeholder="e.g. Senior Software Engineer" 
                                    style={inputStyle} 
                                />
                            </div>
                            <div>
                                <label htmlFor="companyName" style={labelStyle}>Hiring Company / Client (Optional)</label>
                                <input 
                                    name="companyName" 
                                    id="companyName" 
                                    value={form.companyName}
                                    onChange={(e) => handleChange('companyName', e.target.value)}
                                    placeholder="e.g. Shark Edutech Pvt Ltd" 
                                    style={inputStyle} 
                                />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label htmlFor="type" style={labelStyle}>Employment Type</label>
                                <select 
                                    name="type" 
                                    id="type" 
                                    required 
                                    value={form.type}
                                    onChange={(e) => handleChange('type', e.target.value)}
                                    style={{ ...inputStyle, backgroundColor: 'white' }}
                                >
                                    <option value="Full-Time">Full-Time</option>
                                    <option value="Part-Time">Part-Time</option>
                                    <option value="Contract">Contract</option>
                                    <option value="Internship">Internship</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="status" style={labelStyle}>Vacancy Status</label>
                                <select 
                                    name="status" 
                                    id="status" 
                                    required 
                                    value={form.status}
                                    onChange={(e) => handleChange('status', e.target.value)}
                                    style={{ ...inputStyle, backgroundColor: 'white' }}
                                >
                                    <option value="Active">Active</option>
                                    <option value="Urgent">Urgent</option>
                                    <option value="Closed">Closed</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="category" style={labelStyle}>Job Category</label>
                                <select 
                                    name="category" 
                                    id="category" 
                                    required 
                                    value={form.category}
                                    onChange={(e) => handleChange('category', e.target.value)}
                                    style={{ ...inputStyle, backgroundColor: 'white' }}
                                >
                                    <optgroup label="Operations">
                                        <option value="Front Office">Front Office</option>
                                        <option value="Back Office">Back Office</option>
                                        <option value="Guest Relations">Guest Relations</option>
                                        <option value="Concierge">Concierge</option>
                                        <option value="Reservations">Reservations</option>
                                    </optgroup>
                                    <optgroup label="Food & Beverage">
                                        <option value="F&B Service">F&B Service</option>
                                        <option value="Food Production">Food Production (Kitchen)</option>
                                        <option value="Banquet & Events">Banquet &amp; Events</option>
                                        <option value="Bar & Mixology">Bar &amp; Mixology</option>
                                        <option value="Pastry & Bakery">Pastry &amp; Bakery</option>
                                        <option value="Stewarding">Stewarding</option>
                                    </optgroup>
                                    <optgroup label="Rooms Division">
                                        <option value="Housekeeping">Housekeeping</option>
                                        <option value="Laundry">Laundry</option>
                                        <option value="Engineering & Maintenance">Engineering &amp; Maintenance</option>
                                    </optgroup>
                                    <optgroup label="Wellness & Recreation">
                                        <option value="Spa & Wellness">Spa &amp; Wellness</option>
                                        <option value="Recreation & Activities">Recreation &amp; Activities</option>
                                    </optgroup>
                                    <optgroup label="Support Functions">
                                        <option value="Sales & Marketing">Sales &amp; Marketing</option>
                                        <option value="HR & Admin">HR &amp; Admin</option>
                                        <option value="Accounts & Finance">Accounts &amp; Finance</option>
                                        <option value="Purchasing & Stores">Purchasing &amp; Stores</option>
                                        <option value="Security">Security</option>
                                        <option value="IT & Systems">IT &amp; Systems</option>
                                    </optgroup>
                                    <option value="__custom__">✏️ Other (Custom)</option>
                                </select>
                            </div>
                        </div>

                        {isCustomCategory && (
                            <div>
                                <label htmlFor="customCategory" style={labelStyle}>Custom Category Name</label>
                                <input 
                                    name="customCategory" 
                                    id="customCategory"
                                    required 
                                    value={form.customCategory}
                                    onChange={(e) => handleChange('customCategory', e.target.value)}
                                    placeholder="Enter your custom category..." 
                                    style={inputStyle} 
                                />
                            </div>
                        )}

                        <div>
                            <label htmlFor="location" style={labelStyle}>Location</label>
                            <input 
                                name="location" 
                                id="location" 
                                required 
                                value={form.location}
                                onChange={(e) => handleChange('location', e.target.value)}
                                placeholder="e.g. Remote / New York" 
                                style={inputStyle} 
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label htmlFor="salaryMin" style={labelStyle}>Minimum Salary</label>
                                <input 
                                    name="salaryMin" 
                                    id="salaryMin" 
                                    type="number" 
                                    value={form.salaryMin}
                                    onChange={(e) => handleChange('salaryMin', e.target.value)}
                                    placeholder="e.g. 50000" 
                                    style={inputStyle} 
                                />
                            </div>
                            <div>
                                <label htmlFor="salaryMax" style={labelStyle}>Maximum Salary</label>
                                <input 
                                    name="salaryMax" 
                                    id="salaryMax" 
                                    type="number" 
                                    value={form.salaryMax}
                                    onChange={(e) => handleChange('salaryMax', e.target.value)}
                                    placeholder="e.g. 80000" 
                                    style={inputStyle} 
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="description" style={labelStyle}>Job Description</label>
                            <textarea 
                                name="description" 
                                id="description" 
                                required 
                                value={form.description}
                                onChange={(e) => handleChange('description', e.target.value)}
                                placeholder="Describe the role and responsibilities..." 
                                style={{ ...inputStyle, minHeight: '150px', fontFamily: 'inherit' }} 
                            />
                        </div>

                        <div>
                            <label htmlFor="requirements" style={labelStyle}>Requirements</label>
                            <textarea 
                                name="requirements" 
                                id="requirements" 
                                required 
                                value={form.requirements}
                                onChange={(e) => handleChange('requirements', e.target.value)}
                                placeholder="List the required skills and qualifications..." 
                                style={{ ...inputStyle, minHeight: '150px', fontFamily: 'inherit' }} 
                            />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
                            <Button 
                                type="button" 
                                variant="outline" 
                                disabled={deleting}
                                onClick={handleDelete}
                                style={{ color: '#ef4444', borderColor: '#fee2e2', backgroundColor: '#fef2f2' }}
                            >
                                {deleting ? 'Deleting...' : '🗑️ Delete Vacancy'}
                            </Button>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <Button type="button" variant="outline" onClick={() => router.push('/jobs/employer/active')}>Cancel</Button>
                                <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
