"use client";

import { Sidebar } from "@/components/dashboard/Sidebar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

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
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "loading") return;

        if (!session) {
            router.push('/admissions/auth/signin');
            return;
        }

        const role = (session.user as any).role;
        // Only allow COLLEGE or potentially ADMIN to access college portal
        if (role === 'CANDIDATE') {
            router.push('/candidate/dashboard');
        } else if (role === 'EMPLOYER') {
            router.push('/jobs/employer');
        } else if (role !== 'COLLEGE' && role !== 'ADMIN') {
            router.push('/auth/signin');
        }
    }, [session, status, router]);

    if (status === "loading") {
        return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>Loading...</div>;
    }

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
