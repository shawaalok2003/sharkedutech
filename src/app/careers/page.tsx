import React from 'react';
import styles from '../policies.module.css';
import { Footer } from '@/components/layout/Footer';

export default function CareersPage() {
    return (
        <main>
            <div className={styles.policyContainer}>
                <header className={styles.header}>
                    <h1 className={styles.title}>Join Our Team</h1>
                    <p className={styles.lastUpdated}>Build the future of hospitality education with us.</p>
                </header>

                <div className={styles.content}>
                    <h2>Why Work at Shark Edutech?</h2>
                    <p>
                        Shark Edutech is more than just a platform; it's a mission to transform the hospitality industry through better education and career opportunities. We are looking for passionate individuals who want to make a real impact.
                    </p>

                    <h2>Current Openings</h2>
                    <ul>
                        <li>
                            <strong>Educational Consultant</strong> - Help colleges integrate our platform and improve student outcomes.
                        </li>
                        <li>
                            <strong>Technical Support Specialist</strong> - Provide top-tier support to our students and institutional partners.
                        </li>
                        <li>
                            <strong>Content Strategist</strong> - Create engaging content for our blog and educational resources.
                        </li>
                        <li>
                            <strong>Full Stack Developer</strong> - Help us build and scale our integrated job and admission portals.
                        </li>
                    </ul>

                    <h2>Our Values</h2>
                    <p>
                        We value innovation, integrity, and a deep commitment to the hospitality sector. We offer a remote-friendly environment, competitive benefits, and the chance to be part of a rapidly growing ed-tech startup.
                    </p>

                    <p style={{ marginTop: '3rem', textAlign: 'center' }}>
                        Interested? Send your CV to <strong>careers@shark.com</strong>
                    </p>
                </div>
            </div>
            <Footer />
        </main>
    );
}
