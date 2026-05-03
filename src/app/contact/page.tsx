import React from 'react';
import styles from '../policies.module.css';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';

export default function ContactPage() {
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
                            <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Full Name</label>
                                    <input type="text" style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)' }} placeholder="John Doe" />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Email Address</label>
                                    <input type="email" style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)' }} placeholder="john@example.com" />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Message</label>
                                    <textarea style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)', minHeight: '150px' }} placeholder="How can we help you?"></textarea>
                                </div>
                                <Button size="lg" style={{ width: '100%' }}>Send Message</Button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
