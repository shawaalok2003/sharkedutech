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
                .candidate-layout {
                    display: flex;
                    min-height: 100vh;
                    background-color: #F0F9FF;
                }
                
                .candidate-main {
                    flex: 1;
                    margin-left: 280px;
                    padding: 2rem;
                    transition: margin-left 0.3s ease;
                }
                
                @media (max-width: 1024px) {
                    .candidate-main {
                        margin-left: 240px;
                        padding: 1.5rem;
                    }
                }
                
                @media (max-width: 768px) {
                    .candidate-main {
                        margin-left: 0;
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
