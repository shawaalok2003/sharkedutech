"use client";

import styles from './JobCarousel.module.css';

export function JobCarousel({ jobs = [] }: { jobs?: any[] }) {
    return (
        <section className={styles.carouselSection}>
            <div className={styles.container}>
                <h2 className={styles.title}>Top Job Opportunities</h2>
                <div className={styles.carousel}>
                    {jobs.map((job) => (
                        <div key={job.id} className={styles.jobCard}>
                            <div className={styles.companyLogo}>
                                {job.logo || (job.title?.toLowerCase().includes('chef') ? '👨‍🍳' : 
                                             job.title?.toLowerCase().includes('front') ? '🏨' : 
                                             job.title?.toLowerCase().includes('house') ? '🧹' : '💼')}
                            </div>
                            <h3 className={styles.jobTitle}>{job.title}</h3>
                            <p className={styles.companyName}>{job.employer?.companyName || job.company || 'Hospitality Partner'}</p>
                            <div className={styles.tags}>
                                <span className={styles.tag}>📍 {job.location}</span>
                                <span className={styles.tag}>⏱️ {job.type}</span>
                            </div>
                            <button className={styles.applyBtn}>Apply Now</button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
