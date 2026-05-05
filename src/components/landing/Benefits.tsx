"use client";

import { useState } from 'react';
import styles from './Benefits.module.css';

const benefitsData = {
    students: [
        { icon: "🎓", title: "100% Placement Assistance", desc: "We provide comprehensive job assistance and placement support to all our students during their tenure." },
        { icon: "💎", title: "Free Premium Membership", desc: "Get free lifetime premium membership to our job portal, giving you first access to top hospitality roles." },
        { icon: "🏥", title: "Free Health Insurance", desc: "Your well-being matters. We provide free student health insurance to ensure peace of mind while you study." }
    ],
    colleges: [
        { icon: "👥", title: "Quality Applicants", desc: "Receive applications from pre-screened, serious candidates passionate about hospitality." },
        { icon: "📊", title: "Admissions Dashboard", desc: "Manage applications, schedule interviews, and track enrollment stats in one place." },
        { icon: "🌍", title: "Global Reach", desc: "Showcase your institute to a diverse pool of students from across the country." }
    ],
    employers: [
        { icon: "⭐", title: "Top Talent", desc: "Hire graduates trained from the best institutes with verified credentials." },
        { icon: "⚡", title: "Fast Hiring", desc: "Post jobs and shortlist candidates quickly with our intuitive recruitment tools." },
        { icon: "📝", title: "Brand Building", desc: "Create a company profile that attracts the next generation of hospitality leaders." }
    ]
};

export function Benefits() {
    const [activeTab, setActiveTab] = useState<'students' | 'colleges' | 'employers'>('students');

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.tagline}>THE SHARK ADVANTAGE</div>
                    <h2 className={styles.title}>Why Choose Sharkedutech?</h2>
                    <p className={styles.subtitle}>Empowering students, colleges, and employers with a seamless hospitality ecosystem.</p>
                </div>

                <div className={styles.tabsContainer}>
                    {(['students', 'colleges', 'employers'] as const).map((tab) => (
                        <button
                            key={tab}
                            className={`${styles.tab} ${activeTab === tab ? styles.activeTab : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            For {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                <div className={styles.contentGrid}>
                    {benefitsData[activeTab].map((item, idx) => (
                        <div key={idx} className={styles.card}>
                            <div className={styles.cardIcon}>{item.icon}</div>
                            <h3 className={styles.cardTitle}>{item.title}</h3>
                            <p className={styles.cardText}>{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
