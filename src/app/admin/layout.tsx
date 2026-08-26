"use client";

import { Sidebar } from "@/components/dashboard/Sidebar";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";

const allAdminSidebarItems = [
    { label: "Overview", href: "/admin", perm: null },
    { label: "Manage Users", href: "/admin/users", perm: "manage_users" },
    { label: "🔐 Role-Based Access", href: "/admin/sub-admins", perm: "manage_users" },
    { label: "Manage Jobs", href: "/admin/jobs", perm: "manage_jobs" },
    { label: "Job Applications", href: "/admin/applications", perm: "manage_jobs" },
    { label: "Application Approvals", href: "/admin/approvals", perm: "manage_jobs" },
    { label: "Manage Colleges & Courses", href: "/admin/colleges", perm: "manage_colleges" },
    { label: "College Inquiries", href: "/admin/college-inquiries", perm: "manage_colleges" },
    { label: "Manage Admissions", href: "/admin/admissions", perm: "manage_admissions" },
    { label: "Settings", href: "/admin/settings", perm: "manage_users" },
];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data: session } = useSession();
    const pathname = usePathname();
    const [clientPermissions, setClientPermissions] = useState<string | null>(null);

    const user = session?.user as any;
    const role = user?.role;
    const isSuper = role === "SUPER_ADMIN";

    // Auto-refresh session permissions for existing active sessions
    useEffect(() => {
        if (session?.user && role === "ADMIN" && !user?.adminPermissions) {
            fetch('/api/auth/session')
                .then(res => res.json())
                .then(data => {
                    if (data?.user?.adminPermissions) {
                        setClientPermissions(data.user.adminPermissions);
                    }
                })
                .catch(err => console.error("Session refresh error:", err));
        }
    }, [session, role, user]);

    const activePermStr = user?.adminPermissions || clientPermissions || "";
    const userPerms: string[] = activePermStr ? activePermStr.split(',') : [];

    // Filter sidebar navigation items based on assigned sub-admin permissions
    const filteredSidebarItems = allAdminSidebarItems.filter(item => {
        if (!item.perm) return true; // Overview is accessible
        if (isSuper) return true; // Super admin sees all items
        if (role === "ADMIN" && !activePermStr) return true; // Safe fallback while loading
        return userPerms.includes(item.perm);
    });

    // Check if sub-admin is attempting to open an unpermitted route
    const currentItem = allAdminSidebarItems.find(item => item.href === pathname);
    const hasPermission = !currentItem || !currentItem.perm || isSuper || !activePermStr || userPerms.includes(currentItem.perm);

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
                <Sidebar items={filteredSidebarItems} title={isSuper ? "Super Admin" : "Admin Portal"} />
                <main className="admin-main">
                    {!hasPermission ? (
                        <div style={{ maxWidth: '600px', margin: '4rem auto', textAlign: 'center', background: '#ffffff', padding: '3.5rem 2rem', borderRadius: '1.5rem', border: '1px solid #fecaca', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}>
                            <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>⛔</div>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#991b1b', marginBottom: '0.75rem' }}>
                                Access Restricted — Permission Required
                            </h2>
                            <p style={{ color: '#64748b', fontSize: '0.975rem', marginBottom: '2rem', lineHeight: '1.6' }}>
                                Your sub-admin account (<strong>{user?.email || 'Sub-Admin'}</strong>) does not have the <strong>{currentItem?.perm}</strong> permission required to access this feature.
                            </p>
                            <Link href="/admin" style={{ background: '#2563eb', color: '#ffffff', padding: '0.85rem 1.75rem', borderRadius: '10px', fontWeight: 800, textDecoration: 'none', display: 'inline-block', boxShadow: '0 4px 14px rgba(37,99,235,0.3)' }}>
                                ← Return to Admin Overview
                            </Link>
                        </div>
                    ) : (
                        children
                    )}
                </main>
            </div>
        </>
    );
}
