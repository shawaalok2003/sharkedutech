"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function AdminError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Admin route error:", error);
    }, [error]);

    return (
        <div
            style={{
                maxWidth: "560px",
                margin: "4rem auto",
                background: "#ffffff",
                border: "1px solid #fecaca",
                borderRadius: "1rem",
                padding: "2.25rem",
                textAlign: "center",
                boxShadow: "0 12px 32px rgba(0, 0, 0, 0.06)",
            }}
        >
            <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>⚠️</div>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#991b1b", marginBottom: "0.5rem" }}>
                Admin Panel Error
            </h2>
            <p style={{ color: "#475569", fontSize: "0.9rem", lineHeight: 1.55, marginBottom: "1.5rem" }}>
                {error?.message || "Something went wrong while rendering this admin view."}
            </p>
            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
                <button
                    type="button"
                    onClick={() => reset()}
                    style={{
                        background: "#002147",
                        color: "#ffffff",
                        border: "none",
                        borderRadius: "8px",
                        padding: "0.65rem 1.25rem",
                        fontWeight: 700,
                        cursor: "pointer",
                    }}
                >
                    Try Again
                </button>
                <Link
                    href="/"
                    style={{
                        background: "#f1f5f9",
                        color: "#0f172a",
                        border: "1px solid #cbd5e1",
                        borderRadius: "8px",
                        padding: "0.65rem 1.25rem",
                        fontWeight: 700,
                        textDecoration: "none",
                    }}
                >
                    Go Home
                </Link>
            </div>
        </div>
    );
}
