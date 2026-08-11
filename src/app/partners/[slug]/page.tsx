import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HOTEL_PARTNERS, getHotelPartnerData } from "@/data/hotelPartnersData";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import styles from "./page.module.css";

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

export default async function PartnerDetailPage({ params }: PageProps) {
    const { slug } = await params;
    
    // Decode or lookup partner
    let partner = HOTEL_PARTNERS[slug];
    
    if (!partner) {
        // Fallback to name search or format
        const formattedName = slug.replace(/-/g, ' ');
        partner = getHotelPartnerData(formattedName);
    }

    if (!partner) {
        notFound();
    }

    const jobsQuery = encodeURIComponent(partner.name);

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc' }}>
            <Navbar />

            <main style={{ flex: 1, paddingBottom: '4rem' }}>
                {/* Hero Header */}
                <div className={styles.heroHeader}>
                    <div className={styles.heroContainer}>
                        <Link href="/#partners" className={styles.backLink}>
                            ← Back to Industry Partners
                        </Link>

                        <div className={styles.heroContentRow}>
                            <div className={styles.logoCard}>
                                <img 
                                    src={`/HOTEL LOGOS-20260501T173926Z-3-001/HOTEL LOGOS/${partner.logoFilename}`} 
                                    alt={partner.name} 
                                    className={styles.logoImg}
                                />
                            </div>

                            <div className={styles.heroTextContent}>
                                <div className={styles.badgeRow}>
                                    <span className={styles.badge}>🏷️ {partner.category}</span>
                                    <span className={styles.starBadge}>★ {partner.rating}</span>
                                    <span className={styles.badge}>🤝 Hiring Partner</span>
                                </div>
                                <h1 className={styles.heroTitle}>{partner.name}</h1>
                                <p className={styles.heroSubtitle}>
                                    Shark Edutech Placement & Hiring Partner for Hospitality Excellence
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Details */}
                <div className={styles.container}>
                    <div className={styles.gridContainer}>
                        {/* Left Column: Details */}
                        <div className={styles.leftCol}>
                            <div className={styles.card}>
                                <h2 className={styles.cardTitle}>
                                    <span>🏨</span> Overview & Workplace Culture
                                </h2>
                                <p className={styles.overviewText}>{partner.overview}</p>

                                <h3 className={styles.subTitle}>📍 Active Locations Across India</h3>
                                <div className={styles.locationGrid}>
                                    {partner.locations.map((loc, idx) => (
                                        <div key={idx} className={styles.locationBox}>
                                            📍 {loc}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className={styles.card}>
                                <h2 className={styles.cardTitle}>
                                    <span>⭐</span> Employee Benefits & Growth Facilities
                                </h2>
                                <div className={styles.benefitsGrid}>
                                    {partner.keyBenefits.map((benefit, idx) => (
                                        <div key={idx} className={styles.benefitBox}>
                                            <span className={styles.check}>✓</span>
                                            <span>{benefit}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className={styles.card}>
                                <h2 className={styles.cardTitle}>
                                    <span>💼</span> Open Opportunities at {partner.name}
                                </h2>
                                <div>
                                    {partner.activeJobs.map((job, idx) => (
                                        <div key={idx} className={styles.jobRow}>
                                            <div>
                                                <h4 className={styles.jobTitle}>{job.title}</h4>
                                                <div className={styles.jobMeta}>
                                                    <span>📂 {job.department}</span>
                                                    <span>📍 {job.location}</span>
                                                    <span>💰 {job.salary}</span>
                                                    <span>🎓 {job.experience}</span>
                                                </div>
                                            </div>
                                            <Link href={`/jobs?search=${jobsQuery}`} className={styles.applyBtn}>
                                                Apply Now →
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Sidebar: Apply & Requirements */}
                        <div className={styles.rightCol}>
                            <div className={styles.sidebarCard}>
                                <h3 className={styles.sidebarTitle}>🚀 Ready to Join {partner.name}?</h3>
                                <p className={styles.sidebarText}>
                                    Apply now through Shark Edutech to get priority placement and direct interviews with recruitment managers.
                                </p>
                                <Link href={`/jobs?search=${jobsQuery}`} className={styles.mainCtaBtn}>
                                    Explore & Apply Now →
                                </Link>
                            </div>

                            <div className={styles.sidebarCard}>
                                <h3 className={styles.sidebarTitle}>📋 Eligibility Criteria</h3>
                                <ul className={styles.reqList}>
                                    {partner.requirements.map((req, idx) => (
                                        <li key={idx} className={styles.reqItem}>
                                            <span className={styles.bullet}>•</span>
                                            <span>{req}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
