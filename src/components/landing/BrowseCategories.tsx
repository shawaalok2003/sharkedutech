"use client";

import { useState } from 'react';
import Link from 'next/link';
import styles from './BrowseCategories.module.css';

const categories = [
    {
        title: "General Management",
        href: "/jobs?category=General Management",
        svg: (
            <svg viewBox="0 0 64 64" className={styles.svgIcon}>
                <circle cx="32" cy="20" r="10" fill="#2563eb" />
                <path d="M26 18 a6 6 0 0 1 12 0" fill="none" stroke="#ffffff" strokeWidth="2" />
                <path d="M20 48 c0-9 5-16 12-16 s12 7 12 16 v4 H20 v-4 z" fill="#2563eb" />
                <polygon points="32,32 29,40 32,46 35,40" fill="#ffffff" />
                <path d="M24 20 h4 M36 20 h4" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
            </svg>
        )
    },
    {
        title: "Front Office",
        href: "/jobs?category=Front Office",
        svg: (
            <svg viewBox="0 0 64 64" className={styles.svgIcon}>
                <rect x="12" y="38" width="40" height="16" rx="3" fill="#2563eb" />
                <rect x="36" y="24" width="12" height="14" rx="2" fill="#2563eb" opacity="0.8" />
                <path d="M42 38 v4" stroke="#ffffff" strokeWidth="2" />
                <circle cx="24" cy="22" r="7" fill="#2563eb" />
                <path d="M16 38 c0-5 3.5-9 8-9 s8 4 8 9" fill="#2563eb" />
                <path d="M18 20 c-2 0-3 2-3 4 M30 20 c2 0 3 2 3 4" stroke="#2563eb" strokeWidth="2" fill="none" />
            </svg>
        )
    },
    {
        title: "HouseKeeping",
        href: "/jobs?category=Housekeeping",
        svg: (
            <svg viewBox="0 0 64 64" className={styles.svgIcon}>
                <circle cx="26" cy="18" r="6" fill="#2563eb" />
                <path d="M20 44 v-14 c0-4 3-7 6-7 s6 3 6 7 v14" fill="none" stroke="#2563eb" strokeWidth="4" />
                <rect x="34" y="28" width="18" height="20" rx="3" fill="#2563eb" />
                <path d="M38 28 v-8 a4 4 0 0 1 8 0 v8" fill="none" stroke="#2563eb" strokeWidth="3" />
                <circle cx="38" cy="52" r="3" fill="#2563eb" />
                <circle cx="48" cy="52" r="3" fill="#2563eb" />
            </svg>
        )
    },
    {
        title: "Food & Beverage (F&B) Service",
        href: "/jobs?category=Food %26 Beverage",
        svg: (
            <svg viewBox="0 0 64 64" className={styles.svgIcon}>
                <rect x="34" y="20" width="16" height="24" rx="4" fill="#2563eb" />
                <path d="M42 20 v-8 l6 -4" stroke="#2563eb" strokeWidth="3" fill="none" strokeLinecap="round" />
                <path d="M14 36 h18 v4 a8 8 0 0 1 -18 0 v-4 z" fill="#2563eb" />
                <rect x="12" y="32" width="22" height="4" rx="2" fill="#2563eb" opacity="0.7" />
                <line x1="23" y1="44" x2="23" y2="52" stroke="#2563eb" strokeWidth="3" />
                <line x1="16" y1="52" x2="30" y2="52" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" />
            </svg>
        )
    },
    {
        title: "Kitchen",
        href: "/jobs?category=Food Production",
        svg: (
            <svg viewBox="0 0 64 64" className={styles.svgIcon}>
                <rect x="14" y="16" width="36" height="36" rx="4" fill="none" stroke="#2563eb" strokeWidth="3" />
                <line x1="14" y1="28" x2="50" y2="28" stroke="#2563eb" strokeWidth="3" />
                <rect x="18" y="32" width="14" height="16" rx="2" fill="#2563eb" />
                <circle cx="42" cy="36" r="3" fill="#2563eb" />
                <circle cx="42" cy="44" r="3" fill="#2563eb" />
                <path d="M20 22 h8 M36 22 h8" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" />
            </svg>
        )
    },
    {
        title: "Sales & Marketing",
        href: "/jobs?category=Sales %26 Marketing",
        svg: (
            <svg viewBox="0 0 64 64" className={styles.svgIcon}>
                <path d="M14 44 c6-2 10-8 14-8 s6 4 10 4 8-10 14-14" fill="none" stroke="#2563eb" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                <polyline points="42,26 52,26 52,36" stroke="#2563eb" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                <circle cx="34" cy="22" r="7" fill="#2563eb" opacity="0.2" />
                <path d="M12 50 c8-4 16-2 24-4 s12-8 16-8" fill="none" stroke="#2563eb" strokeWidth="2" strokeDasharray="3 3" />
            </svg>
        )
    },
    {
        title: "Finance & Accounts",
        href: "/jobs?category=Accounts",
        svg: (
            <svg viewBox="0 0 64 64" className={styles.svgIcon}>
                <rect x="16" y="14" width="22" height="36" rx="3" fill="#2563eb" />
                <rect x="20" y="18" width="14" height="8" rx="1" fill="#ffffff" />
                <circle cx="22" cy="32" r="2" fill="#ffffff" />
                <circle cx="27" cy="32" r="2" fill="#ffffff" />
                <circle cx="32" cy="32" r="2" fill="#ffffff" />
                <circle cx="22" cy="38" r="2" fill="#ffffff" />
                <circle cx="27" cy="38" r="2" fill="#ffffff" />
                <circle cx="32" cy="38" r="2" fill="#ffffff" />
                <circle cx="22" cy="44" r="2" fill="#ffffff" />
                <circle cx="27" cy="44" r="2" fill="#ffffff" />
                <circle cx="32" cy="44" r="2" fill="#ffffff" />
                <path d="M42 22 a10 10 0 1 1 -10 10" fill="none" stroke="#2563eb" strokeWidth="4" />
                <path d="M42 22 v10 h10" fill="none" stroke="#2563eb" strokeWidth="3" />
            </svg>
        )
    },
    {
        title: "Human Resources (HR)",
        href: "/jobs?category=Human Resources",
        svg: (
            <svg viewBox="0 0 64 64" className={styles.svgIcon}>
                <rect x="16" y="24" width="32" height="24" rx="4" fill="none" stroke="#2563eb" strokeWidth="3" />
                <path d="M26 24 v-6 a6 6 0 0 1 12 0 v6" fill="none" stroke="#2563eb" strokeWidth="3" />
                <circle cx="26" cy="36" r="4" fill="#2563eb" />
                <circle cx="38" cy="36" r="4" fill="#2563eb" />
                <path d="M21 44 c0-3 2.5-5 5-5 s5 2 5 5" stroke="#2563eb" strokeWidth="2" fill="none" />
                <path d="M33 44 c0-3 2.5-5 5-5 s5 2 5 5" stroke="#2563eb" strokeWidth="2" fill="none" />
            </svg>
        )
    },
    {
        title: "Security Department",
        href: "/jobs?category=Security",
        svg: (
            <svg viewBox="0 0 64 64" className={styles.svgIcon}>
                <path d="M32 12 l16 6 v14 c0 12-8 20-16 24 c-8-4-16-12-16-24 v-14 z" fill="#2563eb" opacity="0.15" stroke="#2563eb" strokeWidth="3" />
                <circle cx="32" cy="28" r="7" fill="#2563eb" />
                <path d="M22 46 c0-6 4.5-10 10-10 s10 4 10 10" fill="#2563eb" />
                <polygon points="32,16 35,22 41,22 36,26 38,32 32,28 26,32 28,26 23,22 29,22" fill="#2563eb" opacity="0.4" />
            </svg>
        )
    },
    {
        title: "Spa & Wellness",
        href: "/jobs?category=Spa",
        svg: (
            <svg viewBox="0 0 64 64" className={styles.svgIcon}>
                <circle cx="32" cy="20" r="6" fill="#2563eb" />
                <path d="M20 46 c0-8 5.5-14 12-14 s12 6 12 14" stroke="#2563eb" strokeWidth="3" fill="none" />
                <path d="M32 40 c-10-12-20 0-20 10 c10 0 20-10 20-10 z" fill="#2563eb" opacity="0.8" />
                <path d="M32 40 c10-12 20 0 20 10 c-10 0-20-10-20-10 z" fill="#2563eb" opacity="0.8" />
            </svg>
        )
    },
    {
        title: "Events & Banquets",
        href: "/jobs?category=Events",
        svg: (
            <svg viewBox="0 0 64 64" className={styles.svgIcon}>
                <path d="M12 20 h40 v28 h-40 z" fill="none" stroke="#2563eb" strokeWidth="3" />
                <path d="M12 20 q10 10 20 0 q10 10 20 0" fill="none" stroke="#2563eb" strokeWidth="3" />
                <path d="M20 48 v-16 a6 6 0 0 1 12 0 v16" fill="#2563eb" opacity="0.2" stroke="#2563eb" strokeWidth="2" />
                <path d="M32 48 v-16 a6 6 0 0 1 12 0 v16" fill="#2563eb" opacity="0.2" stroke="#2563eb" strokeWidth="2" />
                <circle cx="32" cy="14" r="3" fill="#2563eb" />
            </svg>
        )
    },
    {
        title: "Procurement & Stores",
        href: "/jobs?category=Procurement",
        svg: (
            <svg viewBox="0 0 64 64" className={styles.svgIcon}>
                <rect x="14" y="16" width="22" height="32" rx="3" fill="none" stroke="#2563eb" strokeWidth="3" />
                <line x1="20" y1="24" x2="30" y2="24" stroke="#2563eb" strokeWidth="2" />
                <line x1="20" y1="30" x2="30" y2="30" stroke="#2563eb" strokeWidth="2" />
                <line x1="20" y1="36" x2="26" y2="36" stroke="#2563eb" strokeWidth="2" />
                <rect x="34" y="28" width="18" height="20" rx="3" fill="#2563eb" opacity="0.9" />
                <path d="M38 28 v-4 a4 4 0 0 1 8 0 v4" stroke="#2563eb" strokeWidth="3" fill="none" />
            </svg>
        )
    }
];

export function BrowseCategories() {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <span className={styles.badge}>EXPLORE CATEGORIES</span>
                    <h2 className={styles.title}>Browse Our Latest Job Categories</h2>
                    <p className={styles.subtitle}>
                        Search for your dream job based on the specialized fields listed below. Explore vacancies to find the right trajectory for you.
                    </p>
                </div>

                <div className={styles.grid}>
                    {categories.map((cat, idx) => (
                        <Link key={idx} href={cat.href} className={styles.card}>
                            <div className={styles.iconCircle}>
                                {cat.svg}
                            </div>
                            <h3 className={styles.cardTitle}>{cat.title}</h3>
                            <span className={styles.cardLink}>Explore Openings &rarr;</span>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Floating Action Buttons */}
            <div className={styles.fabGroup}>
                <button 
                    onClick={scrollToTop} 
                    className={styles.scrollTopFab}
                    title="Scroll to top"
                    aria-label="Scroll to top"
                >
                    ↑
                </button>
                <a 
                    href="https://wa.me/919147331167" 
                    target="_blank" 
                    rel="noreferrer" 
                    className={styles.whatsappFab}
                    title="Chat on WhatsApp"
                    aria-label="Chat on WhatsApp"
                >
                    💬
                </a>
            </div>
        </section>
    );
}
