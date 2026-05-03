"use client";

import { useState } from "react";

interface ResetLinkButtonProps {
    userId: string;
    resetToken?: string | null;
    generateAction: (formData: FormData) => Promise<void>;
}

export function ResetLinkButton({ userId, resetToken, generateAction }: ResetLinkButtonProps) {
    const [isCopying, setIsCopying] = useState(false);

    const handleCopy = () => {
        const url = window.location.origin + `/auth/reset-password?token=${resetToken}`;
        navigator.clipboard.writeText(url);
        setIsCopying(true);
        setTimeout(() => setIsCopying(false), 2000);
        alert("Reset link copied to clipboard!");
    };

    if (resetToken) {
        return (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                <span style={{ fontSize: "0.75rem", color: "#16a34a", fontWeight: 600 }}>Link Active</span>
                <code style={{ fontSize: "0.7rem", backgroundColor: "#f1f5f9", padding: "0.2rem", borderRadius: "3px", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "150px", display: "block" }}>
                    {`/auth/reset-password?token=${resetToken}`}
                </code>
                <button 
                    onClick={handleCopy}
                    style={{ fontSize: "0.7rem", color: "var(--primary)", border: "none", background: "none", cursor: "pointer", textDecoration: "underline", padding: 0, textAlign: "left" }}
                >
                    {isCopying ? "Copied!" : "Copy Full URL"}
                </button>
            </div>
        );
    }

    return (
        <form action={generateAction}>
            <input type="hidden" name="userId" value={userId} />
            <button
                type="submit"
                style={{ padding: "0.4rem 0.8rem", backgroundColor: "#f1f5f9", color: "#475569", borderRadius: "4px", border: "1px solid #e2e8f0", cursor: "pointer", fontSize: "0.875rem" }}
            >
                Generate Link
            </button>
        </form>
    );
}
