import styles from './HowItWorks.module.css';

const steps = [
    {
        icon: "🎓",
        title: "Apply for Admission",
        description: "Create your profile, explore top hospitality colleges, and submit a single application to multiple institutes."
    },
    {
        icon: "📚",
        title: "Master Your Craft",
        description: "Get admitted, attend world-class courses, and build the practical skills needed for a premium career."
    },
    {
        icon: "💼",
        title: "Launch Your Career",
        description: "Access our exclusive job portal to connect with luxury hotels, resorts, and premium employers globally."
    }
];

export function HowItWorks() {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Your Pathway to Success</h2>
                    <p className={styles.subtitle}>
                        Sharkedutech streamlines your journey from a student to a hospitality professional in three simple connected steps.
                    </p>
                </div>

                <div className={styles.steps}>
                    {steps.map((step, index) => (
                        <div key={index} className={styles.step}>
                            <div className={styles.iconWrapper}>{step.icon}</div>
                            <h3 className={styles.stepTitle}>{step.title}</h3>
                            <p className={styles.stepDesc}>{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
