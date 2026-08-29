"use client";

import { useState } from 'react';
import styles from './DreamCareerTestimonials.module.css';

const testimonials = [
    {
        title: "Zero Callbacks to a 5-Star Offer in 12 Days!",
        quote: "I had been applying on different portals for months with zero callbacks. A friend suggested Shark Edutech and within 12 days, I had two interview calls and a confirmed offer from a 5-star property in Bangalore.",
        name: "Krishna Yadav",
        role: "F&B Executive, Courtyard Marriott",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
    },
    {
        title: "Stay Updated With the Platform",
        quote: "I use the platform regularly where new hospitality jobs come in regularly, and I can check and apply for them right from my phone. It's convenient to stay updated, apply quickly, and stay connected with top recruiters.",
        name: "Nitin Kumar",
        role: "Commis Chef, ITC Gardenia",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
    },
    {
        title: "Found the Right Opportunity Instantly",
        quote: "I had a great experience using this platform to find a hospitality job. The listings were clear, the process was simple, and I found a role that matched my experience and target location. I'm really happy with the team!",
        name: "Rahul Singh",
        role: "Front Office Manager, Four Points Sheraton",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80"
    }
];

export function DreamCareerTestimonials() {
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Your Dream Hospitality Career Starts Here</h2>
                    <p className={styles.subtitle}>
                        Join thousands of professionals who have accelerated their careers through Shark Edutech. From luxury resorts to boutique stays, we connect your talent with India's most prestigious hospitality brands.
                    </p>
                </div>

                <div className={styles.grid}>
                    {testimonials.map((item, idx) => (
                        <div key={idx} className={styles.card}>
                            <div>
                                <h3 className={styles.cardTitle}>{item.title}</h3>
                                <p className={styles.quote}>{item.quote}</p>
                            </div>

                            <div className={styles.userRow}>
                                <img src={item.avatar} alt={item.name} className={styles.avatar} />
                                <div>
                                    <div className={styles.userName}>{item.name}</div>
                                    <div className={styles.userRole}>{item.role}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className={styles.dots}>
                    {testimonials.map((_, idx) => (
                        <button 
                            key={idx}
                            onClick={() => setActiveIndex(idx)}
                            className={`${styles.dot} ${idx === activeIndex ? styles.dotActive : ''}`}
                            aria-label={`Slide ${idx + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
