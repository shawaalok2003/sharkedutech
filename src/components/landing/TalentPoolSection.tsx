import Link from 'next/link';
import styles from './TalentPoolSection.module.css';

export function TalentPoolSection() {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.grid}>
                    {/* Left Column */}
                    <div>
                        <span className={styles.badge}>OUR NETWORK</span>
                        <h2 className={styles.heading}>
                            Powerful <span className={styles.headingHighlight}>Talent Pool</span> Ready to Work
                        </h2>
                        
                        <p className={styles.subHeading}>Stay connected with future opportunities.</p>
                        
                        <p className={styles.description}>
                            <strong>Join our Talent Pool in one simple step.</strong> Just sign up and update your candidate profile and you're in! Our recruitment team will keep your profile on hand and reach out to you directly as soon as a suitable opportunity matches your skills and career aspirations.
                        </p>

                        <p className={styles.description}>
                            It's a simple way to stay on our radar while we connect you with 400+ star hotel properties nationwide.
                        </p>

                        <Link href="/auth/signup?type=candidate" className={styles.btn}>
                            Explore Talent Pool &rarr;
                        </Link>
                    </div>

                    {/* Right Column: 4-Step Flowchart Card */}
                    <div className={styles.flowchartCard}>
                        <h3 className={styles.flowchartTitle}>Join Our Talent Pool</h3>

                        <div className={styles.stepGrid}>
                            <div className={styles.stepBox}>
                                <div className={styles.stepNumber}>1</div>
                                <div>
                                    <div className={styles.stepText}>Click Talent Pool</div>
                                    <div className={styles.stepSub}>Get started by registering</div>
                                </div>
                            </div>

                            <div className={styles.stepBox}>
                                <div className={styles.stepNumber}>2</div>
                                <div>
                                    <div className={styles.stepText}>Fill Your Details</div>
                                    <div className={styles.stepSub}>Enter basic profile info</div>
                                </div>
                            </div>

                            <div className={styles.stepBox}>
                                <div className={styles.stepNumber}>3</div>
                                <div>
                                    <div className={styles.stepText}>Submit Profile</div>
                                    <div className={styles.stepSub}>Upload resume & skills</div>
                                </div>
                            </div>

                            <div className={styles.stepBox}>
                                <div className={styles.stepNumber}>4</div>
                                <div>
                                    <div className={styles.stepText}>Get Connected</div>
                                    <div className={styles.stepSub}>Direct 5-star callbacks</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
