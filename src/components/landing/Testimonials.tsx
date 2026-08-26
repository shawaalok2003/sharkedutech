"use client";

import { useState, useEffect } from "react";
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
        quote: "SHARK Edutech helped me gain real industry exposure and confidence. My internship turned into a full-time job.",
        name: "Asikul Mondal",
        role: "Placed Graduate",
        company: "Luxury Hospitality Partner",
        badge: "Verified Placement",
        initials: "AM",
        bgGradient: "linear-gradient(135deg, #001736, #002b5b)",
        rating: 5
    },
    {
        id: 2,
        quote: "The practical training, industry tie-ups, and lifetime career support from SHARK Edutech helped me build my hospitality career.",
        name: "Rima Bagchi",
        role: "Hospitality Professional",
        company: "Star Hotel Partner",
        badge: "Verified Graduate",
        initials: "RB",
        bgGradient: "linear-gradient(135deg, #d97706, #b45309)",
        rating: 5
    },
    {
        id: 3,
        quote: "Through SHARK Edutech's network of 400+ tie-up hotels, I secured a rewarding position right after my training.",
        name: "Altab Hossain",
        role: "F&B Operations",
        company: "Barbeque Nation, Bangalore",
        badge: "Placed Alumni",
        initials: "AH",
        bgGradient: "linear-gradient(135deg, #2563eb, #1e40af)",
        rating: 5
    },
    {
        id: 4,
        quote: "Connecting with premier 5-star properties through SHARK Edutech gave me the hands-on exposure I needed for rapid career growth.",
        name: "Shaon Das",
        role: "Hotel Management Specialist",
        company: "ITC Kohenur, Hyderabad",
        badge: "Verified Alumni",
        initials: "SD",
        bgGradient: "linear-gradient(135deg, #059669, #047857)",
        rating: 5
    },
    {
        id: 5,
        quote: "SHARK Edutech's strong industry partnerships opened international doors for my career. The lifetime assistance is real.",
        name: "Robius Sani",
        role: "Front Office Executive",
        company: "The Diplomatic Club, Doha",
        badge: "Global Placement",
        initials: "RS",
        bgGradient: "linear-gradient(135deg, #7c3aed, #6d28d9)",
        rating: 5
    },
    {
        id: 6,
        quote: "Hospitality is not just a profession, it's the art of making people feel at home anywhere in the world. SHARK made this dream come true.",
        name: "Suman Samanta",
        role: "Guest Relations Associate",
        company: "Rajmahal Palace Raas, Jaipur",
        badge: "Verified Graduate",
        initials: "SS",
        bgGradient: "linear-gradient(135deg, #0284c7, #0369a1)",
        rating: 5
    },
    {
        id: 7,
        quote: "From structured training to global employment opportunities, SHARK Edutech guided me every step into top luxury brands.",
        name: "Abu Darda Molla",
        role: "Hospitality Operations",
        company: "Hotel Dollenberg, Germany",
        badge: "International Alumni",
        initials: "AM",
        bgGradient: "linear-gradient(135deg, #001736, #1e293b)",
        rating: 5
    },
    {
        id: 8,
        quote: "Great service turns a stay into a story worth telling. SHARK Edutech gave me the skills and confidence for star-rated properties.",
        name: "Asfak Sk",
        role: "Operations Specialist",
        company: "Aramco Project, Saudi Arabia",
        badge: "Global Placement",
        initials: "AS",
        bgGradient: "linear-gradient(135deg, #059669, #1d4ed8)",
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
                        SUCCESS STORIES &amp; TESTIMONIALS
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
