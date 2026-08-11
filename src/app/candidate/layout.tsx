"use client";

import { Sidebar } from "@/components/dashboard/Sidebar";

const candidateSidebarItems = [
    { label: "Dashboard", href: "/candidate/dashboard" },
    { label: "My Profile", href: "/admissions/profile" },
    { label: "Browse Jobs", href: "/jobs" },
    { label: "Find Courses", href: "/admissions" },
    { label: "Job Apps", href: "/candidate/applications" },
    { label: "College Apps", href: "/admissions/applications" },
    { label: "Documents", href: "/admissions/documents" },
];

export default function CandidateLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <style jsx global>{`
                html, body {
                    margin: 0;
                    padding: 0;
                    overflow-x: hidden;
                    background-color: #F0F9FF;
                }

                .candidate-layout {
                    min-height: 100vh;
                    background-color: #F0F9FF;
                    position: relative;
                    width: 100%;
                }
                
                .candidate-main {
                    margin-left: 260px;
                    padding: 1.75rem 2rem;
                    min-height: 100vh;
                    box-sizing: border-box;
                    width: calc(100% - 260px);
                    max-width: calc(100% - 260px);
                    transition: margin-left 0.3s ease;
                }
                
                @media (max-width: 1024px) {
                    .candidate-main {
                        margin-left: 230px;
                        width: calc(100% - 230px);
                        max-width: calc(100% - 230px);
                        padding: 1.25rem 1.5rem;
                    }
                }
                
                @media (max-width: 768px) {
                    .candidate-main {
                        margin-left: 0;
                        width: 100%;
                        max-width: 100%;
                        padding: 1rem;
                        padding-bottom: 5rem;
                    }
                }
                
                @media (max-width: 480px) {
                    .candidate-main {
                        padding: 0.75rem;
                        padding-bottom: 5rem;
                    }
                }
            `}</style>
            <div className="candidate-layout">
                <Sidebar items={candidateSidebarItems} title="Student Portal" />
                <main className="candidate-main">
                    {children}
                </main>
            </div>
        </>
    );
}
