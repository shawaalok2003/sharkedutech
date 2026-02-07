"use client";

import { useState } from 'react';
import styles from './Benefits.module.css';

const benefitsData = {
    students: [
        { icon: "🚀", title: "Single Profile, Many Options", desc: "Create one profile and apply to multiple top-tier hospitality institutes seamlessly." },
        { icon: "🛡️", title: "Verified Institutes", desc: "We only partner with accredited and recognized colleges ensuring quality education." },
        { icon: "🤝", title: "Career Support", desc: "Get direct access to our job portal upon graduation with premium employer connections." }
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
                    <h2 className={styles.title}>Why Choose Sharkedutech?</h2>
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
