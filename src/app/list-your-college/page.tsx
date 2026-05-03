"use client";

import React, { useState } from 'react';
import styles from '../policies.module.css';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';

export default function ListCollegePage() {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [formData, setFormData] = useState({
        collegeName: '',
        location: '',
        contactPerson: '',
        officialEmail: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        try {
            const res = await fetch('/api/list-your-college', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setStatus('success');
                setFormData({ collegeName: '', location: '', contactPerson: '', officialEmail: '' });
            } else {
                setStatus('error');
            }
        } catch (error) {
            setStatus('error');
        }
    };

    return (
        <main>
            <div className={styles.policyContainer}>
                <header className={styles.header}>
                    <h1 className={styles.title}>Partner With Us</h1>
                    <p className={styles.lastUpdated}>Register your institution on India's leading hospitality education platform.</p>
                </header>

                <div className={styles.content}>
                    <h2>Why Join Shark Edutech?</h2>
                    <p>
                        By listing your college on our portal, you gain access to a massive pool of prospective students interested in hospitality management.
                    </p>
                    <ul>
                        <li><strong>Increased Visibility:</strong> Reach students across India and globally.</li>
                        <li><strong>Direct Applications:</strong> Receive and manage admissions directly through our streamlined dashboard.</li>
                        <li><strong>Placement Support:</strong> Connect your graduating students with top hotel brands on our Job Portal.</li>
                        <li><strong>Analytics:</strong> Get insights into admission trends and student interests.</li>
                    </ul>

                    <h2 style={{ marginTop: '3rem' }}>Register Your Interest</h2>
                    
                    {status === 'success' ? (
                        <div style={{ padding: '2rem', backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '1rem', textAlign: 'center' }}>
                            <h3 style={{ color: '#166534', marginBottom: '0.5rem' }}>✅ Request Submitted!</h3>
                            <p style={{ color: '#166534' }}>Thank you for your interest. Our team will contact you shortly.</p>
                            <Button variant="ghost" onClick={() => setStatus('idle')} style={{ marginTop: '1rem' }}>Submit Another Request</Button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1.5rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>College Name</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={formData.collegeName}
                                        onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })}
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)' }} 
                                        placeholder="Global Institute of Hospitality" 
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Location</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)' }} 
                                        placeholder="Ahmedabad, Gujarat" 
                                    />
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Contact Person</label>
                                <input 
                                    type="text" 
                                    required
                                    value={formData.contactPerson}
                                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)' }} 
                                    placeholder="Dean/Principal Name" 
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Official Email</label>
                                <input 
                                    type="email" 
                                    required
                                    value={formData.officialEmail}
                                    onChange={(e) => setFormData({ ...formData, officialEmail: e.target.value })}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)' }} 
                                    placeholder="admissions@college.edu" 
                                />
                            </div>
                            <Button 
                                type="submit"
                                size="lg" 
                                style={{ width: '100%' }}
                                disabled={status === 'loading'}
                            >
                                {status === 'loading' ? 'Submitting...' : 'Submit Partnership Request'}
                            </Button>
                            {status === 'error' && (
                                <p style={{ color: '#ef4444', textAlign: 'center' }}>Something went wrong. Please try again.</p>
                            )}
                        </form>
                    )}
                </div>
            </div>
            <Footer />
        </main>
    );
}
