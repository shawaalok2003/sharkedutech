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
        image: "/Ahmedabad/01. Four Point Sheraton - Ms. Mehgarani Padhi (Human Resource Associate).jpg"
    },
    {
        id: 2,
        title: "JW Marriott - Executive Leadership & Placement",
        location: "Goa, India",
        badge: "Luxury Resort Partner",
        image: "/Goa/03. JW Marriott Goa - Ms. Ruby Khan (Director Human Resources), Mr. Priyabrata Dash (Training Manager).jpg"
    },
    {
        id: 3,
        title: "Renaissance Ahmedabad - Cluster GM Partnership",
        location: "Ahmedabad, Gujarat",
        badge: "Star Hotel Tie-up",
        image: "/Ahmedabad/04. Renaissance Hotel Ahmedabad - Mr. Rohit Bajpai (Multi Property General Manager).jpeg"
    },
    {
        id: 4,
        title: "Courtyard & Fairfield by Marriott - Training & Recruitment",
        location: "Bengaluru, Karnataka",
        badge: "Industrial Training Campus",
        image: "/Bangalore/02. Courtyard & Fairfield by Marriott Bangalore Outer Ring Road & Rajajinagar - Mr. Suveer Sodhi (Cluster GM), Mr. Paul Kingsly Samraj (HRM).jpeg"
    },
    {
        id: 5,
        title: "St. Regis - Global Hospitality Standards",
        location: "Goa, India",
        badge: "Premier Hospitality MoU",
        image: "/Goa/02. St. Regis Goa - Mr. Jagdeep Shetty (Director Human Resources), Ms. Muskan Sonkar (Assistant Manager Learning & Development).jpg"
    },
    {
        id: 6,
        title: "Hilton Chennai - Management Collaboration",
        location: "Chennai, Tamil Nadu",
        badge: "Global Hotel Chain",
        image: "/Chennai/04. Hilton Chennai - Mr. Vinod Ramamurthy (General Manager).jpg"
    },
    {
        id: 7,
        title: "Radisson Blu Plaza Airport - F&B Industry Exposure",
        location: "New Delhi",
        badge: "5-Star Extended Campus",
        image: "/delhi/03. Radisson Blu Plaza - Mr. Shashank Goyel (Food & Beverage Manager).jpeg"
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
