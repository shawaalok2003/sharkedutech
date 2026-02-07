"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type College = {
    id: string;
    name: string;
    location: string;
    description?: string;
    rating?: number;
    courseCount?: number;
    logoUrl?: string;
};

export default function CollegeSearchPage() {
    const router = useRouter();
    const [query, setQuery] = useState("");
    const [colleges, setColleges] = useState<College[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchColleges() {
            try {
                const res = await fetch("/api/admissions/colleges");
                if (res.ok) {
                    const data = await res.json();
                    setColleges(data);
                }
            } finally {
                setLoading(false);
            }
        }
        fetchColleges();
    }, []);

    const filtered = useMemo(() => {
        const term = query.toLowerCase();
        return colleges.filter(c =>
            c.name.toLowerCase().includes(term) || c.location.toLowerCase().includes(term)
        );
    }, [query, colleges]);

    return (
        <>
            <style jsx>{`
                .page-container { padding: 0; }
                .page-header {
                    margin-bottom: 1.5rem;
                }
                .page-title {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: var(--primary);
                    margin-bottom: 1rem;
                }
                .search-row {
                    display: flex;
                    gap: 0.75rem;
                    flex-wrap: wrap;
                }
                .search-input {
                    flex: 1;
                    min-width: 200px;
                    padding: 0.75rem 1rem;
                    border-radius: var(--radius);
                    border: 1px solid var(--border);
                    font-size: 0.9rem;
                    transition: all var(--transition-base);
                }
                .search-input:focus {
                    outline: none;
                    border-color: var(--primary);
                    box-shadow: 0 0 0 3px rgba(0, 33, 71, 0.1);
                }
                .colleges-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 1.25rem;
                }
                .college-card {
                    background: white;
                    border-radius: var(--radius-lg);
                    border: 1px solid var(--border);
                    overflow: hidden;
                    transition: all var(--transition-base);
                }
                .college-card:hover {
                    transform: translateY(-3px);
                    box-shadow: var(--shadow-lg);
                }
                .card-header {
                    padding: 1.25rem;
                    display: flex;
                    gap: 1rem;
                    align-items: flex-start;
                }
                .college-logo {
                    width: 48px;
                    height: 48px;
                    border-radius: var(--radius);
                    background: var(--muted);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: var(--primary);
                    flex-shrink: 0;
                    overflow: hidden;
                }
                .college-logo img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                .college-info { flex: 1; min-width: 0; }
                .college-name {
                    font-size: 1rem;
                    font-weight: 600;
                    color: var(--foreground);
                    margin-bottom: 0.25rem;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .college-location {
                    font-size: 0.8rem;
                    color: var(--muted-foreground);
                }
                .rating-badge {
                    background: var(--warning-light);
                    color: var(--warning);
                    padding: 0.25rem 0.5rem;
                    border-radius: var(--radius);
                    font-weight: 600;
                    font-size: 0.75rem;
                    flex-shrink: 0;
                }
                .card-content {
                    padding: 0 1.25rem 1rem;
                }
                .college-desc {
                    font-size: 0.85rem;
                    color: var(--muted-foreground);
                    line-height: 1.5;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                .course-count {
                    font-size: 0.8rem;
                    color: var(--muted-foreground);
                    margin-top: 0.5rem;
                }
                .card-footer {
                    padding: 1rem 1.25rem;
                    border-top: 1px solid var(--border-light);
                    display: flex;
                    gap: 0.5rem;
                }
                .card-footer button {
                    flex: 1;
                }
                .empty-state {
                    text-align: center;
                    padding: 3rem 1.5rem;
                    background: white;
                    border-radius: var(--radius-lg);
                    border: 1px solid var(--border);
                }
                .results-count {
                    font-size: 0.85rem;
                    color: var(--muted-foreground);
                    margin-bottom: 1rem;
                }

                @media (max-width: 1024px) {
                    .colleges-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }
                @media (max-width: 640px) {
                    .colleges-grid {
                        grid-template-columns: 1fr;
                    }
                    .search-row {
                        flex-direction: column;
                    }
                    .search-input {
                        width: 100%;
                    }
                }
            `}</style>
            <div className="page-container">
                <div className="page-header">
                    <h1 className="page-title">🏫 Find Top Colleges</h1>
                    <div className="search-row">
                        <input
                            type="text"
                            className="search-input"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search by college name or city..."
                        />
                        <Button>🔍 Search</Button>
                    </div>
                </div>

                {loading ? (
                    <div style={{ color: 'var(--muted-foreground)', padding: '2rem', textAlign: 'center' }}>Loading colleges...</div>
                ) : filtered.length === 0 ? (
                    <div className="empty-state">
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
                        <h3 style={{ marginBottom: '0.5rem', color: 'var(--foreground)' }}>No Colleges Found</h3>
                        <p style={{ color: 'var(--muted-foreground)' }}>Try adjusting your search terms.</p>
                    </div>
                ) : (
                    <>
                        <p className="results-count">{filtered.length} college{filtered.length !== 1 ? 's' : ''} found</p>
                        <div className="colleges-grid">
                            {filtered.map((college) => (
                                <div key={college.id} className="college-card">
                                    <div className="card-header">
                                        <div className="college-logo">
                                            {college.logoUrl ? (
                                                <img src={college.logoUrl} alt={college.name} />
                                            ) : (
                                                college.name.slice(0, 2).toUpperCase()
                                            )}
                                        </div>
                                        <div className="college-info">
                                            <div className="college-name">{college.name}</div>
                                            <div className="college-location">📍 {college.location}</div>
                                        </div>
                                        <span className="rating-badge">★ {(college.rating ?? 0).toFixed(1)}</span>
                                    </div>
                                    <div className="card-content">
                                        <p className="college-desc">
                                            {college.description || "Top-rated institute offering quality education."}
                                        </p>
                                        <p className="course-count">📚 {college.courseCount ?? 0} active courses</p>
                                    </div>
                                    <div className="card-footer">
                                        <Button variant="outline" size="sm" onClick={() => router.push(`/admissions/colleges/${college.id}`)}>
                                            View Details
                                        </Button>
                                        <Button size="sm" onClick={() => router.push(`/admissions/colleges/${college.id}#apply`)}>
                                            Apply Now
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </>
    );
}
