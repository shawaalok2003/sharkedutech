import { Metadata } from 'next';
import { Footer } from '@/components/layout/Footer';
import styles from '../policies.module.css';

export const metadata: Metadata = {
    title: 'Refund Policy | Sharkedutech',
    description: 'Refund policy for admissions and services provided by Sharkedutech.',
};

export default function RefundPolicy() {
    return (
        <main>
            <div className={styles.policyContainer}>
                <header className={styles.header}>
                    <h1 className={styles.title}>Refund Policy</h1>
                    <p className={styles.lastUpdated}>Last Updated: May 2026</p>
                </header>

                <div className={styles.content}>
                    <p>At Sharkedutech, we strive to ensure a transparent and fair process for all students applying through our platform. This Refund Policy outlines the terms regarding payments made for admission services.</p>

                    <h2>1. Application Fees</h2>
                    <p>Unless otherwise stated, all application fees paid through the Sharkedutech platform are <strong>non-refundable</strong>. These fees cover the administrative costs of processing your application and are not contingent on the final admission decision by the college.</p>

                    <h2>2. Admission Security Deposits</h2>
                    <p>Payments made as security deposits or seat booking fees to specific colleges are subject to the individual refund policies of those institutions. Sharkedutech acts as a facilitator for these payments, and the following general rules apply:</p>
                    <ul>
                        <li>If a student chooses to withdraw their admission before the official start of the academic session, they may be eligible for a partial refund as per the college's policy.</li>
                        <li>Sharkedutech will assist in the communication between the student and the college for refund requests, but the final decision rests with the institution.</li>
                    </ul>

                    <h2>3. Service Fees</h2>
                    <p>Fees paid for premium counseling or specialized admission support services provided directly by Sharkedutech are refundable under the following conditions:</p>
                    <ul>
                        <li>Full refund if the service is cancelled within 24 hours of payment.</li>
                        <li>50% refund if the service is cancelled before the first counseling session.</li>
                        <li>No refund will be issued after the service has commenced.</li>
                    </ul>

                    <h2>4. Processing Refunds</h2>
                    <p>Approved refunds will be processed back to the original payment method within 7-10 business days. Any transaction charges or banking fees incurred during the initial payment are non-refundable.</p>

                    <h2>5. Contact Us</h2>
                    <p>If you have any questions about our Refund Policy, please contact our support team at support@sharkedutech.com.</p>
                </div>
            </div>
            <Footer />
        </main>
    );
}
