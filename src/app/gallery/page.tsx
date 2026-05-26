import { Metadata } from 'next';
import path from 'path';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/Card';
import { Footer } from '@/components/layout/Footer';
import styles from './Gallery.module.css';
import galleryData from './galleryData.json';

export const metadata: Metadata = {
    title: 'Gallery | Sharkedutech',
    description: 'Explore our gallery of hospitality education and industry interactions across India.',
};

export default function GalleryPage() {

    return (
        <div className={styles.galleryMain}>
            <section className={styles.hero}>
                <div className="container">
                    <h1>Our Gallery</h1>
                    <p>Experience the hospitality excellence across India's leading cities. From campus to corporate, we capture it all.</p>
                </div>
            </section>

            <div className="container">
                {galleryData.length > 0 ? (
                    galleryData.map(group => (
                        <section key={group.city} className={styles.citySection}>
                            <h2 className={styles.cityTitle}>{group.city}</h2>
                            <div className={styles.imageGrid}>
                                {group.images.map((src, index) => {
                                    // Prettify the filename for the display
                                    const fileName = path.basename(src).split('.')[0];
                                    const displayName = fileName
                                        .replace(/_/g, ' ')
                                        .replace(/\s+/g, ' ')
                                        .trim();

                                    return (
                                        <Card key={index} className={styles.imageCard}>
                                            <div className={styles.imageWrapper}>
                                                <Image 
                                                    src={src} 
                                                    alt={displayName}
                                                    fill
                                                    className={styles.image}
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                />
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
                        <h3>No images found in the gallery folders.</h3>
                        <p>Please ensure city folders exist in the public directory.</p>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}
