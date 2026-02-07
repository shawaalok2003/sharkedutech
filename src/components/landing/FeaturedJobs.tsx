import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import styles from './FeaturedJobs.module.css';

const jobs = [
    { role: "Guest Relations Executive", company: "Taj Hotels", location: "New Delhi", type: "Full-time" },
    { role: "Sous Chef", company: "Marriott International", location: "Bangalore", type: "Full-time" },
    { role: "Event Coordinator", company: "Hyatt Regency", location: "Mumbai", type: "Contract" },
    { role: "Front Office Manager", company: "Oberoi Group", location: "Jaipur", type: "Full-time" }
];

export function FeaturedJobs() {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div>
                        <h2 className={styles.title}>Featured Opportunities</h2>
                        <p className={styles.subtitle}>Explore the latest roles from top hospitality brands.</p>
                    </div>
                    <Link href="/jobs">
                        <Button variant="outline" className="text-white border-white hover:bg-white/10">View All Jobs</Button>
                    </Link>
                </div>

                <div className={styles.grid}>
                    {jobs.map((job, idx) => (
                        <div key={idx} className={styles.card}>
                            <div className={styles.cardHeader}>
                                <div>
                                    <h3 className={styles.role}>{job.role}</h3>
                                    <p className={styles.company}>{job.company}</p>
                                </div>
                                <span className={styles.type}>{job.type}</span>
                            </div>
                            <div className={styles.details}>
                                <span>📍 {job.location}</span>
                                <span>💼 {job.company}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
