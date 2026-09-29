"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/Card';
import { Footer } from '@/components/layout/Footer';
import styles from './Gallery.module.css';

interface GalleryItem {
    src: string;
    hotel?: string;
    person?: string;
    designation?: string;
}

interface GalleryGroup {
    city: string;
    images?: string[];
    items?: GalleryItem[];
}

interface FlattenedImage {
    src: string;
    encodedSrc: string;
    displayName: string;
    hotel: string;
    person: string;
    designation: string;
    city: string;
}

function parseImageDetails(src: string): { hotel: string; executive: string; displayName: string } {
    const fileNameWithExt = src.split('/').pop() || '';
    const rawName = fileNameWithExt.substring(0, fileNameWithExt.lastIndexOf('.')) || fileNameWithExt;
    const cleanName = rawName.replace(/^\d+[\.\s\-]+/, '').replace(/_/g, ' ').replace(/\s+/g, ' ').trim();

    if (cleanName.includes(' - ')) {
        const parts = cleanName.split(' - ');
        return {
            hotel: parts[0].trim(),
            executive: parts.slice(1).join(' - ').trim(),
            displayName: cleanName
        };
    }
    return {
        hotel: cleanName,
        executive: '',
        displayName: cleanName
    };
}

export default function GalleryClient({ galleryData }: { galleryData: GalleryGroup[] }) {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    const allImages: FlattenedImage[] = [];
    const groups = Array.isArray(galleryData) ? galleryData : [];
    
    groups.forEach(group => {
        if (group) {
            if (Array.isArray(group.items) && group.items.length > 0) {
                group.items.forEach(item => {
                    const encodedSrc = item.src.split('/').map(s => encodeURIComponent(s)).join('/');
                    const displayName = `${item.hotel || ''} - ${item.person || ''}`;
                    allImages.push({
                        src: item.src,
                        encodedSrc,
                        displayName,
                        hotel: item.hotel || '',
                        person: item.person || '',
                        designation: item.designation || '',
                        city: group.city
                    });
                });
            } else if (Array.isArray(group.images)) {
                group.images.forEach(src => {
                    const { hotel, executive, displayName } = parseImageDetails(src);
                    const encodedSrc = src.split('/').map(s => encodeURIComponent(s)).join('/');
                    allImages.push({
                        src,
                        encodedSrc,
                        displayName,
                        hotel,
                        person: executive,
                        designation: '',
                        city: group.city
                    });
                });
            }
        }
    });

    const activeImage = selectedIndex !== null ? allImages[selectedIndex] : null;

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (selectedIndex === null) return;
            if (e.key === 'Escape') setSelectedIndex(null);
            if (e.key === 'ArrowLeft') setSelectedIndex(prev => (prev === null || prev === 0 ? allImages.length - 1 : prev - 1));
            if (e.key === 'ArrowRight') setSelectedIndex(prev => (prev === null || prev === allImages.length - 1 ? 0 : prev + 1));
        };

        if (selectedIndex !== null) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleKeyDown);
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [selectedIndex, allImages.length]);

    let currentFlatIndex = 0;

    return (
        <div className={styles.galleryMain}>
            <section className={styles.hero}>
                <div className="container">
                    <h1>Our Gallery</h1>
                    <p>Experience the hospitality excellence across India's leading cities. Click any photo for full-screen view.</p>
                </div>
            </section>

            <div className="container">
                {groups.length > 0 ? (
                    groups.map(group => (
                        <section key={group.city} className={styles.citySection}>
                            <h2 className={styles.cityTitle}>{group.city}</h2>
                            <div className={styles.imageGrid}>
                                {((Array.isArray(group.items) && group.items.length > 0)
                                    ? group.items
                                    : (group.images || []).map(src => {
                                        const { hotel, executive } = parseImageDetails(src);
                                        return { src, hotel, person: executive, designation: '' };
                                    })
                                ).map((item) => {
                                    const thisIndex = currentFlatIndex;
                                    currentFlatIndex++;
                                    const encodedSrc = item.src.split('/').map(s => encodeURIComponent(s)).join('/');

                                    return (
                                        <Card 
                                            key={thisIndex} 
                                            className={styles.imageCard}
                                            onClick={() => setSelectedIndex(thisIndex)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <div className={styles.imageWrapper}>
                                                <Image 
                                                    src={encodedSrc} 
                                                    alt={item.hotel || 'Hotel Partner'}
                                                    fill
                                                    unoptimized
                                                    className={styles.image}
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                />
                                                {/* High-visibility overlay on the photo */}
                                                <div className={styles.photoBottomOverlay}>
                                                    <span className={styles.photoHotelBadge}>{item.hotel}</span>
                                                </div>
                                                <div className={styles.hoverOverlay}>
                                                    <span>View Photo</span>
                                                </div>
                                            </div>
                                            <CardContent className={styles.imageInfo}>
                                                <div className={styles.hotelLine}>
                                                    <h3 className={styles.hotelTitle}>{item.hotel}</h3>
                                                </div>
                                                {item.person && (
                                                    <div className={styles.personLine}>
                                                        <span className={styles.personIcon}>👤</span>
                                                        <span className={styles.personTitle}>{item.person}</span>
                                                    </div>
                                                )}
                                                {item.designation && (
                                                    <div className={styles.designationLine}>
                                                        <span className={styles.designationBadge}>{item.designation}</span>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                        </section>
                    ))
                ) : (
                    <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                        <h3>No images found in the gallery.</h3>
                    </div>
                )}
            </div>

            {activeImage && selectedIndex !== null && (
                <div 
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 99999,
                        backgroundColor: 'rgba(0, 15, 35, 0.95)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '1rem'
                    }}
                    onClick={() => setSelectedIndex(null)}
                >
                    <div 
                        style={{
                            position: 'absolute',
                            top: '1rem',
                            left: '1rem',
                            right: '1rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            color: 'white',
                            zIndex: 100000
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div style={{ fontSize: '0.9rem', fontWeight: 600, background: 'rgba(255, 255, 255, 0.1)', padding: '0.4rem 1rem', borderRadius: '999px' }}>
                            {activeImage.city} - Image {selectedIndex + 1} of {allImages.length}
                        </div>
                        <button
                            onClick={() => setSelectedIndex(null)}
                            style={{
                                background: 'rgba(255, 255, 255, 0.2)',
                                color: 'white',
                                border: 'none',
                                width: '2.5rem',
                                height: '2.5rem',
                                borderRadius: '50%',
                                fontSize: '1.2rem',
                                cursor: 'pointer'
                            }}
                        >
                            X
                        </button>
                    </div>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelectedIndex(prev => (prev === null || prev === 0 ? allImages.length - 1 : prev - 1));
                        }}
                        style={{
                            position: 'absolute',
                            left: '1rem',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'rgba(255, 255, 255, 0.2)',
                            color: 'white',
                            border: 'none',
                            width: '3rem',
                            height: '3rem',
                            borderRadius: '50%',
                            fontSize: '1rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            zIndex: 100000
                        }}
                    >
                        Prev
                    </button>

                    <div 
                        style={{
                            position: 'relative',
                            maxWidth: '90vw',
                            maxHeight: '75vh',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img 
                            src={activeImage.encodedSrc} 
                            alt={activeImage.displayName}
                            style={{
                                maxWidth: '100%',
                                maxHeight: '75vh',
                                objectFit: 'contain',
                                borderRadius: '8px'
                            }}
                        />
                    </div>

                    <div 
                        style={{
                            marginTop: '1.25rem',
                            textAlign: 'center',
                            color: 'white',
                            maxWidth: '850px',
                            padding: '0 1rem',
                            zIndex: 100000
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#fed488', marginBottom: '0.4rem', letterSpacing: '0.01em', textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
                            {activeImage.hotel}
                        </h3>
                        {activeImage.person && (
                            <p style={{ fontSize: '1.15rem', color: '#ffffff', fontWeight: 700, margin: '0 0 0.4rem 0', textShadow: '0 2px 6px rgba(0,0,0,0.8)' }}>
                                👤 {activeImage.person}
                            </p>
                        )}
                        {activeImage.designation && (
                            <p style={{ display: 'inline-block', background: 'rgba(37, 99, 235, 0.3)', border: '1px solid rgba(96, 165, 250, 0.6)', color: '#93c5fd', fontSize: '0.95rem', fontWeight: 600, padding: '0.35rem 0.85rem', borderRadius: '999px', margin: '0 0 0.6rem 0' }}>
                                {activeImage.designation}
                            </p>
                        )}
                        <p style={{ fontSize: '0.825rem', color: '#cbd5e1', margin: 0, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 500 }}>
                            📍 {activeImage.city} &bull; Shark Edutech Industry Collaboration
                        </p>
                    </div>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelectedIndex(prev => (prev === null || prev === allImages.length - 1 ? 0 : prev + 1));
                        }}
                        style={{
                            position: 'absolute',
                            right: '1rem',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'rgba(255, 255, 255, 0.2)',
                            color: 'white',
                            border: 'none',
                            width: '3rem',
                            height: '3rem',
                            borderRadius: '50%',
                            fontSize: '1rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            zIndex: 100000
                        }}
                    >
                        Next
                    </button>
                </div>
            )}
            <Footer />
        </div>
    );
}
