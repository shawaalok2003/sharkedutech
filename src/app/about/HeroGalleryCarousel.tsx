"use client";

import React, { useState, useEffect } from "react";
import styles from "./About.module.css";

interface GallerySlide {
    id: number;
    title: string;
    location: string;
    badge: string;
    image: string;
}

const gallerySlides: GallerySlide[] = [
    {
        id: 1,
        title: "Four Points by Sheraton - HR Association Meeting",
        location: "Ahmedabad, Gujarat",
        badge: "5-Star Industry MoU",
        image: "/Ahmedabad/FOUR POINT SHERATON MS. MEGHARANI PADHI (HR ASSOCIATE).jpg"
    },
    {
        id: 2,
        title: "JW Marriott - Executive Leadership & Placement",
        location: "Goa, India",
        badge: "Luxury Resort Partner",
        image: "/Goa/JW MARRIOTT GOA MS. RUBY KHAN(DHR) MR. PRIYABRATA DASH (TRAINING MANAGER).jpg"
    },
    {
        id: 3,
        title: "Renaissance Ahmedabad - Cluster GM Partnership",
        location: "Ahmedabad, Gujarat",
        badge: "Star Hotel Tie-up",
        image: "/Ahmedabad/RENAISSANCE AHMDABAD MR. ROHIT BAJPAI (CLUSTER GM).jpeg"
    },
    {
        id: 4,
        title: "Courtyard & Fairfield by Marriott - Training & Recruitment",
        location: "Bengaluru, Karnataka",
        badge: "Industrial Training Campus",
        image: "/Bengalore/COURTYARD BY MARRIOTT & FAIRFIELD BY MARRIOTT BANGALORE OUTER RING ROAD & FAIRFIELD BY MARRIOTT RAJAJINAGAR/MR. SUVEER SODHI (CLUSTER GM) MR. PAUL KINGSLY SAMRAJ (HRM).jpeg"
    },
    {
        id: 5,
        title: "St. Regis - Global Hospitality Standards",
        location: "Goa, India",
        badge: "Premier Hospitality MoU",
        image: "/Goa/ST. REGIS GOA MS. MUSKAN SONAKAR (AM L&D).jpg"
    },
    {
        id: 6,
        title: "Hilton Chennai - Management Collaboration",
        location: "Chennai, Tamil Nadu",
        badge: "Global Hotel Chain",
        image: "/Chennai/HILTON CHENNAI MR. VINOD RAMAMURTHY (GM).jpg"
    },
    {
        id: 7,
        title: "Radisson Blu Plaza Airport - F&B Industry Exposure",
        location: "New Delhi",
        badge: "5-Star Extended Campus",
        image: "/delhi/RADISSON BLU PLAZA DELHI AIRPORT Mr. SHASHANK GOYEL (F&B MANAGER).jpeg"
    }
];

export function HeroGalleryCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        if (isPaused) return;

        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % gallerySlides.length);
        }, 3500);

        return () => clearInterval(timer);
    }, [isPaused]);

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev === 0 ? gallerySlides.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % gallerySlides.length);
    };

    const activeSlide = gallerySlides[currentIndex];

    // Encode special characters in URL
    const encodedSrc = activeSlide.image
        .split("/")
        .map((segment) => encodeURIComponent(segment))
        .join("/");

    return (
        <div 
            className={styles.heroCarouselFrame}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* Top Indicator Dots */}
            <div className={styles.heroCarouselDots}>
                {gallerySlides.map((slide, idx) => (
                    <button
                        key={slide.id}
                        className={`${styles.heroCarouselDot} ${currentIndex === idx ? styles.heroCarouselDotActive : ""}`}
                        onClick={() => setCurrentIndex(idx)}
                        aria-label={`Go to photo ${idx + 1}`}
                    />
                ))}
            </div>

            {/* Main Photo Slide */}
            <img 
                src={encodedSrc} 
                alt={activeSlide.title}
                className={styles.heroCarouselImg}
            />

            {/* Bottom Caption Overlay */}
            <div className={styles.heroCarouselOverlay}>
                <span className={styles.heroCarouselBadge}>
                    📍 {activeSlide.badge}
                </span>
                <h3 className={styles.heroCarouselTitle}>
                    {activeSlide.title}
                </h3>
                <p className={styles.heroCarouselSub}>
                    {activeSlide.location} &bull; Shark Edutech Gallery
                </p>
            </div>

            {/* Navigation Arrows */}
            <button 
                className={`${styles.heroCarouselNavBtn} ${styles.heroCarouselPrev}`}
                onClick={handlePrev}
                aria-label="Previous Gallery Photo"
            >
                ‹
            </button>
            <button 
                className={`${styles.heroCarouselNavBtn} ${styles.heroCarouselNext}`}
                onClick={handleNext}
                aria-label="Next Gallery Photo"
            >
                ›
            </button>
        </div>
    );
}
