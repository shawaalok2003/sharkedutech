"use client";

import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useEffect, useState } from "react";

type Query = {
    id: string;
    subject: string;
    message: string;
    status: string;
    createdAt: string;
    student?: { name?: string };
};

export default function QueriesPage() {
    const [queries, setQueries] = useState<Query[]>([]);
    const [replyText, setReplyText] = useState<Record<string, string>>({});

    useEffect(() => {
        async function fetchQueries() {
            const res = await fetch("/api/admissions/queries");
            if (res.ok) {
                const data = await res.json();
                setQueries(data);
            }
        }
        fetchQueries();
    }, []);

    const sendReply = async (id: string) => {
        const reply = replyText[id] || "";
        if (!reply.trim()) return;

        const res = await fetch(`/api/admissions/queries/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: "Replied", reply })
        });
        if (res.ok) {
            setQueries(prev => prev.map(q => q.id === id ? { ...q, status: "Replied" } : q));
        }
    };

    return (
        <>
            <style jsx>{`
                .queries-container {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                .queries-title {
                    font-size: 1.75rem;
                    font-weight: 700;
                    color: var(--primary);
                    margin: 0 0 1.5rem;
                }
                .query-card {
                    cursor: pointer;
                    border-left: 4px solid var(--border);
                    transition: all 0.2s ease;
                }
                .query-card.unread {
                    border-left-color: var(--primary);
                }
                .query-content {
                    padding: 1.25rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    gap: 1rem;
                }
                .query-main {
                    flex: 1;
                }
                .query-header {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    margin-bottom: 0.25rem;
                    flex-wrap: wrap;
                }
                .query-subject {
                    font-size: 1.05rem;
                    font-weight: 600;
                    margin: 0;
                }
                .badge-new {
                    font-size: 0.7rem;
                    background: var(--accent);
                    color: white;
                    padding: 0.2rem 0.5rem;
                    border-radius: 4px;
                    font-weight: 600;
                }
                .query-message {
                    color: var(--muted-foreground);
                    margin: 0.5rem 0;
                    font-size: 0.9rem;
                }
                .query-meta {
                    font-size: 0.8rem;
                    color: var(--muted-foreground);
                    margin-bottom: 0.75rem;
                }
                .reply-section {
                    display: flex;
                    gap: 0.5rem;
                    flex-wrap: wrap;
                }
                .reply-input {
                    flex: 1;
                    min-width: 200px;
                    padding: 0.5rem 0.65rem;
                    border-radius: 6px;
                    border: 1px solid var(--border);
                    font-size: 0.875rem;
                }

                @media (max-width: 768px) {
                    .query-content {
                        flex-direction: column;
                        gap: 0.75rem;
                    }
                    .query-header {
                        flex-direction: column;
                        align-items: flex-start;
                    }
                    .reply-section {
                        flex-direction: column;
                    }
                    .reply-input {
                        min-width: unset;
                    }
                    .reply-section button {
                        width: 100%;
                    }
                }
                @media (max-width: 480px) {
                    .queries-title {
                        font-size: 1.5rem;
                    }
                    .query-subject {
                        font-size: 0.95rem;
                    }
                    .query-message {
                        font-size: 0.85rem;
                    }
                }
            `}</style>
            <div className="queries-container">
                <h1 className="queries-title">Student Queries</h1>

                <div>
                    {queries.map((query) => (
                        <Card key={query.id} className={`query-card ${query.status === 'Unread' ? 'unread' : ''}`}>
                            <CardContent className="query-content">
                                <div className="query-main">
                                    <div className="query-header">
                                        <h3 className="query-subject">{query.subject}</h3>
                                        {query.status === 'Unread' && <span className="badge-new">NEW</span>}
                                    </div>
                                    <p className="query-message">{query.message}</p>
                                    <div className="query-meta">From: <strong>{query.student?.name || "Student"}</strong> • {new Date(query.createdAt).toLocaleDateString()}</div>
                                    <div className="reply-section">
                                        <input
                                            type="text"
                                            placeholder="Type reply..."
                                            value={replyText[query.id] || ""}
                                            onChange={(e) => setReplyText(prev => ({ ...prev, [query.id]: e.target.value }))}
                                            className="reply-input"
                                        />
                                        <Button variant="outline" size="sm" onClick={() => sendReply(query.id)}>Reply</Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </>
    );
}
