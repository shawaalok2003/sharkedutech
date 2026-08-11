import React from "react";
import Link from "next/link";
import styles from "./About.module.css";
import { Footer } from "@/components/layout/Footer";

export const metadata = {
    title: "About Us | Shark Edutech",
    description: "Learn about Shark Edutech - Architects of careers and builders of extraordinary hospitality teams globally.",
};

export default function AboutPage() {
    return (
        <div className={styles.pageWrapper}>
            <main className={styles.main}>
                {/* Hero Section */}
                <section className={styles.heroSection}>
                    <div className={styles.heroBg}>
                        <img 
                            alt="Luxury hospitality lobby" 
                            className={styles.heroBgImg} 
                            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1920&q=80"
                        />
                        <div className={styles.heroOverlay} />
                    </div>
                    
                    <div className={styles.heroContainer}>
                        <div className={`${styles.glassPanel} ${styles.heroCard}`}>
                            <h1 className={`${styles.headlineXl} ${styles.textGradientPrimary}`} style={{ marginBottom: '1.25rem' }}>
                                Welcome to Shark Edutech
                            </h1>
                            <p className={styles.headlineMd} style={{ color: '#1e293b', marginBottom: '1.5rem', fontWeight: 600 }}>
                                Your Gateway to Success in the Dynamic World of Hospitality!
                            </p>
                            <p className={styles.bodyLg} style={{ color: '#475569', fontSize: '1.15rem' }}>
                                We are more than just a platform; we are architects of careers and builders of extraordinary teams in the global hospitality sector.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Who We Are & Mission */}
                <section className={`${styles.sectionPadding} ${styles.whoWeAreBg}`}>
                    <div className={styles.container}>
                        <div className={styles.whoGrid}>
                            {/* Who We Are */}
                            <div className={styles.whoCard}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                                    <div className={styles.iconWrapper} style={{ background: '#eff6ff', color: '#1d4ed8' }}>
                                        <svg className={styles.iconSvg} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m3 0h1m-1-4h.01M9 16h.01M9 12h.01M9 8h.01M15 16h.01M15 12h.01M15 8h.01" />
                                        </svg>
                                    </div>
                                    <h2 className={styles.headlineLg} style={{ color: '#001736', margin: 0 }}>
                                        Who We Are
                                    </h2>
                                </div>
                                <p className={styles.bodyMd} style={{ color: '#475569', fontSize: '1.05rem', lineHeight: '1.7' }}>
                                    Shark Edutech is a passionate team of industry experts, technologists, and HR professionals. We share a common goal: to foster meaningful connections between top-tier talent and premier establishments across the globe.
                                </p>
                            </div>

                            {/* Our Mission */}
                            <div className={styles.missionCard}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                                    <div className={styles.iconWrapper}>
                                        <svg className={styles.iconSvg} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                    <h2 className={styles.headlineLg} style={{ color: '#ffffff', margin: 0 }}>
                                        Our Mission
                                    </h2>
                                </div>
                                <p className={styles.bodyMd} style={{ color: '#ffffff', fontSize: '1.2rem', fontWeight: 300, fontStyle: 'italic', lineHeight: '1.6' }}>
                                    "Bridging the gap between talented individuals and excellence-driven establishments."
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* What Sets Us Apart (Bento Grid) */}
                <section className={styles.sectionPadding}>
                    <div className={styles.container}>
                        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                            <h2 className={styles.headlineLg} style={{ color: '#001736', marginBottom: '0.75rem' }}>
                                What Sets Us Apart
                            </h2>
                            <p className={styles.bodyMd} style={{ color: '#64748b', maxWidth: '650px', margin: '0 auto', fontSize: '1.1rem' }}>
                                Our specialized approach ensures precision in matching talent with opportunity.
                            </p>
                        </div>

                        <div className={styles.bentoGrid}>
                            {/* Card 1 */}
                            <div className={`${styles.bentoCard1} ${styles.bentoSpan2}`}>
                                <div className={styles.iconWrapper} style={{ background: '#eff6ff', color: '#1d4ed8', marginBottom: '1rem' }}>
                                    <svg className={styles.iconSvg} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m3 0h1m-1-4h.01M9 16h.01M9 12h.01M9 8h.01M15 16h.01M15 12h.01M15 8h.01" />
                                    </svg>
                                </div>
                                <h3 className={styles.headlineMd} style={{ color: '#001736', marginBottom: '0.5rem' }}>Specialized Focus</h3>
                                <p className={styles.bodyMd} style={{ color: '#475569' }}>
                                    We are dedicated exclusively to Hotel Management and the broader hospitality industry, understanding the unique nuances and demands of this dynamic field.
                                </p>
                            </div>

                            {/* Card 2 */}
                            <div className={styles.bentoCard2}>
                                <div className={styles.iconWrapper} style={{ background: 'rgba(255,255,255,0.15)', color: '#93c5fd', marginBottom: '1rem' }}>
                                    <svg className={styles.iconSvg} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 1321 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h3 className={styles.headlineMd} style={{ color: '#ffffff', marginBottom: '0.5rem' }}>Comprehensive Listings</h3>
                                <p className={styles.bodyMd} style={{ color: '#93c5fd' }}>
                                    Access a curated selection of premium opportunities worldwide.
                                </p>
                            </div>

                            {/* Card 3 */}
                            <div className={styles.bentoCard3}>
                                <div className={styles.iconWrapper} style={{ background: '#fef3c7', color: '#d97706', marginBottom: '1rem' }}>
                                    <svg className={styles.iconSvg} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                                    </svg>
                                </div>
                                <h3 className={styles.headlineMd} style={{ color: '#1e293b', marginBottom: '0.5rem' }}>Intuitive Interface</h3>
                                <p className={styles.bodyMd} style={{ color: '#475569' }}>
                                    Our user-friendly platform streamlines the search process for both candidates and recruiters.
                                </p>
                            </div>

                            {/* Card 4 */}
                            <div className={`${styles.bentoCard4} ${styles.bentoSpan2}`}>
                                <div className={styles.iconWrapper} style={{ background: '#f0fdf4', color: '#16a34a', width: '56px', height: '56px' }}>
                                    <svg className={styles.iconSvg} fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: '30px', height: '30px' }}>
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className={styles.headlineMd} style={{ color: '#001736', marginBottom: '0.5rem' }}>Industry Insights</h3>
                                    <p className={styles.bodyMd} style={{ color: '#475569' }}>
                                        Stay ahead with data-driven trends and expert guidance tailored for hospitality professionals.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Dual Path Section */}
                <section className={`${styles.sectionPadding} ${styles.whoWeAreBg}`}>
                    <div className={styles.container}>
                        <div className={styles.dualGrid}>
                            {/* Job Seekers */}
                            <div className={styles.dualCard}>
                                <div 
                                    className={styles.dualCardBg}
                                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80')" }}
                                />
                                <div className={styles.dualGradient} />
                                <div className={styles.dualContent}>
                                    <h3 className={styles.headlineLg} style={{ color: '#ffffff', marginBottom: '0.75rem', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>For Job Seekers</h3>
                                    <p className={styles.bodyMd} style={{ color: '#f1f5f9', marginBottom: '1.5rem', fontSize: '1.05rem', textShadow: '0 1px 5px rgba(0,0,0,0.5)' }}>
                                        Discover roles that match your ambition and expertise in top-tier establishments.
                                    </p>
                                    <Link href="/jobs" className={styles.dualBtn}>
                                        Explore Jobs →
                                    </Link>
                                </div>
                            </div>

                            {/* Employers */}
                            <div className={styles.dualCard}>
                                <div 
                                    className={styles.dualCardBg}
                                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=800&q=80')" }}
                                />
                                <div className={styles.dualGradient} />
                                <div className={styles.dualContent}>
                                    <h3 className={styles.headlineLg} style={{ color: '#ffffff', marginBottom: '0.75rem', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>For Employers</h3>
                                    <p className={styles.bodyMd} style={{ color: '#f1f5f9', marginBottom: '1.5rem', fontSize: '1.05rem', textShadow: '0 1px 5px rgba(0,0,0,0.5)' }}>
                                        Connect with vetted, passionate professionals ready to elevate your service standards.
                                    </p>
                                    <Link href="/auth/signup?type=employer" className={styles.dualBtn}>
                                        Post an Opportunity →
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Director Message */}
                <section className={styles.sectionPadding}>
                    <div className={styles.container}>
                        <div className={styles.whoGrid}>
                            <img 
                                alt="Jameson Sterling - Managing Director" 
                                className={styles.directorImg} 
                                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80"
                            />

                            <div className={styles.directorCard}>
                                <h2 className={styles.headlineLg} style={{ color: '#001736', marginBottom: '1.5rem' }}>
                                    A Message from Our Director
                                </h2>
                                <div style={{ position: 'relative' }}>
                                    <p className={styles.bodyLg} style={{ fontStyle: 'italic', color: '#334155', marginBottom: '2rem', fontSize: '1.15rem', lineHeight: '1.7' }}>
                                        "Our vision is to redefine hospitality excellence by empowering the next generation of leaders. We don't just fill positions; we cultivate the human potential that drives the world's most prestigious establishments."
                                    </p>
                                </div>
                                <p className={styles.headlineMd} style={{ color: '#001736', marginBottom: '0.25rem' }}>Jameson Sterling</p>
                                <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Managing Director</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Team Section */}
                <section className={styles.sectionPadding} style={{ backgroundColor: '#f8fafc' }}>
                    <div className={styles.container}>
                        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                            <h2 className={styles.headlineLg} style={{ color: '#001736', marginBottom: '0.75rem' }}>Meet Our Team</h2>
                            <p className={styles.bodyMd} style={{ color: '#64748b', fontSize: '1.1rem' }}>The experts behind your hospitality success story.</p>
                        </div>

                        <div className={styles.teamGrid}>
                            {/* Team Member 1 */}
                            <div className={styles.teamCard}>
                                <img 
                                    alt="Elena Rodriguez" 
                                    className={styles.teamImg} 
                                    src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=600&q=80"
                                />
                                <h3 className={styles.headlineMd} style={{ color: '#001736', marginBottom: '0.25rem' }}>Elena Rodriguez</h3>
                                <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#d97706', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Hospitality Consultant</p>
                                <p className={styles.bodyMd} style={{ color: '#475569' }}>Expert in luxury service standards and operational efficiency.</p>
                            </div>

                            {/* Team Member 2 */}
                            <div className={styles.teamCard}>
                                <img 
                                    alt="Marcus Chen" 
                                    className={styles.teamImg} 
                                    src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80"
                                />
                                <h3 className={styles.headlineMd} style={{ color: '#001736', marginBottom: '0.25rem' }}>Marcus Chen</h3>
                                <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#d97706', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Head of Talent Acquisition</p>
                                <p className={styles.bodyMd} style={{ color: '#475569' }}>Connecting global talent with premier hospitality brands.</p>
                            </div>

                            {/* Team Member 3 */}
                            <div className={styles.teamCard}>
                                <img 
                                    alt="Sarah Jenkins" 
                                    className={styles.teamImg} 
                                    src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80"
                                />
                                <h3 className={styles.headlineMd} style={{ color: '#001736', marginBottom: '0.25rem' }}>Sarah Jenkins</h3>
                                <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#d97706', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Industry Liaison</p>
                                <p className={styles.bodyMd} style={{ color: '#475569' }}>Building strategic partnerships across the global hotel sector.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className={styles.finalCta}>
                    <div style={{ maxWidth: '48rem', margin: '0 auto' }}>
                        <h2 className={styles.headlineXl} style={{ marginBottom: '1.5rem', color: '#ffffff' }}>
                            Elevate your hospitality experience with Shark Edutech.
                        </h2>
                        <p className={styles.headlineMd} style={{ color: '#ffdea5', fontStyle: 'italic', fontWeight: 300, marginBottom: '2.5rem' }}>
                            Where Talent Meets Opportunity!
                        </p>
                        <Link href="/auth/signup" className={styles.ctaBtn}>
                            Get Started Today
                        </Link>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
