"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/Card';
import { Footer } from '@/components/layout/Footer';
import styles from './Gallery.module.css';

interface GalleryGroup {
    city: string;
    images: string[];
}

interface FlattenedImage {
    src: string;
    encodedSrc: string;
    displayName: string;
    city: string;
}

function getDisplayNameFromSrc(src: string): string {
    const fileNameWithExt = src.split('/').pop() || '';
    const fileName = fileNameWithExt.substring(0, fileNameWithExt.lastIndexOf('.')) || fileNameWithExt;
    return fileName.replace(/_/g, ' ').replace(/\s+/g, ' ').trim();
}

export default function GalleryClient({ galleryData }: { galleryData: GalleryGroup[] }) {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    const allImages: FlattenedImage[] = [];
    const groups = Array.isArray(galleryData) ? galleryData : [];
    
    groups.forEach(group => {
        if (group && Array.isArray(group.images)) {
            group.images.forEach(src => {
                const displayName = getDisplayNameFromSrc(src);
                const encodedSrc = src.split('/').map(s => encodeURIComponent(s)).join('/');
                allImages.push({ src, encodedSrc, displayName, city: group.city });
            });
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
                                {group.images.map((src) => {
                                    const thisIndex = currentFlatIndex;
                                    currentFlatIndex++;
                                    const displayName = getDisplayNameFromSrc(src);
                                    const encodedSrc = src.split('/').map(s => encodeURIComponent(s)).join('/');

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
                                                    alt={displayName}
                                                    fill
                                                    unoptimized
                                                    className={styles.image}
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                />
                                                <div className={styles.hoverOverlay}>
                                                    <span>View Photo</span>
                                                </div>
                                            </div>
                                            <CardContent className={styles.imageInfo}>
                                                <p className={styles.imageName}>
                                                    {displayName}
                                                </p>
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
                            marginTop: '1rem',
                            textAlign: 'center',
                            color: 'white',
                            zIndex: 100000
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.2rem' }}>
                            {activeImage.displayName}
                        </h3>
                        <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                            {activeImage.city} - Shark Edutech
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
