import Link from 'next/link';
import styles from './WhoWeAreSection.module.css';

export function WhoWeAreSection() {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.grid}>
                    {/* Text Column */}
                    <div>
                        <span className={styles.badge}>WHO WE ARE</span>
                        <h2 className={styles.heading}>About Our Company</h2>
                        <p className={styles.description}>
                            <strong>Shark Edutech</strong> is India's dedicated hospitality recruitment and job placement platform built exclusively for hotels, resorts, luxury properties, and the professionals who power them. We are not a generic job portal. We are specialists. Every employer on our platform is verified. Every candidate profile is screened. Every placement is supported. Whether you're a hotel owner looking to build a world-class team, or a hospitality professional ready for your next career move — Shark Edutech is where the right people and the right opportunities come together.
                        </p>
                        
                        <div className={styles.highlightText}>
                            Trusted by 400+ Star Hotels &nbsp;|&nbsp; 15,000+ Candidates Placed &nbsp;|&nbsp; PAN India Network
                        </div>

                        <Link href="/about" className={styles.btn}>
                            Learn More
                        </Link>
                    </div>

                    {/* Image Column */}
                    <div className={styles.imageFrame}>
                        <img 
                            src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=1000&q=80" 
                            alt="Hospitality Professionals Team - Chefs, Front Desk & Management" 
                            className={styles.image}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
