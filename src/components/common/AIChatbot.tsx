"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import styles from "./AIChatbot.module.css";

type ChatMessage = {
    id: string;
    sender: "user" | "bot";
    text: string;
    time: string;
};

const INITIAL_MESSAGES: ChatMessage[] = [
    {
        id: "msg-init-1",
        sender: "bot",
        text: `### Hey there! Welcome to Shark AI Advisor 👋\n\nI am your 24/7 **Hospitality Career & Admissions Concierge**.\n\nAsk me anything about:\n- 💼 **50+ Verified 5-Star Hotel Jobs** (Front Office, Chefs, F&B, Housekeeping)\n- 🎓 **Hotel Management Degrees & Admissions** (/admissions)\n- 🏨 **400+ Luxury Hotel MOUs** (Taj, Marriott, Hyatt, Radisson, ITC)\n- 🛡️ **100% Written Refund Policy** & 3-Month Placement Guarantee\n- ✍️ **Candidate Consent Form & Registration**\n- 📞 Official Contact & Kolkata Office Support\n\nHow can I help guide your hospitality journey today?`,
        time: "Just now"
    }
];

const QUICK_CHIPS = [
    { label: "💼 Explore Hot Jobs", query: "Show me the latest hospitality jobs and salary ranges" },
    { label: "🎓 Hotel Courses & BHM", query: "What hotel management courses and admissions are available?" },
    { label: "🏨 5-Star Hotel Tie-Ups", query: "Which luxury hotels are tied up with Shark Edutech?" },
    { label: "🛡️ 100% Refund Policy", query: "How does the 100% placement refund guarantee work?" },
    { label: "✍️ Candidate Consent Form", query: "Tell me about the Candidate Consent Form and how to apply" },
    { label: "💰 Salary & Stipends", query: "What are the typical salaries and perks in 5-star hotel jobs?" },
    { label: "📞 Contact Support", query: "Where is Shark Edutech located and how can I contact support?" }
];

const STORAGE_KEY = "shark_ai_chat_messages";
const BUBBLE_STORAGE_KEY = "shark_ai_bubble_dismissed";

export function AIChatbot() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [showBubble, setShowBubble] = useState(true);
    const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isHydrated, setIsHydrated] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // 1. Session Storage Restoration on Mount
    useEffect(() => {
        setIsHydrated(true);
        try {
            const savedMessages = sessionStorage.getItem(STORAGE_KEY);
            if (savedMessages) {
                const parsed = JSON.parse(savedMessages);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setMessages(parsed);
                }
            }

            const bubbleDismissed = sessionStorage.getItem(BUBBLE_STORAGE_KEY);
            if (bubbleDismissed === "true") {
                setShowBubble(false);
            }
        } catch (err) {
            console.error("Session restoration error:", err);
        }
    }, []);

    // 2. Session Storage Persistence when Messages Change
    useEffect(() => {
        if (!isHydrated) return;
        try {
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
        } catch (err) {
            console.error("Session save error:", err);
        }
    }, [messages, isHydrated]);

    // Hide chatbot on admin dashboard pages
    if (pathname?.startsWith('/admin')) {
        return null;
    }

    // Auto-scroll to bottom when messages update
    useEffect(() => {
        if (isOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isLoading, isOpen]);

    // Focus input on sidebar open
    useEffect(() => {
        if (isOpen) {
            setShowBubble(false);
            setTimeout(() => inputRef.current?.focus(), 250);
        }
    }, [isOpen]);

    // Handle Escape key to close sidebar
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) {
                setIsOpen(false);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen]);

    const handleSendMessage = async (textToSend?: string) => {
        const query = (textToSend || inputValue).trim();
        if (!query || isLoading) return;

        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const userMsg: ChatMessage = {
            id: `usr-${Date.now()}`,
            sender: "user",
            text: query,
            time: timeStr
        };

        setMessages(prev => [...prev, userMsg]);
        if (!textToSend) setInputValue("");
        setIsLoading(true);

        try {
            const res = await fetch("/api/ai/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: query,
                    history: messages.slice(-4).map(m => ({ sender: m.sender, text: m.text }))
                })
            });

            const data = await res.json();
            const botReplyText = data.reply || "I am currently updating our records. Please visit our [Jobs Portal](/jobs) or [Admissions Explorer](/admissions) for complete details.";

            const botMsg: ChatMessage = {
                id: `bot-${Date.now()}`,
                sender: "bot",
                text: botReplyText,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };

            setMessages(prev => [...prev, botMsg]);
        } catch (error) {
            console.error("Chat error:", error);
            const errorMsg: ChatMessage = {
                id: `bot-err-${Date.now()}`,
                sender: "bot",
                text: "I couldn't connect right now. You can browse all active jobs directly at [/jobs](/jobs) or reach out on [WhatsApp (+91 91473 31167)](https://wa.me/919147331167)!",
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetChat = () => {
        setMessages(INITIAL_MESSAGES);
        setInputValue("");
        try {
            sessionStorage.removeItem(STORAGE_KEY);
        } catch (err) {}
    };

    const handleDismissBubble = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowBubble(false);
        try {
            sessionStorage.setItem(BUBBLE_STORAGE_KEY, "true");
        } catch (err) {}
    };

    // Simple markdown-to-JSX parser for links, bolding, and lists
    const renderFormattedText = (rawText: string) => {
        const lines = rawText.split("\n");

        return lines.map((line, idx) => {
            const trimmed = line.trim();

            if (!trimmed) {
                return <div key={idx} style={{ height: "0.35rem" }} />;
            }

            if (trimmed.startsWith("### ")) {
                return <h3 key={idx}>{trimmed.replace("### ", "")}</h3>;
            }

            const isListItem = trimmed.startsWith("- ") || trimmed.startsWith("• ");
            const content = isListItem ? trimmed.replace(/^[-•]\s*/, "") : trimmed;

            // Parse [text](url), **[text](url)**, [**text**](url), **bold**, and *italic*
            const parts: (string | React.ReactNode)[] = [];
            const regex = /\*\*\[(.*?)\]\((.*?)\)\*\*|\[\*\*(.*?)\*\*\]\((.*?)\)|\[(.*?)\]\((.*?)\)|\*\*(.*?)\*\*|\*(.*?)\*/g;
            let lastIndex = 0;
            let match;

            while ((match = regex.exec(content)) !== null) {
                if (match.index > lastIndex) {
                    parts.push(content.substring(lastIndex, match.index));
                }

                // **[text](url)**
                if (match[1] && match[2]) {
                    const linkText = match[1];
                    const linkHref = match[2];
                    const isInternal = linkHref.startsWith("/");
                    parts.push(
                        isInternal ? (
                            <Link key={match.index} href={linkHref} onClick={() => { if (window.innerWidth < 768) setIsOpen(false); }}>
                                <strong>{linkText}</strong>
                            </Link>
                        ) : (
                            <a key={match.index} href={linkHref} target="_blank" rel="noopener noreferrer">
                                <strong>{linkText}</strong>
                            </a>
                        )
                    );
                }
                // [**text**](url)
                else if (match[3] && match[4]) {
                    const linkText = match[3];
                    const linkHref = match[4];
                    const isInternal = linkHref.startsWith("/");
                    parts.push(
                        isInternal ? (
                            <Link key={match.index} href={linkHref} onClick={() => { if (window.innerWidth < 768) setIsOpen(false); }}>
                                <strong>{linkText}</strong>
                            </Link>
                        ) : (
                            <a key={match.index} href={linkHref} target="_blank" rel="noopener noreferrer">
                                <strong>{linkText}</strong>
                            </a>
                        )
                    );
                }
                // [text](url)
                else if (match[5] && match[6]) {
                    const linkText = match[5];
                    const linkHref = match[6];
                    const isInternal = linkHref.startsWith("/");
                    parts.push(
                        isInternal ? (
                            <Link key={match.index} href={linkHref} onClick={() => { if (window.innerWidth < 768) setIsOpen(false); }}>
                                {linkText}
                            </Link>
                        ) : (
                            <a key={match.index} href={linkHref} target="_blank" rel="noopener noreferrer">
                                {linkText}
                            </a>
                        )
                    );
                }
                // **bold**
                else if (match[7]) {
                    parts.push(<strong key={match.index}>{match[7]}</strong>);
                }
                // *italic*
                else if (match[8]) {
                    parts.push(<em key={match.index}>{match[8]}</em>);
                }

                lastIndex = regex.lastIndex;
            }

            if (lastIndex < content.length) {
                parts.push(content.substring(lastIndex));
            }

            if (isListItem) {
                return (
                    <li key={idx} style={{ marginLeft: "1.1rem", marginBottom: "0.25rem" }}>
                        {parts}
                    </li>
                );
            }

            return <p key={idx} style={{ margin: "0.25rem 0" }}>{parts}</p>;
        });
    };

    return (
        <>
            {/* Floating Launcher Button */}
            <div className={styles.floatingLauncher}>
                {showBubble && !isOpen && (
                    <div className={styles.welcomeBubble} onClick={() => setIsOpen(true)}>
                        <div className={styles.bubbleAvatarWrapper}>
                            <Image
                                src="/images/ai-avatar.jpg"
                                alt="Shark AI"
                                width={36}
                                height={36}
                                className={styles.bubbleMiniAvatar}
                            />
                        </div>
                        <div className={styles.bubbleTextGroup}>
                            <div className={styles.bubbleHeaderRow}>
                                <span className={styles.bubbleHeyPill}>HEY! 👋</span>
                                <span className={styles.bubbleTitle}>Shark AI Advisor</span>
                            </div>
                            <span className={styles.bubbleSubtitle}>Need help with 5-star jobs or courses?</span>
                        </div>
                        <button
                            type="button"
                            className={styles.welcomeBubbleClose}
                            onClick={handleDismissBubble}
                            title="Dismiss"
                        >
                            &times;
                        </button>
                    </div>
                )}

                <button
                    type="button"
                    className={`${styles.launcherButton} ${isOpen ? styles.launcherActive : ''}`}
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle Shark AI Chatbot Sidebar"
                    title="Ask Shark AI Assistant"
                >
                    <div className={styles.launcherPulse} />
                    <span className={styles.launcherBadge} />
                    
                    {isOpen ? (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    ) : (
                        <div className={styles.launcherAvatarContainer}>
                            <Image
                                src="/images/ai-avatar.jpg"
                                alt="Shark AI"
                                width={54}
                                height={54}
                                className={styles.launcherAvatarImg}
                                priority
                            />
                            <span className={styles.aiSparkleBadge}>AI</span>
                        </div>
                    )}
                </button>
            </div>

            {/* Backdrop Blur Overlay */}
            {isOpen && (
                <div
                    className={styles.sidebarOverlay}
                    onClick={() => setIsOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* Chatbot Sidebar Drawer */}
            <aside
                className={`${styles.chatSidebar} ${isOpen ? styles.chatSidebarOpen : ""}`}
                role="dialog"
                aria-modal="true"
                aria-label="Shark AI Assistant Sidebar"
            >
                {/* Header */}
                <div className={styles.chatHeader}>
                    <div className={styles.headerInfo}>
                        <div className={styles.headerAvatarWrapper}>
                            <Image
                                src="/images/ai-avatar.jpg"
                                alt="Shark AI Avatar"
                                width={44}
                                height={44}
                                className={styles.headerAvatarImg}
                            />
                            <span className={styles.headerOnlineDot} />
                        </div>
                        <div>
                            <div className={styles.headerTitleRow}>
                                <h3 className={styles.headerTitle}>Shark AI Advisor</h3>
                            </div>
                            <div className={styles.headerStatus}>
                                24/7 Verified Hospitality &amp; Admissions Guide
                            </div>
                        </div>
                    </div>

                    <div className={styles.headerControls}>
                        <button
                            type="button"
                            className={styles.headerBtn}
                            onClick={handleResetChat}
                            title="Reset Conversation"
                            aria-label="Reset Conversation"
                        >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                                <path d="M3 3v5h5" />
                            </svg>
                        </button>
                        <button
                            type="button"
                            className={`${styles.headerBtn} ${styles.headerCloseBtn}`}
                            onClick={() => setIsOpen(false)}
                            title="Close Sidebar"
                            aria-label="Close Sidebar"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                {/* Quick Suggestion Chips */}
                <div className={styles.chipsContainer}>
                    {QUICK_CHIPS.map((chip, i) => (
                        <button
                            key={i}
                            type="button"
                            className={styles.chipButton}
                            onClick={() => handleSendMessage(chip.query)}
                            disabled={isLoading}
                        >
                            {chip.label}
                        </button>
                    ))}
                </div>

                {/* Messages Area */}
                <div className={styles.messagesContainer}>
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`${styles.messageRow} ${msg.sender === "user" ? styles.userRow : styles.botRow}`}
                        >
                            {msg.sender === "bot" && (
                                <div className={styles.botRowWrapper}>
                                    <div className={styles.botAvatarMiniContainer}>
                                        <Image
                                            src="/images/ai-avatar.jpg"
                                            alt="Shark AI"
                                            width={28}
                                            height={28}
                                            className={styles.botAvatarMini}
                                        />
                                    </div>
                                    <div className={styles.botBubbleGroup}>
                                        {msg.id === "msg-init-1" ? (
                                            /* Enhanced Welcome "Hey There!" Card */
                                            <div className={styles.welcomeHeroCard}>
                                                <div className={styles.welcomeHeroHeader}>
                                                    <span className={styles.heyGlowBadge}>HEY THERE! 👋</span>
                                                    <h4 className={styles.welcomeHeroTitle}>Welcome to Shark AI Advisor</h4>
                                                    <p className={styles.welcomeHeroSub}>
                                                        Your 24/7 personal guide for 5-star hotel placements, university degrees, and career acceleration.
                                                    </p>
                                                </div>

                                                <div className={styles.welcomeFeaturesGrid}>
                                                    <div
                                                        className={styles.welcomeFeatureItem}
                                                        onClick={() => handleSendMessage("Show me the latest hospitality jobs and salary ranges")}
                                                    >
                                                        <span className={styles.featureIcon}>💼</span>
                                                        <div className={styles.featureTextGroup}>
                                                            <strong>50+ Verified Jobs</strong>
                                                            <small>Front Office, Chefs, F&B, Housekeeping</small>
                                                        </div>
                                                    </div>

                                                    <div
                                                        className={styles.welcomeFeatureItem}
                                                        onClick={() => handleSendMessage("What hotel management courses and admissions are available?")}
                                                    >
                                                        <span className={styles.featureIcon}>🎓</span>
                                                        <div className={styles.featureTextGroup}>
                                                            <strong>Hotel Degrees &amp; BHM</strong>
                                                            <small>Admissions &amp; 100% OJT Monthly Stipend</small>
                                                        </div>
                                                    </div>

                                                    <div
                                                        className={styles.welcomeFeatureItem}
                                                        onClick={() => handleSendMessage("Which luxury hotels are tied up with Shark Edutech?")}
                                                    >
                                                        <span className={styles.featureIcon}>🏨</span>
                                                        <div className={styles.featureTextGroup}>
                                                            <strong>400+ Hotel MOUs</strong>
                                                            <small>Taj, Marriott, Hyatt, Radisson, ITC</small>
                                                        </div>
                                                    </div>

                                                    <div
                                                        className={styles.welcomeFeatureItem}
                                                        onClick={() => handleSendMessage("How does the 100% placement refund guarantee work?")}
                                                    >
                                                        <span className={styles.featureIcon}>🛡️</span>
                                                        <div className={styles.featureTextGroup}>
                                                            <strong>Placement Guarantee</strong>
                                                            <small>3-Month 100% Refund Commitment</small>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className={styles.welcomePromptHint}>
                                                    💬 <em>Tap any box above or ask your question below to begin!</em>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className={styles.botBubble}>
                                                {renderFormattedText(msg.text)}
                                            </div>
                                        )}
                                        <span className={styles.messageTime}>{msg.time}</span>
                                    </div>
                                </div>
                            )}

                            {msg.sender === "user" && (
                                <div className={styles.userRowWrapper}>
                                    <div className={styles.userBubble}>
                                        {msg.text}
                                    </div>
                                    <span className={`${styles.messageTime} ${styles.userTime}`}>
                                        {msg.time}
                                    </span>
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Typing Animation */}
                    {isLoading && (
                        <div className={`${styles.messageRow} ${styles.botRow}`}>
                            <div className={styles.botRowWrapper}>
                                <div className={styles.botAvatarMiniContainer}>
                                    <Image
                                        src="/images/ai-avatar.jpg"
                                        alt="Shark AI"
                                        width={28}
                                        height={28}
                                        className={styles.botAvatarMini}
                                    />
                                </div>
                                <div className={styles.typingBubble}>
                                    <span className={styles.typingDot}></span>
                                    <span className={styles.typingDot}></span>
                                    <span className={styles.typingDot}></span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input Bar Form */}
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSendMessage();
                    }}
                    className={styles.inputForm}
                >
                    <div className={styles.inputWrapper}>
                        <input
                            ref={inputRef}
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Ask about 5-star jobs, courses, tie-ups, refund..."
                            className={styles.chatInput}
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !inputValue.trim()}
                            className={styles.sendButton}
                            aria-label="Send Message"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="22" y1="2" x2="11" y2="13"></line>
                                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                            </svg>
                        </button>
                    </div>
                    <div className={styles.inputDisclaimer}>
                        Shark AI answers all questions about hospitality careers, verified jobs &amp; admissions.
                    </div>
                </form>
            </aside>
        </>
    );
}
