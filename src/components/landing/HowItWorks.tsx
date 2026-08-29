"use client";

import { useState } from 'react';
import styles from './HowItWorks.module.css';

const candidateSteps = [
    {
        number: 1,
        title: "Register an account",
        description: "Create an account and upload your updated resume."
    },
    {
        number: 2,
        title: "Find your job",
        description: "Our advanced search filters allow you to narrow down your job search based on specific criteria."
    },
    {
        number: 3,
        title: "Apply for job",
        description: "Just simply click on Apply Now and you are done. The company will contact you."
    }
];

const employerSteps = [
    {
        number: 1,
        title: "Register your Company",
        description: "Create an employer profile and showcase your company details."
    },
    {
        number: 2,
        title: "Post a job",
        description: "Create detailed job listings to attract the best hospitality talent in the industry."
    },
    {
        number: 3,
        title: "Hire top talent",
        description: "Review applications and hire service-ready professionals."
    }
];

export function HowItWorks() {
    const [tab, setTab] = useState<'candidate' | 'employer'>('candidate');
    const [activeStep, setActiveStep] = useState(1);

    const steps = tab === 'candidate' ? candidateSteps : employerSteps;

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                {/* Top Pill Switcher */}
                <div className={styles.toggleContainer}>
                    <div className={styles.togglePill}>
                        <button
                            onClick={() => { setTab('candidate'); setActiveStep(1); }}
                            className={`${styles.toggleBtn} ${tab === 'candidate' ? styles.toggleBtnActive : ''}`}
                        >
                            For Candidate
                        </button>
                        <button
                            onClick={() => { setTab('employer'); setActiveStep(1); }}
                            className={`${styles.toggleBtn} ${tab === 'employer' ? styles.toggleBtnActive : ''}`}
                        >
                            For Employer
                        </button>
                    </div>
                </div>

                <div className={styles.grid}>
                    {/* Left Column: Heading & Stepper */}
                    <div>
                        <h2 className={styles.title}>
                            {tab === 'candidate' ? (
                                <>That's How Shark Edutech Works for Candidate : <span className={styles.titleHighlight}>Find Your Hotel Job in 3 Steps</span></>
                            ) : (
                                <>That's How Shark Edutech Works for Employer : <span className={styles.titleHighlight}>Build Your Team in 3 Simple Steps</span></>
                            )}
                        </h2>

                        <p className={styles.subtitle}>
                            {tab === 'candidate' 
                                ? "At Shark Edutech, we connect you with world-class talent dedicated to delivering exceptional service and elevating your brand's guest experience."
                                : "At Shark Edutech, we help you find top talent efficiently, ensuring your business grows with the right professionals who match your company culture."
                            }
                        </p>

                        <div className={styles.stepper}>
                            {steps.map((step) => {
                                const isActive = step.number === activeStep;

                                return (
                                    <div 
                                        key={step.number} 
                                        className={styles.stepItem}
                                        onClick={() => setActiveStep(step.number)}
                                    >
                                        <div className={`${styles.stepCircle} ${isActive ? styles.stepCircleActive : ''}`}>
                                            {step.number}
                                        </div>
                                        <div>
                                            <h3 className={`${styles.stepTitle} ${isActive ? styles.stepTitleActive : ''}`}>
                                                {step.title}
                                            </h3>
                                            <p className={styles.stepDesc}>
                                                {step.description}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right Column: Interactive Graphic Illustrative Card */}
                    <div className={styles.graphicCard}>
                        {tab === 'candidate' ? (
                            <svg viewBox="0 0 500 380" className={styles.graphicImage}>
                                {/* Candidate Job Search Vector Graphic */}
                                <rect x="50" y="40" width="400" height="240" rx="16" fill="#ffffff" stroke="#93c5fd" strokeWidth="4" />
                                <circle cx="75" cy="65" r="5" fill="#ef4444" />
                                <circle cx="90" cy="65" r="5" fill="#f59e0b" />
                                <circle cx="105" cy="65" r="5" fill="#10b981" />

                                {/* Search Bar */}
                                <rect x="140" y="52" width="220" height="26" rx="13" fill="#eff6ff" stroke="#3b82f6" strokeWidth="2" />
                                <text x="160" y="70" fill="#2563eb" fontSize="13" fontWeight="bold">Shark Edutech Jobs</text>

                                {/* Job Badges */}
                                <rect x="80" y="110" width="80" height="32" rx="8" fill="#3b82f6" />
                                <text x="96" y="131" fill="#ffffff" fontSize="14" fontWeight="bold">JOB</text>

                                <rect x="330" y="110" width="80" height="32" rx="8" fill="#3b82f6" />
                                <text x="346" y="131" fill="#ffffff" fontSize="14" fontWeight="bold">JOB</text>

                                <rect x="230" y="80" width="80" height="32" rx="8" fill="#3b82f6" />
                                <text x="246" y="101" fill="#ffffff" fontSize="14" fontWeight="bold">JOB</text>

                                {/* Magnifying Glass */}
                                <circle cx="200" cy="220" r="45" fill="none" stroke="#1e3a8a" strokeWidth="12" />
                                <line x1="170" y1="250" x2="110" y2="310" stroke="#1e3a8a" strokeWidth="16" strokeLinecap="round" />

                                {/* Person with Laptop */}
                                <ellipse cx="380" cy="310" rx="60" ry="8" fill="#cbd5e1" />
                                <rect x="335" y="240" width="70" height="60" fill="#1d4ed8" rx="8" />
                                <circle cx="370" cy="210" r="18" fill="#f87171" />
                                <path d="M330" y1="270" x2="310" y2="280" stroke="#3b82f6" strokeWidth="6" />
                                <rect x="300" y="278" width="60" height="5" fill="#3b82f6" rx="2" />
                            </svg>
                        ) : (
                            <svg viewBox="0 0 500 380" className={styles.graphicImage}>
                                {/* Employer Hiring Vector Graphic */}
                                <rect x="140" y="40" width="280" height="34" rx="17" fill="#ffffff" stroke="#2563eb" strokeWidth="3" />
                                <text x="165" y="63" fill="#1e3a8a" fontSize="15" fontWeight="bold">Shark Edutech Employer</text>
                                <circle cx="395" cy="57" r="12" fill="#2563eb" />

                                {/* 3D Icon Grid */}
                                <rect x="60" y="110" width="120" height="110" rx="16" fill="#2563eb" />
                                {/* Gear vector */}
                                <circle cx="120" cy="165" r="28" fill="none" stroke="#ffffff" strokeWidth="6" strokeDasharray="8 6" />

                                <rect x="200" y="110" width="90" height="80" rx="16" fill="#fbbf24" />
                                <path d="M245 130 l15 20 h-30 z" fill="#ffffff" />

                                <rect x="200" y="200" width="90" height="80" rx="16" fill="#f97316" />
                                <circle cx="235" cy="235" r="10" fill="#ffffff" />
                                <circle cx="255" cy="245" r="8" fill="#ffffff" />

                                {/* Employer Lady User */}
                                <ellipse cx="370" cy="330" rx="60" ry="8" fill="#cbd5e1" />
                                <path d="M350 215 c10-15 30-15 40 0 v115 h-40 z" fill="#1e293b" />
                                <circle cx="370" cy="185" r="16" fill="#f87171" />
                                <path d="M370 170 c-10 0-18 8-18 18 v10 h36 v-10 c0-10-8-18-18-18 z" fill="#0f172a" />
                            </svg>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
