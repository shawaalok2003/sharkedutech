"use client";

import Link from "next/link";
import styles from "./AuthLayout.module.css";

interface AuthLayoutProps {
    title: string;
    subtitle: string;
    children: React.ReactNode;
}

export function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
    return (
        <div className={styles.pageContainer}>
            <div className={styles.authWrapper}>
                {/* Left 3D Panel */}
                <div className={styles.leftPanel}>
                    <div className={styles.leftBgGlow}></div>
                    <div className={styles.leftContent}>
                        <Link href="/" className={styles.brandLogo}>
                            <span className={styles.logoBadge}>SHARK</span>
                            <span className={styles.logoText}>EDUTECH</span>
                        </Link>

                        <div className={styles.illustrationWrapper}>
                            <img 
                                src="/images/auth-3d.png" 
                                alt="Shark Edutech 3D Hospitality" 
                                className={styles.illustration3d} 
                            />
                        </div>

                        <div className={styles.leftTextGroup}>
                            <h2 className={styles.leftHeading}>
                                Empowering Your Hospitality Journey
                            </h2>
                            <p className={styles.leftSubheading}>
                                Access premier college admissions, verified internships, and luxury hotel placement programs worldwide.
                            </p>
                        </div>

                        <div className={styles.featureList}>
                            <div className={styles.featureItem}>
                                <span className={styles.featureIcon}>🎓</span>
                                <span>100% Verified Admissions & Programs</span>
                            </div>
                            <div className={styles.featureItem}>
                                <span className={styles.featureIcon}>💼</span>
                                <span>Direct Placement in 5-Star Resorts</span>
                            </div>
                            <div className={styles.featureItem}>
                                <span className={styles.featureIcon}>🔒</span>
                                <span>Bank-Grade Encryption & Privacy</span>
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
