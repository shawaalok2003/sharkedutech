"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useEffect, useState } from "react";

export default function AnalyticsPage() {
    const [stats, setStats] = useState({ totalApplications: 0, pending: 0, shortlisted: 0, accepted: 0 });

    useEffect(() => {
        async function load() {
            const res = await fetch("/api/admissions/analytics");
            if (res.ok) {
                const data = await res.json();
                setStats(data);
            }
        }
        load();
    }, []);

    return (
        <>
            <style jsx>{`
                .analytics-container {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }
                .analytics-title {
                    font-size: 1.75rem;
                    font-weight: 700;
                    color: var(--primary);
                    margin: 0 0 1.5rem;
                }
                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 1.25rem;
                }
                .stat-card {
                    padding: 1.5rem;
                    text-align: center;
                }
                .stat-value {
                    font-size: 2.25rem;
                    font-weight: 700;
                    color: var(--primary);
                }
                .stat-label {
                    color: var(--muted-foreground);
                    font-size: 0.875rem;
                    margin-top: 0.25rem;
                }
                .charts-grid {
                    display: grid;
                    grid-template-columns: 2fr 1fr;
                    gap: 1.5rem;
                }
                .chart-container {
                    height: 280px;
                    display: flex;
                    align-items: flex-end;
                    justify-content: space-around;
                    padding-bottom: 1rem;
                    padding-left: 0.75rem;
                    border-bottom: 1px solid var(--border);
                }
                .bar {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.4rem;
                }
                .bar-column {
                    width: 35px;
                    background-color: var(--primary);
                    border-radius: 4px 4px 0 0;
                    opacity: 0.85;
                }
                .bar-label {
                    font-size: 0.75rem;
                    color: var(--muted-foreground);
                }
                .demographics {
                    display: flex;
                    flex-direction: column;
                    gap: 1.25rem;
                    margin-top: 1rem;
                }
                .demo-item {
                    display: flex;
                    flex-direction: column;
                    gap: 0.4rem;
                }
                .demo-header {
                    display: flex;
                    justify-content: space-between;
                    font-size: 0.875rem;
                }
                .demo-label {
                    flex: 1;
                }
                .demo-percent {
                    margin-left: auto;
                    font-weight: 600;
                }
                .progress-bar {
                    height: 8px;
                    background-color: var(--muted);
                    border-radius: 4px;
                    overflow: hidden;
                }
                .progress-fill {
                    height: 100%;
                    background-color: var(--accent);
                    border-radius: 4px;
                }

                @media (max-width: 1024px) {
                    .charts-grid {
                        grid-template-columns: 1fr;
                    }
                }
                @media (max-width: 768px) {
                    .stats-grid {
                        grid-template-columns: 1fr;
                    }
                    .stat-value {
                        font-size: 1.75rem;
                    }
                    .chart-container {
                        height: 250px;
                        padding-left: 0.5rem;
                    }
                    .bar-column {
                        width: 30px;
                    }
                }
                @media (max-width: 480px) {
                    .analytics-title {
                        font-size: 1.5rem;
                    }
                    .stat-value {
                        font-size: 1.5rem;
                    }
                    .bar {
                        gap: 0.25rem;
                    }
                    .bar-label {
                        font-size: 0.7rem;
                    }
                }
            `}</style>
            <div className="analytics-container">
                <h1 className="analytics-title">Analytics & Reports</h1>

                {/* Top Stats */}
                <div className="stats-grid">
                    <Card>
                        <CardContent className="stat-card">
                            <div className="stat-value">{stats.totalApplications}</div>
                            <div className="stat-label">Total Applications</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="stat-card">
                            <div className="stat-value">{stats.pending}</div>
                            <div className="stat-label">Pending Applications</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="stat-card">
                            <div className="stat-value">{stats.accepted}</div>
                            <div className="stat-label">Accepted Students</div>
                        </CardContent>
                    </Card>
                </div>

                <div className="charts-grid">
                    <Card>
                        <CardHeader>
                            <CardTitle>Application Trends</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="chart-container">
                                {/* Mock Bar Chart */}
                                {[40, 65, 35, 80, 55, 90].map((h, i) => (
                                    <div key={i} className="bar">
                                        <div className="bar-column" style={{ height: `${h * 2.5}px` }}></div>
                                        <span className="bar-label">{['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'][i]}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Demographics</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="demographics">
                                <div className="demo-item">
                                    <div className="demo-header">
                                        <span className="demo-label">Mumbai</span>
                                        <span className="demo-percent">45%</span>
                                    </div>
                                    <div className="progress-bar">
                                        <div className="progress-fill" style={{ width: '45%' }}></div>
                                    </div>
                                </div>
                                <div className="demo-item">
                                    <div className="demo-header">
                                        <span className="demo-label">Delhi</span>
                                        <span className="demo-percent">25%</span>
                                    </div>
                                    <div className="progress-bar">
                                        <div className="progress-fill" style={{ width: '25%' }}></div>
                                    </div>
                                </div>
                                <div className="demo-item">
                                    <div className="demo-header">
                                        <span className="demo-label">Bangalore</span>
                                        <span className="demo-percent">15%</span>
                                    </div>
                                    <div className="progress-bar">
                                        <div className="progress-fill" style={{ width: '15%' }}></div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
