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

    if (isAuthRoute || isDashboardRoute) {
        return null;
    }

    const isActive = (path: string) => pathname === path ? styles.linkActive : '';

    const getDashboardLink = () => {
        if (!session?.user) return '/';
        const role = (session.user as any).role;
        if (role === 'ADMIN') return '/admin';
        if (role === 'EMPLOYER') return '/jobs/employer';
        if (role === 'COLLEGE') return '/admissions/college';
        return '/candidate/dashboard';
    };

    return (
        <header className={styles.header}>
            <div className={styles.navContainer}>
                <Link href="/" className={styles.logo} style={{ display: 'flex', alignItems: 'center' }}>
                    <Image src="/images/shark_edu_tech_logo-removebg-preview.png" alt="Sharkedutech Logo" width={380} height={100} style={{ objectFit: 'contain' }} priority />
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

                {/* Desktop Navigation (Clean Text Links - No Icons) */}
                <nav className={styles.navLinks}>
                    <Link href="/" className={`${styles.link} ${isActive('/')}`}>
                        <span>Home</span>
                    </Link>
                    <Link href="/about" className={`${styles.link} ${isActive('/about')}`}>
                        <span>About Us</span>
                    </Link>
                    <Link href="/admissions" className={`${styles.link} ${isActive('/admissions')}`}>
                        <span>Admissions</span>
                    </Link>
                    <Link href="/jobs" className={`${styles.link} ${isActive('/jobs')}`}>
                        <span>Jobs</span>
                    </Link>
                    <Link href="/gallery" className={`${styles.link} ${isActive('/gallery')}`}>
                        <span>Gallery</span>
                    </Link>
                    {session?.user && (session.user as any).role === 'ADMIN' && (
                        <>
                            <Link href="/colleges" className={`${styles.link} ${isActive('/colleges')}`}>
                                <span>Colleges</span>
                            </Link>
                            <Link href="/employers" className={`${styles.link} ${isActive('/employers')}`}>
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
                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
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
                            <span>Home</span>
                        </Link>
                        <Link href="/about" className={`${styles.mobileLink} ${isActive('/about')}`}>
                            <span>About Us</span>
                        </Link>
                        <Link href="/admissions" className={`${styles.mobileLink} ${isActive('/admissions')}`}>
                            <span>Admissions</span>
                        </Link>
                        <Link href="/jobs" className={`${styles.mobileLink} ${isActive('/jobs')}`}>
                            <span>Jobs</span>
                        </Link>
                        <Link href="/gallery" className={`${styles.mobileLink} ${isActive('/gallery')}`}>
                            <span>Gallery</span>
                        </Link>
                        {session?.user && (session.user as any).role === 'ADMIN' && (
                            <>
                                <Link href="/colleges" className={`${styles.mobileLink} ${isActive('/colleges')}`}>
                                    <span>Colleges</span>
                                </Link>
                                <Link href="/employers" className={`${styles.mobileLink} ${isActive('/employers')}`}>
                                    <span>Employers</span>
                                </Link>
                            </>
                        )}
                        <div className={styles.mobileActions}>
                            {session ? (
                                <>
                                    <Link href={getDashboardLink()}>
                                        <Button size="md" variant="primary" style={{ width: '100%' }}>Dashboard</Button>
                                    </Link>
                                    <Button
                                        variant="outline"
                                        size="md"
                                        onClick={() => signOut({ callbackUrl: '/' })}
                                        style={{ width: '100%' }}
                                    >
                                        Logout
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Link href="/auth/signin">
                                        <Button variant="outline" size="md" style={{ width: '100%' }}>Login</Button>
                                    </Link>
                                    <Link href="/auth/signup">
                                        <Button size="md" variant="primary" style={{ width: '100%' }}>Register</Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>
                </div>
            </div>
        </header>
    );
}
