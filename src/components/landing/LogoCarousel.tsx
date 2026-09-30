"use client";

import React, { useState } from "react";
import styles from "./LogoCarousel.module.css";
import { AllHotelsModal } from "./AllHotelsModal";

const logos = [
    "ASTOR.JPG.jpeg", "AURIKA.jpeg", "CITRUS HOTEL.jpeg", "COURTYARD MARRIOTT.jpeg",
    "EFFOTEL SAYAJI.jpeg", "FAIRFIELD MARRIOTT.JPG.jpeg",
    "FOUR POINTS BY SHERATON.JPG.jpeg", "GIFT CITY CLUB.jpeg", "GOKULAM GRAND.jpeg",
    "HILTON.JPG.jpeg", "HOLIDAY INN.JPG.jpeg",
    "HYATT REGENCY.jpeg", "JW MARRIOTT.JPG.jpeg", "KEYS SELECT (1).jpeg",
    "LEMON TREE PREMIER.JPG.jpeg", "LEMON TREE.JPG.jpeg", "LM.jpeg",
    "MARRIOTT.JPG.jpeg", "PALM MEADOWS.jpeg",
    "RADISSON BLU.JPG.jpeg", "RADISSON INDIVIDUALS.JPG.jpeg",
    "RENAISSANCE.jpeg", "SAYAJI.JPG.jpeg", "SHERATON.JPG.jpeg",
    "ST REGIS.JPG.jpeg", "THE FERN.jpeg", "THE NEST.jpeg", "THE PRIDE.JPG.jpeg",
    "WESTIN.JPG.jpeg", "WHISPERING PALMS.jpeg", "ZUPER...JPG.jpeg"
];

export const LogoCarousel = () => {
    const [isListModalOpen, setIsListModalOpen] = useState(false);

    // Double the logos to create a seamless infinite loop
    const displayLogos = [...logos, ...logos];

    return (
        <section className={styles.container} id="partners">
            <div className={styles.header}>
                <div className={styles.tagline}>⭐ DIRECT RECRUITMENT &amp; 5-STAR TIE-UPS</div>
                <h2 className={styles.title}>Our 5-Star Hotel Tie-Ups &amp; Industry Partners</h2>
                <p className={styles.subtitle}>
                    Direct recruitment partnerships with world-class luxury hotel chains and resorts across India &amp; overseas
                </p>
                <div className={styles.headerCtaRow}>
                    <button 
                        type="button" 
                        onClick={() => setIsListModalOpen(true)}
                        className={styles.primaryCtaBtn}
                    >
                        📋 Explore All Hotel Partners
                    </button>
                    <a 
                        href="/jobs" 
                        className={styles.secondaryCtaBtn}
                    >
                        💼 Browse Active Hotel Jobs &rarr;
                    </a>
                </div>
            </div>
            
            <div className={styles.slider}>
                <div className={styles.slideTrack}>
                    {displayLogos.map((logo, index) => {
                        const cleanName = logo
                            .replace(/\.(JPG|jpeg|jpg|png)/gi, '')
                            .replace(/\(\d+\)/g, '')
                            .replace(/[._]/g, ' ')
                            .trim();
                        return (
                            <div 
                                className={styles.slide} 
                                key={`${logo}-${index}`}
                                onClick={() => setIsListModalOpen(true)}
                                title="Click to view full hotel partners list"
                                role="button"
                                tabIndex={0}
                            >
                                <div className={styles.logoCard}>
                                    <img 
                                        src={`/HOTEL LOGOS-20260501T173926Z-3-001/HOTEL LOGOS/${logo}`} 
                                        alt={cleanName} 
                                    />
                                </div>
                                <span className={styles.clickBadge}>View All Partners 📋</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {isListModalOpen && (
                <AllHotelsModal 
                    logos={logos}
                    onClose={() => setIsListModalOpen(false)} 
                />
            )}
        </section>
    );
};
