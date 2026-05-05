"use client";

import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PostJobPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

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

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const data = {
            title: formData.get('title'),
            companyName: formData.get('companyName'),
            type: formData.get('type'),
            location: formData.get('location'),
            salaryMin: formData.get('salary-min'),
            salaryMax: formData.get('salary-max'),
            description: formData.get('description'),
            requirements: formData.get('requirements'),
            questions: JSON.stringify(formData.getAll('questions')),
        };

        try {
            const res = await fetch('/api/jobs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                router.push('/jobs/employer/active');
            } else {
                const errorData = await res.json();
                alert(`Failed to post job: ${errorData.error || 'Unknown error'}`);
            }
        } catch (error) {
            console.error(error);
            alert('An error occurred while posting the job.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.875rem', fontWeight: 700, color: 'var(--primary)' }}>Post a New Job</h1>
                <p style={{ color: 'var(--muted-foreground)', marginTop: '0.5rem' }}>Create a new job listing to find the perfect candidate.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Job Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label htmlFor="title" style={labelStyle}>Job Title</label>
                                <input name="title" id="title" required placeholder="e.g. Senior Software Engineer" style={inputStyle} />
                            </div>
                            <div>
                                <label htmlFor="companyName" style={labelStyle}>Hiring Company / Client (Optional)</label>
                                <input name="companyName" id="companyName" placeholder="e.g. Shark Edutech Pvt Ltd" style={inputStyle} />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label htmlFor="type" style={labelStyle}>Employment Type</label>
                                <select name="type" id="type" required style={{ ...inputStyle, backgroundColor: 'white' }}>
                                    <option value="">Select type</option>
                                    <option value="Full-Time">Full-Time</option>
                                    <option value="Part-Time">Part-Time</option>
                                    <option value="Contract">Contract</option>
                                    <option value="Internship">Internship</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="location" style={labelStyle}>Location</label>
                                <input name="location" id="location" required placeholder="e.g. Remote / New York" style={inputStyle} />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label htmlFor="salary-min" style={labelStyle}>Minimum Salary</label>
                                <input name="salary-min" id="salary-min" type="number" placeholder="e.g. 50000" style={inputStyle} />
                            </div>
                            <div>
                                <label htmlFor="salary-max" style={labelStyle}>Maximum Salary</label>
                                <input name="salary-max" id="salary-max" type="number" placeholder="e.g. 80000" style={inputStyle} />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="description" style={labelStyle}>Job Description</label>
                            <textarea name="description" id="description" required placeholder="Describe the role and responsibilities..." style={{ ...inputStyle, minHeight: '150px', fontFamily: 'inherit' }} />
                        </div>

                        <div>
                            <label htmlFor="requirements" style={labelStyle}>Requirements</label>
                            <textarea name="requirements" id="requirements" required placeholder="List the required skills and qualifications..." style={{ ...inputStyle, minHeight: '150px', fontFamily: 'inherit' }} />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
                            <Button variant="outline" type="button">Save Draft</Button>
                            <Button type="submit" disabled={loading}>{loading ? 'Posting...' : 'Publish Job'}</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
