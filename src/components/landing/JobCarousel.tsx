"use client";

import styles from './JobCarousel.module.css';

const jobs = [
    {
        id: 1,
        title: "Front Office Manager",
        company: "Marriott International",
        location: "Mumbai",
        type: "Full-time",
        logo: "🏨"
    },
    {
        id: 2,
        title: "Executive Sous Chef",
        company: "Radisson Blu",
        location: "New Delhi",
        type: "Full-time",
        logo: "👨‍🍳"
    },
    {
        id: 3,
        title: "Guest Relations Officer",
        company: "Taj Hotels",
        location: "Jaipur",
        type: "Full-time",
        logo: "✨"
    },
    {
        id: 4,
        title: "Housekeeping Supervisor",
        company: "Lemon Tree Hotels",
        location: "Bangalore",
        type: "Full-time",
        logo: "🧹"
    },
    {
        id: 5,
        title: "F&B Manager",
        company: "Hyatt Regency",
        location: "Hyderabad",
        type: "Full-time",
        logo: "🍷"
    }
];

export function JobCarousel() {
    return (
        <section className={styles.carouselSection}>
            <div className={styles.container}>
                <h2 className={styles.title}>Top Job Opportunities</h2>
                <div className={styles.carousel}>
                    {jobs.map((job) => (
                        <div key={job.id} className={styles.jobCard}>
                            <div className={styles.companyLogo}>{job.logo}</div>
                            <h3 className={styles.jobTitle}>{job.title}</h3>
                            <p className={styles.companyName}>{job.company}</p>
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
