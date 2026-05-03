import React from 'react';
import styles from '../policies.module.css';
import { Footer } from '@/components/layout/Footer';

const faqs = [
    {
        q: "How do I apply for a course?",
        a: "Navigate to the Admissions Portal, browse the available courses, and click 'Apply Now'. You will need to fill out your student profile first."
    },
    {
        q: "How do I post a job as an employer?",
        a: "You must register as an Employer. Once logged in, go to the Job Portal and click 'Post a Job' in your dashboard."
    },
    {
        q: "Is my data secure?",
        a: "Yes. Employers cannot access your profile without explicit permission, and we never share your CV without your specific consent."
    },
    {
        q: "How do I track my admission status?",
        a: "Log in to the Student Dashboard and go to 'My Applications'. You will see real-time updates on your admission status."
    }
];

export default function HelpCenterPage() {
    return (
        <main>
            <div className={styles.policyContainer}>
                <header className={styles.header}>
                    <h1 className={styles.title}>Help Center</h1>
                    <p className={styles.lastUpdated}>Find answers to common questions and guides on using the platform.</p>
                </header>

                <div className={styles.content}>
                    <h2>Frequently Asked Questions</h2>
                    <div style={{ display: 'grid', gap: '2rem' }}>
                        {faqs.map((faq, i) => (
                            <div key={i}>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--primary)' }}>{faq.q}</h3>
                                <p style={{ color: 'var(--muted-foreground)' }}>{faq.a}</p>
                            </div>
                        ))}
                    </div>

                    <h2 style={{ marginTop: '4rem' }}>Need more help?</h2>
                    <p>
                        If you couldn't find what you were looking for, please contact our support team at <strong>support@shark.com</strong> or visit our <a href="/contact" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>Contact Page</a>.
                    </p>
                </div>
            </div>
            <Footer />
        </main>
    );
}
