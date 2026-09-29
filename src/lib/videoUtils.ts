/**
 * Video & YouTube Utility Helpers for Shark EduTech Live Broadcasts
 */

export function extractYouTubeId(url: string | null | undefined): string | null {
    if (!url) return null;
    const trimmed = url.trim();

    // Direct 11 character ID check
    if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
        return trimmed;
    }

    // Match youtube.com/watch?v=, youtu.be/, youtube.com/live/, youtube.com/embed/, youtube.com/shorts/
    const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|live|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = trimmed.match(regExp);

    if (match && match[1]) {
        return match[1];
    }

    return null;
}

export function getYouTubeThumbnail(videoId: string | null | undefined, quality: 'max' | 'hq' | 'default' = 'max'): string {
    if (!videoId) return '/images/video-placeholder.jpg';
    if (quality === 'max') {
        return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    }
    if (quality === 'hq') {
        return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    }
    return `https://img.youtube.com/vi/${videoId}/default.jpg`;
}

export function getYouTubeEmbedUrl(videoId: string | null | undefined, autoplay: boolean = true): string {
    if (!videoId) return '';
    const autoParam = autoplay ? '1' : '0';
    return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=${autoParam}&rel=0&modestbranding=1&enablejsapi=1`;
}

export function formatVideoDuration(seconds?: number | string): string {
    if (!seconds) return '';
    if (typeof seconds === 'string') return seconds;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}
