"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import styles from './HeroSection.module.css';
import { useSession } from "next-auth/react";

export function HeroSection() {
    return (
        <section className={styles.hero}>
            <div className={styles.container}>
                <div className={styles.content}>
                    <h1 className={styles.title}>
                        Its Easy to Find Your <span className={styles.highlight}>Dream Job</span>
                    </h1>
                    <p className={styles.description}>
                        Type your keyword, then click search to find your perfect job.
                    </p>

                    <div className={styles.searchBox}>
                        <input
                            type="text"
                            className={styles.searchInput}
                            placeholder="Enter Skills or job title"
                        />
                        <select className={styles.searchSelect}>
                            <option>Select Functional Area</option>
                            <option>House Keeping</option>
                            <option>Production</option>
                            <option>Service</option>
                            <option>Front Office</option>
                        </select>
                        <button className={styles.searchButton}>
                            🔍
                        </button>
                    </div>

                    <div className={styles.statsText}>
                        <div className={styles.statsLabel}>GLOBAL RECRUITMENT NETWORK</div>
                        <div className={styles.statsHighlight}>
                            <span style={{ fontWeight: 900 }}>5556+</span> &nbsp; VACANCIES LIVE
                        </div>
                    </div>
                </div>

                <div className={styles.imageWrapper}>
                    <div className={`${styles.bubble} ${styles.bubble1}`}>
                        <div className={styles.bubbleIcon}>🏢</div>
                        Job Portal
                    </div>
                    <div className={`${styles.bubble} ${styles.bubble2}`}>
                        <div className={styles.bubbleIcon}>🎓</div>
                        Admission Portal
                    </div>
                    <div className={`${styles.bubble} ${styles.bubble3}`}>
                        <div className={styles.bubbleIcon}>🌍</div>
                        Man Power
                    </div>
                    <div className={`${styles.bubble} ${styles.bubble4}`}>
                        <div className={styles.bubbleIcon}>🚀</div>
                        Training & Placement
                    </div>

                    <Image
                        src="/images/hero-new.png"
                        alt="Hospitality Education and Jobs"
                        width={600}
                        height={600}
                        className={styles.mainImg}
                        priority
                    />
                </div>
            </div>
        </section>
    );
}
