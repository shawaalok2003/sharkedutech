"use client";

import Image from 'next/image';
import styles from './AdCarousel.module.css';

const ads = [
    {
        id: 1,
        title: "World-Class Training",
        desc: "Master your skills with our elite hospitality programs.",
        image: "/images/ad1.png"
    },
    {
        id: 2,
        title: "Culinary Excellence",
        desc: "Learn from the best chefs and lead the global kitchen.",
        image: "/images/ad2.png"
    },
    {
        id: 3,
        title: "Global Career Paths",
        desc: "We connect you with luxury brands across the world.",
        image: "/images/ad3.png"
    }
];

export function AdCarousel() {
    return (
        <section className={styles.carouselSection}>
            <div className={styles.container}>
                <h2 className={styles.title}>Explore Opportunities</h2>
                <div className={styles.carousel}>
                    {ads.map((ad) => (
                        <div key={ad.id} className={styles.adCard}>
                            <Image
                                src={ad.image}
                                alt={ad.title}
                                width={1200}
                                height={600}
                                className={styles.image}
                            />
                            <div className={styles.overlay}>
                                <h3 className={styles.adTitle}>{ad.title}</h3>
                                <p className={styles.adDesc}>{ad.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
