import { Metadata } from 'next';
import { Footer } from '@/components/layout/Footer';
import styles from '../policies.module.css';

export const metadata: Metadata = {
    title: 'Terms and Conditions | Sharkedutech',
    description: 'Terms and conditions for using the Sharkedutech platform.',
};

export default function TermsAndConditions() {
    return (
        <main>
            <div className={styles.policyContainer}>
                <header className={styles.header}>
                    <h1 className={styles.title}>Terms & Conditions</h1>
                    <p className={styles.lastUpdated}>Last Updated: May 2026</p>
                </header>

                <div className={styles.content}>
                    <p>Welcome to Sharkedutech. By accessing or using our platform, you agree to comply with and be bound by the following terms and conditions of use.</p>

                    <h2>1. Use of the Platform</h2>
                    <p>This platform is designed to connect students with educational institutions and employers in the hospitality sector. You agree to use the platform only for lawful purposes and in a way that does not infringe the rights of others.</p>

                    <h2>2. User Accounts</h2>
                    <p>When you create an account, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.</p>

                    <h2>3. Admission Process</h2>
                    <p>Sharkedutech facilitates the admission process between students and colleges. However:</p>
                    <ul>
                        <li>Final admission decisions are at the sole discretion of the respective colleges.</li>
                        <li>Sharkedutech does not guarantee admission to any institution.</li>
                        <li>All documents submitted must be genuine. Submission of forged documents will lead to immediate cancellation of application and potential legal action.</li>
                    </ul>

                    <h2>4. Intellectual Property</h2>
                    <p>The Service and its original content, features, and functionality are and will remain the exclusive property of Sharkedutech and its licensors.</p>

                    <h2>5. Limitation of Liability</h2>
                    <p>In no event shall Sharkedutech, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.</p>

                    <h2>6. Governing Law</h2>
                    <p>These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions.</p>
                </div>
            </div>
            <Footer />
        </main>
    );
}
