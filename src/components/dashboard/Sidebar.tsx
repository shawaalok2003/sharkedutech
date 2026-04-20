"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import styles from './Sidebar.module.css';

interface SidebarItem {
    label: string;
    href: string;
    icon?: React.ReactNode;
}

interface SidebarProps {
    items: SidebarItem[];
    title?: string;
}

export function Sidebar({ items, title = "Sharkedutech" }: SidebarProps) {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const { data: session } = useSession();
    const [photoUrl, setPhotoUrl] = useState<string | null>(null);

    // Fetch user profile for photo
    useEffect(() => {
        if (session?.user && (session.user as any).role === 'CANDIDATE') {
            fetch('/api/admissions/profile')
                .then(res => res.json())
                .then(data => {
                    if (data.photoUrl) setPhotoUrl(data.photoUrl);
                })
                .catch(err => console.error("Sidebar profile fetch error:", err));
        }
    }, [session]);

    // Close sidebar when route changes on mobile
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    // Prevent body scroll when sidebar is open on mobile
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    return (
        <>
            {/* Mobile Toggle Button */}
            <button 
                className={styles.mobileToggle}
                onClick={() => setIsOpen(true)}
                aria-label="Open menu"
            >
                ☰
            </button>

            {/* Overlay */}
            <div 
                className={`${styles.overlay} ${isOpen ? styles.overlayVisible : ''}`}
                onClick={() => setIsOpen(false)}
                style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
            />

            {/* Sidebar */}
            <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}>
                <div className={styles.header}>
                    <div className={styles.brand}>{title}</div>
                    <button 
                        className={styles.closeBtn}
                        onClick={() => setIsOpen(false)}
                        aria-label="Close menu"
                    >
                        ✕
                    </button>
                </div>

                <nav className={styles.nav}>
                    {items.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`${styles.item} ${pathname === item.href ? styles.active : ''}`}
                        >
                            {item.icon && <span>{item.icon}</span>}
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className={styles.footer}>
                    <div className={styles.user}>
                        <div className={styles.avatar}>
                            {photoUrl ? (
                                <img src={photoUrl} alt="User Balance" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                            ) : (
                                session?.user?.name ? session.user.name.charAt(0).toUpperCase() : 'U'
                            )}
                        </div>
                        <div className={styles.userInfo}>
                            <div className={styles.userName}>{session?.user?.name || 'User'}</div>
                            <div className={styles.userRole}>{(session?.user as any)?.role || 'Applicant'}</div>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
