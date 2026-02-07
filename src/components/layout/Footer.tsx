import Link from 'next/link';
import styles from './Footer.module.css';

export function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.grid}>
                    <div>
                        <div className={styles.brand}>Sharkedutech</div>
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
                            <Link href="/admissions" className={styles.link}>Admissions</Link>
                            <Link href="/jobs" className={styles.link}>Job Portal</Link>
                            <Link href="/colleges" className={styles.link}>For Colleges</Link>
                            <Link href="/employers" className={styles.link}>For Employers</Link>
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
                            <Link href="/help" className={styles.link}>Help Center</Link>
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
