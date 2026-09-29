"use client";

import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { extractYouTubeId, getYouTubeThumbnail, getYouTubeEmbedUrl } from "@/lib/videoUtils";

export interface LiveVideo {
    id: string;
    title: string;
    description: string | null;
    category: string;
    videoType: string;
    youtubeUrl: string | null;
    youtubeId: string | null;
    videoUrl: string | null;
    thumbnailUrl: string | null;
    status: string;
    isLiveNow: boolean;
    isFeatured: boolean;
    duration: string | null;
    speakerName: string | null;
    speakerTitle: string | null;
    scheduledAt: string | null;
    viewsCount: number;
    createdAt: string;
}

export function LiveVideosAdminSection({ compact = false }: { compact?: boolean }) {
    const [videos, setVideos] = useState<LiveVideo[]>([]);
    const [stats, setStats] = useState({ total: 0, liveNow: 0, upcoming: 0, recorded: 0 });
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [searchTerm, setSearchTerm] = useState("");

    // Modal state for Add / Edit
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingVideo, setEditingVideo] = useState<LiveVideo | null>(null);

    // Form inputs
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("Live Session");
    const [videoType, setVideoType] = useState<"YOUTUBE" | "DIRECT_UPLOAD">("YOUTUBE");
    const [youtubeUrl, setYoutubeUrl] = useState("");
    const [videoUrl, setVideoUrl] = useState("");
    const [thumbnailUrl, setThumbnailUrl] = useState("");
    const [status, setStatus] = useState("RECORDED");
    const [isLiveNow, setIsLiveNow] = useState(false);
    const [isFeatured, setIsFeatured] = useState(true);
    const [speakerName, setSpeakerName] = useState("");
    const [speakerTitle, setSpeakerTitle] = useState("");
    const [duration, setDuration] = useState("");
    const [scheduledAt, setScheduledAt] = useState("");

    // Upload state
    const [uploadingVideo, setUploadingVideo] = useState(false);
    const [uploadingThumb, setUploadingThumb] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

    // Preview modal state
    const [previewVideo, setPreviewVideo] = useState<LiveVideo | null>(null);

    // File input refs
    const videoFileRef = useRef<HTMLInputElement>(null);
    const thumbFileRef = useRef<HTMLInputElement>(null);

    const fetchVideos = async () => {
        try {
            setLoading(true);
            const query = new URLSearchParams();
            if (statusFilter !== "ALL") query.append("status", statusFilter);
            if (searchTerm.trim()) query.append("search", searchTerm.trim());

            const res = await fetch(`/api/admin/live-videos?${query.toString()}`);
            if (res.status === 401) {
                // Session expired or unauthenticated
                setMessage({ text: "Please log in to manage broadcasts.", type: "error" });
                setLoading(false);
                return;
            }
            const data = await res.json();
            if (data.videos) {
                setVideos(data.videos);
                if (data.stats) setStats(data.stats);
            }
        } catch (err) {
            console.error("Error loading videos:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVideos();
    }, [statusFilter]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        fetchVideos();
    };

    const openCreateModal = () => {
        setEditingVideo(null);
        setTitle("");
        setDescription("");
        setCategory("Live Session");
        setVideoType("YOUTUBE");
        setYoutubeUrl("");
        setVideoUrl("");
        setThumbnailUrl("");
        setStatus("RECORDED");
        setIsLiveNow(false);
        setIsFeatured(true);
        setSpeakerName("");
        setSpeakerTitle("");
        setDuration("45 mins");
        setScheduledAt("");
        setIsModalOpen(true);
    };

    const openEditModal = (v: LiveVideo) => {
        setEditingVideo(v);
        setTitle(v.title || "");
        setDescription(v.description || "");
        setCategory(v.category || "Live Session");
        setVideoType((v.videoType as any) || "YOUTUBE");
        setYoutubeUrl(v.youtubeUrl || "");
        setVideoUrl(v.videoUrl || "");
        setThumbnailUrl(v.thumbnailUrl || "");
        setStatus(v.status || "RECORDED");
        setIsLiveNow(v.isLiveNow);
        setIsFeatured(v.isFeatured);
        setSpeakerName(v.speakerName || "");
        setSpeakerTitle(v.speakerTitle || "");
        setDuration(v.duration || "");
        setScheduledAt(v.scheduledAt ? new Date(v.scheduledAt).toISOString().slice(0, 16) : "");
        setIsModalOpen(true);
    };

    const detectedYouTubeId = extractYouTubeId(youtubeUrl);
    const detectedYouTubeThumb = detectedYouTubeId ? getYouTubeThumbnail(detectedYouTubeId, "max") : null;

    const handleVideoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setUploadingVideo(true);
            const formData = new FormData();
            formData.append("file", file);
            formData.append("type", "video");

            const res = await fetch("/api/admin/live-videos/upload", {
                method: "POST",
                body: formData
            });

            const data = await res.json();
            if (data.success && data.url) {
                setVideoUrl(data.url);
                setMessage({ text: `Video file uploaded (${(file.size / (1024 * 1024)).toFixed(1)} MB)`, type: "success" });
            } else {
                setMessage({ text: data.error || "Failed to upload video", type: "error" });
            }
        } catch (err) {
            console.error("Video upload error:", err);
            setMessage({ text: "Error uploading video file", type: "error" });
        } finally {
            setUploadingVideo(false);
        }
    };

    const handleThumbFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setUploadingThumb(true);
            const formData = new FormData();
            formData.append("file", file);
            formData.append("type", "thumbnail");

            const res = await fetch("/api/admin/live-videos/upload", {
                method: "POST",
                body: formData
            });

            const data = await res.json();
            if (data.success && data.url) {
                setThumbnailUrl(data.url);
                setMessage({ text: "Thumbnail uploaded successfully", type: "success" });
            } else {
                setMessage({ text: data.error || "Failed to upload thumbnail", type: "error" });
            }
        } catch (err) {
            console.error("Thumbnail upload error:", err);
            setMessage({ text: "Error uploading thumbnail", type: "error" });
        } finally {
            setUploadingThumb(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) {
            alert("Please enter a title");
            return;
        }

        try {
            setSaving(true);
            const payload = {
                title: title.trim(),
                description: description.trim() || null,
                category,
                videoType,
                youtubeUrl: videoType === "YOUTUBE" ? youtubeUrl.trim() : null,
                videoUrl: videoType === "DIRECT_UPLOAD" ? videoUrl.trim() : null,
                thumbnailUrl: thumbnailUrl.trim() || (videoType === "YOUTUBE" ? detectedYouTubeThumb : null),
                status: isLiveNow ? "LIVE_NOW" : status,
                isLiveNow,
                isFeatured,
                duration: duration.trim() || null,
                speakerName: speakerName.trim() || null,
                speakerTitle: speakerTitle.trim() || null,
                scheduledAt: scheduledAt ? new Date(scheduledAt).toISOString() : null
            };

            const endpoint = editingVideo
                ? `/api/admin/live-videos/${editingVideo.id}`
                : "/api/admin/live-videos";
            const method = editingVideo ? "PATCH" : "POST";

            const res = await fetch(endpoint, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            if (data.success) {
                setMessage({
                    text: editingVideo ? "Video updated successfully!" : "Broadcast/Video published successfully!",
                    type: "success"
                });
                setIsModalOpen(false);
                fetchVideos();
            } else {
                setMessage({ text: data.error || "Failed to save video", type: "error" });
            }
        } catch (err) {
            console.error("Save error:", err);
            setMessage({ text: "Error saving video", type: "error" });
        } finally {
            setSaving(false);
        }
    };

    const toggleLiveStatus = async (v: LiveVideo) => {
        const nextIsLive = !v.isLiveNow;
        const confirmMsg = nextIsLive
            ? `Start live streaming for "${v.title}"? This will display the red LIVE NOW badge on the home page.`
            : `End live stream for "${v.title}"? It will be marked as Recorded Replay so visitors can still watch it.`;

        if (!confirm(confirmMsg)) return;

        try {
            const res = await fetch(`/api/admin/live-videos/${v.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    isLiveNow: nextIsLive,
                    status: nextIsLive ? "LIVE_NOW" : "RECORDED"
                })
            });
            const data = await res.json();
            if (data.success) {
                fetchVideos();
            }
        } catch (err) {
            console.error("Error toggling live status:", err);
        }
    };

    const toggleFeatured = async (v: LiveVideo) => {
        try {
            const res = await fetch(`/api/admin/live-videos/${v.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isFeatured: !v.isFeatured })
            });
            const data = await res.json();
            if (data.success) {
                fetchVideos();
            }
        } catch (err) {
            console.error("Error toggling featured:", err);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to permanently delete "${name}"?`)) return;

        try {
            const res = await fetch(`/api/admin/live-videos/${id}`, {
                method: "DELETE"
            });
            const data = await res.json();
            if (data.success) {
                setMessage({ text: `Video "${name}" was permanently deleted.`, type: "success" });
                fetchVideos();
            } else {
                setMessage({ text: data.error || "Failed to delete video", type: "error" });
            }
        } catch (err) {
            console.error("Delete error:", err);
            setMessage({ text: "Error deleting video", type: "error" });
        }
    };

    return (
        <div>
            {/* Header Title & Go Live Action */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", marginBottom: "1.5rem" }}>
                <div>
                    <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#002147", margin: "0 0 0.35rem 0" }}>
                        📺 Live Streams & Videos Hub (Home Carousel)
                    </h2>
                    <p style={{ color: "#64748b", margin: 0, fontSize: "0.9rem" }}>
                        Go live, publish YouTube videos, or upload video recordings directly to the landing page carousel.
                    </p>
                </div>

                <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                    <Button
                        onClick={openCreateModal}
                        style={{
                            background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                            color: "#ffffff",
                            fontWeight: 700,
                            boxShadow: "0 4px 14px rgba(220, 38, 38, 0.35)",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem"
                        }}
                    >
                        <span>🔴</span> Go Live / Add Video
                    </Button>
                </div>
            </div>

            {/* Notification alert */}
            {message && (
                <div style={{
                    padding: "0.85rem 1.25rem",
                    borderRadius: "10px",
                    marginBottom: "1.25rem",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: message.type === "success" ? "#ecfdf5" : "#fef2f2",
                    color: message.type === "success" ? "#065f46" : "#991b1b",
                    border: `1px solid ${message.type === "success" ? "#a7f3d0" : "#fecaca"}`
                }}>
                    <span>{message.text}</span>
                    <button
                        onClick={() => setMessage(null)}
                        style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", fontWeight: 700 }}
                    >
                        ✕
                    </button>
                </div>
            )}

            {/* Quick Stats Banner */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
                <Card style={{ padding: "1rem 1.25rem", background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "12px" }}>
                    <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Total Broadcasts</div>
                    <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#002147", marginTop: "0.2rem" }}>{stats.total}</div>
                </Card>

                <Card style={{
                    padding: "1rem 1.25rem",
                    background: stats.liveNow > 0 ? "linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)" : "#ffffff",
                    border: `1px solid ${stats.liveNow > 0 ? "#fca5a5" : "#e2e8f0"}`,
                    borderRadius: "12px"
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                        <span style={{
                            width: 8, height: 8, borderRadius: "50%",
                            backgroundColor: stats.liveNow > 0 ? "#ef4444" : "#94a3b8"
                        }}></span>
                        <span style={{ fontSize: "0.75rem", fontWeight: 700, color: stats.liveNow > 0 ? "#991b1b" : "#64748b", textTransform: "uppercase" }}>
                            Live Now Active
                        </span>
                    </div>
                    <div style={{ fontSize: "1.6rem", fontWeight: 800, color: stats.liveNow > 0 ? "#dc2626" : "#64748b", marginTop: "0.2rem" }}>
                        {stats.liveNow}
                    </div>
                </Card>

                <Card style={{ padding: "1rem 1.25rem", background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "12px" }}>
                    <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#d97706", textTransform: "uppercase" }}>⏳ Upcoming Lives</div>
                    <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#d97706", marginTop: "0.2rem" }}>{stats.upcoming}</div>
                </Card>

                <Card style={{ padding: "1rem 1.25rem", background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "12px" }}>
                    <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#0284c7", textTransform: "uppercase" }}>📼 Recorded Videos</div>
                    <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#0284c7", marginTop: "0.2rem" }}>{stats.recorded}</div>
                </Card>
            </div>

            {/* Filters & Search Row */}
            <div style={{
                background: "#ffffff",
                padding: "0.85rem 1.15rem",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "0.75rem",
                marginBottom: "1.25rem"
            }}>
                <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                    {[
                        { label: "All Videos", val: "ALL" },
                        { label: "🔴 Live Now", val: "LIVE_NOW" },
                        { label: "⏳ Upcoming", val: "UPCOMING" },
                        { label: "📼 Recorded Replay", val: "RECORDED" }
                    ].map(f => (
                        <button
                            key={f.val}
                            onClick={() => setStatusFilter(f.val)}
                            style={{
                                padding: "0.4rem 0.8rem",
                                borderRadius: "8px",
                                border: statusFilter === f.val ? "1px solid #002147" : "1px solid #cbd5e1",
                                background: statusFilter === f.val ? "#002147" : "#f8fafc",
                                color: statusFilter === f.val ? "#ffffff" : "#475569",
                                fontWeight: 700,
                                fontSize: "0.8rem",
                                cursor: "pointer"
                            }}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>

                <form onSubmit={handleSearchSubmit} style={{ display: "flex", gap: "0.5rem" }}>
                    <input
                        type="text"
                        placeholder="Search broadcasts..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            padding: "0.4rem 0.75rem",
                            borderRadius: "8px",
                            border: "1px solid #cbd5e1",
                            fontSize: "0.825rem",
                            width: "200px",
                            outline: "none"
                        }}
                    />
                    <Button type="submit" variant="outline" style={{ fontSize: "0.8rem", padding: "0.4rem 0.8rem" }}>
                        Search
                    </Button>
                </form>
            </div>

            {/* Video List Cards */}
            {loading ? (
                <div style={{ textAlign: "center", padding: "3rem 0", color: "#64748b" }}>
                    <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>⏳</div>
                    <div>Loading live broadcasts & videos...</div>
                </div>
            ) : videos.length === 0 ? (
                <div style={{
                    textAlign: "center",
                    padding: "3rem 2rem",
                    background: "#ffffff",
                    borderRadius: "14px",
                    border: "1px dashed #cbd5e1"
                }}>
                    <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>🎬</div>
                    <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#002147", margin: "0 0 0.4rem 0" }}>
                        No videos found
                    </h3>
                    <p style={{ color: "#64748b", margin: "0 0 1rem 0", maxWidth: "450px", marginLeft: "auto", marginRight: "auto", fontSize: "0.875rem" }}>
                        You haven't uploaded or streamed any videos under this filter yet. Add a YouTube live link or upload a video recording!
                    </p>
                    <Button onClick={openCreateModal} style={{ background: "#002147", color: "#ffffff", fontSize: "0.85rem" }}>
                        + Add First Video / Live Stream
                    </Button>
                </div>
            ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.25rem" }}>
                    {videos.map((v) => {
                        const fallbackThumb = v.youtubeId
                            ? `https://img.youtube.com/vi/${v.youtubeId}/hqdefault.jpg`
                            : "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80";

                        return (
                            <Card
                                key={v.id}
                                style={{
                                    background: "#ffffff",
                                    borderRadius: "14px",
                                    overflow: "hidden",
                                    border: v.isLiveNow ? "2px solid #ef4444" : "1px solid #e2e8f0",
                                    boxShadow: v.isLiveNow ? "0 8px 24px rgba(239, 68, 68, 0.15)" : "0 4px 12px rgba(0, 0, 0, 0.04)",
                                    display: "flex",
                                    flexDirection: "column"
                                }}
                            >
                                {/* Thumbnail Header */}
                                <div style={{ position: "relative", width: "100%", aspectRatio: "16 / 9", background: "#000" }}>
                                    <img
                                        src={v.thumbnailUrl || fallbackThumb}
                                        alt={v.title}
                                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                    />
                                    <div style={{
                                        position: "absolute",
                                        inset: 0,
                                        background: "linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)"
                                    }}></div>

                                    {/* Status Badge */}
                                    <div style={{ position: "absolute", top: "10px", left: "10px", zIndex: 2 }}>
                                        {v.isLiveNow ? (
                                            <span style={{
                                                background: "#dc2626",
                                                color: "#ffffff",
                                                fontWeight: 800,
                                                fontSize: "0.7rem",
                                                padding: "0.2rem 0.55rem",
                                                borderRadius: "6px",
                                                display: "inline-flex",
                                                alignItems: "center",
                                                gap: "0.3rem"
                                            }}>
                                                🔴 LIVE NOW
                                            </span>
                                        ) : v.status === "UPCOMING" ? (
                                            <span style={{
                                                background: "#d97706",
                                                color: "#ffffff",
                                                fontWeight: 700,
                                                fontSize: "0.7rem",
                                                padding: "0.2rem 0.55rem",
                                                borderRadius: "6px"
                                            }}>
                                                ⏳ UPCOMING
                                            </span>
                                        ) : (
                                            <span style={{
                                                background: "#334155",
                                                color: "#e2e8f0",
                                                fontWeight: 700,
                                                fontSize: "0.7rem",
                                                padding: "0.2rem 0.55rem",
                                                borderRadius: "6px"
                                            }}>
                                                📼 RECORDED
                                            </span>
                                        )}
                                    </div>

                                    {/* Video Type Pill */}
                                    <div style={{ position: "absolute", top: "10px", right: "10px", zIndex: 2 }}>
                                        <span style={{
                                            background: "rgba(0,0,0,0.75)",
                                            color: "#ffffff",
                                            fontWeight: 700,
                                            fontSize: "0.68rem",
                                            padding: "0.2rem 0.45rem",
                                            borderRadius: "6px",
                                            border: "1px solid rgba(255,255,255,0.2)"
                                        }}>
                                            {v.videoType === "YOUTUBE" ? "▶ YouTube" : "📁 Direct Video"}
                                        </span>
                                    </div>

                                    {/* Play preview trigger */}
                                    <button
                                        onClick={() => setPreviewVideo(v)}
                                        style={{
                                            position: "absolute",
                                            top: "50%",
                                            left: "50%",
                                            transform: "translate(-50%, -50%)",
                                            width: "46px",
                                            height: "46px",
                                            borderRadius: "50%",
                                            background: "rgba(234, 179, 8, 0.95)",
                                            border: "none",
                                            color: "#002147",
                                            fontSize: "1.2rem",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            cursor: "pointer",
                                            paddingLeft: "3px",
                                            zIndex: 2,
                                            boxShadow: "0 4px 15px rgba(0,0,0,0.5)"
                                        }}
                                        title="Click to preview video player"
                                    >
                                        ▶
                                    </button>

                                    {/* Duration */}
                                    {v.duration && (
                                        <span style={{
                                            position: "absolute",
                                            bottom: "8px",
                                            right: "10px",
                                            background: "rgba(0,0,0,0.8)",
                                            color: "#ffffff",
                                            fontSize: "0.7rem",
                                            fontWeight: 700,
                                            padding: "0.15rem 0.4rem",
                                            borderRadius: "4px",
                                            zIndex: 2
                                        }}>
                                            {v.duration}
                                        </span>
                                    )}
                                </div>

                                {/* Body */}
                                <div style={{ padding: "1.15rem", flexGrow: 1, display: "flex", flexDirection: "column" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem", marginBottom: "0.4rem" }}>
                                        <span style={{
                                            fontSize: "0.725rem",
                                            fontWeight: 700,
                                            color: "#0284c7",
                                            textTransform: "uppercase"
                                        }}>
                                            {v.category}
                                        </span>
                                        <button
                                            onClick={() => toggleFeatured(v)}
                                            style={{
                                                fontSize: "0.7rem",
                                                fontWeight: 700,
                                                padding: "0.15rem 0.45rem",
                                                borderRadius: "6px",
                                                border: "none",
                                                cursor: "pointer",
                                                background: v.isFeatured ? "#ecfdf5" : "#f1f5f9",
                                                color: v.isFeatured ? "#059669" : "#64748b"
                                            }}
                                            title="Toggle whether visible in landing page carousel"
                                        >
                                            {v.isFeatured ? "✓ On Home" : "Hidden"}
                                        </button>
                                    </div>

                                    <h3 style={{
                                        fontSize: "1.05rem",
                                        fontWeight: 800,
                                        color: "#002147",
                                        margin: "0 0 0.4rem 0",
                                        lineHeight: 1.35
                                    }}>
                                        {v.title}
                                    </h3>

                                    {v.speakerName && (
                                        <div style={{ marginTop: "auto", paddingTop: "0.6rem", borderTop: "1px solid #f1f5f9", fontSize: "0.785rem", color: "#475569" }}>
                                            🎙️ <strong>{v.speakerName}</strong> {v.speakerTitle ? `(${v.speakerTitle})` : ""}
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div style={{ marginTop: "0.85rem", paddingTop: "0.65rem", borderTop: "1px solid #f1f5f9", display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                                        <button
                                            onClick={() => toggleLiveStatus(v)}
                                            style={{
                                                flex: "1 1 auto",
                                                padding: "0.4rem 0.65rem",
                                                borderRadius: "8px",
                                                fontWeight: 800,
                                                fontSize: "0.775rem",
                                                cursor: "pointer",
                                                border: "none",
                                                background: v.isLiveNow ? "#fee2e2" : "#ecfdf5",
                                                color: v.isLiveNow ? "#b91c1c" : "#047857",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                gap: "0.3rem"
                                            }}
                                        >
                                            {v.isLiveNow ? "⏹ End Live" : "🔴 Go Live"}
                                        </button>

                                        <button
                                            onClick={() => openEditModal(v)}
                                            style={{
                                                padding: "0.4rem 0.65rem",
                                                borderRadius: "8px",
                                                border: "1px solid #cbd5e1",
                                                background: "#f8fafc",
                                                color: "#0f172a",
                                                fontWeight: 700,
                                                fontSize: "0.775rem",
                                                cursor: "pointer"
                                            }}
                                        >
                                            ✏️ Edit
                                        </button>

                                        <button
                                            onClick={() => handleDelete(v.id, v.title)}
                                            style={{
                                                padding: "0.4rem 0.55rem",
                                                borderRadius: "8px",
                                                border: "1px solid #fecaca",
                                                background: "#fef2f2",
                                                color: "#dc2626",
                                                fontWeight: 700,
                                                fontSize: "0.775rem",
                                                cursor: "pointer"
                                            }}
                                            title="Delete broadcast"
                                        >
                                            🗑
                                        </button>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}

            {/* Create / Edit Modal */}
            {isModalOpen && (
                <div style={{
                    position: "fixed",
                    inset: 0,
                    background: "rgba(15, 23, 42, 0.7)",
                    backdropFilter: "blur(6px)",
                    zIndex: 9999,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "1rem"
                }}>
                    <div style={{
                        background: "#ffffff",
                        borderRadius: "18px",
                        width: "100%",
                        maxWidth: "700px",
                        maxHeight: "92vh",
                        overflowY: "auto",
                        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                        padding: "2rem"
                    }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                            <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#002147", margin: 0 }}>
                                {editingVideo ? "✏️ Edit Live Stream / Video" : "🔴 New Live Broadcast / Video"}
                            </h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                style={{
                                    background: "#f1f5f9",
                                    border: "none",
                                    borderRadius: "50%",
                                    width: "32px",
                                    height: "32px",
                                    cursor: "pointer",
                                    fontSize: "1rem",
                                    fontWeight: 700
                                }}
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "1.15rem" }}>
                            {/* Live Now Master Switch */}
                            <div style={{
                                background: isLiveNow ? "linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)" : "#f8fafc",
                                border: `1px solid ${isLiveNow ? "#ef4444" : "#e2e8f0"}`,
                                padding: "0.85rem 1.15rem",
                                borderRadius: "12px",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center"
                            }}>
                                <div>
                                    <div style={{ fontWeight: 800, color: isLiveNow ? "#b91c1c" : "#002147", fontSize: "0.9rem" }}>
                                        🔴 STREAMING LIVE RIGHT NOW?
                                    </div>
                                    <p style={{ margin: "0.15rem 0 0 0", fontSize: "0.785rem", color: isLiveNow ? "#991b1b" : "#64748b" }}>
                                        When enabled, this broadcast gets highlighted with a pulsing red LIVE badge in the home carousel.
                                    </p>
                                </div>
                                <label style={{ position: "relative", display: "inline-block", width: "48px", height: "26px" }}>
                                    <input
                                        type="checkbox"
                                        checked={isLiveNow}
                                        onChange={(e) => {
                                            setIsLiveNow(e.target.checked);
                                            if (e.target.checked) setStatus("LIVE_NOW");
                                        }}
                                        style={{ opacity: 0, width: 0, height: 0 }}
                                    />
                                    <span style={{
                                        position: "absolute",
                                        cursor: "pointer",
                                        inset: 0,
                                        backgroundColor: isLiveNow ? "#ef4444" : "#cbd5e1",
                                        borderRadius: "34px",
                                        transition: "0.3s"
                                    }}>
                                        <span style={{
                                            position: "absolute",
                                            content: '""',
                                            height: "20px",
                                            width: "20px",
                                            left: isLiveNow ? "24px" : "3px",
                                            bottom: "3px",
                                            backgroundColor: "white",
                                            borderRadius: "50%",
                                            transition: "0.3s"
                                        }}></span>
                                    </span>
                                </label>
                            </div>

                            {/* Video Source Type Selector */}
                            <div>
                                <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 700, color: "#334155", marginBottom: "0.4rem" }}>
                                    Video Source / Provider
                                </label>
                                <div style={{ display: "flex", gap: "0.65rem" }}>
                                    <button
                                        type="button"
                                        onClick={() => setVideoType("YOUTUBE")}
                                        style={{
                                            flex: 1,
                                            padding: "0.65rem",
                                            borderRadius: "10px",
                                            border: videoType === "YOUTUBE" ? "2px solid #ef4444" : "1px solid #cbd5e1",
                                            background: videoType === "YOUTUBE" ? "#fef2f2" : "#f8fafc",
                                            color: videoType === "YOUTUBE" ? "#b91c1c" : "#475569",
                                            fontWeight: 800,
                                            fontSize: "0.825rem",
                                            cursor: "pointer"
                                        }}
                                    >
                                        ▶ YouTube Link (Live Stream / Replay / Video)
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setVideoType("DIRECT_UPLOAD")}
                                        style={{
                                            flex: 1,
                                            padding: "0.65rem",
                                            borderRadius: "10px",
                                            border: videoType === "DIRECT_UPLOAD" ? "2px solid #002147" : "1px solid #cbd5e1",
                                            background: videoType === "DIRECT_UPLOAD" ? "#f0fdf4" : "#f8fafc",
                                            color: videoType === "DIRECT_UPLOAD" ? "#002147" : "#475569",
                                            fontWeight: 800,
                                            fontSize: "0.825rem",
                                            cursor: "pointer"
                                        }}
                                    >
                                        📁 Direct Video Upload (MP4 / WebM)
                                    </button>
                                </div>
                            </div>

                            {/* YouTube URL Input with Live Detection */}
                            {videoType === "YOUTUBE" ? (
                                <div>
                                    <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 700, color: "#334155", marginBottom: "0.3rem" }}>
                                        YouTube URL or Video ID <span style={{ color: "#ef4444" }}>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. https://www.youtube.com/watch?v=... or https://youtu.be/... or https://youtube.com/live/..."
                                        value={youtubeUrl}
                                        onChange={(e) => setYoutubeUrl(e.target.value)}
                                        style={{
                                            width: "100%",
                                            padding: "0.65rem",
                                            borderRadius: "8px",
                                            border: "1px solid #cbd5e1",
                                            fontSize: "0.875rem",
                                            boxSizing: "border-box"
                                        }}
                                    />
                                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.3rem", fontSize: "0.75rem", color: "#64748b" }}>
                                        <span>Supports YouTube Live streams, standard videos, and Shorts</span>
                                        {detectedYouTubeId && (
                                            <span style={{ color: "#059669", fontWeight: 700 }}>
                                                ✓ Detected ID: {detectedYouTubeId}
                                            </span>
                                        )}
                                    </div>

                                    {/* Live Thumbnail Preview */}
                                    {detectedYouTubeThumb && (
                                        <div style={{ marginTop: "0.65rem", display: "flex", alignItems: "center", gap: "0.85rem", background: "#f8fafc", padding: "0.65rem", borderRadius: "10px" }}>
                                            <img
                                                src={detectedYouTubeThumb}
                                                alt="YouTube Preview"
                                                style={{ width: "110px", aspectRatio: "16/9", objectFit: "cover", borderRadius: "6px" }}
                                            />
                                            <div style={{ fontSize: "0.785rem", color: "#475569" }}>
                                                <strong>Auto-Generated YouTube Thumbnail</strong>
                                                <div style={{ color: "#059669" }}>Ready to display in carousel</div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div>
                                    <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 700, color: "#334155", marginBottom: "0.3rem" }}>
                                        Upload Recorded Video File (MP4, WebM up to 150MB)
                                    </label>
                                    <div style={{ display: "flex", gap: "0.65rem", alignItems: "center" }}>
                                        <input
                                            type="file"
                                            ref={videoFileRef}
                                            accept="video/mp4,video/webm,video/ogg,video/quicktime"
                                            onChange={handleVideoFileUpload}
                                            style={{ display: "none" }}
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => videoFileRef.current?.click()}
                                            disabled={uploadingVideo}
                                        >
                                            {uploadingVideo ? "⏳ Uploading Video..." : "⬆ Select Video File"}
                                        </Button>
                                        {videoUrl && (
                                            <span style={{ color: "#059669", fontWeight: 700, fontSize: "0.825rem" }}>
                                                ✓ Video Uploaded ({videoUrl.split("/").pop()})
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Title */}
                            <div>
                                <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 700, color: "#334155", marginBottom: "0.3rem" }}>
                                    Broadcast / Video Title <span style={{ color: "#ef4444" }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Shark EduTech Grand Placement Drive 2026 Live"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    style={{
                                        width: "100%",
                                        padding: "0.65rem",
                                        borderRadius: "8px",
                                        border: "1px solid #cbd5e1",
                                        fontSize: "0.875rem",
                                        boxSizing: "border-box"
                                    }}
                                />
                            </div>

                            {/* Category & Status */}
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem" }}>
                                <div>
                                    <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 700, color: "#334155", marginBottom: "0.3rem" }}>
                                        Category
                                    </label>
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        style={{
                                            width: "100%",
                                            padding: "0.65rem",
                                            borderRadius: "8px",
                                            border: "1px solid #cbd5e1",
                                            fontSize: "0.875rem",
                                            boxSizing: "border-box"
                                        }}
                                    >
                                        <option value="Live Session">Live Session</option>
                                        <option value="Webinar">Webinar</option>
                                        <option value="Placement Drive">Placement Drive</option>
                                        <option value="Workshop">Workshop</option>
                                        <option value="Campus Tour">Campus Tour</option>
                                        <option value="Industry Talk">Industry Talk</option>
                                    </select>
                                </div>

                                <div>
                                    <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 700, color: "#334155", marginBottom: "0.3rem" }}>
                                        Status
                                    </label>
                                    <select
                                        value={status}
                                        onChange={(e) => {
                                            setStatus(e.target.value);
                                            setIsLiveNow(e.target.value === "LIVE_NOW");
                                        }}
                                        style={{
                                            width: "100%",
                                            padding: "0.65rem",
                                            borderRadius: "8px",
                                            border: "1px solid #cbd5e1",
                                            fontSize: "0.875rem",
                                            boxSizing: "border-box"
                                        }}
                                    >
                                        <option value="RECORDED">📼 Recorded / Video Replay</option>
                                        <option value="LIVE_NOW">🔴 Live Now (Active)</option>
                                        <option value="UPCOMING">⏳ Upcoming / Scheduled</option>
                                    </select>
                                </div>
                            </div>

                            {/* Speaker Info */}
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem" }}>
                                <div>
                                    <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 700, color: "#334155", marginBottom: "0.3rem" }}>
                                        Speaker / Host Name
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Mr. Aalok Shaw"
                                        value={speakerName}
                                        onChange={(e) => setSpeakerName(e.target.value)}
                                        style={{
                                            width: "100%",
                                            padding: "0.65rem",
                                            borderRadius: "8px",
                                            border: "1px solid #cbd5e1",
                                            fontSize: "0.875rem",
                                            boxSizing: "border-box"
                                        }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 700, color: "#334155", marginBottom: "0.3rem" }}>
                                        Speaker Role / Designation
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Placement Director / CEO"
                                        value={speakerTitle}
                                        onChange={(e) => setSpeakerTitle(e.target.value)}
                                        style={{
                                            width: "100%",
                                            padding: "0.65rem",
                                            borderRadius: "8px",
                                            border: "1px solid #cbd5e1",
                                            fontSize: "0.875rem",
                                            boxSizing: "border-box"
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Duration & Scheduled Time */}
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem" }}>
                                <div>
                                    <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 700, color: "#334155", marginBottom: "0.3rem" }}>
                                        Duration Label
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. 45 mins, 1 hr 15 mins"
                                        value={duration}
                                        onChange={(e) => setDuration(e.target.value)}
                                        style={{
                                            width: "100%",
                                            padding: "0.65rem",
                                            borderRadius: "8px",
                                            border: "1px solid #cbd5e1",
                                            fontSize: "0.875rem",
                                            boxSizing: "border-box"
                                        }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 700, color: "#334155", marginBottom: "0.3rem" }}>
                                        Scheduled Date & Time (Optional)
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={scheduledAt}
                                        onChange={(e) => setScheduledAt(e.target.value)}
                                        style={{
                                            width: "100%",
                                            padding: "0.65rem",
                                            borderRadius: "8px",
                                            border: "1px solid #cbd5e1",
                                            fontSize: "0.875rem",
                                            boxSizing: "border-box"
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 700, color: "#334155", marginBottom: "0.3rem" }}>
                                    Description / Session Agenda
                                </label>
                                <textarea
                                    rows={2}
                                    placeholder="Enter details on what will be covered in this live session..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    style={{
                                        width: "100%",
                                        padding: "0.65rem",
                                        borderRadius: "8px",
                                        border: "1px solid #cbd5e1",
                                        fontSize: "0.875rem",
                                        boxSizing: "border-box"
                                    }}
                                />
                            </div>

                            {/* Custom Thumbnail Upload (Optional) */}
                            <div>
                                <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 700, color: "#334155", marginBottom: "0.3rem" }}>
                                    Custom Thumbnail Image (Optional)
                                </label>
                                <div style={{ display: "flex", gap: "0.65rem", alignItems: "center" }}>
                                    <input
                                        type="file"
                                        ref={thumbFileRef}
                                        accept="image/*"
                                        onChange={handleThumbFileUpload}
                                        style={{ display: "none" }}
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => thumbFileRef.current?.click()}
                                        disabled={uploadingThumb}
                                    >
                                        {uploadingThumb ? "⏳ Uploading..." : "📷 Upload Custom Thumbnail"}
                                    </Button>
                                    {thumbnailUrl && (
                                        <span style={{ color: "#059669", fontWeight: 700, fontSize: "0.825rem" }}>
                                            ✓ Custom thumbnail attached
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Feature in Carousel Checkbox */}
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                <input
                                    type="checkbox"
                                    id="isFeaturedCheck"
                                    checked={isFeatured}
                                    onChange={(e) => setIsFeatured(e.target.checked)}
                                    style={{ width: "16px", height: "16px" }}
                                />
                                <label htmlFor="isFeaturedCheck" style={{ fontSize: "0.85rem", fontWeight: 700, color: "#0f172a", cursor: "pointer" }}>
                                    Display in Landing Page Carousel (Featured)
                                </label>
                            </div>

                            {/* Modal Actions */}
                            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.65rem", marginTop: "0.75rem" }}>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={saving || uploadingVideo || uploadingThumb}
                                    style={{
                                        background: isLiveNow ? "#dc2626" : "#002147",
                                        color: "#ffffff",
                                        fontWeight: 800
                                    }}
                                >
                                    {saving ? "⏳ Saving..." : isLiveNow ? "🔴 Publish & GO LIVE NOW" : "Save & Publish"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Video Player Preview Modal */}
            {previewVideo && (
                <div
                    style={{
                        position: "fixed",
                        inset: 0,
                        background: "rgba(0, 0, 0, 0.85)",
                        backdropFilter: "blur(8px)",
                        zIndex: 10000,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "1.5rem"
                    }}
                    onClick={() => setPreviewVideo(null)}
                >
                    <div
                        style={{
                            background: "#0f172a",
                            borderRadius: "18px",
                            width: "100%",
                            maxWidth: "860px",
                            overflow: "hidden",
                            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7)"
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 1.5rem", background: "#021329" }}>
                            <div style={{ color: "#ffffff", fontWeight: 700, fontSize: "1.1rem" }}>
                                {previewVideo.title}
                            </div>
                            <button
                                onClick={() => setPreviewVideo(null)}
                                style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "#fff", width: "32px", height: "32px", borderRadius: "50%", cursor: "pointer" }}
                            >
                                ✕
                            </button>
                        </div>

                        <div style={{ position: "relative", width: "100%", aspectRatio: "16 / 9", background: "#000" }}>
                            {previewVideo.videoType === "DIRECT_UPLOAD" && previewVideo.videoUrl ? (
                                <video
                                    src={previewVideo.videoUrl}
                                    controls
                                    autoPlay
                                    style={{ width: "100%", height: "100%", objectFit: "contain" }}
                                />
                            ) : (
                                <iframe
                                    src={getYouTubeEmbedUrl(previewVideo.youtubeId || extractYouTubeId(previewVideo.youtubeUrl))}
                                    title={previewVideo.title}
                                    style={{ width: "100%", height: "100%", border: "none" }}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
