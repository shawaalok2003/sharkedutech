"use client";

import { Sidebar } from "@/components/dashboard/Sidebar";

const collegeSidebarItems = [
    { label: "Dashboard", href: "/admissions/college" },
    { label: "Manage Courses", href: "/admissions/college/courses" },
    { label: "Applications", href: "/admissions/college/applications" },
    { label: "Student Queries", href: "/admissions/college/queries" },
    { label: "Institute Profile", href: "/admissions/college/profile" },
    { label: "Analytics", href: "/admissions/college/analytics" },
];

export default function CollegeAdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <style jsx global>{`
                .college-layout {
                    display: flex;
                    min-height: 100vh;
                    background-color: #F8FAFC;
                }
                
                .college-main {
                    flex: 1;
                    margin-left: 280px;
                    padding: 2rem;
                    transition: margin-left 0.3s ease;
                }
                
                @media (max-width: 1024px) {
                    .college-main {
                        margin-left: 240px;
                        padding: 1.5rem;
                    }
                }
                
                @media (max-width: 768px) {
                    .college-main {
                        margin-left: 0;
                        padding: 1rem;
                        padding-bottom: 5rem;
                    }
                }
                
                @media (max-width: 480px) {
                    .college-main {
                        padding: 0.75rem;
                        padding-bottom: 5rem;
                    }
                }
            `}</style>
            <div className="college-layout">
                <Sidebar items={collegeSidebarItems} title="College Admin" />
                <main className="college-main">
                    {children}
                </main>
            </div>
        </>
    );
}
