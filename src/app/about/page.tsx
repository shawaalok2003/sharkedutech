import Link from 'next/link';
import styles from './About.module.css';
import { Footer } from '@/components/layout/Footer';
export default function AboutPage() {
    return (
        <main className={styles.main}>

            <section className={styles.hero}>
                <div className={styles.container}>
                    <h1 className={styles.heroTitle}>About Us</h1>
                    <p className={styles.heroSubtitle}>
                        Welcome to Shark Edutech – Your Gateway to Success in the Dynamic World of Hospitality!
                    </p>
                </div>
            </section>

            <section className={styles.section}>
                <div className={styles.container}>
                    <div className={styles.grid}>
                        <div className={styles.content}>
                            <h2 className={styles.heading}>Who We Are</h2>
                            <p className={styles.text}>
                                At the core of Shark Edutech is a passionate team committed to fostering meaningful connections within the hospitality sector. We believe in the power of talent to elevate the guest experience and contribute to the overall success of hotels and resorts worldwide.
                            </p>
                        </div>
                        <div className={styles.content}>
                            <h2 className={styles.heading}>Our Mission</h2>
                            <p className={styles.text}>
                                Our mission is simple yet profound – to bridge the gap between talented individuals seeking rewarding careers in hotel management and establishments searching for the right expertise to enhance their operations. We are dedicated to facilitating mutually beneficial relationships that drive excellence within the industry.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className={styles.section} style={{ backgroundColor: '#fff' }}>
                <div className={styles.container}>
                    <h2 className={styles.heading} style={{ textAlign: 'center' }}>What Sets Us Apart</h2>
                    <div className={styles.cardGrid}>
                        <div className={styles.card}>
                            <div className={styles.cardIcon}>🎯</div>
                            <h3 className={styles.cardTitle}>Specialized Focus</h3>
                            <p className={styles.cardText}>
                                We exclusively cater to the field of hotel management, ensuring that our platform is finely tuned to the specific needs and requirements of the industry.
                            </p>
                        </div>
                        <div className={styles.card}>
                            <div className={styles.cardIcon}>📄</div>
                            <h3 className={styles.cardTitle}>Comprehensive Job Listings</h3>
                            <p className={styles.cardText}>
                                Explore a diverse range of job opportunities, from entry-level positions to executive roles, across various segments of hotel management.
                            </p>
                        </div>
                        <div className={styles.card}>
                            <div className={styles.cardIcon}>💻</div>
                            <h3 className={styles.cardTitle}>User-Friendly Interface</h3>
                            <p className={styles.cardText}>
                                Our intuitive and user-friendly platform makes job searching and talent recruitment a seamless experience for everyone.
                            </p>
                        </div>
                        <div className={styles.card}>
                            <div className={styles.cardIcon}>📊</div>
                            <h3 className={styles.cardTitle}>Industry Insights</h3>
                            <p className={styles.cardText}>
                                Stay informed about the latest trends, news, and developments through our regularly updated blog and resource section.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className={styles.section}>
                <div className={styles.container}>
                    <div className={styles.grid}>
                        <div className={styles.content}>
                            <h2 className={styles.heading}>For Job Seekers</h2>
                            <p className={styles.text}>
                                Embark on your career journey with confidence by browsing through a multitude of exciting job opportunities tailored to your skills and aspirations. Shark Edutech is your go-to destination for finding the perfect match.
                            </p>
                        </div>
                        <div className={styles.content}>
                            <h2 className={styles.heading}>For Employers</h2>
                            <p className={styles.text}>
                                Connect with a pool of talented and dedicated professionals to enhance the efficiency and reputation of your establishment. Streamline your recruitment process with our innovative features.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className={styles.cta}>
                <div className={styles.container}>
                    <h2 className={styles.ctaTitle}>Elevate your hospitality experience with Shark Edutech</h2>
                    <p className={styles.heroSubtitle} style={{ marginBottom: '3rem' }}>
                        Where Talent Meets Opportunity! Your dream career or ideal candidate is just a click away.
                    </p>
                    <Link href="/auth/register" className={styles.ctaButton}>
                        Join Shark Edutech Today
                    </Link>
                </div>
            </section>

            <Footer />
        </main>
    );
}
