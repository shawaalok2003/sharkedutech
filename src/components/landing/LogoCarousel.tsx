"use client";

import React from "react";
import styles from "./LogoCarousel.module.css";

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
    // Double the logos to create a seamless infinite loop
    const displayLogos = [...logos, ...logos];

    return (
        <section className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.title}>Our Industry Partners</h2>
                <p className={styles.subtitle}>Top hospitality brands hiring through Shark Edutech</p>
            </div>
            
            <div className={styles.slider}>
                <div className={styles.slideTrack}>
                    {displayLogos.map((logo, index) => (
                        <div className={styles.slide} key={`${logo}-${index}`}>
                            <img 
                                src={`/HOTEL LOGOS-20260501T173926Z-3-001/HOTEL LOGOS/${logo}`} 
                                alt={logo.split('.')[0]} 
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
