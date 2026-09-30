"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import styles from './HeroSection.module.css';

const HERO_SLIDES = [
    {
        url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=2000&q=85",
        alt: "Luxury 5-Star Hotel Resort & Pool Openings",
        tag: "5-Star Resorts & Villas"
    },
    {
        url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=2000&q=85",
        alt: "Grand Luxury Hotel Lobby & Front Desk Careers",
        tag: "Front Office & Concierge"
    },
    {
        url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=2000&q=85",
        alt: "Fine Dining Restaurant & Master Chef Positions",
        tag: "Culinary & F&B Service"
    },
    {
        url: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=2000&q=85",
        alt: "Elite Beachfront Hospitality Opportunities",
        tag: "Luxury Beach Properties"
    },
    {
        url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=2000&q=85",
        alt: "Executive Hospitality Management & Operations",
        tag: "Management & Operations"
    }
];

const POPULAR_JOB_TAGS = [
    "Front Office Associate",
    "F&B Hostess",
    "Commis Chef",
    "Housekeeping Supervisor",
    "Duty Manager",
    "Bartender",
    "Goa",
    "Marriott"
];

export function HeroSection() {
    const router = useRouter();
    const [search, setSearch] = useState('');
    const [currentSlide, setCurrentSlide] = useState(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Auto-advance slides every 5.5 seconds
    useEffect(() => {
        timerRef.current = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % HERO_SLIDES.length);
        }, 5500);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    const goToSlide = (idx: number) => {
        setCurrentSlide(idx);
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = setInterval(() => {
                setCurrentSlide(prev => (prev + 1) % HERO_SLIDES.length);
            }, 5500);
        }
    };

    const nextSlide = () => {
        goToSlide((currentSlide + 1) % HERO_SLIDES.length);
    };

    const prevSlide = () => {
        goToSlide((currentSlide - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
    };

    const handleSearch = (searchTerm?: string) => {
        const queryTerm = typeof searchTerm === 'string' ? searchTerm : search;
        const queryParams = new URLSearchParams();
        if (queryTerm.trim()) {
            queryParams.set('search', queryTerm.trim());
        }
        router.push(`/jobs?${queryParams.toString()}`);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <section className={styles.hero} aria-label="Hospitality Job Portal Hero">
            {/* Dynamic Background Carousel */}
            <div className={styles.slidesTrack}>
                {HERO_SLIDES.map((slide, idx) => (
                    <div 
                        key={idx}
                        className={`${styles.slideItem} ${idx === currentSlide ? styles.slideActive : ''}`}
                    >
                        <img 
                            src={slide.url} 
                            alt={slide.alt} 
                            className={styles.slideImage}
                        />
                    </div>
                ))}
            </div>

            {/* Dark Luxury Overlay & Radial Glow */}
            <div className={styles.overlay} />
            <div className={styles.radialGlow} />

            {/* Left / Right Carousel Controls */}
            <button 
                type="button" 
                onClick={prevSlide} 
                className={`${styles.navArrow} ${styles.prevArrow}`}
                aria-label="Previous background slide"
            >
                ‹
            </button>
            <button 
                type="button" 
                onClick={nextSlide} 
                className={`${styles.navArrow} ${styles.nextArrow}`}
                aria-label="Next background slide"
            >
                ›
            </button>

            {/* Main Content (100% Focused on Jobs & 5-Star Hotel Careers) */}
            <div className={styles.container}>
                <div className={styles.content}>
                    <div className={styles.eyebrow}>
                        <span>⭐ INDIA&apos;S PREMIER 5-STAR HOSPITALITY JOB NETWORK</span>
                    </div>

                    <h1 className={styles.title}>
                        Exclusively <span className={styles.titleHighlight}>Hospitality Job Portal</span>
                    </h1>
                    
                    <p className={styles.description}>
                        Empowering hospitality professionals with direct recruitment, verified hotel job vacancies, and 100% placement support across 400+ luxury hotels &amp; resorts nationwide.
                    </p>

                    {/* Job Search Box */}
                    <div className={styles.searchBox}>
                        <div className={styles.inputWrapper}>
                            <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8" />
                                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                            <input
                                type="text"
                                className={styles.searchInput}
                                placeholder="Search your job, hotel brands, or cities (e.g. Front Office, F&B, Chef, Goa)"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                        </div>
                        
                        <button className={styles.searchButton} onClick={() => handleSearch()}>
                            <span>Search Jobs</span>
                            <span className={styles.arrowIcon}>→</span>
                        </button>
                    </div>

                    {/* Trending Job Openings Quick Tags */}
                    <div className={styles.trendingRow}>
                        <span className={styles.trendingLabel}>🔥 Trending Jobs:</span>
                        {POPULAR_JOB_TAGS.map((tag) => (
                            <button
                                key={tag}
                                type="button"
                                className={styles.trendingTag}
                                onClick={() => {
                                    setSearch(tag);
                                    handleSearch(tag);
                                }}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>

                    {/* Key Stats Row */}
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
                                <span className={styles.statLabel}>Placement Success</span>
                            </div>
                        </div>

                        <div 
                            className={styles.statPill}
                            onClick={() => {
                                const el = document.getElementById('partners');
                                if (el) el.scrollIntoView({ behavior: 'smooth' });
                            }}
                            style={{ cursor: 'pointer' }}
                            title="Click to view our 400+ 5-Star Hotel Partners"
                        >
                            <div className={styles.statIconBox}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M3 21h18M3 7v14M21 7v14M6 21V11M10 21V11M14 21V11M18 21V11M9 7h6M12 3l3 4H9l3-4z" />
                                </svg>
                            </div>
                            <div className={styles.statTextGroup}>
                                <span className={styles.statNumber}>400+</span>
                                <span className={styles.statLabel}>5-Star Hotel Partners ↗</span>
                            </div>
                        </div>

                        <div 
                            className={styles.statPill}
                            onClick={() => router.push('/jobs')}
                            style={{ cursor: 'pointer' }}
                            title="Click to browse 1,500+ active hospitality jobs"
                        >
                            <div className={styles.statIconBox}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                                </svg>
                            </div>
                            <div className={styles.statTextGroup}>
                                <span className={styles.statNumber}>1,500+</span>
                                <span className={styles.statLabel}>Active Job Openings ↗</span>
                            </div>
                        </div>

                        <div className={styles.statPill}>
                            <div className={styles.statIconBox} style={{ color: '#10b981' }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                    <polyline points="9 12 11 14 15 10" />
                                </svg>
                            </div>
                            <div className={styles.statTextGroup}>
                                <span className={styles.statNumber}>100%</span>
                                <span className={styles.statLabel}>Refund Guaranteed</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Slide Indicator Dots */}
            <div className={styles.indicators}>
                {HERO_SLIDES.map((_, idx) => (
                    <button
                        key={idx}
                        type="button"
                        onClick={() => goToSlide(idx)}
                        className={`${styles.dot} ${idx === currentSlide ? styles.dotActive : ''}`}
                        aria-label={`Go to slide ${idx + 1}`}
                    />
                ))}
            </div>
        </section>
    );
}
