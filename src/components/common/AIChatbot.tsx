"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
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
        text: `### Hello! Welcome to Shark Edutech AI 👋\n\nI am your 24/7 **Hospitality & Career Advisor**. Ask me anything about:\n- 💼 **50+ Verified Hotel Jobs** (Front Office, Chef, F&B, Housekeeping)\n- 🎓 **Hotel Management Courses & College Admissions**\n- 🏨 **400+ Luxury Hotel Tie-Ups** (Taj, Marriott, Hyatt, ITC)\n- 🛡️ **100% Written Refund Policy** & Placement Guarantee\n- 📞 Contact and registration support\n\nHow can I help you today?`,
        time: "Just now"
    }
];

const QUICK_CHIPS = [
    { label: "💼 Explore Hot Jobs", query: "Show me the latest hospitality jobs and salary ranges" },
    { label: "🎓 Hotel Courses", query: "What hotel management courses and admissions are available?" },
    { label: "🏨 5-Star Hotel Tie-Ups", query: "Which luxury hotels are tied up with Shark Edutech?" },
    { label: "🛡️ Refund Policy", query: "How does the 100% placement refund guarantee work?" },
    { label: "✍️ Candidate Consent", query: "Tell me about the Candidate Consent Form and how to apply" },
    { label: "📞 Contact & Office", query: "Where is Shark Edutech located and how can I contact support?" }
];

export function AIChatbot() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [showBubble, setShowBubble] = useState(true);
    const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

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

    // Focus input on window open
    useEffect(() => {
        if (isOpen) {
            setShowBubble(false);
            setTimeout(() => inputRef.current?.focus(), 150);
        }
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
                text: "I couldn't connect right now. You can browse all active jobs directly at [/jobs](/jobs) or reach out on WhatsApp!",
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
    };

    // Simple markdown-to-JSX parser for links, bolding, and lists
    const renderFormattedText = (rawText: string) => {
        const lines = rawText.split("\n");

        return lines.map((line, idx) => {
            const trimmed = line.trim();

            if (!trimmed) {
                return <div key={idx} style={{ height: "0.4rem" }} />;
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
                            <Link key={match.index} href={linkHref} onClick={() => { if (window.innerWidth < 640) setIsOpen(false); }}>
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
                            <Link key={match.index} href={linkHref} onClick={() => { if (window.innerWidth < 640) setIsOpen(false); }}>
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
                            <Link key={match.index} href={linkHref} onClick={() => { if (window.innerWidth < 640) setIsOpen(false); }}>
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
                    <li key={idx} style={{ marginLeft: "1rem", marginBottom: "0.25rem" }}>
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
                        <span>💬 Ask Shark AI (Jobs &amp; Courses)</span>
                        <button
                            type="button"
                            className={styles.welcomeBubbleClose}
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowBubble(false);
                            }}
                            title="Dismiss"
                        >
                            &times;
                        </button>
                    </div>
                )}

                <button
                    type="button"
                    className={styles.launcherButton}
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle Shark AI Chatbot"
                    title="Ask Shark AI Assistant"
                >
                    <div className={styles.launcherPulse} />
                    <span className={styles.launcherBadge} />
                    {isOpen ? (
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    ) : (
                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                            <circle cx="9" cy="10" r="1" fill="currentColor"></circle>
                            <circle cx="12" cy="10" r="1" fill="currentColor"></circle>
                            <circle cx="15" cy="10" r="1" fill="currentColor"></circle>
                        </svg>
                    )}
                </button>
            </div>

            {/* Chatbot Window */}
            {isOpen && (
                <div className={styles.chatWindow}>
                    {/* Header */}
                    <div className={styles.chatHeader}>
                        <div className={styles.headerInfo}>
                            <div className={styles.botAvatar}>🦈</div>
                            <div>
                                <h3 className={styles.headerTitle}>Shark AI Advisor</h3>
                                <div className={styles.headerStatus}>
                                    <span className={styles.statusDot}></span>
                                    Online • 24/7 Hospitality Guide
                                </div>
                            </div>
                        </div>

                        <div className={styles.headerControls}>
                            <button
                                type="button"
                                className={styles.headerBtn}
                                onClick={handleResetChat}
                                title="Reset Conversation"
                            >
                                🔄
                            </button>
                            <button
                                type="button"
                                className={styles.headerBtn}
                                onClick={() => setIsOpen(false)}
                                title="Close Chat"
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
                                <div
                                    className={`${styles.messageBubble} ${
                                        msg.sender === "user" ? styles.userBubble : styles.botBubble
                                    }`}
                                >
                                    {msg.sender === "user" ? msg.text : renderFormattedText(msg.text)}
                                </div>
                                <span
                                    className={`${styles.messageTime} ${
                                        msg.sender === "user" ? styles.userTime : ""
                                    }`}
                                >
                                    {msg.time}
                                </span>
                            </div>
                        ))}

                        {/* Typing Animation */}
                        {isLoading && (
                            <div className={`${styles.messageRow} ${styles.botRow}`}>
                                <div className={styles.typingBubble}>
                                    <span className={styles.typingDot}></span>
                                    <span className={styles.typingDot}></span>
                                    <span className={styles.typingDot}></span>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Bar */}
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSendMessage();
                        }}
                        className={styles.inputForm}
                    >
                        <input
                            ref={inputRef}
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Ask about jobs, courses, tie-ups, refund..."
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
                    </form>
                </div>
            )}
        </>
    );
}
