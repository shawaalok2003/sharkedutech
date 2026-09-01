"use client";

import React, { useState } from 'react';
import styles from './Contact.module.css';
import { Footer } from '@/components/layout/Footer';
import { toast } from 'react-hot-toast';

export default function ContactPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [category, setCategory] = useState('Student Admission Inquiry');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email || !message) {
            toast.error("Please fill in all required fields.");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    name, 
                    email, 
                    message: `[Category: ${category}] [Phone: ${phone || 'N/A'}]\n\n${message}` 
                })
            });

            const result = await response.json();

            if (!response.ok) {
                toast.error(result.error || "Failed to send message. Please try again.");
                return;
            }

            toast.success("🎉 Message sent successfully! Our counselors will contact you shortly.");
            setName('');
            setEmail('');
            setPhone('');
            setMessage('');
        } catch (error) {
            console.error("Contact form error:", error);
            toast.error("An unexpected error occurred. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main style={{ background: '#f8fafc', minHeight: '100vh' }}>
            <div className={styles.container}>
                {/* Hero Header */}
                <div className={styles.heroHeader}>
                    <span className={styles.heroBadge}>📍 24/7 SUPPORT &amp; COUNSELING</span>
                    <h1 className={styles.heroTitle}>Get in Touch with Shark Edutech</h1>
                    <p className={styles.heroSubtitle}>
                        Have questions about hotel management admissions, 5-star placements, 0% interest loans, or listing your college/hotel? Our expert team is ready to assist you.
                    </p>
                </div>

                {/* Info Cards Grid */}
                <div className={styles.infoGrid}>
                    <div className={styles.infoCard}>
                        <div className={styles.infoIcon}>🏢</div>
                        <h3 className={styles.infoTitle}>Headquarters</h3>
                        <p className={styles.infoText}>
                            Chinar Park (behind Aminia Restaurant), Rajarhat, Kolkata - 700157, West Bengal, India
                        </p>
                    </div>

                    <div className={styles.infoCard}>
                        <div className={styles.infoIcon}>📞</div>
                        <h3 className={styles.infoTitle}>Phone &amp; WhatsApp</h3>
                        <p className={styles.infoText}>
                            <a href="tel:+919147331167" className={styles.infoLink}>+91 91473 31167</a><br />
                            Direct Counselor Helpline: Available 24/7
                        </p>
                    </div>

                    <div className={styles.infoCard}>
                        <div className={styles.infoIcon}>📧</div>
                        <h3 className={styles.infoTitle}>Official Email</h3>
                        <p className={styles.infoText}>
                            <a href="mailto:info@sharkedutech.com" className={styles.infoLink}>info@sharkedutech.com</a><br />
                            <a href="mailto:admissions@sharkedutech.com" className={styles.infoLink}>admissions@sharkedutech.com</a>
                        </p>
                    </div>

                    <div className={styles.infoCard}>
                        <div className={styles.infoIcon}>⏱️</div>
                        <h3 className={styles.infoTitle}>Working Hours</h3>
                        <p className={styles.infoText}>
                            Monday &ndash; Saturday: 9:30 AM &ndash; 7:00 PM<br />
                            Sunday: Online WhatsApp Support Active
                        </p>
                    </div>
                </div>

                {/* Main Split Grid */}
                <div className={styles.mainGrid}>
                    {/* Left Form Column */}
                    <div className={styles.formCard}>
                        <h2 className={styles.formTitle}>Send Us a Direct Message</h2>
                        <p className={styles.formSubtitle}>Fill in your details below and our team will get back to you within 2 hours.</p>

                        <form onSubmit={handleSubmit} className={styles.formGrid}>
                            <div className={styles.fieldGroup}>
                                <label className={styles.label}>Full Name *</label>
                                <input 
                                    type="text" 
                                    required
                                    disabled={loading}
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter your full name"
                                    className={styles.input}
                                />
                            </div>

                            <div className={styles.fieldGroup}>
                                <label className={styles.label}>Email Address *</label>
                                <input 
                                    type="email" 
                                    required
                                    disabled={loading}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="john@example.com"
                                    className={styles.input}
                                />
                            </div>

                            <div className={styles.fieldGroup}>
                                <label className={styles.label}>Phone / WhatsApp Number</label>
                                <input 
                                    type="tel" 
                                    disabled={loading}
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="+91 98765 43210"
                                    className={styles.input}
                                />
                            </div>

                            <div className={styles.fieldGroup}>
                                <label className={styles.label}>Inquiry Category</label>
                                <select 
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className={styles.select}
                                >
                                    <option value="Student Admission Inquiry">Student Admission Inquiry</option>
                                    <option value="Employer / Hotel Hiring">Employer / Hotel Hiring</option>
                                    <option value="College Partner Registration">College Partner Registration</option>
                                    <option value="0% Interest Loan Assistance">0% Interest Loan Assistance</option>
                                    <option value="General Support">General Technical Support</option>
                                </select>
                            </div>

                            <div className={`${styles.fieldGroup} ${styles.fullWidth}`}>
                                <label className={styles.label}>Your Message *</label>
                                <textarea 
                                    required
                                    disabled={loading}
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Tell us how we can help your education or career journey..."
                                    className={styles.textarea}
                                ></textarea>
                            </div>

                            <div className={styles.fullWidth}>
                                <button type="submit" disabled={loading} className={styles.submitBtn}>
                                    {loading ? 'Sending Message...' : 'Send Message ↗'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Right Office Map & Contacts Column */}
                    <div className={styles.locationCard}>
                        <h2 className={styles.locationTitle}>Visit Our Headquarters</h2>
                        <p className={styles.locationDesc}>
                            Located conveniently at Chinar Park, Rajarhat, Kolkata. Drop by our office for face-to-face counseling and direct college admission assistance.
                        </p>

                        <div className={styles.mapFrame}>
                            <iframe 
                                title="Shark Edutech Location Map"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3683.4754519965313!2d88.4554313!3d22.6360408!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f89e3a6c116d47%3A0xb6cfbdf91e1d3a77!2sChinar%20Park%2C%20Kolkata!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
                                width="100%" 
                                height="100%" 
                                style={{ border: 0 }} 
                                allowFullScreen={false} 
                                loading="lazy" 
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>

                        <div className={styles.directContactsBox}>
                            <div className={styles.directContactRow}>
                                <span className={styles.directIcon}>🎓</span>
                                <div>
                                    <div className={styles.directTitle}>Admissions Helpline</div>
                                    <div className={styles.directVal}>+91 91473 31167</div>
                                </div>
                            </div>

                            <div className={styles.directContactRow}>
                                <span className={styles.directIcon}>💼</span>
                                <div>
                                    <div className={styles.directTitle}>Employer Hiring Desk</div>
                                    <div className={styles.directVal}>hiring@sharkedutech.com</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
