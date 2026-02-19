"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import styles from './Navbar.module.css';
import { useState, useEffect } from 'react';

import { useSession, signOut } from "next-auth/react";

export function Navbar() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const isActive = (path: string) => pathname === path ? styles.linkActive : '';

    const getDashboardLink = () => {
        if (!session?.user) return '/';
        const role = (session.user as any).role; // Type assertion if needed, or rely on d.ts
        if (role === 'ADMIN') return '/admin';
        if (role === 'EMPLOYER') return '/jobs/employer';
        return '/candidate/dashboard';
    };

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

    return (
        <header className={styles.header}>
            <div className={styles.navContainer}>
                <Link href="/" className={styles.logo}>
                    Sharkedutech
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
                        Home
                    </Link>
                    <Link href="/admissions" className={`${styles.link} ${isActive('/admissions')}`}>
                        Admissions
                    </Link>
                    <Link href="/jobs" className={`${styles.link} ${isActive('/jobs')}`}>
                        Jobs
                    </Link>
                    <Link href="/colleges" className={`${styles.link} ${isActive('/colleges')}`}>
                        Colleges
                    </Link>
                    <Link href="/employers" className={`${styles.link} ${isActive('/employers')}`}>
                        Employers
                    </Link>
                </nav>

                {/* Desktop Actions */}
                <div className={styles.actions}>
                    {session ? (
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <span className={styles.userName}>
                                Hi, {session.user?.name || 'User'}
                            </span>
                            <Link href={getDashboardLink()}>
                                <Button size="sm">Dashboard</Button>
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
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <Link href="/auth/signin">
                                <Button variant="ghost" size="sm">Login</Button>
                            </Link>
                            <Link href="/auth/signup">
                                <Button variant="primary" size="sm">Candidate Register</Button>
                            </Link>
                            <div style={{ width: '1px', height: '20px', backgroundColor: 'var(--border)', margin: '0 0.25rem' }}></div>
                            <Link href="/admissions/auth/signup">
                                <Button variant="outline" size="sm" style={{ backgroundColor: '#FFF7ED', borderColor: '#FDBA74', color: '#9A3412' }}>College Register</Button>
                            </Link>
                            <Link href="/auth/signup/employer">
                                <Button variant="outline" size="sm" style={{ backgroundColor: '#F0F9FF', borderColor: '#BAE6FD', color: '#0369A1' }}>Employer Register</Button>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Menu */}
                <div className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.mobileMenuOpen : ''}`}>
                    <nav className={styles.mobileNav}>
                        <Link href="/" className={`${styles.mobileLink} ${isActive('/')}`}>
                            Home
                        </Link>
                        <Link href="/admissions" className={`${styles.mobileLink} ${isActive('/admissions')}`}>
                            Admissions
                        </Link>
                        <Link href="/jobs" className={`${styles.mobileLink} ${isActive('/jobs')}`}>
                            Jobs
                        </Link>
                        <Link href="/colleges" className={`${styles.mobileLink} ${isActive('/colleges')}`}>
                            Colleges
                        </Link>
                        <Link href="/employers" className={`${styles.mobileLink} ${isActive('/employers')}`}>
                            Employers
                        </Link>
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
                            <>
                                <>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.5rem', width: '100%' }}>
                                        <Link href="/auth/signin">
                                            <Button variant="ghost" size="lg" style={{ width: '100%' }}>Login</Button>
                                        </Link>
                                        <Link href="/auth/signup">
                                            <Button variant="primary" size="lg" style={{ width: '100%' }}>Candidate Register</Button>
                                        </Link>
                                        <Link href="/admissions/auth/signup">
                                            <Button variant="outline" size="lg" style={{ width: '100%', backgroundColor: '#FFF7ED', borderColor: '#FDBA74', color: '#9A3412' }}>College Register</Button>
                                        </Link>
                                        <Link href="/auth/signup/employer">
                                            <Button variant="outline" size="lg" style={{ width: '100%', backgroundColor: '#F0F9FF', borderColor: '#BAE6FD', color: '#0369A1' }}>Employer Register</Button>
                                        </Link>
                                    </div>
                                </>
                            </>
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
