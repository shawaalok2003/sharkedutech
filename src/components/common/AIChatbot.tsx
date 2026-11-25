"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import styles from "./AIChatbot.module.css";

type QuickLink = {
    label: string;
    href: string;
};

type JobCardItem = {
    id: string;
    title: string;
    companyName: string;
    location: string;
    salaryRange: string;
    category: string;
};

type ChatMessage = {
    id: string;
    sender: "user" | "bot";
    text: string;
    time: string;
    followUps?: string[];
    quickLinks?: QuickLink[];
    matchedJobs?: JobCardItem[];
    feedback?: "up" | "down" | null;
    source?: "gemini" | "smart-engine";
};

type PreferredLang = "auto" | "en" | "bn" | "hi";

const INITIAL_MESSAGES: ChatMessage[] = [
    {
        id: "msg-init-1",
        sender: "bot",
        text: `### Welcome to Shark AI Concierge 👋\n\nI am your 24/7 **Hospitality Career & Admissions Advisor** powered by live job & college data.`,
        time: "Just now",
        followUps: [
            "Show latest 5-star hotel jobs in Goa & Mumbai",
            "Compare hotel management courses & OJT stipends",
            "Explain the 3-month 100% refund guarantee",
        ],
    },
];

const QUICK_CHIPS = [
    { label: "💼 Hot Hotel Jobs", query: "Show me the latest 5-star hospitality jobs and salary ranges" },
    { label: "🎓 BHM & Culinary", query: "What hotel management courses and admissions are available?" },
    { label: "🏨 Luxury Hotel Tie-Ups", query: "Which luxury 5-star hotels are tied up with Shark Edutech?" },
    { label: "🛡️ 100% Refund Guarantee", query: "How does the 100% placement refund guarantee work?" },
    { label: "💰 Salaries & Perks", query: "What are the typical salaries and perks in 5-star hotel jobs?" },
    { label: "📝 How to Apply", query: "Tell me the step-by-step process to apply for a job" },
    { label: "📞 Contact & WhatsApp", query: "Where is Shark Edutech located and how can I contact support?" },
];

const LANG_OPTIONS: { id: PreferredLang; label: string }[] = [
    { id: "auto", label: "Auto" },
    { id: "en", label: "EN" },
    { id: "bn", label: "বাংলা" },
    { id: "hi", label: "हिन्दी" },
];

const THINKING_STEPS = [
    "Scanning live 5-star hotel openings...",
    "Checking partner colleges & OJT programs...",
    "Crafting your tailored response...",
];

const STORAGE_KEY = "shark_ai_chat_messages_v2";
const BUBBLE_STORAGE_KEY = "shark_ai_bubble_dismissed";

export function AIChatbot() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [showBubble, setShowBubble] = useState(true);
    const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [thinkingStep, setThinkingStep] = useState(0);
    const [preferredLang, setPreferredLang] = useState<PreferredLang>("auto");
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [speakingId, setSpeakingId] = useState<string | null>(null);
    const [isListening, setIsListening] = useState(false);
    const [speechSupported, setSpeechSupported] = useState(false);
    const [isHydrated, setIsHydrated] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const recognitionRef = useRef<{ stop: () => void; start: () => void } | null>(null);

    // 1. Hydrate from sessionStorage & detect speech capabilities
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

        const win = window as unknown as {
            SpeechRecognition?: new () => unknown;
            webkitSpeechRecognition?: new () => unknown;
        };
        if (win.SpeechRecognition || win.webkitSpeechRecognition) {
            setSpeechSupported(true);
        }
    }, []);

    // 2. Persist messages in sessionStorage
    useEffect(() => {
        if (!isHydrated) return;
        try {
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
        } catch (err) {
            console.error("Session save error:", err);
        }
    }, [messages, isHydrated]);

    // 3. Cycle thinking status text while loading
    useEffect(() => {
        if (!isLoading) {
            setThinkingStep(0);
            return;
        }
        const timer = setInterval(() => {
            setThinkingStep((prev) => (prev + 1) % THINKING_STEPS.length);
        }, 1600);
        return () => clearInterval(timer);
    }, [isLoading]);

    // 4. Auto-scroll to bottom
    useEffect(() => {
        if (isOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isLoading, isOpen]);

    // 5. Focus input on open
    useEffect(() => {
        if (isOpen) {
            setShowBubble(false);
            setTimeout(() => inputRef.current?.focus(), 250);
        } else if (typeof window !== "undefined" && "speechSynthesis" in window) {
            window.speechSynthesis.cancel();
            setSpeakingId(null);
        }
    }, [isOpen]);

    // 6. Close on Escape
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) {
                setIsOpen(false);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen]);

    const handleSendMessage = useCallback(async (textToSend?: string) => {
        const query = (textToSend || inputValue).trim();
        if (!query || isLoading) return;

        const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        const userMsg: ChatMessage = {
            id: `usr-${Date.now()}`,
            sender: "user",
            text: query,
            time: timeStr,
        };

        setMessages((prev) => [...prev, userMsg]);
        if (!textToSend) setInputValue("");
        setIsLoading(true);

        try {
            const res = await fetch("/api/ai/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: query,
                    history: messages.slice(-6).map((m) => ({ sender: m.sender, text: m.text })),
                    currentPath: pathname,
                    preferredLanguage: preferredLang,
                }),
            });

            const data = await res.json();
            const botMsg: ChatMessage = {
                id: `bot-${Date.now()}`,
                sender: "bot",
                text:
                    data.reply ||
                    "I am currently updating our records. Please explore [Jobs Portal](/jobs) or [Admissions](/admissions).",
                time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                followUps: Array.isArray(data.followUps) ? data.followUps : undefined,
                quickLinks: Array.isArray(data.quickLinks) ? data.quickLinks : undefined,
                matchedJobs: Array.isArray(data.matchedJobs) ? data.matchedJobs : undefined,
                source: data.meta?.source,
                feedback: null,
            };

            setMessages((prev) => [...prev, botMsg]);
        } catch (error) {
            console.error("Chat error:", error);
            const errorMsg: ChatMessage = {
                id: `bot-err-${Date.now()}`,
                sender: "bot",
                text:
                    "### ⚠️ Temporary Connection Issue\n\nI couldn't reach the server right now. You can browse live jobs directly or chat with us on WhatsApp!",
                time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                quickLinks: [
                    { label: "💼 Browse Jobs", href: "/jobs" },
                    { label: "💬 WhatsApp Support", href: "https://wa.me/919147331167" },
                ],
            };
            setMessages((prev) => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    }, [inputValue, isLoading, messages, pathname, preferredLang]);

    const handleResetChat = () => {
        setMessages(INITIAL_MESSAGES);
        setInputValue("");
        if (typeof window !== "undefined" && "speechSynthesis" in window) {
            window.speechSynthesis.cancel();
            setSpeakingId(null);
        }
        try {
            sessionStorage.removeItem(STORAGE_KEY);
        } catch {
            // ignore storage errors
        }
    };

    const handleDismissBubble = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowBubble(false);
        try {
            sessionStorage.setItem(BUBBLE_STORAGE_KEY, "true");
        } catch {
            // ignore storage errors
        }
    };

    const handleCopyMessage = async (msg: ChatMessage) => {
        try {
            const plain = msg.text.replace(/[#>*_`]/g, "");
            await navigator.clipboard.writeText(plain);
            setCopiedId(msg.id);
            setTimeout(() => setCopiedId((prev) => (prev === msg.id ? null : prev)), 1800);
        } catch {
            // ignore clipboard errors
        }
    };

    const handleSpeakMessage = (msg: ChatMessage) => {
        if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
        if (speakingId === msg.id) {
            window.speechSynthesis.cancel();
            setSpeakingId(null);
            return;
        }
        window.speechSynthesis.cancel();
        const plainText = msg.text
            .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
            .replace(/[#>*_`|]/g, " ")
            .replace(/\s+/g, " ")
            .trim();
        const utterance = new SpeechSynthesisUtterance(plainText);
        utterance.rate = 1.02;
        utterance.onend = () => setSpeakingId(null);
        utterance.onerror = () => setSpeakingId(null);
        setSpeakingId(msg.id);
        window.speechSynthesis.speak(utterance);
    };

    const handleFeedback = (msgId: string, vote: "up" | "down") => {
        setMessages((prev) =>
            prev.map((m) => (m.id === msgId ? { ...m, feedback: m.feedback === vote ? null : vote } : m))
        );
    };

    const handleVoiceInput = () => {
        if (isListening && recognitionRef.current) {
            recognitionRef.current.stop();
            setIsListening(false);
            return;
        }

        const win = window as unknown as {
            SpeechRecognition?: new () => {
                lang: string;
                interimResults: boolean;
                onresult: (e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void;
                onerror: () => void;
                onend: () => void;
                start: () => void;
                stop: () => void;
            };
            webkitSpeechRecognition?: new () => {
                lang: string;
                interimResults: boolean;
                onresult: (e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void;
                onerror: () => void;
                onend: () => void;
                start: () => void;
                stop: () => void;
            };
        };

        const SpeechRecognitionCtor = win.SpeechRecognition || win.webkitSpeechRecognition;
        if (!SpeechRecognitionCtor) return;

        const recognition = new SpeechRecognitionCtor();
        recognition.lang = preferredLang === "bn" ? "bn-IN" : preferredLang === "hi" ? "hi-IN" : "en-IN";
        recognition.interimResults = false;
        recognition.onresult = (event) => {
            const transcript = event.results?.[0]?.[0]?.transcript;
            if (transcript) {
                setInputValue((prev) => (prev ? `${prev} ${transcript}` : transcript));
                inputRef.current?.focus();
            }
        };
        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);
        recognitionRef.current = recognition;
        setIsListening(true);
        recognition.start();
    };

    // Hide chatbot on admin dashboard pages (after all hooks!)
    if (pathname?.startsWith("/admin")) {
        return null;
    }

    const renderLink = (key: string | number, linkText: string, linkHref: string, bold = false) => {
        const isInternal = linkHref.startsWith("/");
        const content = bold ? <strong>{linkText}</strong> : linkText;
        if (isInternal) {
            return (
                <Link
                    key={key}
                    href={linkHref}
                    onClick={() => {
                        if (window.innerWidth < 768) setIsOpen(false);
                    }}
                >
                    {content}
                </Link>
            );
        }
        return (
            <a key={key} href={linkHref} target="_blank" rel="noopener noreferrer">
                {content}
            </a>
        );
    };

    const renderInline = (text: string): (string | React.ReactNode)[] => {
        const parts: (string | React.ReactNode)[] = [];
        const regex =
            /\*\*\[(.*?)\]\((.*?)\)\*\*|\[\*\*(.*?)\*\*\]\((.*?)\)|\[(.*?)\]\((.*?)\)|`([^`]+)`|\*\*(.*?)\*\*|\*(.*?)\*/g;
        let lastIndex = 0;
        let match: RegExpExecArray | null;

        while ((match = regex.exec(text)) !== null) {
            if (match.index > lastIndex) {
                parts.push(text.substring(lastIndex, match.index));
            }
            if (match[1] && match[2]) {
                parts.push(renderLink(match.index, match[1], match[2], true));
            } else if (match[3] && match[4]) {
                parts.push(renderLink(match.index, match[3], match[4], true));
            } else if (match[5] && match[6]) {
                parts.push(renderLink(match.index, match[5], match[6], false));
            } else if (match[7]) {
                parts.push(
                    <code key={match.index} className={styles.inlineHighlight}>
                        {match[7]}
                    </code>
                );
            } else if (match[8]) {
                parts.push(<strong key={match.index}>{match[8]}</strong>);
            } else if (match[9]) {
                parts.push(<em key={match.index}>{match[9]}</em>);
            }
            lastIndex = regex.lastIndex;
        }

        if (lastIndex < text.length) {
            parts.push(text.substring(lastIndex));
        }
        return parts;
    };

    const renderFormattedText = (rawText: string) => {
        const lines = rawText.split("\n");
        const elements: React.ReactNode[] = [];
        let i = 0;

        while (i < lines.length) {
            const trimmed = lines[i].trim();

            if (!trimmed) {
                i++;
                continue;
            }

            // Horizontal rule
            if (/^---+$/.test(trimmed)) {
                elements.push(<hr key={`hr-${i}`} className={styles.mdDivider} />);
                i++;
                continue;
            }

            // Headings (##, ###, ####)
            if (trimmed.startsWith("#### ")) {
                elements.push(<h4 key={`h4-${i}`}>{renderInline(trimmed.slice(5))}</h4>);
                i++;
                continue;
            }
            if (trimmed.startsWith("### ")) {
                elements.push(<h3 key={`h3-${i}`}>{renderInline(trimmed.slice(4))}</h3>);
                i++;
                continue;
            }
            if (trimmed.startsWith("## ")) {
                elements.push(<h3 key={`h2-${i}`}>{renderInline(trimmed.slice(3))}</h3>);
                i++;
                continue;
            }

            // Blockquote / Callout Card
            if (trimmed.startsWith(">")) {
                const quoteLines: string[] = [];
                while (i < lines.length && lines[i].trim().startsWith(">")) {
                    quoteLines.push(lines[i].trim().replace(/^>\s?/, ""));
                    i++;
                }
                elements.push(
                    <div key={`quote-${i}`} className={styles.calloutBox}>
                        {quoteLines.map((ql, qIdx) => (
                            <p key={qIdx}>{renderInline(ql)}</p>
                        ))}
                    </div>
                );
                continue;
            }

            // Markdown Table
            if (trimmed.startsWith("|") && i + 1 < lines.length && /^\|[\s:-]+\|/.test(lines[i + 1].trim())) {
                const parseRow = (rowStr: string) =>
                    rowStr
                        .trim()
                        .replace(/^\||\|$/g, "")
                        .split("|")
                        .map((cell) => cell.trim());

                const headers = parseRow(lines[i]);
                i += 2; // skip header + separator
                const rows: string[][] = [];
                while (i < lines.length && lines[i].trim().startsWith("|")) {
                    rows.push(parseRow(lines[i]));
                    i++;
                }

                elements.push(
                    <div key={`table-${i}`} className={styles.tableWrapper}>
                        <table className={styles.mdTable}>
                            <thead>
                                <tr>
                                    {headers.map((h, hIdx) => (
                                        <th key={hIdx}>{renderInline(h)}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((r, rIdx) => (
                                    <tr key={rIdx}>
                                        {r.map((cell, cIdx) => (
                                            <td key={cIdx}>{renderInline(cell)}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );
                continue;
            }

            // Unordered list
            if (/^([-•*])\s+/.test(trimmed)) {
                const items: string[] = [];
                while (i < lines.length && /^([-•*])\s+/.test(lines[i].trim())) {
                    items.push(lines[i].trim().replace(/^[-•*]\s+/, ""));
                    i++;
                }
                elements.push(
                    <ul key={`ul-${i}`} className={styles.mdList}>
                        {items.map((item, idx) => (
                            <li key={idx}>{renderInline(item)}</li>
                        ))}
                    </ul>
                );
                continue;
            }

            // Ordered list
            if (/^\d+\.\s+/.test(trimmed)) {
                const items: string[] = [];
                while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
                    items.push(lines[i].trim().replace(/^\d+\.\s+/, ""));
                    i++;
                }
                elements.push(
                    <ol key={`ol-${i}`} className={styles.mdOrderedList}>
                        {items.map((item, idx) => (
                            <li key={idx}>{renderInline(item)}</li>
                        ))}
                    </ol>
                );
                continue;
            }

            // Normal paragraph
            elements.push(<p key={`p-${i}`}>{renderInline(trimmed)}</p>);
            i++;
        }

        return elements;
    };

    const lastBotMsgId = [...messages].reverse().find((m) => m.sender === "bot")?.id;

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
                                width={38}
                                height={38}
                                className={styles.bubbleMiniAvatar}
                            />
                        </div>
                        <div className={styles.bubbleTextGroup}>
                            <div className={styles.bubbleHeaderRow}>
                                <span className={styles.bubbleHeyPill}>AI CONCIERGE</span>
                                <span className={styles.bubbleTitle}>Shark AI Advisor</span>
                            </div>
                            <span className={styles.bubbleSubtitle}>5-Star Jobs, Salaries &amp; Courses</span>
                        </div>
                        <button
                            type="button"
                            className={styles.welcomeBubbleClose}
                            onClick={handleDismissBubble}
                            title="Dismiss"
                            aria-label="Dismiss welcome prompt"
                        >
                            &times;
                        </button>
                    </div>
                )}

                <button
                    type="button"
                    className={`${styles.launcherButton} ${isOpen ? styles.launcherActive : ""}`}
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle Shark AI Chatbot Sidebar"
                    title="Ask Shark AI Concierge"
                >
                    <div className={styles.launcherPulse} />
                    <span className={styles.launcherBadge} />

                    {isOpen ? (
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
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
                className={`${styles.chatSidebar} ${isOpen ? styles.chatSidebarOpen : ""} ${isExpanded ? styles.chatSidebarExpanded : ""}`}
                role="dialog"
                aria-modal="true"
                aria-label="Shark AI Concierge Sidebar"
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
                                <h3 className={styles.headerTitle}>Shark AI Concierge</h3>
                                <span className={styles.proBadge}>LIVE RAG</span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.headerControls}>
                        <button
                            type="button"
                            className={`${styles.headerBtn} ${styles.expandBtnDesktop}`}
                            onClick={() => setIsExpanded((prev) => !prev)}
                            title={isExpanded ? "Compact View" : "Wide View (Better for Tables)"}
                            aria-label={isExpanded ? "Compact View" : "Wide View"}
                        >
                            {isExpanded ? (
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="4 14 10 14 10 20" />
                                    <polyline points="20 10 14 10 14 4" />
                                    <line x1="14" y1="10" x2="21" y2="3" />
                                    <line x1="3" y1="21" x2="10" y2="14" />
                                </svg>
                            ) : (
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="15 3 21 3 21 9" />
                                    <polyline points="9 21 3 21 3 15" />
                                    <line x1="21" y1="3" x2="14" y2="10" />
                                    <line x1="3" y1="21" x2="10" y2="14" />
                                </svg>
                            )}
                        </button>
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
                            title="Close Sidebar (Esc)"
                            aria-label="Close Sidebar"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                {/* Language Switcher + Quick Topics Bar */}
                <div className={styles.subHeaderBar}>
                    <div className={styles.langSwitcher} role="group" aria-label="Response Language">
                        {LANG_OPTIONS.map((langOpt) => (
                            <button
                                key={langOpt.id}
                                type="button"
                                className={`${styles.langPill} ${preferredLang === langOpt.id ? styles.langPillActive : ""}`}
                                onClick={() => setPreferredLang(langOpt.id)}
                            >
                                {langOpt.label}
                            </button>
                        ))}
                    </div>
                    <span className={styles.subHeaderHint}>Multilingual AI • EN / বাংলা / हिन्दी</span>
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
                    {messages.map((msg) => {
                        const isLatestBot = msg.sender === "bot" && msg.id === lastBotMsgId;

                        return (
                            <div
                                key={msg.id}
                                className={`${styles.messageRow} ${msg.sender === "user" ? styles.userRow : styles.botRow}`}
                            >
                                {msg.sender === "bot" ? (
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
                                                <div className={styles.welcomeHeroCard}>
                                                    <div className={styles.welcomeHeroHeader}>
                                                        <div className={styles.welcomeTopBadges}>
                                                            <span className={styles.heyGlowBadge}>SHARK AI 2.0 ✨</span>
                                                            <span className={styles.verifiedTag}>Live DB Synced</span>
                                                        </div>
                                                        <h4 className={styles.welcomeHeroTitle}>
                                                            Your 5-Star Hospitality Career Concierge
                                                        </h4>
                                                        <p className={styles.welcomeHeroSub}>
                                                            Ask anything in English, বাংলা, or हिन्दी — get instant job matches, salary tables, course fees, and placement guarantee details.
                                                        </p>
                                                    </div>

                                                    <div className={styles.welcomeFeaturesGrid}>
                                                        <button
                                                            type="button"
                                                            className={styles.welcomeFeatureItem}
                                                            onClick={() => handleSendMessage("Show me the latest 5-star hospitality jobs and salary ranges")}
                                                        >
                                                            <span className={styles.featureIcon}>💼</span>
                                                            <div className={styles.featureTextGroup}>
                                                                <strong>50+ Verified Jobs</strong>
                                                                <small>Front Office, Chefs, F&amp;B</small>
                                                            </div>
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className={styles.welcomeFeatureItem}
                                                            onClick={() => handleSendMessage("What hotel management courses and admissions are available?")}
                                                        >
                                                            <span className={styles.featureIcon}>🎓</span>
                                                            <div className={styles.featureTextGroup}>
                                                                <strong>BHM &amp; Culinary</strong>
                                                                <small>100% OJT + Monthly Stipend</small>
                                                            </div>
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className={styles.welcomeFeatureItem}
                                                            onClick={() => handleSendMessage("Which luxury hotels are tied up with Shark Edutech?")}
                                                        >
                                                            <span className={styles.featureIcon}>🏨</span>
                                                            <div className={styles.featureTextGroup}>
                                                                <strong>Luxury Hotel Tie-Ups</strong>
                                                                <small>Taj, Marriott, Hyatt, ITC</small>
                                                            </div>
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className={styles.welcomeFeatureItem}
                                                            onClick={() => handleSendMessage("How does the 100% placement refund guarantee work?")}
                                                        >
                                                            <span className={styles.featureIcon}>🛡️</span>
                                                            <div className={styles.featureTextGroup}>
                                                                <strong>100% Refund Policy</strong>
                                                                <small>3-Month Written Guarantee</small>
                                                            </div>
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className={styles.botBubble}>
                                                    <div className={styles.botBubbleBody}>
                                                        {renderFormattedText(msg.text)}
                                                    </div>

                                                    {/* Embedded Live Job Cards */}
                                                    {msg.matchedJobs && msg.matchedJobs.length > 0 && (
                                                        <div className={styles.embeddedJobsSection}>
                                                            <div className={styles.embeddedJobsLabel}>
                                                                ⚡ Live Matching Openings
                                                            </div>
                                                            <div className={styles.embeddedJobsList}>
                                                                {msg.matchedJobs.map((job) => (
                                                                    <Link
                                                                        key={job.id}
                                                                        href={`/jobs/${job.id}`}
                                                                        className={styles.embeddedJobCard}
                                                                        onClick={() => {
                                                                            if (window.innerWidth < 768) setIsOpen(false);
                                                                        }}
                                                                    >
                                                                        <div className={styles.embeddedJobTop}>
                                                                            <span className={styles.embeddedJobTitle}>{job.title}</span>
                                                                            <span className={styles.embeddedJobSalary}>{job.salaryRange}</span>
                                                                        </div>
                                                                        <div className={styles.embeddedJobMeta}>
                                                                            <span>🏨 {job.companyName}</span>
                                                                            <span>📍 {job.location}</span>
                                                                        </div>
                                                                        <span className={styles.embeddedJobCta}>View &amp; Apply →</span>
                                                                    </Link>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Quick Action CTAs */}
                                                    {msg.quickLinks && msg.quickLinks.length > 0 && (
                                                        <div className={styles.quickLinksRow}>
                                                            {msg.quickLinks.map((ql, idx) =>
                                                                ql.href.startsWith("/") ? (
                                                                    <Link
                                                                        key={idx}
                                                                        href={ql.href}
                                                                        className={styles.quickLinkPill}
                                                                        onClick={() => {
                                                                            if (window.innerWidth < 768) setIsOpen(false);
                                                                        }}
                                                                    >
                                                                        {ql.label}
                                                                    </Link>
                                                                ) : (
                                                                    <a
                                                                        key={idx}
                                                                        href={ql.href}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className={styles.quickLinkPill}
                                                                    >
                                                                        {ql.label}
                                                                    </a>
                                                                )
                                                            )}
                                                        </div>
                                                    )}

                                                    {/* Response Utility Bar: Copy, Listen, Feedback */}
                                                    <div className={styles.msgToolbar}>
                                                        <div className={styles.msgToolbarLeft}>
                                                            <button
                                                                type="button"
                                                                className={styles.toolbarBtn}
                                                                onClick={() => handleCopyMessage(msg)}
                                                                title="Copy response"
                                                            >
                                                                {copiedId === msg.id ? "✓ Copied" : "📋 Copy"}
                                                            </button>
                                                            <button
                                                                type="button"
                                                                className={`${styles.toolbarBtn} ${speakingId === msg.id ? styles.toolbarBtnActive : ""}`}
                                                                onClick={() => handleSpeakMessage(msg)}
                                                                title={speakingId === msg.id ? "Stop reading" : "Listen to response"}
                                                            >
                                                                {speakingId === msg.id ? "⏹ Stop" : "🔊 Listen"}
                                                            </button>
                                                        </div>
                                                        <div className={styles.msgToolbarRight}>
                                                            <button
                                                                type="button"
                                                                className={`${styles.voteBtn} ${msg.feedback === "up" ? styles.voteActiveUp : ""}`}
                                                                onClick={() => handleFeedback(msg.id, "up")}
                                                                aria-label="Helpful"
                                                                title="Helpful"
                                                            >
                                                                👍
                                                            </button>
                                                            <button
                                                                type="button"
                                                                className={`${styles.voteBtn} ${msg.feedback === "down" ? styles.voteActiveDown : ""}`}
                                                                onClick={() => handleFeedback(msg.id, "down")}
                                                                aria-label="Not helpful"
                                                                title="Needs improvement"
                                                            >
                                                                👎
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Contextual Follow-Up Chips (shown on latest bot message) */}
                                            {isLatestBot && !isLoading && msg.followUps && msg.followUps.length > 0 && (
                                                <div className={styles.followUpsWrap}>
                                                    <span className={styles.followUpsLabel}>Suggested next questions:</span>
                                                    <div className={styles.followUpsList}>
                                                        {msg.followUps.map((fq, fIdx) => (
                                                            <button
                                                                key={fIdx}
                                                                type="button"
                                                                className={styles.followUpChip}
                                                                onClick={() => handleSendMessage(fq)}
                                                            >
                                                                <span>↳ {fq}</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            <span className={styles.messageTime}>{msg.time}</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className={styles.userRowWrapper}>
                                        <div className={styles.userBubble}>{msg.text}</div>
                                        <span className={`${styles.messageTime} ${styles.userTime}`}>
                                            {msg.time}
                                        </span>
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {/* Smart Thinking Indicator */}
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
                                <div className={styles.typingCard}>
                                    <div className={styles.typingDotsRow}>
                                        <span className={styles.typingDot} />
                                        <span className={styles.typingDot} />
                                        <span className={styles.typingDot} />
                                    </div>
                                    <span className={styles.thinkingLabel}>{THINKING_STEPS[thinkingStep]}</span>
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
                            placeholder={
                                isListening
                                    ? "Listening... speak your question"
                                    : "Ask about Goa jobs, chef salaries, BHM fees..."
                            }
                            className={styles.chatInput}
                            disabled={isLoading}
                        />
                        {speechSupported && (
                            <button
                                type="button"
                                onClick={handleVoiceInput}
                                disabled={isLoading}
                                className={`${styles.micButton} ${isListening ? styles.micListening : ""}`}
                                title={isListening ? "Stop voice input" : "Speak your question"}
                                aria-label="Voice Input"
                            >
                                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                                    <line x1="12" y1="19" x2="12" y2="23" />
                                    <line x1="8" y1="23" x2="16" y2="23" />
                                </svg>
                            </button>
                        )}
                        <button
                            type="submit"
                            disabled={isLoading || !inputValue.trim()}
                            className={styles.sendButton}
                            aria-label="Send Message"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="22" y1="2" x2="11" y2="13" />
                                <polygon points="22 2 15 22 11 13 2 9 22 2" />
                            </svg>
                        </button>
                    </div>
                    <div className={styles.inputDisclaimer}>
                        Shark AI Concierge • Live Hospitality Jobs &amp; Admissions • 100% Free Job Applications
                    </div>
                </form>
            </aside>
        </>
    );
}
