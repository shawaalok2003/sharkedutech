"use client";

import { Sidebar } from "@/components/dashboard/Sidebar";

const adminSidebarItems = [
    { label: "Overview", href: "/admin" },
    { label: "Manage Jobs", href: "/admin/jobs" },
    { label: "Manage Users", href: "/admin/users" },
    { label: "Settings", href: "/admin/settings" },
];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <style jsx global>{`
                .admin-layout {
                    display: flex;
                    min-height: 100vh;
                    background-color: #F0F9FF;
                }
                
                .admin-main {
                    flex: 1;
                    margin-left: 280px;
                    padding: 2rem;
                    transition: margin-left 0.3s ease;
                }
                
                @media (max-width: 1024px) {
                    .admin-main {
                        margin-left: 240px;
                        padding: 1.5rem;
                    }
                }
                
                @media (max-width: 768px) {
                    .admin-main {
                        margin-left: 0;
                        padding: 1rem;
                        padding-bottom: 5rem;
                    }
                }
                
                @media (max-width: 480px) {
                    .admin-main {
                        padding: 0.75rem;
                        padding-bottom: 5rem;
                    }
                }
            `}</style>
            <div className="admin-layout">
                <Sidebar items={adminSidebarItems} title="Admin Portal" />
                <main className="admin-main">
                    {children}
                </main>
            </div>
        </>
    );
}
