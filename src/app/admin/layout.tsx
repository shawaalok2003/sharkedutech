"use client";

import { Sidebar } from "@/components/dashboard/Sidebar";

const adminSidebarItems = [
    { label: "Overview", href: "/admin" },
    { label: "Manage Users", href: "/admin/users" },
    { label: "Manage Jobs", href: "/admin/jobs" },
    { label: "Job Applications", href: "/admin/applications" },
    { label: "Application Approvals", href: "/admin/approvals" },
    { label: "Manage Colleges & Courses", href: "/admin/colleges" },
    { label: "College Inquiries", href: "/admin/college-inquiries" },
    { label: "Manage Admissions", href: "/admin/admissions" },
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
                html, body {
                    margin: 0;
                    padding: 0;
                    overflow-x: hidden;
                    background-color: #f8fafc;
                }

                .admin-layout {
                    min-height: 100vh;
                    background-color: #f8fafc;
                    position: relative;
                    width: 100%;
                }
                
                .admin-main {
                    margin-left: 260px;
                    padding: 1.75rem 2rem;
                    min-height: 100vh;
                    box-sizing: border-box;
                    width: calc(100% - 260px);
                    max-width: calc(100% - 260px);
                    transition: margin-left 0.3s ease;
                }
                
                @media (max-width: 1024px) {
                    .admin-main {
                        margin-left: 230px;
                        width: calc(100% - 230px);
                        max-width: calc(100% - 230px);
                        padding: 1.25rem 1.5rem;
                    }
                }
                
                @media (max-width: 768px) {
                    .admin-main {
                        margin-left: 0;
                        width: 100%;
                        max-width: 100%;
                        padding: 1rem;
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
