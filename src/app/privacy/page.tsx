import { Metadata } from 'next';
import { Footer } from '@/components/layout/Footer';
import styles from '../policies.module.css';

export const metadata: Metadata = {
    title: 'Privacy Policy | Sharkedutech',
    description: 'Privacy policy and data protection practices at Sharkedutech.',
};

export default function PrivacyPolicy() {
    return (
        <main>
            <div className={styles.policyContainer}>
                <header className={styles.header}>
                    <h1 className={styles.title}>Privacy Policy</h1>
                    <p className={styles.lastUpdated}>Last Updated: May 2026</p>
                </header>

                <div className={styles.content}>
                    <p>Your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our admission services.</p>

                    <h2>1. Information We Collect</h2>
                    <p>We collect personal information that you voluntarily provide to us when registering, applying for admissions, or contacting us. This includes:</p>
                    <ul>
                        <li>Personal identification information (Name, email address, phone number, etc.)</li>
                        <li>Educational records and documents (Mark sheets, certificates, ID proofs)</li>
                        <li>Professional details for job applications</li>
                        <li>Payment information (processed through secure third-party gateways)</li>
                    </ul>

                    <h2>2. How We Use Your Information</h2>
                    <p>We use the information we collect to:</p>
                    <ul>
                        <li>Process and submit your college applications</li>
                        <li>Communicate with you regarding your application status</li>
                        <li>Provide personalized counseling and support</li>
                        <li>Improve our platform's functionality and user experience</li>
                        <li>Comply with legal and regulatory requirements</li>
                    </ul>

                    <h2>3. Sharing Your Information</h2>
                    <p>We share your data with:</p>
                    <ul>
                        <li><strong>Colleges & Institutions:</strong> Only the specific institutions you apply to will receive your application details and documents.</li>
                        <li><strong>Employers:</strong> 
                            <ul>
                                <li>Employers <strong>cannot</strong> access your personal data or documents without your explicit permission.</li>
                                <li><strong>CV Sharing:</strong> Your CV will only be shared with multiple employer houses after obtaining your specific concern/agreement. You have the right to opt-in or opt-out of this sharing feature through your dashboard.</li>
                            </ul>
                        </li>
                        <li><strong>Service Providers:</strong> We may share information with third-party vendors who perform services for us, such as payment processing or data analysis.</li>
                    </ul>

                    <h2>4. Data Security</h2>
                    <p>We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that no security measures are perfect or impenetrable.</p>

                    <h2>5. Your Rights</h2>
                    <p>You have the right to access, correct, or delete your personal information stored on our platform. You can manage most of this through your account dashboard or by contacting our support team.</p>

                    <h2>6. Cookies</h2>
                    <p>We use cookies and similar tracking technologies to track the activity on our Service and hold certain information to improve and analyze our Service.</p>
                </div>
            </div>
            <Footer />
        </main>
    );
}
