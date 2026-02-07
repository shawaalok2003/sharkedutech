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
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <Link href="/auth/signin?type=candidate">
                                <Button variant="ghost" size="sm">Candidate</Button>
                            </Link>
                            <Link href="/auth/signin?type=employer">
                                <Button variant="outline" size="sm">Employer</Button>
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
                                <Link href="/auth/signin?type=candidate" style={{ width: '100%' }}>
                                    <Button variant="primary" size="lg" style={{ width: '100%' }}>Candidate Login</Button>
                                </Link>
                                <Link href="/auth/signin?type=employer" style={{ width: '100%' }}>
                                    <Button variant="outline" size="lg" style={{ width: '100%' }}>Employer Login</Button>
                                </Link>
                                <Link href="/auth/signin?type=admin" style={{ width: '100%' }}>
                                    <Button variant="outline" size="lg" style={{ width: '100%' }}>Admin Login</Button>
                                </Link>
                                <Link href="/admissions/auth/signin" style={{ width: '100%' }}>
                                    <Button variant="outline" size="lg" style={{ width: '100%' }}>College Admin</Button>
                                </Link>
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
