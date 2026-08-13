"use client";

import { useState } from "react";

export default function JobImageUploader({ initialPosterUrl = "" }: { initialPosterUrl?: string }) {
    const [posterUrl, setPosterUrl] = useState(initialPosterUrl);
    const [uploading, setUploading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const reader = new FileReader();
        reader.onloadend = () => {
            if (typeof reader.result === 'string') {
                setPosterUrl(reader.result);
            }
            setUploading(false);
        };
        reader.readAsDataURL(file);
    };

    return (
        <div style={{ backgroundColor: "#f8fafc", padding: "1.25rem", borderRadius: "8px", border: "1px dashed #cbd5e1" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 700, color: "#0f172a" }}>
                🖼️ Job Poster Flyer / Banner Image (Optional)
            </label>
            <p style={{ fontSize: "0.85rem", color: "#64748b", marginBottom: "1rem" }}>
                Upload a recruitment poster flyer file or paste an image URL. This poster will be displayed on the Explore Opportunities carousel and job details page.
            </p>

            <input type="hidden" name="posterUrl" value={posterUrl} />

            <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: "240px" }}>
                    <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#475569", marginBottom: "0.25rem" }}>
                        Upload Image File from Device:
                    </label>
                    <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileChange}
                        style={{ width: "100%", padding: "0.4rem", borderRadius: "4px", border: "1px solid #ccc", background: "white" }} 
                    />
                </div>

                <div style={{ flex: 1, minWidth: "240px" }}>
                    <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#475569", marginBottom: "0.25rem" }}>
                        Or Enter Image URL Path:
                    </label>
                    <input 
                        type="text" 
                        placeholder="/opportunites/poster.jpeg or https://..." 
                        value={posterUrl}
                        onChange={(e) => setPosterUrl(e.target.value)}
                        style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc", background: "white" }} 
                    />
                </div>
            </div>

            {uploading && (
                <div style={{ marginTop: "0.75rem", fontSize: "0.85rem", color: "#2563eb", fontWeight: 600 }}>
                    Processing image file...
                </div>
            )}

            {posterUrl && (
                <div style={{ marginTop: "1rem", display: "flex", alignItems: "center", gap: "1rem" }}>
                    <div style={{ width: "100px", height: "120px", borderRadius: "6px", overflow: "hidden", border: "1px solid #cbd5e1", background: "#001736" }}>
                        <img src={posterUrl} alt="Poster Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                    <div>
                        <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#166534", display: "block" }}>
                            ✅ Image attached successfully!
                        </span>
                        <button 
                            type="button"
                            onClick={() => setPosterUrl("")}
                            style={{ marginTop: "0.4rem", padding: "0.25rem 0.6rem", background: "#ef4444", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "0.75rem", fontWeight: 600 }}
                        >
                            Remove Image
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
