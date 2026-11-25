"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './HeroSection.module.css';
import { HOTEL_PARTNER_LOGOS } from './LogoCarousel';
import { AllHotelsModal } from './AllHotelsModal';

const HERO_SLIDES = [
    {
        name: "JW Marriott Goa",
        location: "Vagator, Goa",
        category: "5-Star Luxury Resort",
        url: "/hero/jw marriot goa.jpg",
        alt: "JW Marriott Goa - 5-Star Luxury Resort"
    },
    {
        name: "JW Marriott Mumbai Sahar",
        location: "Mumbai, Maharashtra",
        category: "5-Star Luxury Hotel",
        url: "/hero/jw marriot sahar.jpg",
        alt: "JW Marriott Mumbai Sahar - 5-Star Luxury Hotel"
    },
    {
        name: "Radisson Resort & Spa Kandla",
        location: "Gandhidham, Gujarat",
        category: "5-Star Luxury Resort",
        url: "/hero/Radisson Resort & Spa Kandla.jpg",
        alt: "Radisson Resort & Spa Kandla"
    },
    {
        name: "Hyatt Ahmedabad",
        location: "Vastrapur, Ahmedabad",
        category: "5-Star Luxury Hotel",
        url: "/hero/Hyatt Ahmedabad.avif",
        alt: "Hyatt Ahmedabad"
    },
    {
        name: "Renaissance Hotel Ahmedabad",
        location: "SG Highway, Ahmedabad",
        category: "Marriott Luxury Brand",
        url: "/hero/Renaissance Hotel Ahmedabad.jpg",
        alt: "Renaissance Hotel Ahmedabad"
    },
    {
        name: "Radisson Blu Hotel Indore",
        location: "Indore, Madhya Pradesh",
        category: "5-Star Premier Hotel",
        url: "/hero/Radisson Blu Hotel Indore.webp",
        alt: "Radisson Blu Hotel Indore"
    },
    {
        name: "Sayaji Hotel Indore",
        location: "Indore, Madhya Pradesh",
        category: "5-Star Luxury Flagship",
        url: "/hero/Sayaji Hotel Indore.webp",
        alt: "Sayaji Hotel Indore"
    },
    {
        name: "Gokulam Park Kochi",
        location: "Kaloor, Kochi",
        category: "Luxury 5-Star Hotel",
        url: "/hero/Gokulam Park Kochi.webp",
        alt: "Gokulam Park Kochi"
    },
    {
        name: "Lemon Tree Premier Bangalore",
        location: "Ulsoor, Bengaluru",
        category: "Upscale 5-Star Hotel",
        url: "/hero/Lemon Tree Premiew Bangalore.jpg",
        alt: "Lemon Tree Premier Bangalore"
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
    const [isHotelsModalOpen, setIsHotelsModalOpen] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const displayLogos = [...HOTEL_PARTNER_LOGOS, ...HOTEL_PARTNER_LOGOS];

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

            {/* Main Content */}
            <div className={styles.container}>
                <div className={styles.content}>
                    {/* Full-Width Top Bar: Left = Skill India & Startup India | Right = Network & Trust Stats */}
                    <div className={styles.topUtilityBar}>
                        <div className={styles.certBanner} aria-label="Skill India and Startup India Recognized">
                            <div className={styles.skillIndiaBadge}>
                                <span className={styles.skillIconBox}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <rect x="2" y="3" width="20" height="14" rx="2" />
                                        <line x1="8" y1="21" x2="16" y2="21" />
                                        <line x1="12" y1="17" x2="12" y2="21" />
                                        <path d="M9 10l2 2 4-4" />
                                    </svg>
                                </span>
                                <span className={styles.skillText}>
                                    <span className={styles.skillOrange}>Skill</span>{" "}
                                    <span className={styles.skillGreen}>India</span>
                                </span>
                            </div>

                            <span className={styles.certDivider} aria-hidden="true" />

                            <div className={styles.startupIndiaBadge}>
                                <span className={styles.startupLogoMark}>
                                    <span className={styles.startupHash}>#</span>
                                    <span className={styles.startupWord}>startup</span>
                                    <span className={styles.startupIndiaWord}>india</span>
                                    <svg className={styles.startupStepArrow} width="14" height="12" viewBox="0 0 16 14" fill="none" aria-hidden="true">
                                        <path d="M1 12H6V7H11V2H15" stroke="#4ade80" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </span>
                                <span className={styles.certNoPill}>CERTIFICATE NO: DIPP196896</span>
                            </div>
                        </div>

                        <div className={styles.topRightTrust}>
                            <div className={styles.eyebrow}>
                                <span>⭐ 5-STAR HOSPITALITY NETWORK</span>
                            </div>

                            <div className={styles.statsRow}>
                                <div className={styles.statPill}>
                                    <div className={styles.statIconBox}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                                            <polyline points="17 6 23 6 23 12" />
                                        </svg>
                                    </div>
                                    <div className={styles.statTextGroup}>
                                        <span className={styles.statNumber}>98%</span>
                                        <span className={styles.statLabel}>Placement Success</span>
                                    </div>
                                </div>

                                <div className={styles.statPill}>
                                    <div className={styles.statIconBox} style={{ color: '#34d399' }}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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

                    <h1 className={styles.title}>
                        Exclusively <span className={styles.titleHighlight}>Hospitality Job Portal</span>
                    </h1>

                    <p className={styles.description}>
                        Direct recruitment, verified hotel job vacancies, and 100% placement support across luxury hotels &amp; resorts nationwide.
                    </p>

                    {/* 4 Core Pillars Strip under Hero Title */}
                    <div className={styles.pillarsStrip} aria-label="Core Hospitality Capabilities">
                        <div className={styles.pillarItem}>
                            <span className={styles.pillarIcon}>
                                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                    <path d="M12 12a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Zm0 2c-4.42 0-8 2.24-8 5v1.5a.5.5 0 0 0 .5.5h15a.5.5 0 0 0 .5-.5V19c0-2.76-3.58-5-8-5Z" />
                                </svg>
                            </span>
                            <span>Manpower Supply</span>
                        </div>

                        <div className={styles.pillarItem}>
                            <span className={styles.pillarIcon}>
                                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                    <path d="M12 3 1 9l11 6 9-4.91V17h2V9L12 3Zm-7 9.18V16l7 3.82L19 16v-3.82L12 16l-7-3.82Z" />
                                </svg>
                            </span>
                            <span>Industry Aligned Training</span>
                        </div>

                        <div className={styles.pillarItem}>
                            <span className={styles.pillarIcon}>
                                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                    <path d="M10 4h4a2 2 0 0 1 2 2v1h4a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h4V6a2 2 0 0 1 2-2Zm0 3h4V6h-4v1Z" />
                                </svg>
                            </span>
                            <span>100% Placement Support</span>
                        </div>

                        <div className={styles.pillarItem}>
                            <span className={styles.pillarIcon}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <circle cx="12" cy="12" r="9" />
                                    <path d="M3.6 9h16.8" />
                                    <path d="M3.6 15h16.8" />
                                    <path d="M12 3a13.5 13.5 0 0 1 0 18" />
                                    <path d="M12 3a13.5 13.5 0 0 0 0 18" />
                                </svg>
                            </span>
                            <span>Global Training</span>
                        </div>
                    </div>

                    {/* Unified Action Tabs + Single Job Search Bar */}
                    <div className={styles.searchCluster}>
                        <div className={styles.modeTabs} role="navigation" aria-label="Portal Quick Actions">
                            <span className={`${styles.modeTab} ${styles.modeTabActive}`}>
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <circle cx="11" cy="11" r="7" />
                                    <line x1="21" y1="21" x2="16.2" y2="16.2" />
                                </svg>
                                Search Jobs
                            </span>
                            <Link href="/auth/signup/employer" className={styles.modeTab}>
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                                    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                                </svg>
                                Find Talent ↗
                            </Link>
                            <Link href="/admissions" className={styles.modeTab}>
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                                    <path d="M6 12v5c3 3 9 3 12 0v-5" />
                                </svg>
                                Build Careers ↗
                            </Link>
                        </div>

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

                    {/* Moving Hotel Partner Logos Banner under Trending Jobs */}
                    <div className={styles.heroLogoBanner} aria-label="Hotel Tie-Ups Moving Banner">
                        <div className={styles.heroLogoTrack}>
                            {displayLogos.map((logo, index) => {
                                const cleanName = logo
                                    .replace(/\.(JPG|jpeg|jpg|png)/gi, '')
                                    .replace(/\(\d+\)/g, '')
                                    .replace(/[._]/g, ' ')
                                    .trim();
                                return (
                                    <button
                                        key={`${logo}-${index}`}
                                        type="button"
                                        className={styles.heroLogoSlide}
                                        onClick={() => setIsHotelsModalOpen(true)}
                                        title={`View partner hotels (${cleanName})`}
                                    >
                                        <div className={styles.heroLogoCard}>
                                            <img
                                                src={`/HOTEL LOGOS-20260501T173926Z-3-001/HOTEL LOGOS/${logo}`}
                                                alt={cleanName}
                                            />
                                        </div>
                                    </button>
                                );
                            })}
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

            {isHotelsModalOpen && (
                <AllHotelsModal
                    logos={HOTEL_PARTNER_LOGOS}
                    onClose={() => setIsHotelsModalOpen(false)}
                />
            )}
        </section>
    );
}
