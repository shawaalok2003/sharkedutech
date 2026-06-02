"use client";

import React, { useState } from 'react';
import styles from '../policies.module.css';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { toast } from 'react-hot-toast';

export default function ContactPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email || !message) {
            toast.error("Please fill in all fields.");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, message })
            });

            const result = await response.json();

            if (!response.ok) {
                toast.error(result.error || "Failed to send message. Please try again.");
                return;
            }

            toast.success("Message sent successfully!");
            // Reset form
            setName('');
            setEmail('');
            setMessage('');

        } catch (error) {
            console.error("Contact form error:", error);
            toast.error("An unexpected error occurred. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main>
            <div className={styles.policyContainer}>
                <header className={styles.header}>
                    <h1 className={styles.title}>Contact Us</h1>
                    <p className={styles.lastUpdated}>We are here to help you with your hospitality journey.</p>
                </header>

                <div className={styles.content}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' }}>
                        <div>
                            <h2>Get in Touch</h2>
                            <p>Have questions about admissions, job postings, or technical issues? Our team is ready to assist.</p>
                            
                            <div style={{ marginTop: '2rem' }}>
                                <p><strong>📍 Address:</strong><br />Indore, Madhya Pradesh, India</p>
                                <p><strong>📧 Email:</strong><br />info@shark.com</p>
                                <p><strong>📞 Phone:</strong><br />+91 98765 43210</p>
                            </div>
                        </div>

                        <div>
                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Full Name</label>
                                    <input 
                                        type="text" 
                                        required 
                                        disabled={loading}
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)' }} 
                                        placeholder="John Doe" 
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Email Address</label>
                                    <input 
                                        type="email" 
                                        required 
                                        disabled={loading}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)' }} 
                                        placeholder="john@example.com" 
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Message</label>
                                    <textarea 
                                        required 
                                        disabled={loading}
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)', minHeight: '150px' }} 
                                        placeholder="How can we help you?"
                                    ></textarea>
                                </div>
                                <Button type="submit" size="lg" style={{ width: '100%' }} disabled={loading}>
                                    {loading ? 'Sending...' : 'Send Message'}
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
