"use client";

import { Sidebar } from "@/components/dashboard/Sidebar";

const employerSidebarItems = [
    { label: "Dashboard", href: "/jobs/employer" },
    { label: "Post a Job", href: "/jobs/employer/post" },
    { label: "Active Jobs", href: "/jobs/employer/active" },
    { label: "Candidates", href: "/jobs/employer/candidates" },
    { label: "Company Profile", href: "/jobs/employer/profile" },
    { label: "Settings", href: "/jobs/employer/settings" },
];

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function EmployerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "loading") return;

        if (!session) {
            router.push('/auth/signin?type=employer');
            return;
        }

        const role = (session.user as any).role;
        if (role === 'CANDIDATE') {
            router.push('/candidate/dashboard');
        } else if (role === 'COLLEGE') {
            router.push('/admissions/college');
        } else if (role !== 'EMPLOYER' && role !== 'ADMIN') {
            router.push('/auth/signin');
        }
    }, [session, status, router]);

    if (status === "loading") {
        return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>Loading...</div>;
    }
    return (
        <>
            <style jsx global>{`
                .employer-layout {
                    display: flex;
                    min-height: 100vh;
                    background-color: #F0F9FF;
                }
                
                .employer-main {
                    flex: 1;
                    margin-left: 280px;
                    padding: 2rem;
                    transition: margin-left 0.3s ease;
                }
                
                @media (max-width: 1024px) {
                    .employer-main {
                        margin-left: 240px;
                        padding: 1.5rem;
                    }
                }
                
                @media (max-width: 768px) {
                    .employer-main {
                        margin-left: 0;
                        padding: 1rem;
                        padding-bottom: 5rem;
                    }
                }
                
                @media (max-width: 480px) {
                    .employer-main {
                        padding: 0.75rem;
                        padding-bottom: 5rem;
                    }
                }
            `}</style>
            <div className="employer-layout">
                <Sidebar items={employerSidebarItems} title="Employer Portal" />
                <main className="employer-main">
                    {children}
                </main>
            </div>
        </>
    );
}
