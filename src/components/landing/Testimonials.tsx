"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./Testimonials.module.css";

interface Testimonial {
    id: number;
    quote: string;
    name: string;
    role: string;
    company: string;
    badge: string;
    initials: string;
    bgGradient: string;
    rating: number;
}

const testimonials: Testimonial[] = [
    {
        id: 1,
        quote: "Sharkedutech helped me find the perfect culinary degree that aligned with my career goals. The admission guidance was incredibly smooth and hassle-free.",
        name: "Sarah Jenkins",
        role: "Culinary Arts Student",
        company: "Swiss Hotel Management School",
        badge: "Verified Student",
        initials: "SJ",
        bgGradient: "linear-gradient(135deg, #2563eb, #1e40af)",
        rating: 5
    },
    {
        id: 2,
        quote: "As an employer, the quality of candidates we recruit from Shark Edutech is unmatched. It's our primary platform for hiring fresh hospitality leaders.",
        name: "David Chen",
        role: "HR & Talent Director",
        company: "Grand Hyatt International",
        badge: "Recruitment Partner",
        initials: "DC",
        bgGradient: "linear-gradient(135deg, #0f172a, #334155)",
        rating: 5
    },
    {
        id: 3,
        quote: "The platform is exceptionally slick and easy to navigate. I submitted applications to 4 top institutes in one go and landed my dream scholarship!",
        name: "Rahul Sharma",
        role: "Hospitality Management Graduate",
        company: "Marriott Luxury Collection",
        badge: "Verified Alumni",
        initials: "RS",
        bgGradient: "linear-gradient(135deg, #d97706, #b45309)",
        rating: 5
    },
    {
        id: 4,
        quote: "Shark Edutech connects world-class institutions with top talent seamlessly. The verified applicant process saves us weeks of recruitment effort.",
        name: "Elena Rostova",
        role: "Front Office Director",
        company: "Ritz-Carlton Dubai",
        badge: "Industry Partner",
        initials: "ER",
        bgGradient: "linear-gradient(135deg, #059669, #047857)",
        rating: 5
    },
    {
        id: 5,
        quote: "Managing application pipelines through Shark Edutech has boosted our international student enrollment by over 40% year-on-year.",
        name: "Vikramaditya Rao",
        role: "Dean of Admissions",
        company: "International Institute of Hotel Mgmt",
        badge: "Institute Partner",
        initials: "VR",
        bgGradient: "linear-gradient(135deg, #7c3aed, #6d28d9)",
        rating: 5
    },
    {
        id: 6,
        quote: "From course selection to my first luxury resort placement, Shark Edutech was with me every step. Highly recommended for aspiring professionals!",
        name: "Aisha Al-Mansoor",
        role: "Yacht Hospitality Executive",
        company: "Oceanic Luxury Fleet",
        badge: "Verified Graduate",
        initials: "AA",
        bgGradient: "linear-gradient(135deg, #0284c7, #0369a1)",
        rating: 5
    }
];

export function Testimonials() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [cardsToShow, setCardsToShow] = useState(3);

    // Responsive visible cards count
    useEffect(() => {
        const updateCardsToShow = () => {
            if (window.innerWidth < 768) {
                setCardsToShow(1);
            } else if (window.innerWidth < 1100) {
                setCardsToShow(2);
            } else {
                setCardsToShow(3);
            }
        };

        updateCardsToShow();
        window.addEventListener("resize", updateCardsToShow);
        return () => window.removeEventListener("resize", updateCardsToShow);
    }, []);

    const maxIndex = Math.max(0, testimonials.length - cardsToShow);

    // Auto-advance slide timer
    useEffect(() => {
        if (isPaused) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
        }, 4500);

        return () => clearInterval(interval);
    }, [isPaused, maxIndex]);

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    };

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.kicker}>
                        <span className={styles.sparkleIcon}>✨</span>
                        SUCCESS STORIES & TESTIMONIALS
                    </div>
                    <h2 className={styles.title}>
                        What Our Community <span className={styles.highlight}>Says</span>
                    </h2>
                    <p className={styles.subtitle}>
                        Discover how Shark Edutech empowers students, top hotel institutes, and global hospitality leaders.
                    </p>
                </div>

                <div 
                    className={styles.carouselWrapper}
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    <button 
                        className={`${styles.navBtn} ${styles.prevBtn}`}
                        onClick={handlePrev}
                        aria-label="Previous Testimonial"
                    >
                        ‹
                    </button>

                    <div className={styles.trackContainer}>
                        <div 
                            className={styles.track}
                            style={{
                                transform: `translateX(-${currentIndex * (100 / cardsToShow)}%)`
                            }}
                        >
                            {testimonials.map((item) => (
                                <div 
                                    key={item.id} 
                                    className={styles.cardItem}
                                    style={{ flex: `0 0 ${100 / cardsToShow}%` }}
                                >
                                    <div className={styles.card}>
                                        <div className={styles.watermarkQuote}>“</div>

                                        <div className={styles.cardTop}>
                                            <div className={styles.ratingRow}>
                                                {[...Array(item.rating)].map((_, i) => (
                                                    <span key={i} className={styles.star}>★</span>
                                                ))}
                                            </div>
                                            <span className={styles.badge}>{item.badge}</span>
                                        </div>

                                        <p className={styles.quote}>"{item.quote}"</p>

                                        <div className={styles.author}>
                                            <div 
                                                className={styles.avatar}
                                                style={{ background: item.bgGradient }}
                                            >
                                                {item.initials}
                                            </div>
                                            <div className={styles.info}>
                                                <div className={styles.name}>{item.name}</div>
                                                <div className={styles.role}>{item.role}</div>
                                                <div className={styles.company}>{item.company}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button 
                        className={`${styles.navBtn} ${styles.nextBtn}`}
                        onClick={handleNext}
                        aria-label="Next Testimonial"
                    >
                        ›
                    </button>
                </div>

                {/* Pagination Indicator Dots */}
                <div className={styles.dotsRow}>
                    {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
                        <button
                            key={idx}
                            className={`${styles.dot} ${currentIndex === idx ? styles.activeDot : ""}`}
                            onClick={() => setCurrentIndex(idx)}
                            aria-label={`Go to slide ${idx + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
