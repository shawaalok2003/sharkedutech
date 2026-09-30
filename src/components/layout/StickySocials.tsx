"use client";

import { usePathname } from 'next/navigation';
import styles from './StickySocials.module.css';

const SOCIAL_LINKS = [
    {
        name: 'WhatsApp',
        url: 'https://wa.me/919147331167',
        className: styles.whatsapp,
        icon: (
            <svg className={styles.iconSvg} viewBox="0 0 24 24">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.585 1.961.948 2.791.948h.005c3.179 0 5.767-2.586 5.767-5.766.001-3.182-2.585-5.769-5.766-5.769zm3.393 8.163c-.144.405-.837.774-1.17.824-.312.045-.634.054-1.805-.431-1.397-.579-2.316-1.988-2.385-2.079-.07-.091-.564-.75-.564-1.429 0-.679.355-1.013.481-1.152.126-.139.276-.174.368-.174.092 0 .184.001.264.005.085.004.199-.032.311.237.115.276.391.954.425 1.023.034.07.057.151.011.242-.046.091-.069.148-.138.229-.069.08-.145.179-.207.24-.07.069-.143.144-.062.284.081.139.36.594.773.962.531.474 1.002.636 1.153.719.151.083.24.072.33-.032.091-.104.391-.456.495-.612.103-.157.207-.131.345-.08.138.051.874.412 1.024.487.15.075.25.112.287.175.037.063.037.367-.107.772zM12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.66 1.434 5.178L2 22l4.981-1.397C8.423 21.493 10.154 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.2c-1.636 0-3.167-.478-4.46-1.3l-.32-.204-2.96.828.842-2.887-.21-.334C4.019 14.996 3.55 13.535 3.55 12c0-4.659 3.791-8.45 8.45-8.45 4.659 0 8.45 3.791 8.45 8.45 0 4.659-3.791 8.45-8.45 8.45z"/>
            </svg>
        )
    },
    {
        name: 'Facebook',
        url: 'https://www.facebook.com/sharkedutech',
        className: styles.facebook,
        icon: (
            <svg className={styles.iconSvg} viewBox="0 0 24 24">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
            </svg>
        )
    },
    {
        name: 'LinkedIn',
        url: 'https://www.linkedin.com/company/shark-edutech/',
        className: styles.linkedin,
        icon: (
            <svg className={styles.iconSvg} viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.64a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28z" />
            </svg>
        )
    },
    {
        name: 'X (Twitter)',
        url: 'https://twitter.com/sharkedutech',
        className: styles.twitter,
        icon: (
            <svg className={styles.iconSvg} viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
        )
    },
    {
        name: 'Instagram',
        url: 'https://www.instagram.com/sharkedutech',
        className: styles.instagram,
        icon: (
            <svg className={styles.iconSvg} viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
        )
    }
];

export function StickySocials() {
    const pathname = usePathname();

    // Hide on admin and dedicated internal dashboard routes
    const isDashboardRoute = (
        pathname?.startsWith('/admin') ||
        pathname?.startsWith('/candidate/dashboard') ||
        pathname?.startsWith('/admissions/college') ||
        pathname?.startsWith('/jobs/employer')
    );

    if (isDashboardRoute) {
        return null;
    }

    return (
        <aside className={styles.stickyContainer} aria-label="Social media links">
            {SOCIAL_LINKS.map((item) => (
                <a
                    key={item.name}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${styles.socialButton} ${item.className}`}
                    aria-label={`Follow us on ${item.name}`}
                >
                    {item.icon}
                    <span className={styles.tooltip}>{item.name}</span>
                </a>
            ))}
        </aside>
    );
}
