"use client";

import { useState } from 'react';
import styles from './HowItWorks.module.css';

const candidateSteps = [
    {
        number: 1,
        title: "Register an account",
        description: "Create an account and upload your updated resume.",
        image: "/images/3d_candidate.jpg",
        caption: "Step 1: Set up your 3D candidate profile & resume in under 60 seconds."
    },
    {
        number: 2,
        title: "Find your job",
        description: "Our advanced search filters allow you to narrow down your job search based on specific criteria.",
        image: "/images/3d_candidate.jpg",
        caption: "Step 2: Filter 400+ luxury hotel & resort vacancies nationwide."
    },
    {
        number: 3,
        title: "Apply for job",
        description: "Just simply click on Apply Now and you are done. The company will contact you.",
        image: "/images/3d_candidate.jpg",
        caption: "Step 3: Direct 5-star callbacks & interview requests."
    }
];

const collegeSteps = [
    {
        number: 1,
        title: "Register your College",
        description: "List your institute, upload campus photos, and showcase accredited hospitality programs.",
        image: "/images/3d_college.jpg",
        caption: "Step 1: Showcase your campus & AICTE/NCHMCT accredited programs."
    },
    {
        number: 2,
        title: "Publish Courses & Eligibility",
        description: "Define course fees, duration, batch timings, and admission eligibility criteria.",
        image: "/images/3d_college.jpg",
        caption: "Step 2: Publish Hotel Management Degree & Diploma programs."
    },
    {
        number: 3,
        title: "Receive Student Applications",
        description: "Track student inquiries, review admission documents, and issue enrollment letters.",
        image: "/images/3d_college.jpg",
        caption: "Step 3: Process admissions & enroll students in real-time."
    }
];

const employerSteps = [
    {
        number: 1,
        title: "Register your Company",
        description: "Create an employer profile and showcase your company details.",
        image: "/images/3d_employer.jpg",
        caption: "Step 1: Register your 5-star hotel, resort, or luxury dining brand."
    },
    {
        number: 2,
        title: "Post a job",
        description: "Create detailed job listings to attract the best hospitality talent in the industry.",
        image: "/images/3d_employer.jpg",
        caption: "Step 2: Post F&B, Culinary, Front Office & Management openings."
    },
    {
        number: 3,
        title: "Hire top talent",
        description: "Review applications and hire service-ready professionals.",
        image: "/images/3d_employer.jpg",
        caption: "Step 3: Shortlist pre-screened talent & hire service-ready staff."
    }
];

export function HowItWorks() {
    const [tab, setTab] = useState<'candidate' | 'college' | 'employer'>('candidate');
    const [activeStep, setActiveStep] = useState(1);

    const getSteps = () => {
        if (tab === 'candidate') return candidateSteps;
        if (tab === 'college') return collegeSteps;
        return employerSteps;
    };

    const steps = getSteps();
    const currentStepObj = steps.find(s => s.number === activeStep) || steps[0];

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                {/* Top 3-Pill Switcher */}
                <div className={styles.toggleContainer}>
                    <div className={styles.togglePill}>
                        <button
                            onClick={() => { setTab('candidate'); setActiveStep(1); }}
                            className={`${styles.toggleBtn} ${tab === 'candidate' ? styles.toggleBtnActive : ''}`}
                        >
                            For Candidate
                        </button>
                        <button
                            onClick={() => { setTab('college'); setActiveStep(1); }}
                            className={`${styles.toggleBtn} ${tab === 'college' ? styles.toggleBtnActive : ''}`}
                        >
                            For College
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
                            {tab === 'candidate' && (
                                <>That's How Shark Edutech Works for Candidate : <span className={styles.titleHighlight}>Find Your Hotel Job in 3 Steps</span></>
                            )}
                            {tab === 'college' && (
                                <>That's How Shark Edutech Works for College : <span className={styles.titleHighlight}>Enroll Students &amp; Manage Admissions in 3 Steps</span></>
                            )}
                            {tab === 'employer' && (
                                <>That's How Shark Edutech Works for Employer : <span className={styles.titleHighlight}>Build Your Team in 3 Simple Steps</span></>
                            )}
                        </h2>

                        <p className={styles.subtitle}>
                            {tab === 'candidate' && "At Shark Edutech, we connect you with world-class opportunities dedicated to elevating your hospitality career."}
                            {tab === 'college' && "At Shark Edutech, we empower hospitality institutes to showcase their courses, receive verified student applications, and streamline enrollment."}
                            {tab === 'employer' && "At Shark Edutech, we help you find top talent efficiently, ensuring your business grows with the right professionals who match your company culture."}
                        </p>

                        <div className={styles.stepper}>
                            {steps.map((step) => {
                                const isActive = step.number === activeStep;

                                return (
                                    <div 
                                        key={step.number} 
                                        className={styles.stepItem}
                                        onClick={() => setActiveStep(step.number)}
                                        onMouseEnter={() => setActiveStep(step.number)}
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

                    {/* Right Column: 3D Isometric Illustration Card */}
                    <div className={styles.graphicCard}>
                        <img 
                            key={`${tab}-${currentStepObj.number}`}
                            src={currentStepObj.image} 
                            alt={currentStepObj.title} 
                            className={styles.stepImage}
                        />
                        <div className={styles.imageOverlay}>
                            <span className={styles.imageStepBadge}>
                                STEP {currentStepObj.number} OF 3 &bull; 3D WORKFLOW
                            </span>
                            <div className={styles.imageTitle}>{currentStepObj.title}</div>
                            <div className={styles.imageCaption}>{currentStepObj.caption}</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
