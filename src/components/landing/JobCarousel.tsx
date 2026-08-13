"use client";

import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import styles from './JobCarousel.module.css';

export function JobCarousel({ jobs = [] }: { jobs?: any[] }) {
    const router = useRouter();
    const carouselRef = useRef<HTMLDivElement>(null);

    const scrollLeft = () => {
        if (carouselRef.current) {
            carouselRef.current.scrollBy({ left: -420, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (carouselRef.current) {
            carouselRef.current.scrollBy({ left: 420, behavior: 'smooth' });
        }
    };

    // Filter to ensure ONLY poster opportunity jobs are displayed
    const posterJobs = jobs.filter(j => j && j.posterUrl);

    return (
        <section className={styles.carouselSection} id="opportunities">
            <div className={styles.container}>
                <div className={styles.headerRow}>
                    <h2 className={styles.title}>Explore Opportunities</h2>
                    <div className={styles.navControls}>
                        <button onClick={scrollLeft} className={styles.navBtn} aria-label="Previous Opportunities">←</button>
                        <button onClick={scrollRight} className={styles.navBtn} aria-label="Next Opportunities">→</button>
                    </div>
                </div>

                <div className={styles.carousel} ref={carouselRef}>
                    {posterJobs.map((job) => (
                        <div 
                            key={job.id} 
                            className={styles.opportunityCard}
                            onClick={() => router.push(`/jobs/apply/${job.id}`)}
                        >
                            <div className={styles.imageContainer}>
                                <img 
                                    src={job.posterUrl} 
                                    alt={job.title} 
                                    className={styles.posterImage}
                                />
                                
                                <div className={styles.gradientOverlay}></div>

                                <div className={styles.badgeTop}>
                                    <span className={styles.locationTag}>📍 {job.location}</span>
                                    <span className={styles.typeTag}>{job.type}</span>
                                </div>

                                <div className={styles.cardContent}>
                                    <h3 className={styles.cardTitle}>{job.title}</h3>
                                    <p className={styles.companySubtitle}>{job.companyName || 'Luxury Hospitality Partner'}</p>
                                    <p className={styles.cardSnippet}>
                                        {job.description ? (job.description.length > 80 ? job.description.substring(0, 80) + '...' : job.description) : 'Click to view full job requirements and apply.'}
                                    </p>
                                    <div className={styles.cardAction}>
                                        <span className={styles.applyLink}>Apply Now →</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
