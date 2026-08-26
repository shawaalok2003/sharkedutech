import Link from 'next/link';
import Image from 'next/image';
import styles from './Footer.module.css';

export function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.grid}>
                    {/* Brand & Contact Column */}
                    <div>
                        <Link href="/" className={styles.logoPill} title="Go to Shark Edutech Home">
                            <Image 
                                src="/images/shark_edu_tech_logo-removebg-preview.png" 
                                alt="Shark Edutech Logo" 
                                width={300} 
                                height={80} 
                                style={{ objectFit: 'contain', display: 'block', maxHeight: '80px', width: 'auto' }} 
                            />
                        </Link>
                        <p className={styles.description}>
                            India's premier integrated platform for hospitality education and career advancement. Connecting aspiring candidates with <strong>400+ star hotels</strong> nationwide.
                        </p>

                        <div className={styles.contactList}>
                            <a href="mailto:info@sharkedutech.com" className={styles.contactItem}>
                                ✉️ info@sharkedutech.com
                            </a>
                            <a href="tel:+919147331167" className={styles.contactItem}>
                                📞 +91 91473 31167
                            </a>
                            <span className={styles.contactItem}>
                                📍 Kolkata, India &bull; Pan-India Network
                            </span>
                        </div>

                        {/* Social Icons */}
                        <div className={styles.socials}>
                            {/* Facebook */}
                            <a href="#" className={styles.socialIcon} aria-label="Facebook">
                                <svg className={styles.socialSvg} viewBox="0 0 24 24">
                                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                                </svg>
                            </a>
                            {/* LinkedIn */}
                            <a href="#" className={styles.socialIcon} aria-label="LinkedIn">
                                <svg className={styles.socialSvg} viewBox="0 0 24 24">
                                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.64a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28z" />
                                </svg>
                            </a>
                            {/* Twitter / X */}
                            <a href="#" className={styles.socialIcon} aria-label="Twitter">
                                <svg className={styles.socialSvg} viewBox="0 0 24 24">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                            </a>
                            {/* Instagram */}
                            <a href="#" className={styles.socialIcon} aria-label="Instagram">
                                <svg className={styles.socialSvg} viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Platform Column */}
                    <div>
                        <h4 className={styles.heading}>Platform</h4>
                        <div className={styles.links}>
                            <Link href="/admissions" className={styles.link}>Admissions Portal</Link>
                            <Link href="/jobs" className={styles.link}>Job Portal</Link>
                            <Link href="/colleges" className={styles.link}>Colleges Directory</Link>
                            <Link href="/list-your-college" className={styles.link}>List Your College</Link>
                            <Link href="/jobs/employer/post" className={styles.link}>Post a Job</Link>
                        </div>
                    </div>

                    {/* Company Column */}
                    <div>
                        <h4 className={styles.heading}>Company</h4>
                        <div className={styles.links}>
                            <Link href="/about" className={styles.link}>About Us</Link>
                            <Link href="/gallery" className={styles.link}>Gallery</Link>
                            <Link href="/careers" className={styles.link}>Careers</Link>
                            <Link href="/blog" className={styles.link}>Blog &amp; News</Link>
                            <Link href="/contact" className={styles.link}>Contact Us</Link>
                        </div>
                    </div>

                    {/* Support Column */}
                    <div>
                        <h4 className={styles.heading}>Support &amp; Legal</h4>
                        <div className={styles.links}>
                            <Link href="/help-center" className={styles.link}>Help Center</Link>
                            <Link href="/refund-policy" className={styles.link}>Refund Policy</Link>
                            <Link href="/terms" className={styles.link}>Terms of Service</Link>
                            <Link href="/privacy" className={styles.link}>Privacy Policy</Link>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className={styles.bottom}>
                    <div className={styles.copyright}>
                        © <span className={styles.rightsTag}>2026</span> Sharkedutech. All rights reserved. &bull; Shark International Edutech Pvt. Ltd.
                    </div>
                    <div className={styles.designedTag}>
                        ✨ Designed for Hospitality Excellence
                    </div>
                </div>
            </div>
        </footer>
    );
}
