import React from 'react';
import styles from '../policies.module.css';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent } from "@/components/ui/Card";

const blogPosts = [
    {
        title: "Future of Luxury Hospitality in 2026",
        date: "May 1, 2026",
        excerpt: "Exploring the trends that are shaping the next generation of luxury hotels and guest experiences.",
        category: "Industry Trends"
    },
    {
        title: "How to Ace Your Hotel Management Interview",
        date: "April 25, 2026",
        excerpt: "Top tips from industry veterans on what luxury brands are looking for in new candidates.",
        category: "Career Advice"
    },
    {
        title: "Why Practical Training is Key in Hospitality",
        date: "April 15, 2026",
        excerpt: "Understanding the importance of well-equipped training kitchens and housekeeping labs.",
        category: "Education"
    }
];

export default function BlogPage() {
    return (
        <main>
            <div className={styles.policyContainer}>
                <header className={styles.header}>
                    <h1 className={styles.title}>Shark Blog</h1>
                    <p className={styles.lastUpdated}>Insights, trends, and advice from the world of hospitality.</p>
                </header>

                <div className="blog-grid" style={{ display: 'grid', gap: '2rem' }}>
                    {blogPosts.map((post, i) => (
                        <Card key={i}>
                            <CardContent style={{ padding: '2rem' }}>
                                <div style={{ color: 'var(--secondary)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.5rem' }}>{post.category}</div>
                                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--primary)' }}>{post.title}</h2>
                                <p style={{ color: 'var(--muted-foreground)', marginBottom: '1.5rem' }}>{post.excerpt}</p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)' }}>{post.date}</span>
                                    <span style={{ color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }}>Read More →</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
            <Footer />
        </main>
    );
}
