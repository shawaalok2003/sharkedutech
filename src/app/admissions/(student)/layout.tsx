"use client";

import { Sidebar } from "@/components/dashboard/Sidebar";

const sidebarItems = [
  { label: "Dashboard", href: "/admissions" },
  { label: "My Profile", href: "/admissions/profile" },
  { label: "College Search", href: "/admissions/colleges" },
  { label: "Applications", href: "/admissions/applications" },
  { label: "Documents", href: "/admissions/documents" },
];

export default function AdmissionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <style jsx global>{`
        .admissions-layout {
          display: flex;
          min-height: 100vh;
          background-color: var(--background-secondary, #F9FAFB);
        }
        
        .admissions-main {
          flex: 1;
          margin-left: 280px;
          padding: 2rem;
          transition: margin-left 0.3s ease;
        }
        
        @media (max-width: 1024px) {
          .admissions-main {
            margin-left: 240px;
            padding: 1.5rem;
          }
        }
        
        @media (max-width: 768px) {
          .admissions-main {
            margin-left: 0;
            padding: 1rem;
            padding-bottom: 5rem;
          }
        }
        
        @media (max-width: 480px) {
          .admissions-main {
            padding: 0.75rem;
            padding-bottom: 5rem;
          }
        }
      `}</style>
      <div className="admissions-layout">
        <Sidebar items={sidebarItems} title="Admissions Portal" />
        <main className="admissions-main">
          {children}
        </main>
      </div>
    </>
  );
}
