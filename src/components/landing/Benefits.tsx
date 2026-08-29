"use client";

import { useState } from 'react';
import styles from './Benefits.module.css';

const benefitsData = {
    students: [
        { 
            icon: (
                <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor">
                    <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4l7 3.82 7-3.82v-4L12 17l-7-3.82z" />
                </svg>
            ), 
            title: "Top Accredited Colleges", 
            desc: "Explore AICTE & NCHMCT accredited hospitality institutes with verified placement records." 
        },
        { 
            icon: (
                <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor">
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
                </svg>
            ), 
            title: "100% Placement Support", 
            desc: "Direct access to 400+ 5-star partner hotels and luxury resorts nationwide upon graduation." 
        },
        { 
            icon: (
                <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
                </svg>
            ), 
            title: "Direct Online Application", 
            desc: "Apply to multiple hospitality courses with a single profile and instant real-time track status." 
        }
    ],
    colleges: [
        { 
            icon: (
                <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor">
                    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                </svg>
            ), 
            title: "Quality Applicants", 
            desc: "Receive applications from pre-screened, serious candidates passionate about hospitality." 
        },
        { 
            icon: (
                <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
                </svg>
            ), 
            title: "Admissions Dashboard", 
            desc: "Manage applications, schedule interviews, and track enrollment stats in one place." 
        },
        { 
            icon: (
                <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                </svg>
            ), 
            title: "Global Reach", 
            desc: "Showcase your institute to a diverse pool of students from across the country." 
        }
    ],
    employers: [
        { 
            icon: (
                <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
            ), 
            title: "Service-Ready Talent", 
            desc: "Hire pre-screened candidates trained specifically for luxury F&B, Front Office, and Culinary roles." 
        },
        { 
            icon: (
                <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor">
                    <path d="M7 2v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-2V2h-2v2H9V2H7zm12 18H5V8h14v12zm-7-9h-2v2H8v2h2v2h2v-2h2v-2h-2v-2z" />
                </svg>
            ), 
            title: "Instant Job Posting", 
            desc: "Post vacancies and receive structured candidate profiles with verified contact info." 
        },
        { 
            icon: (
                <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor">
                    <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z" />
                </svg>
            ), 
            title: "Dedicated Recruitment", 
            desc: "Get personalized placement assistance from our team for bulk hospitality hiring." 
        }
    ]
};

export function Benefits() {
    const [activeTab, setActiveTab] = useState<'students' | 'colleges' | 'employers'>('colleges');

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 className={styles.title}>
                        Why Choose <span className={styles.highlight}>Sharkedutech?</span>
                    </h2>
                    <p className={styles.subtitle}>
                        Empowering students, colleges, and employers with a seamless hospitality ecosystem.
                    </p>
                </div>

                {/* 3-Tab Pill Switcher Container */}
                <div className={styles.tabsContainer}>
                    <div className={styles.pillGroup}>
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
                </div>

                {/* 3-Column Card Grid */}
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
