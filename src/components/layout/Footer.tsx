import Link from 'next/link';
import Image from 'next/image';
import styles from './Footer.module.css';

export function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.grid}>
                    <div>
                        <div className={styles.brand} style={{ marginBottom: '1rem' }}>
                            <Image src="/images/shark_edu_tech_logo-removebg-preview.png" alt="Sharkedutech Logo" width={150} height={40} style={{ objectFit: 'contain' }} />
                        </div>
                        <p className={styles.description}>
                            The leading integrated platform for hospitality education and career advancement. Connecting talent with opportunity globally.
                        </p>
                        <div className={styles.socials}>
                            {['FB', 'LI', 'TW', 'IG'].map((icon) => (
                                <a key={icon} href="#" className={styles.socialIcon}>{icon}</a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className={styles.heading}>Platform</h4>
                        <div className={styles.links}>
                            <Link href="/admissions" className={styles.link}>Admissions Portal</Link>
                            <Link href="/jobs" className={styles.link}>Job Portal</Link>
                            <Link href="/list-your-college" className={styles.link}>List Your College</Link>
                            <Link href="/jobs/employer/post" className={styles.link}>Post a Job</Link>
                        </div>
                    </div>

                    <div>
                        <h4 className={styles.heading}>Company</h4>
                        <div className={styles.links}>
                            <Link href="/about" className={styles.link}>About Us</Link>
                            <Link href="/careers" className={styles.link}>Careers</Link>
                            <Link href="/blog" className={styles.link}>Blog</Link>
                            <Link href="/contact" className={styles.link}>Contact</Link>
                        </div>
                    </div>

                    <div>
                        <h4 className={styles.heading}>Support</h4>
                        <div className={styles.links}>
                            <Link href="/help-center" className={styles.link}>Help Center</Link>
                            <Link href="/refund-policy" className={styles.link}>Refund Policy</Link>
                            <Link href="/terms" className={styles.link}>Terms of Service</Link>
                            <Link href="/privacy" className={styles.link}>Privacy Policy</Link>
                        </div>
                    </div>
                </div>

                <div className={styles.bottom}>
                    <div>© 2026 Sharkedutech. All rights reserved.</div>
                    <div>Designed for Excellence</div>
                </div>
            </div>
        </footer>
    );
}
