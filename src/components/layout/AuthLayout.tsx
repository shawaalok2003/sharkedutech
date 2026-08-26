"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import styles from "./AuthLayout.module.css";

interface AuthLayoutProps {
    title: string;
    subtitle: string;
    children: React.ReactNode;
}

const carouselSlides = [
    {
        url: "/images/auth-3d.png",
        badge: "🏆 100% Certified",
        title: "Excellence & Innovation",
        sub: "India's Premier Dedicated Hospitality Career Platform"
    },
    {
        url: encodeURI("/Ahmedabad/RENAISSANCE AHMDABAD MR. ROHIT BAJPAI (CLUSTER GM).jpeg"),
        badge: "✨ Top 5-Star Placement",
        title: "Renaissance Marriott Placements",
        sub: "Direct Recruitment & Executive Leadership Hiring"
    },
    {
        url: encodeURI("/Bengalore/CITRUS CLASSIC HOTEL/MR. ANISH KUMAR RANA (GM).jpeg"),
        badge: "🏨 Global Luxury Chains",
        title: "Citrus Classic Hotel Partnerships",
        sub: "Signed Industrial Training in 400+ Star Hotels"
    },
    {
        url: encodeURI("/Ahmedabad/FOUR POINT SHERATON MS. MEGHARANI PADHI (HR ASSOCIATE).jpg"),
        badge: "🌟 Professional Growth",
        title: "Four Points by Sheraton",
        sub: "Accelerate Your Hospitality Career Worldwide"
    },
    {
        url: encodeURI("/Ahmedabad/ITC GARDENIA MR. AKSHAY KAVRA (GM) MR. DHANANJAY KULKARNI (HEAD HR).jpeg"),
        badge: "👑 Executive Partnerships",
        title: "ITC Gardenia & Luxury Resorts",
        sub: "Connecting Talent with Top Industry Leaders"
    }
];

export function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
        }, 3500);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className={styles.pageContainer}>
            <div className={styles.authWrapper}>
                {/* Left Panel with Carousel */}
                <div className={styles.leftPanel}>
                    <div className={styles.leftBgGlow}></div>
                    <div className={styles.leftContent}>
                        {/* Brand Logo Pill */}
                        <Link href="/" className={styles.brandLogo}>
                            <Image 
                                src="/images/shark_edu_tech_logo-removebg-preview.png" 
                                alt="Shark Edutech Logo" 
                                width={240} 
                                height={64} 
                                style={{ objectFit: 'contain', display: 'block', maxHeight: '56px', width: 'auto' }} 
                                priority
                            />
                        </Link>

                        {/* Moving Gallery Photo Carousel */}
                        <div className={styles.carouselFrame}>
                            <div className={styles.carouselDots}>
                                {carouselSlides.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentSlide(idx)}
                                        className={`${styles.carouselDot} ${idx === currentSlide ? styles.carouselDotActive : ''}`}
                                        aria-label={`Slide ${idx + 1}`}
                                    />
                                ))}
                            </div>

                            {carouselSlides.map((slide, idx) => (
                                <div 
                                    key={idx} 
                                    className={`${styles.carouselSlide} ${idx === currentSlide ? styles.carouselSlideActive : ''}`}
                                >
                                    <img 
                                        src={slide.url} 
                                        alt={slide.title} 
                                        className={styles.carouselImg} 
                                    />
                                    <div className={styles.carouselOverlay}>
                                        <span className={styles.carouselBadge}>{slide.badge}</span>
                                        <h3 className={styles.carouselTitle}>{slide.title}</h3>
                                        <p className={styles.carouselSub}>{slide.sub}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Heading & Subheading */}
                        <div className={styles.leftTextGroup}>
                            <h2 className={styles.leftHeading}>
                                Empowering Your Hospitality Journey
                            </h2>
                            <p className={styles.leftSubheading}>
                                Access premier college admissions, verified internships, and luxury hotel placement programs worldwide.
                            </p>
                        </div>

                        {/* Features */}
                        <div className={styles.featureList}>
                            <div className={styles.featureItem}>
                                <span className={styles.featureIcon}>🎓</span>
                                <span>100% Verified Admissions &amp; Programs</span>
                            </div>
                            <div className={styles.featureItem}>
                                <span className={styles.featureIcon}>💼</span>
                                <span>Direct Placement in 5-Star Resorts</span>
                            </div>
                            <div className={styles.featureItem}>
                                <span className={styles.featureIcon}>🔒</span>
                                <span>Bank-Grade Encryption &amp; Privacy</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Form Panel */}
                <div className={styles.rightPanel}>
                    <div className={styles.formContainer}>
                        <div className={styles.formHeader}>
                            <h1 className={styles.formTitle}>{title}</h1>
                            <p className={styles.formSubtitle}>{subtitle}</p>
                        </div>

                        <div className={styles.formContent}>
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
