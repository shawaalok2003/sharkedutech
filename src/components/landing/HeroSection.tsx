"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import styles from './HeroSection.module.css';
import { useSession } from "next-auth/react";

export function HeroSection() {
    const { data: session } = useSession();
    return (
        <section className={styles.hero}>
            <div className={styles.container}>
                <div className={styles.content}>
                    <span className={styles.badge}>🚀 Launching Careers in Hospitality</span>
                    <h1 className={styles.title}>
                        Master the Art of <span className={styles.highlight}>Hospitality</span> Management
                    </h1>
                    <p className={styles.description}>
                        Join the elite platform connecting aspiring professionals with top-tier education and premium career opportunities in the global hospitality industry.
                    </p>
                    <div className={styles.actions}>
                        {(!session || (session?.user as any)?.role === 'CANDIDATE') && (
                            <Link href="/admissions">
                                <Button size="lg">Apply for Admission</Button>
                            </Link>
                        )}
                        <Link href="/jobs">
                            <Button size="lg" variant="outline">Explore Jobs</Button>
                        </Link>
                    </div>
                </div>

                <div className={styles.imageWrapper}>
                    <Image
                        src="/images/hero.png"
                        alt="Hospitality Professionals in a Luxury Hotel Lobby"
                        fill
                        className={styles.image}
                        priority
                    />
                </div>
            </div>
        </section>
    );
}
