"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import styles from './HeroSection.module.css';
import { useSession } from "next-auth/react";

export function HeroSection() {
    const router = useRouter();
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');

    const handleSearch = () => {
        const queryParams = new URLSearchParams();
        if (search.trim()) {
            queryParams.set('search', search.trim());
        }
        if (category) {
            queryParams.set('category', category);
        }
        router.push(`/jobs?${queryParams.toString()}`);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

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
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <select 
                            className={styles.searchSelect}
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <option value="">Select Functional Area</option>
                            <optgroup label="Operations">
                                <option value="Front Office">Front Office</option>
                                <option value="Back Office">Back Office</option>
                                <option value="Guest Relations">Guest Relations</option>
                                <option value="Concierge">Concierge</option>
                                <option value="Reservations">Reservations</option>
                            </optgroup>
                            <optgroup label="Food & Beverage">
                                <option value="F&B Service">F&B Service</option>
                                <option value="Food Production">Food Production</option>
                                <option value="Banquet & Events">Banquet & Events</option>
                                <option value="Bar & Mixology">Bar & Mixology</option>
                                <option value="Pastry & Bakery">Pastry & Bakery</option>
                                <option value="Stewarding">Stewarding</option>
                            </optgroup>
                            <optgroup label="Rooms Division">
                                <option value="Housekeeping">Housekeeping</option>
                                <option value="Laundry">Laundry</option>
                                <option value="Engineering & Maintenance">Engineering & Maintenance</option>
                            </optgroup>
                            <optgroup label="Wellness & Recreation">
                                <option value="Spa & Wellness">Spa & Wellness</option>
                                <option value="Recreation & Activities">Recreation & Activities</option>
                            </optgroup>
                            <optgroup label="Support Functions">
                                <option value="Sales & Marketing">Sales & Marketing</option>
                                <option value="HR & Admin">HR & Admin</option>
                                <option value="Accounts & Finance">Accounts & Finance</option>
                                <option value="Purchasing & Stores">Purchasing & Stores</option>
                                <option value="Security">Security</option>
                                <option value="IT & Systems">IT & Systems</option>
                            </optgroup>
                        </select>
                        <button className={styles.searchButton} onClick={handleSearch}>
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
