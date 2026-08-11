"use client";

import React, { useState, useEffect } from "react";
import styles from "./AllHotelsModal.module.css";
import { getHotelPartnerData, HotelPartner } from "@/data/hotelPartnersData";

interface AllHotelsModalProps {
    logos: string[];
    onClose: () => void;
}

export const AllHotelsModal: React.FC<AllHotelsModalProps> = ({ logos, onClose }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [partnersList, setPartnersList] = useState<HotelPartner[]>([]);

    useEffect(() => {
        // Prevent body scrolling
        document.body.style.overflow = "hidden";
        
        // Remove duplicates and construct partner objects
        const uniqueLogos = Array.from(new Set(logos));
        const list = uniqueLogos.map((logo) => getHotelPartnerData(logo));
        setPartnersList(list);

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            document.body.style.overflow = "";
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [logos, onClose]);

    const filteredPartners = partnersList.filter((partner) => {
        const query = searchTerm.toLowerCase().trim();
        if (!query) return true;
        return (
            partner.name.toLowerCase().includes(query) ||
            partner.category.toLowerCase().includes(query) ||
            partner.locations.some((loc) => loc.toLowerCase().includes(query))
        );
    });

    return (
        <div className={styles.backdrop} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className={styles.header}>
                    <button className={styles.closeBtn} onClick={onClose} aria-label="Close modal">
                        &times;
                    </button>

                    <div className={styles.headerTag}>RECRUITMENT & PLACEMENT NETWORK</div>
                    <h2 className={styles.headerTitle}>All Industry Partner Hotels ({partnersList.length})</h2>

                    <div className={styles.searchContainer}>
                        <span className={styles.searchIcon}>🔍</span>
                        <input
                            type="text"
                            className={styles.searchInput}
                            placeholder="Search hotel brands or locations (e.g. Marriott, Hilton, Goa)..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Body: Hotel Directory Grid */}
                <div className={styles.body}>
                    <div className={styles.hotelCount}>
                        Showing {filteredPartners.length} of {partnersList.length} Partner Hotel Chains
                    </div>

                    <div className={styles.grid}>
                        {filteredPartners.map((partner, idx) => (
                            <div key={`${partner.id}-${idx}`} className={styles.card}>
                                <div>
                                    <div className={styles.cardHeader}>
                                        <div className={styles.logoBox}>
                                            <img
                                                src={`/HOTEL LOGOS-20260501T173926Z-3-001/HOTEL LOGOS/${partner.logoFilename}`}
                                                alt={partner.name}
                                                className={styles.logoImg}
                                            />
                                        </div>
                                        <div className={styles.cardTitleSection}>
                                            <h3 className={styles.hotelName}>{partner.name}</h3>
                                            <div className={styles.badges}>
                                                <span className={styles.badge}>{partner.category}</span>
                                                <span className={styles.starBadge}>★ {partner.rating}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={styles.locations}>
                                        📍 <strong>Locations:</strong> {partner.locations.slice(0, 4).join(", ")}
                                        {partner.locations.length > 4 ? " & more" : ""}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className={styles.footer}>
                    <span className={styles.footerText}>
                        Connecting top hospitality candidates with 30+ luxury brands nationwide.
                    </span>
                    <button className={styles.closeFooterBtn} onClick={onClose}>
                        Close List
                    </button>
                </div>
            </div>
        </div>
    );
};
