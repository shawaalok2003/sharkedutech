"use client";

import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import styles from './JobCarousel.module.css';
import { formatJobDate } from '@/lib/dateUtils';

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
        <section className={styles.carouselSection} id="current-openings">
            <div className={styles.container}>
                <div className={styles.headerRow}>
                    <h2 className={styles.title}>Current Openings</h2>
                    <div className={styles.navControls}>
                        <button onClick={scrollLeft} className={styles.navBtn} aria-label="Previous Openings">←</button>
                        <button onClick={scrollRight} className={styles.navBtn} aria-label="Next Openings">→</button>
                    </div>
                </div>

                <div className={styles.carousel} ref={carouselRef}>
                    {posterJobs.map((job) => {
                        const dateFormatted = formatJobDate(job.createdAt);
                        return (
                            <div 
                                key={job.id} 
                                className={styles.opportunityCard}
                                onClick={() => router.push(`/jobs/${job.id}`)}
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
                                        <div className={styles.topRightTags}>
                                            {dateFormatted && (
                                                <span className={styles.dateTag}>
                                                    📅 {dateFormatted}
                                                </span>
                                            )}
                                            <span className={styles.typeTag}>{job.type}</span>
                                        </div>
                                    </div>

                                    <div className={styles.cardContent}>
                                        <h3 className={styles.cardTitle}>{job.title}</h3>
                                        <div className={styles.cardMetaRow}>
                                            <p className={styles.companySubtitle}>{job.companyName || 'Luxury Hospitality Partner'}</p>
                                            {dateFormatted && (
                                                <span className={styles.cardDateText}>
                                                    Posted: {dateFormatted}
                                                </span>
                                            )}
                                        </div>
                                        <p className={styles.cardSnippet}>
                                            {job.description ? (job.description.length > 80 ? job.description.substring(0, 80) + '...' : job.description) : 'Click to view full job requirements and apply.'}
                                        </p>
                                        <div className={styles.cardAction}>
                                            <span className={styles.applyLink}>View Details →</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
