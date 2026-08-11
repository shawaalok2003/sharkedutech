"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './HeroSection.module.css';

export function HeroSection() {
    const router = useRouter();
    const [search, setSearch] = useState('');

    const handleSearch = () => {
        const queryParams = new URLSearchParams();
        if (search.trim()) {
            queryParams.set('search', search.trim());
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
            <div className={styles.overlay} />
            <div className={styles.container}>
                <div className={styles.content}>
                    <h1 className={styles.title}>
                        Your Global Gateway to Hospitality Excellence & Careers
                    </h1>
                    
                    <p className={styles.description}>
                        Empowering the next generation of hospitality leaders through world-class education admissions and elite recruitment opportunities.
                    </p>

                    <div className={styles.searchBox}>
                        <div className={styles.inputWrapper}>
                            <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8" />
                                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                            <input
                                type="text"
                                className={styles.searchInput}
                                placeholder="Search colleges, roles, or locations"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                        </div>
                        
                        <button className={styles.searchButton} onClick={handleSearch}>
                            <span>Explore Opportunities</span>
                            <span className={styles.arrowIcon}>→</span>
                        </button>
                    </div>

                    <div className={styles.statsRow}>
                        <div className={styles.statPill}>
                            <div className={styles.statIconBox}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                                    <polyline points="17 6 23 6 23 12" />
                                </svg>
                            </div>
                            <div className={styles.statTextGroup}>
                                <span className={styles.statNumber}>98%</span>
                                <span className={styles.statLabel}>Placement Rate</span>
                            </div>
                        </div>

                        <div className={styles.statPill}>
                            <div className={styles.statIconBox}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="2" y1="12" x2="22" y2="12" />
                                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                                </svg>
                            </div>
                            <div className={styles.statTextGroup}>
                                <span className={styles.statNumber}>50+</span>
                                <span className={styles.statLabel}>Global Partners</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
