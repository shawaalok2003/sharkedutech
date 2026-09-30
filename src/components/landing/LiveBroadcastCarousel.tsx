"use client";

import { useRef, useState, useEffect } from 'react';
import styles from './LiveBroadcastCarousel.module.css';
import { getYouTubeEmbedUrl, extractYouTubeId } from '@/lib/videoUtils';

export interface LiveVideoItem {
    id: string;
    title: string;
    description?: string | null;
    category?: string | null;
    videoType: string;
    youtubeUrl?: string | null;
    youtubeId?: string | null;
    videoUrl?: string | null;
    thumbnailUrl?: string | null;
    status: string; // 'LIVE_NOW' | 'UPCOMING' | 'RECORDED'
    isLiveNow: boolean;
    isFeatured: boolean;
    duration?: string | null;
    speakerName?: string | null;
    speakerTitle?: string | null;
    viewsCount?: number;
}

export function LiveBroadcastCarousel({ initialVideos = [] }: { initialVideos?: LiveVideoItem[] }) {
    const [videos, setVideos] = useState<LiveVideoItem[]>(initialVideos);
    const [activeModalVideo, setActiveModalVideo] = useState<LiveVideoItem | null>(null);
    const carouselRef = useRef<HTMLDivElement>(null);

    // Fetch latest live videos if not supplied or to ensure real-time updates
    useEffect(() => {
        if (!initialVideos || initialVideos.length === 0) {
            fetch('/api/live-videos')
                .then(res => res.json())
                .then(data => {
                    if (data?.videos) {
                        setVideos(data.videos);
                    }
                })
                .catch(err => console.error('Failed to load live broadcasts:', err));
        }
    }, [initialVideos]);

    // Close modal on Escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setActiveModalVideo(null);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const scrollLeft = () => {
        if (carouselRef.current) {
            carouselRef.current.scrollBy({ left: -400, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (carouselRef.current) {
            carouselRef.current.scrollBy({ left: 400, behavior: 'smooth' });
        }
    };

    const hasLiveNow = videos.some(v => v.isLiveNow || v.status === 'LIVE_NOW');
    const liveCount = videos.filter(v => v.isLiveNow || v.status === 'LIVE_NOW').length;

    if (!videos || videos.length === 0) {
        return null;
    }

    return (
        <section className={styles.section} id="video-gallery">
            <div className={styles.container}>
                <div className={styles.headerRow}>
                    <div className={styles.headerLeft}>
                        {hasLiveNow && (
                            <div className={styles.liveAlertBadge}>
                                <span className={styles.pulseDot}></span>
                                <span>{liveCount} Live Session{liveCount > 1 ? 's' : ''} Streaming Right Now</span>
                            </div>
                        )}
                        <h2 className={styles.title} style={{ margin: 0 }}>
                            Video <span className={styles.highlight}>Gallery</span>
                        </h2>
                    </div>

                    <div className={styles.navControls}>
                        <button onClick={scrollLeft} className={styles.navBtn} aria-label="Scroll left">←</button>
                        <button onClick={scrollRight} className={styles.navBtn} aria-label="Scroll right">→</button>
                    </div>
                </div>

                <div className={styles.carousel} ref={carouselRef}>
                    {videos.map((item) => {
                        const isLive = item.isLiveNow || item.status === 'LIVE_NOW';
                        const isUpcoming = item.status === 'UPCOMING';
                        const fallbackThumb = item.youtubeId
                            ? `https://img.youtube.com/vi/${item.youtubeId}/hqdefault.jpg`
                            : 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80';

                        return (
                            <div
                                key={item.id}
                                className={`${styles.videoCard} ${isLive ? styles.cardIsLive : ''}`}
                                onClick={() => setActiveModalVideo(item)}
                                role="button"
                                tabIndex={0}
                                aria-label={`Play ${item.title}`}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        setActiveModalVideo(item);
                                    }
                                }}
                            >
                                <div className={styles.thumbnailWrapper}>
                                    <img
                                        src={item.thumbnailUrl || fallbackThumb}
                                        alt={item.title}
                                        className={styles.thumbnailImage}
                                        loading="lazy"
                                        onError={(e) => {
                                            // Fallback on image error
                                            (e.currentTarget as HTMLImageElement).src = fallbackThumb;
                                        }}
                                    />
                                    <div className={styles.cardOverlay}></div>

                                    {/* Status Badge */}
                                    <div className={styles.badgeTopLeft}>
                                        {isLive ? (
                                            <span className={styles.liveBadge}>
                                                <span className={styles.pulseDot} style={{ width: 6, height: 6 }}></span>
                                                LIVE NOW
                                            </span>
                                        ) : isUpcoming ? (
                                            <span className={styles.upcomingBadge}>
                                                ⏳ UPCOMING
                                            </span>
                                        ) : (
                                            <span className={styles.recordedBadge}>
                                                📼 REPLAY
                                            </span>
                                        )}
                                    </div>

                                    {/* Category Pill */}
                                    {item.category && (
                                        <div className={styles.badgeTopRight}>
                                            <span className={styles.categoryPill}>{item.category}</span>
                                        </div>
                                    )}

                                    {/* Play Overlay */}
                                    <div className={styles.playOverlay}>
                                        <div className={styles.playButtonCircle}>
                                            ▶
                                        </div>
                                    </div>

                                    {/* Duration or Live Tag */}
                                    {item.duration && (
                                        <span className={styles.durationTag}>
                                            {isLive ? '🔴 LIVE' : item.duration}
                                        </span>
                                    )}
                                </div>

                                <div className={styles.cardBody}>
                                    <h3 className={styles.cardTitle}>{item.title}</h3>
                                    {item.description && (
                                        <p className={styles.cardDesc}>{item.description}</p>
                                    )}

                                    {(item.speakerName || item.speakerTitle) && (
                                        <div className={styles.speakerBox}>
                                            <div className={styles.speakerAvatar}>
                                                {(item.speakerName || 'S').charAt(0).toUpperCase()}
                                            </div>
                                            <div className={styles.speakerInfo}>
                                                <div className={styles.speakerName}>{item.speakerName || 'Shark EduTech'}</div>
                                                <div className={styles.speakerTitle}>{item.speakerTitle || 'Session Lead'}</div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Video Player Modal */}
            {activeModalVideo && (
                <div
                    className={styles.modalBackdrop}
                    onClick={() => setActiveModalVideo(null)}
                    role="dialog"
                    aria-modal="true"
                >
                    <div
                        className={styles.modalContent}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className={styles.modalHeader}>
                            <div className={styles.modalTitleGroup}>
                                {(activeModalVideo.isLiveNow || activeModalVideo.status === 'LIVE_NOW') && (
                                    <span className={styles.liveBadge} style={{ fontSize: '0.65rem', padding: '0.2rem 0.5rem' }}>
                                        🔴 LIVE
                                    </span>
                                )}
                                <h3 className={styles.modalTitle}>{activeModalVideo.title}</h3>
                            </div>
                            <button
                                className={styles.closeButton}
                                onClick={() => setActiveModalVideo(null)}
                                aria-label="Close video player"
                            >
                                ✕
                            </button>
                        </div>

                        <div className={styles.playerContainer}>
                            {activeModalVideo.videoType === 'DIRECT_UPLOAD' && activeModalVideo.videoUrl ? (
                                <video
                                    src={activeModalVideo.videoUrl}
                                    controls
                                    autoPlay
                                    className={styles.videoElement}
                                />
                            ) : (
                                <iframe
                                    src={getYouTubeEmbedUrl(
                                        activeModalVideo.youtubeId || extractYouTubeId(activeModalVideo.youtubeUrl)
                                    )}
                                    title={activeModalVideo.title}
                                    className={styles.iframePlayer}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                />
                            )}
                        </div>

                        <div className={styles.modalFooter}>
                            {activeModalVideo.speakerName && (
                                <div className={styles.modalSpeaker}>
                                    🎙️ Hosted by {activeModalVideo.speakerName} {activeModalVideo.speakerTitle ? `(${activeModalVideo.speakerTitle})` : ''}
                                </div>
                            )}
                            {activeModalVideo.description && (
                                <p className={styles.modalDesc}>{activeModalVideo.description}</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
