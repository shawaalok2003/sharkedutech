"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import styles from "./LiveVideoPopup.module.css";
import { getYouTubeEmbedUrl, getYouTubeThumbnail } from "@/lib/videoUtils";

export interface LiveVideoData {
    id: string;
    title: string;
    description?: string | null;
    category?: string | null;
    videoType: string;
    youtubeUrl?: string | null;
    youtubeId?: string | null;
    videoUrl?: string | null;
    thumbnailUrl?: string | null;
    status: string;
    isLiveNow: boolean;
    speakerName?: string | null;
    speakerTitle?: string | null;
    scheduledAt?: string | null;
    duration?: string | null;
}

export function LiveVideoPopup() {
    const pathname = usePathname();
    const [liveVideo, setLiveVideo] = useState<LiveVideoData | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    // Don't show inside admin or dashboard management routes
    const isDashboardRoute = (
        pathname?.startsWith("/admin") ||
        pathname?.startsWith("/candidate/dashboard") ||
        pathname?.startsWith("/jobs/employer") ||
        pathname?.startsWith("/admissions/college")
    );

    const checkLiveVideos = async () => {
        try {
            const res = await fetch("/api/live-videos", { cache: "no-store" });
            const data = await res.json();
            if (data?.videos && data.videos.length > 0) {
                // Strictly check for an actively streaming live video (NOT recorded)
                const activeLive = data.videos.find((v: LiveVideoData) => v.isLiveNow || v.status === "LIVE_NOW");
                
                if (activeLive) {
                    setLiveVideo(activeLive);
                    
                    // If not manually dismissed in this session, open popup
                    const dismissedId = sessionStorage.getItem("dismissed_live_popup");
                    if (dismissedId !== activeLive.id) {
                        setIsOpen(true);
                        setIsMinimized(false);
                    } else {
                        setIsMinimized(true);
                    }
                } else {
                    // No active live stream -> hide popup completely
                    setLiveVideo(null);
                    setIsOpen(false);
                    setIsMinimized(false);
                }
            } else {
                setLiveVideo(null);
                setIsOpen(false);
                setIsMinimized(false);
            }
        } catch (err) {
            console.error("Failed to check live videos:", err);
        }
    };

    useEffect(() => {
        if (isDashboardRoute) return;
        checkLiveVideos();

        // Check periodically every 45s for newly started live broadcasts
        const interval = setInterval(checkLiveVideos, 45000);
        return () => clearInterval(interval);
    }, [pathname, isDashboardRoute]);

    if (isDashboardRoute || !liveVideo) {
        return null;
    }

    const isLive = liveVideo.isLiveNow || liveVideo.status === "LIVE_NOW";
    const thumbnail = liveVideo.thumbnailUrl || (liveVideo.youtubeId ? getYouTubeThumbnail(liveVideo.youtubeId) : "/images/video-placeholder.jpg");
    const embedUrl = liveVideo.youtubeId ? getYouTubeEmbedUrl(liveVideo.youtubeId, true) : null;

    const handleClose = (e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        setIsOpen(false);
        setIsMinimized(true);
        setIsPlaying(false);
        sessionStorage.setItem("dismissed_live_popup", liveVideo.id);
    };

    const handleRestore = () => {
        setIsMinimized(false);
        setIsOpen(true);
    };

    const handlePlay = (e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        setIsPlaying(true);
    };

    const handleScrollToLive = () => {
        const el = document.getElementById("live-broadcasts");
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    return (
        <>
            {/* Main Interactive Popup Modal */}
            {isOpen && (
                <aside 
                    className={`${styles.popupContainer} ${isLive ? styles.popupLiveBorder : ''}`}
                    aria-label="Live Video Announcement"
                >
                    {/* Header */}
                    <div className={styles.popupHeader}>
                        <div className={styles.badgeRow}>
                            {isLive ? (
                                <span className={styles.liveBadge}>
                                    <span className={styles.pulseDot} />
                                    LIVE NOW
                                </span>
                            ) : (
                                <span className={styles.broadcastBadge}>
                                    <span className={styles.pulseDot} />
                                    LIVE BROADCAST
                                </span>
                            )}
                            <span className={styles.categoryTag}>
                                {liveVideo.category || "Placement Talk"}
                            </span>
                        </div>
                        <button 
                            onClick={handleClose} 
                            className={styles.closeButton}
                            aria-label="Close live popup"
                            title="Close"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Media Preview Box */}
                    <div className={styles.mediaBox} onClick={!isPlaying ? handlePlay : undefined}>
                        {isPlaying ? (
                            embedUrl ? (
                                <iframe 
                                    src={embedUrl} 
                                    title={liveVideo.title}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                    className={styles.videoIframe}
                                />
                            ) : liveVideo.videoUrl ? (
                                <video 
                                    src={liveVideo.videoUrl} 
                                    controls 
                                    autoPlay 
                                    className={styles.videoIframe}
                                />
                            ) : (
                                <img src={thumbnail} alt={liveVideo.title} className={styles.thumbnailImage} />
                            )
                        ) : (
                            <>
                                <img src={thumbnail} alt={liveVideo.title} className={styles.thumbnailImage} />
                                <div className={styles.thumbnailOverlay}>
                                    <div className={styles.playIconWrapper}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                            <polygon points="5 3 19 12 5 21 5 3" />
                                        </svg>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Popup Body Details */}
                    <div className={styles.popupBody}>
                        <h4 className={styles.videoTitle}>{liveVideo.title}</h4>
                        {liveVideo.speakerName && (
                            <p className={styles.speakerInfo}>
                                <span>🎙️</span>
                                <span>{liveVideo.speakerName} {liveVideo.speakerTitle ? `(${liveVideo.speakerTitle})` : ''}</span>
                            </p>
                        )}

                        <div className={styles.actionRow}>
                            {!isPlaying ? (
                                <button onClick={handlePlay} className={styles.watchBtn}>
                                    <span>▶</span>
                                    <span>Watch {isLive ? "Live Stream" : "Broadcast"}</span>
                                </button>
                            ) : (
                                <button onClick={handleScrollToLive} className={styles.watchBtn}>
                                    <span>View on Page</span>
                                </button>
                            )}
                            <button onClick={handleClose} className={styles.expandBtn} title="Minimize to badge">
                                Dismiss
                            </button>
                        </div>
                    </div>
                </aside>
            )}

            {/* Minimized Floating Beacon Badge (When dismissed, user can reopen anytime) */}
            {isMinimized && (
                <div 
                    onClick={handleRestore}
                    className={styles.minimizedBeacon}
                    title="Click to view live stream"
                    role="button"
                    tabIndex={0}
                >
                    <span className={styles.beaconDot} />
                    <span className={styles.beaconText}>
                        {isLive ? "Live Stream Ongoing" : "Live Video Available"}
                    </span>
                    <span className={styles.beaconArrow}>▶</span>
                </div>
            )}
        </>
    );
}
