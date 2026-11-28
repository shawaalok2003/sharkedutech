"use client";

import React from "react";

interface DeleteJobButtonProps {
    jobTitle?: string;
    label?: string;
    style?: React.CSSProperties;
}

export function DeleteJobButton({ jobTitle, label = "Delete", style }: DeleteJobButtonProps) {
    return (
        <button
            type="submit"
            onClick={(e) => {
                const msg = jobTitle
                    ? `Are you sure you want to delete "${jobTitle}"? This will also remove its applications and cannot be undone.`
                    : "Are you sure you want to delete this job? This cannot be undone.";
                if (!window.confirm(msg)) {
                    e.preventDefault();
                }
            }}
            style={{
                padding: "0.35rem 0.65rem",
                backgroundColor: "#ef4444",
                color: "#ffffff",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
                fontSize: "0.78rem",
                fontWeight: 600,
                ...style,
            }}
        >
            {label}
        </button>
    );
}
