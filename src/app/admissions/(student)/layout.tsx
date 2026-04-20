"use client";

import { Sidebar } from "@/components/dashboard/Sidebar";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

const sidebarItems = [
  { label: "Dashboard", href: "/candidate/dashboard" },
  { label: "My Profile", href: "/admissions/profile" },
  { label: "Browse Jobs", href: "/jobs" },
  { label: "Find Courses", href: "/admissions" },
  { label: "Job Apps", href: "/candidate/applications" },
  { label: "College Apps", href: "/admissions/applications" },
  { label: "Documents", href: "/admissions/documents" },
];

export default function AdmissionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  // The main admissions page is public-ish (entry point)
  const isMainPage = pathname === "/admissions";

  useEffect(() => {
    if (status === "loading") return;

    // Redirect to login if accessing protected sub-routes without session
    if (!session && !isMainPage) {
      router.push("/auth/signin?callbackUrl=" + encodeURIComponent(pathname));
      return;
    }

    if (session?.user) {
      const role = (session.user as any).role;
      if (role === 'EMPLOYER') {
        router.push('/jobs/employer');
      } else if (role === 'ADMIN') {
        router.push('/admin');
      }
      // CANDIDATE is allowed here
    }
  }, [session, status, router, pathname, isMainPage]);

  if (status === "loading") {
    return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#ffffff' }}>Loading...</div>;
  }

  return (
    <>
      <style jsx global>{`
        .admissions-layout {
          display: flex;
          min-height: 100vh;
          background-color: #ffffff;
        }
        
        .admissions-main {
          flex: 1;
          margin-left: ${isMainPage ? '0' : '280px'};
          padding: ${isMainPage ? '0' : '2rem'};
          transition: all 0.3s ease;
          width: 100%;
        }
        
        @media (max-width: 1024px) {
          .admissions-main {
            margin-left: ${isMainPage ? '0' : '240px'};
            padding: ${isMainPage ? '0' : '1.5rem'};
          }
        }
        
        @media (max-width: 768px) {
          .admissions-main {
            margin-left: 0;
            padding: ${isMainPage ? '0' : '1rem'};
            padding-bottom: 5rem;
          }
        }
      `}</style>
      <div className="admissions-layout">
        {!isMainPage && <Sidebar items={sidebarItems} title="Student Portal" />}
        <main className="admissions-main">
          {children}
        </main>
      </div>
    </>
  );
}
