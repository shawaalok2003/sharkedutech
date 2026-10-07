import Link from 'next/link';
import styles from './CareerMilestoneSection.module.css';

export function CareerMilestoneSection() {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.grid}>
                    {/* Image Column */}
                    <div className={styles.imageFrame}>
                        <img 
                            src="/hero/jw marriot goa.jpg" 
                            alt="JW Marriott Goa - 5-Star Luxury Resort Partner" 
                            className={styles.image}
                        />
                    </div>

                    {/* Content Column */}
                    <div>
                        <h2 className={styles.heading}>
                            Your Next Career Milestone is Just One Click Away!
                        </h2>
                        
                        <p className={styles.description}>
                            From luxury 5-star resorts to iconic fine-dining restaurants and global hotel chains, we have hundreds of active openings waiting for the right talent. Don't wait for the perfect role to find you—go find it in our live database.
                        </p>

                        <div className={styles.btnGroup}>
                            <Link href="/jobs" className={styles.primaryBtn}>
                                Explore All Vacancies &rarr;
                            </Link>

                            <Link href="/auth/signup?type=employer" className={styles.secondaryBtn}>
                                Post an Opportunity
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
