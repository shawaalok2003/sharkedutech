"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import Image from 'next/image';
import styles from './Navbar.module.css';
import { useState, useEffect } from 'react';

import { useSession, signOut } from "next-auth/react";

export function Navbar() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Close mobile menu when route changes
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isMobileMenuOpen]);

    // Hide main top navbar ONLY on Dashboard / Portal pages (keep Navbar visible on all Auth pages)
    const isAuthRoute = pathname?.includes('/auth/');

    const isDashboardRoute = !isAuthRoute && (
        pathname?.startsWith('/admin') ||
        pathname?.startsWith('/candidate') ||
        pathname?.startsWith('/admissions/college') ||
        pathname?.startsWith('/jobs/employer') ||
        pathname === '/admissions/profile' ||
        pathname === '/admissions/documents' ||
        pathname === '/admissions/applications' ||
        pathname === '/admissions/dashboard' ||
        pathname === '/admissions/dashboard-details'
    );

    if (isDashboardRoute) {
        return null;
    }

    const isActive = (path: string) => pathname === path ? styles.linkActive : '';

    const getDashboardLink = () => {
        if (!session?.user) return '/';
        const role = (session.user as any).role; // Type assertion if needed, or rely on d.ts
        if (role === 'ADMIN') return '/admin';
        if (role === 'EMPLOYER') return '/jobs/employer';
        if (role === 'COLLEGE') return '/admissions/college';
        return '/candidate/dashboard';
    };

    return (
        <header className={styles.header}>
            <div className={styles.navContainer}>
                <Link href="/" className={styles.logo} style={{ display: 'flex', alignItems: 'center' }}>
                    <Image src="/images/shark_edu_tech_logo-removebg-preview.png" alt="Sharkedutech Logo" width={320} height={84} style={{ objectFit: 'contain' }} priority />
                </Link>

                {/* Hamburger Button */}
                <button
                    className={styles.hamburger}
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    <span className={`${styles.hamburgerLine} ${isMobileMenuOpen ? styles.hamburgerLineOpen : ''}`}></span>
                    <span className={`${styles.hamburgerLine} ${isMobileMenuOpen ? styles.hamburgerLineOpen : ''}`}></span>
                    <span className={`${styles.hamburgerLine} ${isMobileMenuOpen ? styles.hamburgerLineOpen : ''}`}></span>
                </button>

                {/* Desktop Navigation */}
                <nav className={styles.navLinks}>
                    <Link href="/" className={`${styles.link} ${isActive('/')}`}>
                        <svg className={styles.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                        <span>Home</span>
                    </Link>
                    <Link href="/about" className={`${styles.link} ${isActive('/about')}`}>
                        <svg className={styles.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                        <span>About Us</span>
                    </Link>
                    <Link href="/admissions" className={`${styles.link} ${isActive('/admissions')}`}>
                        <svg className={styles.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                        <span>Admissions</span>
                    </Link>
                    <Link href="/jobs" className={`${styles.link} ${isActive('/jobs')}`}>
                        <svg className={styles.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                        <span>Jobs</span>
                    </Link>
                    <Link href="/gallery" className={`${styles.link} ${isActive('/gallery')}`}>
                        <svg className={styles.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                        <span>Gallery</span>
                    </Link>
                    {session?.user && (session.user as any).role === 'ADMIN' && (
                        <>
                            <Link href="/colleges" className={`${styles.link} ${isActive('/colleges')}`}>
                                <svg className={styles.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v8h20v-8a2 2 0 0 0-2-2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>
                                <span>Colleges</span>
                            </Link>
                            <Link href="/employers" className={`${styles.link} ${isActive('/employers')}`}>
                                <svg className={styles.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M16 10h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>
                                <span>Employers</span>
                            </Link>
                        </>
                    )}
                </nav>

                {/* Desktop Actions */}
                <div className={styles.actions}>
                    {session ? (
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <span className={styles.userName}>
                                {session.user?.name || 'User'}
                            </span>
                            <Link href={getDashboardLink()}>
                                <Button size="sm" variant="primary">Dashboard</Button>
                            </Link>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => signOut({ callbackUrl: '/' })}
                            >
                                Logout
                            </Button>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <div className={styles.dropdown}>
                                <div className={styles.dropdownTrigger}>
                                    <Button variant="ghost" size="sm">
                                        Partner Logins ▼
                                    </Button>
                                </div>
                                <div className={styles.dropdownContent}>
                                    <Link href="/auth/signin?type=admin" className={styles.dropdownItem}>
                                        🛡️ Super Admin Portal
                                    </Link>
                                    <Link href="/admissions/auth/signin" className={styles.dropdownItem}>
                                        🎓 College Dashboard
                                    </Link>
                                    <Link href="/auth/signin?type=employer" className={styles.dropdownItem}>
                                        💼 Employer Portal
                                    </Link>
                                    <div className={styles.dropdownDivider}></div>
                                    <Link href="/list-your-college" className={styles.dropdownItem}>
                                        ➕ List Your College
                                    </Link>
                                </div>
                            </div>

                            <Link href="/auth/signin">
                                <Button variant="ghost" size="sm">Login</Button>
                            </Link>
                            
                            <Link href="/auth/signup">
                                <Button size="sm" className={styles.registerBtn}>Register</Button>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Menu */}
                <div className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.mobileMenuOpen : ''}`}>
                    <button 
                        className={styles.closeBtn}
                        onClick={() => setIsMobileMenuOpen(false)}
                        aria-label="Close menu"
                    >
                        &times;
                    </button>
                    <nav className={styles.mobileNav}>
                        <Link href="/" className={`${styles.mobileLink} ${isActive('/')}`}>
                            <svg className={styles.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                            <span>Home</span>
                        </Link>
                        <Link href="/about" className={`${styles.mobileLink} ${isActive('/about')}`}>
                            <svg className={styles.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                            <span>About Us</span>
                        </Link>
                        <Link href="/admissions" className={`${styles.mobileLink} ${isActive('/admissions')}`}>
                            <svg className={styles.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                            <span>Admissions</span>
                        </Link>
                        <Link href="/jobs" className={`${styles.mobileLink} ${isActive('/jobs')}`}>
                            <svg className={styles.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                            <span>Jobs</span>
                        </Link>
                        <Link href="/gallery" className={`${styles.mobileLink} ${isActive('/gallery')}`}>
                            <svg className={styles.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                            <span>Gallery</span>
                        </Link>
                        {session?.user && (session.user as any).role === 'ADMIN' && (
                            <>
                                <Link href="/colleges" className={`${styles.mobileLink} ${isActive('/colleges')}`}>
                                    <svg className={styles.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v8h20v-8a2 2 0 0 0-2-2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>
                                    <span>Colleges</span>
                                </Link>
                                <Link href="/employers" className={`${styles.mobileLink} ${isActive('/employers')}`}>
                                    <svg className={styles.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M16 10h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>
                                    <span>Employers</span>
                                </Link>
                            </>
                        )}
                    </nav>

                    <div className={styles.mobileActions}>
                        {session ? (
                            <>
                                <div className={styles.mobileUserInfo}>
                                    Hi, {session.user?.name || 'User'}
                                </div>
                                <Link href={getDashboardLink()} style={{ width: '100%' }}>
                                    <Button size="lg" style={{ width: '100%' }}>Dashboard</Button>
                                </Link>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    style={{ width: '100%' }}
                                    onClick={() => signOut({ callbackUrl: '/' })}
                                >
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.5rem', width: '100%' }}>
                                <Link href="/auth/signin?type=admin">
                                    <Button variant="outline" size="lg" style={{ width: '100%' }}>Super Admin Login</Button>
                                </Link>
                                <Link href="/admissions/auth/signin">
                                    <Button variant="outline" size="lg" style={{ width: '100%' }}>College Login</Button>
                                </Link>
                                <Link href="/auth/signin?type=employer">
                                    <Button variant="outline" size="lg" style={{ width: '100%' }}>Employer Login</Button>
                                </Link>
                                <Link href="/auth/signin">
                                    <Button variant="ghost" size="lg" style={{ width: '100%' }}>Login</Button>
                                </Link>
                                <Link href="/auth/signup">
                                    <Button variant="primary" size="lg" style={{ width: '100%' }}>Register</Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile Overlay */}
                <div
                    className={`${styles.overlay} ${isMobileMenuOpen ? styles.overlayVisible : ''}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            </div>
        </header>
    );
}
