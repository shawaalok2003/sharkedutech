"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import styles from "./HotelDetailModal.module.css";
import { HotelPartner } from "@/data/hotelPartnersData";

interface HotelDetailModalProps {
    partner: HotelPartner;
    onClose: () => void;
}

export const HotelDetailModal: React.FC<HotelDetailModalProps> = ({ partner, onClose }) => {
    // Prevent scrolling when modal is open
    useEffect(() => {
        document.body.style.overflow = "hidden";
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            document.body.style.overflow = "";
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [onClose]);

    const jobsQuery = encodeURIComponent(partner.name);

    return (
        <div className={styles.backdrop} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className={styles.header}>
                    <div className={styles.headerBackgroundDecoration} />
                    <button className={styles.closeBtn} onClick={onClose} aria-label="Close modal">
                        &times;
                    </button>
                    
                    <div className={styles.brandInfoRow}>
                        <div className={styles.logoContainer}>
                            <img 
                                src={`/HOTEL LOGOS-20260501T173926Z-3-001/HOTEL LOGOS/${partner.logoFilename}`} 
                                alt={partner.name}
                                className={styles.logoImg}
                            />
                        </div>
                        <div className={styles.headerTitleSection}>
                            <h2 className={styles.brandName}>{partner.name}</h2>
                            <div className={styles.badgeRow}>
                                <span className={styles.categoryBadge}>🏷️ {partner.category}</span>
                                <span className={styles.ratingBadge}>★ {partner.rating}</span>
                                <span className={styles.categoryBadge}>🤝 Shark Edutech Hiring Partner</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Body Content */}
                <div className={styles.body}>
                    {/* Brand Overview */}
                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}>
                            <span>🏨</span> About {partner.name}
                        </h3>
                        <p className={styles.overviewText}>{partner.overview}</p>

                        <div style={{ marginTop: '1.25rem' }}>
                            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
                                📍 Key Presence & Locations:
                            </div>
                            <div className={styles.locationPills}>
                                {partner.locations.map((loc, i) => (
                                    <span key={i} className={styles.locationPill}>
                                        📍 {loc}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* 2-Column: Key Benefits & Requirements */}
                    <div className={styles.gridTwoCol}>
                        <div className={styles.section}>
                            <h3 className={styles.sectionTitle}>
                                <span>⭐</span> Workplace Benefits
                            </h3>
                            <ul className={styles.benefitsList}>
                                {partner.keyBenefits.map((benefit, idx) => (
                                    <li key={idx} className={styles.benefitItem}>
                                        <span className={styles.checkIcon}>✓</span>
                                        <span>{benefit}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className={styles.section}>
                            <h3 className={styles.sectionTitle}>
                                <span>📋</span> Candidate Requirements
                            </h3>
                            <ul className={styles.requirementsList}>
                                {partner.requirements.map((req, idx) => (
                                    <li key={idx} className={styles.requirementItem}>
                                        <span className={styles.bulletIcon}>•</span>
                                        <span>{req}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Active Hiring Roles */}
                    <div className={styles.section} style={{ marginBottom: 0 }}>
                        <h3 className={styles.sectionTitle}>
                            <span>💼</span> Active Hiring Roles ({partner.activeJobs.length} Positions Available)
                        </h3>
                        <div>
                            {partner.activeJobs.map((job, idx) => (
                                <div key={idx} className={styles.jobCard}>
                                    <div>
                                        <div className={styles.jobTitle}>{job.title}</div>
                                        <div className={styles.jobMeta}>
                                            <span>📂 {job.department}</span>
                                            <span>📍 {job.location}</span>
                                            <span>💰 {job.salary}</span>
                                            <span>🎓 {job.experience}</span>
                                        </div>
                                    </div>
                                    <Link 
                                        href={`/jobs?search=${jobsQuery}`}
                                        className={styles.applyJobBtn}
                                        onClick={onClose}
                                    >
                                        Apply Now →
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className={styles.footer}>
                    <button className={styles.secondaryBtn} onClick={onClose}>
                        Close
                    </button>
                    <Link 
                        href={`/jobs?search=${jobsQuery}`}
                        className={styles.mainActionBtn}
                        onClick={onClose}
                    >
                        <span>Explore All Jobs at {partner.name}</span>
                        <span>→</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};
