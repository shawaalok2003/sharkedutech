import React from "react";
import Link from "next/link";
import styles from "./About.module.css";
import { Footer } from "@/components/layout/Footer";
import { HeroGalleryCarousel } from "./HeroGalleryCarousel";

export const metadata = {
    title: "About Us | Shark International Edutech",
    description: "Learn about Shark International Edutech Pvt. Ltd. (Shark Edutech) - India's first dedicated hospitality job portal and career building platform.",
};

export default function AboutPage() {
    return (
        <div className={styles.pageWrapper}>
            <main className={styles.main}>
                {/* Hero Section - Elite Dark Styling */}
                <section className={styles.heroSection}>
                    <div className={styles.heroContainer}>
                        <div className={styles.heroGrid}>
                            {/* Left Text Card */}
                            <div className={styles.heroCard}>
                                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#fed488', textTransform: 'uppercase', letterSpacing: '0.1em', background: 'rgba(254, 212, 136, 0.12)', border: '1px solid rgba(254, 212, 136, 0.3)', padding: '0.35rem 0.9rem', borderRadius: '999px', display: 'inline-block', marginBottom: '1.25rem' }}>
                                    ✨ Shark International Edutech Pvt. Ltd.
                                </span>
                                <h1 className={styles.headlineXl} style={{ color: '#ffffff', marginBottom: '1rem', fontSize: '2.45rem', lineHeight: '1.25' }}>
                                    At SHARK, We Don't Just Provide Jobs — We Build Careers.
                                </h1>
                                <p className={styles.headlineMd} style={{ color: '#93c5fd', marginBottom: '1.25rem', fontWeight: 600, fontSize: '1.15rem' }}>
                                    India's First Dedicated Hospitality Job Portal &amp; Career Platform
                                </p>
                                <p className={styles.bodyLg} style={{ color: '#cbd5e1', fontSize: '1rem', lineHeight: '1.7', marginBottom: '2rem' }}>
                                    Shark International Edutech Pvt. Ltd., operating under the brand name <strong>Shark Edutech</strong>, is a dynamic educational technology company established with the mission of creating seamless career opportunities in the hospitality industry across India and globally.
                                </p>
                                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                    <Link href="/jobs" className={styles.ctaBtn} style={{ padding: '0.85rem 1.85rem', fontSize: '0.95rem' }}>
                                        Explore Opportunities →
                                    </Link>
                                    <Link href="/gallery" className={styles.dualBtn} style={{ border: '1.5px solid rgba(255, 255, 255, 0.35)', color: '#ffffff', background: 'rgba(255, 255, 255, 0.08)', padding: '0.85rem 1.6rem', fontSize: '0.95rem' }}>
                                        View Full Gallery 📸
                                    </Link>
                                </div>
                            </div>

                            {/* Right Moving Gallery Carousel */}
                            <HeroGalleryCarousel />
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
                                        About SHARK Edutech
                                    </h2>
                                </div>
                                <p className={styles.bodyMd} style={{ color: '#475569', fontSize: '1.05rem', lineHeight: '1.7', marginBottom: '1rem' }}>
                                    Shark International Edutech Private Limited is an innovative educational technology company designed exclusively for hotel management and hospitality professionals.
                                </p>
                                <p className={styles.bodyMd} style={{ color: '#475569', fontSize: '1.05rem', lineHeight: '1.7' }}>
                                    Our platform directly connects aspiring candidates with <strong>400+ star-category hotels</strong>, supported by signed MoUs with renowned hospitality chains nationwide to ensure financial self-reliance and global employment.
                                </p>
                            </div>

                            {/* Our Mission & Vision */}
                            <div className={styles.missionCard}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                                    <div className={styles.iconWrapper}>
                                        <svg className={styles.iconSvg} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                    <h2 className={styles.headlineLg} style={{ color: '#ffffff', margin: 0 }}>
                                        Our Mission &amp; Vision
                                    </h2>
                                </div>
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <h4 style={{ color: '#fed488', fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem', fontWeight: 800 }}>Our Mission</h4>
                                    <p className={styles.bodyMd} style={{ color: '#f8fafc', fontSize: '1.05rem', lineHeight: '1.6' }}>
                                        To provide quality educational solutions, skill development, and career opportunities—especially for aspiring candidates—ensuring successful hospitality careers through comprehensive training and post-course job placements.
                                    </p>
                                </div>
                                <div>
                                    <h4 style={{ color: '#fed488', fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem', fontWeight: 800 }}>Our Vision</h4>
                                    <p className={styles.bodyMd} style={{ color: '#f8fafc', fontSize: '1.05rem', lineHeight: '1.6' }}>
                                        We strive to reduce unemployment by equipping candidates with practical skills for financially secure futures, offering global employment opportunities in star-rated properties across India and international markets.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Why Choose SHARK? (5 Pillars Bento Grid) */}
                <section className={styles.sectionPadding}>
                    <div className={styles.container}>
                        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                            <h2 className={styles.headlineLg} style={{ color: '#001736', marginBottom: '0.75rem' }}>
                                Why Choose SHARK?
                            </h2>
                            <p className={styles.bodyMd} style={{ color: '#64748b', maxWidth: '650px', margin: '0 auto', fontSize: '1.1rem' }}>
                                Dedicated features built exclusively for hospitality professionals and hotel management candidates.
                            </p>
                        </div>

                        <div className={styles.bentoGrid}>
                            {/* Pillar 1 */}
                            <div className={`${styles.bentoCard1} ${styles.bentoSpan2}`}>
                                <div className={styles.iconWrapper} style={{ background: '#eff6ff', color: '#1d4ed8', marginBottom: '1rem' }}>
                                    <svg className={styles.iconSvg} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                </div>
                                <h3 className={styles.headlineMd} style={{ color: '#001736', marginBottom: '0.5rem' }}>Free Enrollment for Students</h3>
                                <p className={styles.bodyMd} style={{ color: '#475569' }}>
                                    Every hotel management candidate can register at no cost to access genuine placement opportunities, industrial training, and career guidance.
                                </p>
                            </div>

                            {/* Pillar 2 */}
                            <div className={styles.bentoCard2}>
                                <div className={styles.iconWrapper} style={{ background: 'rgba(255,255,255,0.15)', color: '#93c5fd', marginBottom: '1rem' }}>
                                    <svg className={styles.iconSvg} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 1321 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h3 className={styles.headlineMd} style={{ color: '#ffffff', marginBottom: '0.5rem' }}>Pan-India Job Listings</h3>
                                <p className={styles.bodyMd} style={{ color: '#93c5fd' }}>
                                    Verified job requirements from 4-star and 5-star hotels across India, ensuring you find the right fit for your career progression.
                                </p>
                            </div>

                            {/* Pillar 3 */}
                            <div className={styles.bentoCard3}>
                                <div className={styles.iconWrapper} style={{ background: '#fef3c7', color: '#d97706', marginBottom: '1rem' }}>
                                    <svg className={styles.iconSvg} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h3 className={styles.headlineMd} style={{ color: '#1e293b', marginBottom: '0.5rem' }}>Hassle-Free Portal</h3>
                                <p className={styles.bodyMd} style={{ color: '#475569' }}>
                                    Simple, intuitive, and dedicated job portal tailored specifically for the hospitality sector without unnecessary clutter.
                                </p>
                            </div>

                            {/* Pillar 4 */}
                            <div className={`${styles.bentoCard4} ${styles.bentoSpan2}`}>
                                <div className={styles.iconWrapper} style={{ background: '#f0fdf4', color: '#16a34a', width: '56px', height: '56px' }}>
                                    <svg className={styles.iconSvg} fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: '30px', height: '30px' }}>
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className={styles.headlineMd} style={{ color: '#001736', marginBottom: '0.5rem' }}>Lifetime Placement Support</h3>
                                    <p className={styles.bodyMd} style={{ color: '#475569' }}>
                                        Once registered with SHARK, you remain part of our placement network for life. Whether it is your first job or a career change years later, SHARK stands by you.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Lifetime Post-Education Support Through SHARK */}
                <section className={`${styles.sectionPadding} ${styles.whoWeAreBg}`}>
                    <div className={styles.container}>
                        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                            <span style={{ color: '#001736', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', background: '#ffffff', padding: '0.3rem 0.8rem', borderRadius: '999px', border: '1px solid #cbd5e1' }}>
                                Continuous Growth
                            </span>
                            <h2 className={styles.headlineLg} style={{ color: '#001736', marginTop: '0.75rem', marginBottom: '0.75rem' }}>
                                Lifetime Post-Education Support Through SHARK
                            </h2>
                            <p className={styles.bodyMd} style={{ color: '#64748b', maxWidth: '650px', margin: '0 auto', fontSize: '1.1rem' }}>
                                We ensure long-term career stability and continuous professional enhancement.
                            </p>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                            <div style={{ background: '#ffffff', padding: '2rem', borderRadius: '1.25rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                                <div style={{ fontSize: '1.8rem', marginBottom: '0.75rem' }}>🌐</div>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#001736', marginBottom: '0.5rem' }}>India's 1st Hospitality Portal</h3>
                                <p style={{ fontSize: '0.95rem', color: '#64748b', lineHeight: 1.6 }}>
                                    Dedicated exclusively to hotel management talent at <strong>sharkedutech.com</strong>.
                                </p>
                            </div>

                            <div style={{ background: '#ffffff', padding: '2rem', borderRadius: '1.25rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                                <div style={{ fontSize: '1.8rem', marginBottom: '0.75rem' }}>🔔</div>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#001736', marginBottom: '0.5rem' }}>Exclusive Job Alerts</h3>
                                <p style={{ fontSize: '0.95rem', color: '#64748b', lineHeight: 1.6 }}>
                                    Direct access to active openings in 4-star and 5-star properties across India &amp; abroad.
                                </p>
                            </div>

                            <div style={{ background: '#ffffff', padding: '2rem', borderRadius: '1.25rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                                <div style={{ fontSize: '1.8rem', marginBottom: '0.75rem' }}>🎓</div>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#001736', marginBottom: '0.5rem' }}>Skill Upgrade Programs</h3>
                                <p style={{ fontSize: '0.95rem', color: '#64748b', lineHeight: 1.6 }}>
                                    Short-term workshops, culinary/bar masterclasses, and professional certifications.
                                </p>
                            </div>

                            <div style={{ background: '#ffffff', padding: '2rem', borderRadius: '1.25rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                                <div style={{ fontSize: '1.8rem', marginBottom: '0.75rem' }}>👥</div>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#001736', marginBottom: '0.5rem' }}>Alumni Network</h3>
                                <p style={{ fontSize: '0.95rem', color: '#64748b', lineHeight: 1.6 }}>
                                    Connect with former graduates and candidates working across global luxury hotel chains.
                                </p>
                            </div>

                            <div style={{ background: '#ffffff', padding: '2rem', borderRadius: '1.25rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                                <div style={{ fontSize: '1.8rem', marginBottom: '0.75rem' }}>🧭</div>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#001736', marginBottom: '0.5rem' }}>Guidance &amp; Mentorship</h3>
                                <p style={{ fontSize: '0.95rem', color: '#64748b', lineHeight: 1.6 }}>
                                    Expert career counseling, professional resume building, and mock interview prep.
                                </p>
                            </div>

                            <div style={{ background: '#ffffff', padding: '2rem', borderRadius: '1.25rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                                <div style={{ fontSize: '1.8rem', marginBottom: '0.75rem' }}>🏥</div>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#001736', marginBottom: '0.5rem' }}>0% Interest Loan &amp; Insurance</h3>
                                <p style={{ fontSize: '0.95rem', color: '#64748b', lineHeight: 1.6 }}>
                                    Education loan support with 0% interest and health insurance across hospitals nationwide.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Build Your Career in Hotel General Operations */}
                <section className={styles.sectionPadding}>
                    <div className={styles.container}>
                        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                            <h2 className={styles.headlineLg} style={{ color: '#001736', marginBottom: '0.75rem' }}>
                                Build Your Career in Hotel General Operations
                            </h2>
                            <p className={styles.bodyMd} style={{ color: '#64748b', maxWidth: '650px', margin: '0 auto', fontSize: '1.1rem' }}>
                                Structured career pathways across the four core operational departments of luxury hospitality.
                            </p>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
                            {/* F&B Service */}
                            <div style={{ background: '#ffffff', padding: '2.25rem', borderRadius: '1.25rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                                    <span style={{ fontSize: '1.6rem' }}>🍸</span>
                                    <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#001736', margin: 0 }}>Food &amp; Beverage Service</h3>
                                </div>
                                <p style={{ fontSize: '0.95rem', color: '#64748b', marginBottom: '1.25rem' }}>
                                    Responsible for guest dining experiences, restaurant operations, bars, banquets, and service excellence.
                                </p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                                    {['F&B Manager', 'Restaurant Manager', 'Bar Manager', 'Nightclub Manager', 'Banquet Manager', 'Catering Manager', 'Venue Coordinator', 'Maitre D\'Hotel'].map((role, i) => (
                                        <span key={i} style={{ padding: '0.25rem 0.65rem', background: '#f1f5f9', color: '#001736', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600 }}>
                                            {role}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* F&B Production */}
                            <div style={{ background: '#ffffff', padding: '2.25rem', borderRadius: '1.25rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                                    <span style={{ fontSize: '1.6rem' }}>👨‍🍳</span>
                                    <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#001736', margin: 0 }}>Food &amp; Beverage Production</h3>
                                </div>
                                <p style={{ fontSize: '0.95rem', color: '#64748b', marginBottom: '1.25rem' }}>
                                    Responsible for kitchen operations, culinary creation, food preparation, menu planning, and pastry arts.
                                </p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                                    {['Commis Chef', 'Chef de Partie (CDP)', 'Sous Chef', 'Executive Chef', 'Corporate Chef', 'Production Manager (Kitchen)'].map((role, i) => (
                                        <span key={i} style={{ padding: '0.25rem 0.65rem', background: '#f1f5f9', color: '#001736', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600 }}>
                                            {role}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Front Office */}
                            <div style={{ background: '#ffffff', padding: '2.25rem', borderRadius: '1.25rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                                    <span style={{ fontSize: '1.6rem' }}>🏨</span>
                                    <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#001736', margin: 0 }}>Front Office Department</h3>
                                </div>
                                <p style={{ fontSize: '0.95rem', color: '#64748b', marginBottom: '1.25rem' }}>
                                    The face of the hotel. Responsible for guest reception, reservations, concierge, and guest coordination.
                                </p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                                    {['Front Office Executive', 'Guest Relations Executive', 'Lobby Manager', 'Duty Manager', 'Front Office Manager', 'Reservations Manager'].map((role, i) => (
                                        <span key={i} style={{ padding: '0.25rem 0.65rem', background: '#f1f5f9', color: '#001736', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600 }}>
                                            {role}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Housekeeping */}
                            <div style={{ background: '#ffffff', padding: '2.25rem', borderRadius: '1.25rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                                    <span style={{ fontSize: '1.6rem' }}>🧹</span>
                                    <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#001736', margin: 0 }}>Housekeeping Department</h3>
                                </div>
                                <p style={{ fontSize: '0.95rem', color: '#64748b', marginBottom: '1.25rem' }}>
                                    Ensures cleanliness, hygiene, room maintenance, decor, and overall aesthetic standards of the hotel.
                                </p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                                    {['Room Attendant', 'Housekeeping Supervisor', 'Floor Supervisor', 'Executive Housekeeper', 'Rooms Division Manager', 'Director of Operations'].map((role, i) => (
                                        <span key={i} style={{ padding: '0.25rem 0.65rem', background: '#f1f5f9', color: '#001736', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600 }}>
                                            {role}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Dual Path Section (Job Seekers vs Employers) */}
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
                                        Discover verified roles that match your ambition and expertise in 400+ top-tier hotel chains across India.
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
                                    <h3 className={styles.headlineLg} style={{ color: '#ffffff', marginBottom: '0.75rem', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>For Employers &amp; Hotels</h3>
                                    <p className={styles.bodyMd} style={{ color: '#f1f5f9', marginBottom: '1.5rem', fontSize: '1.05rem', textShadow: '0 1px 5px rgba(0,0,0,0.5)' }}>
                                        Connect with trained, vetted hospitality professionals ready to elevate your service standards.
                                    </p>
                                    <Link href="/auth/signup?type=employer" className={styles.dualBtn}>
                                        Post an Opportunity →
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Director's Message */}
                <section className={styles.sectionPadding}>
                    <div className={styles.container}>
                        <div className={styles.whoGrid}>
                            <img 
                                alt="Mr. Maminul Akanda - Founder & CEO of SHARK Edutech" 
                                className={styles.directorImg} 
                                src="/uploads/image.png"
                            />

                            <div className={styles.directorCard}>
                                <span style={{ color: '#001736', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', background: '#f1f5f9', padding: '0.35rem 0.8rem', borderRadius: '999px', display: 'inline-block', marginBottom: '1rem' }}>
                                    Leadership Vision
                                </span>
                                <h2 className={styles.headlineLg} style={{ color: '#001736', marginBottom: '1.25rem' }}>
                                    Message from CEO &amp; Founder
                                </h2>
                                <div style={{ position: 'relative' }}>
                                    <p className={styles.bodyLg} style={{ fontStyle: 'italic', color: '#334155', marginBottom: '1.5rem', fontSize: '1.1rem', lineHeight: '1.7' }}>
                                        "Success is not given — it is earned with passion, perseverance, and purpose. At SHARK, we are committed to nurturing globally competent hospitality professionals through practical exposure, disciplined training, and industry-integrated learning."
                                    </p>
                                    <p className={styles.bodyMd} style={{ color: '#475569', marginBottom: '2rem', lineHeight: '1.6' }}>
                                        We encourage every candidate to dream boldly, work relentlessly, and uphold integrity in every endeavor. Our mission is to shape confident individuals prepared for long-term leadership in the global hospitality arena.
                                    </p>
                                </div>
                                <p className={styles.headlineMd} style={{ color: '#001736', marginBottom: '0.25rem' }}>Mr. Maminul Akanda</p>
                                <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Managing Director &amp; CEO, Shark Edutech</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Corporate Address & Contact Info */}
                <section className={styles.sectionPadding} style={{ backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
                    <div className={styles.container}>
                        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                            <h2 className={styles.headlineLg} style={{ color: '#001736', marginBottom: '0.5rem' }}>Corporate Office</h2>
                            <p style={{ color: '#64748b', fontSize: '1.05rem' }}>Get in touch with Shark International Edutech Private Limited.</p>
                        </div>

                        <div style={{ maxWidth: '44rem', margin: '0 auto', background: '#ffffff', padding: '2.5rem', borderRadius: '1.25rem', border: '1px solid #e2e8f0', boxShadow: '0 10px 30px rgba(0,0,0,0.04)' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
                                <div>
                                    <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Company Registered Name</h4>
                                    <p style={{ fontWeight: 700, color: '#001736', fontSize: '1.05rem', margin: 0 }}>Shark International Edutech Pvt. Ltd.</p>
                                </div>

                                <div>
                                    <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Official Website</h4>
                                    <a href="https://www.sharkedutech.com" target="_blank" rel="noreferrer" style={{ fontWeight: 700, color: '#2563eb', fontSize: '1.05rem', textDecoration: 'none' }}>
                                        www.sharkedutech.com
                                    </a>
                                </div>

                                <div>
                                    <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Contact Email &amp; Phone</h4>
                                    <p style={{ fontWeight: 600, color: '#334155', margin: '0 0 0.25rem 0' }}>✉️ info@sharkedutech.com</p>
                                    <p style={{ fontWeight: 600, color: '#334155', margin: 0 }}>📞 +91 91473 31167</p>
                                </div>

                                <div>
                                    <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Corporate Address</h4>
                                    <p style={{ fontWeight: 600, color: '#334155', fontSize: '0.95rem', margin: 0, lineHeight: 1.5 }}>
                                        Lokenath Park (Atghora), Near Chinarpark, Behind Aminia Restaurant, Kolkata - 700157
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className={styles.finalCta}>
                    <div style={{ maxWidth: '48rem', margin: '0 auto' }}>
                        <h2 className={styles.headlineXl} style={{ marginBottom: '1.5rem', color: '#ffffff' }}>
                            Elevate your hospitality career with Shark Edutech.
                        </h2>
                        <p className={styles.headlineMd} style={{ color: '#ffdea5', fontStyle: 'italic', fontWeight: 300, marginBottom: '2.5rem' }}>
                            Where Talent Meets Unlimited Opportunity!
                        </p>
                        <Link href="/auth/signup" className={styles.ctaBtn}>
                            Register for Free Today
                        </Link>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
