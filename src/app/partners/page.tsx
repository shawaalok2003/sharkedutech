"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getHotelPartnerData, HotelPartner } from "@/data/hotelPartnersData";
import styles from "./partners.module.css";

const HOTEL_LOGOS = [
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

export default function PartnersDirectoryPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    const partners: HotelPartner[] = HOTEL_LOGOS.map(logo => getHotelPartnerData(logo));

    const categories = ["All", "5-Star Luxury", "Marriott Brands", "Resorts & Leisure", "Business Hotels"];

    const filteredPartners = partners.filter(p => {
        const matchesSearch = searchTerm === "" || 
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.locations.some(loc => loc.toLowerCase().includes(searchTerm.toLowerCase()));

        if (!matchesSearch) return false;

        if (selectedCategory === "All") return true;
        if (selectedCategory === "Marriott Brands") {
            return p.name.toLowerCase().includes("marriott") || 
                   p.name.toLowerCase().includes("westin") || 
                   p.name.toLowerCase().includes("sheraton") || 
                   p.name.toLowerCase().includes("st regis") ||
                   p.name.toLowerCase().includes("renaissance");
        }
        if (selectedCategory === "5-Star Luxury") {
            return p.rating.includes("4.8") || p.rating.includes("4.9") || p.category.toLowerCase().includes("luxury");
        }
        if (selectedCategory === "Resorts & Leisure") {
            return p.category.toLowerCase().includes("resort") || p.locations.includes("Goa");
        }
        if (selectedCategory === "Business Hotels") {
            return p.category.toLowerCase().includes("business") || p.category.toLowerCase().includes("premier");
        }
        return true;
    });

    return (
        <div className={styles.pageWrapper}>
            <Navbar />

            <main className={styles.mainContent}>
                {/* Hero Header */}
                <div className={styles.heroSection}>
                    <div className={styles.container}>
                        <div className={styles.badge}>
                            ⭐ OFFICIAL HOSPITALITY RECRUITMENT TIE-UPS
                        </div>
                        <h1 className={styles.title}>
                            Our 5-Star Hotel Tie-Ups &amp; Brand Partners
                        </h1>
                        <p className={styles.subtitle}>
                            Shark Edutech is the authorized talent partner for world-leading luxury hotel chains. Discover active hospitality vacancies and launch your dream hotel career today.
                        </p>

                        {/* Search & Filter Bar */}
                        <div className={styles.searchBarWrapper}>
                            <span className={styles.searchIcon}>🔍</span>
                            <input 
                                type="text"
                                className={styles.searchInput}
                                placeholder="Search hotel brands or cities (e.g. Marriott, Hyatt, Goa, Mumbai)..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            {searchTerm && (
                                <button 
                                    className={styles.clearBtn}
                                    onClick={() => setSearchTerm("")}
                                >
                                    ✕
                                </button>
                            )}
                        </div>

                        {/* Category Filter Pills */}
                        <div className={styles.filterPillsRow}>
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    className={`${styles.filterPill} ${selectedCategory === cat ? styles.filterPillActive : ''}`}
                                    onClick={() => setSelectedCategory(cat)}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Directory Grid */}
                <div className={styles.container}>
                    <div className={styles.resultsMeta}>
                        <span>Showing <strong>{filteredPartners.length}</strong> Partner Hotels</span>
                        <Link href="/jobs" className={styles.browseAllJobsBtn}>
                            💼 Browse All Active Job Openings &rarr;
                        </Link>
                    </div>

                    <div className={styles.grid}>
                        {filteredPartners.map((partner) => (
                            <div key={partner.id} className={styles.hotelCard}>
                                <div className={styles.cardHeader}>
                                    <div className={styles.logoBox}>
                                        <img 
                                            src={`/HOTEL LOGOS-20260501T173926Z-3-001/HOTEL LOGOS/${partner.logoFilename}`}
                                            alt={partner.name}
                                            className={styles.logoImg}
                                        />
                                    </div>
                                    <div className={styles.headerInfo}>
                                        <h3 className={styles.hotelName}>{partner.name}</h3>
                                        <div className={styles.badgeRow}>
                                            <span className={styles.catBadge}>{partner.category}</span>
                                            <span className={styles.starBadge}>{partner.rating}</span>
                                        </div>
                                    </div>
                                </div>

                                <p className={styles.overviewSnippet}>
                                    {partner.overview.length > 120 ? partner.overview.substring(0, 120) + "..." : partner.overview}
                                </p>

                                <div className={styles.locationsRow}>
                                    <span className={styles.locIcon}>📍</span>
                                    <span className={styles.locText}>
                                        {partner.locations.slice(0, 3).join(", ")}
                                        {partner.locations.length > 3 ? " + more" : ""}
                                    </span>
                                </div>

                                <div className={styles.cardActionRow}>
                                    <Link 
                                        href={`/jobs?search=${encodeURIComponent(partner.name)}`}
                                        className={styles.viewJobsBtn}
                                    >
                                        View Openings &rarr;
                                    </Link>
                                    <Link 
                                        href={`/partners/${partner.id}`}
                                        className={styles.partnerDetailBtn}
                                    >
                                        Brand Info
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredPartners.length === 0 && (
                        <div className={styles.emptyState}>
                            <h3>No partner hotels match &quot;{searchTerm}&quot;</h3>
                            <p>Try searching for a different hotel brand or city, or reset filters.</p>
                            <button onClick={() => { setSearchTerm(""); setSelectedCategory("All"); }} className={styles.resetBtn}>
                                Reset Filters
                            </button>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
