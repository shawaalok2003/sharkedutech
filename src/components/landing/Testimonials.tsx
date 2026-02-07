import styles from './Testimonials.module.css';

const testimonials = [
    {
        quote: "Sharkedutech helped me find the perfect college that aligned with my career goals. The admission process was incredibly smooth.",
        name: "Sarah Jenkins",
        role: "Culinary Student, Swiss Hotel School",
        initials: "SJ"
    },
    {
        quote: "As an employer, the quality of candidates we get from this platform is unmatched. It's our go-to for hiring fresh talent.",
        name: "David Chen",
        role: "HR Director, Grand Hyatt",
        initials: "DC"
    },
    {
        quote: "The interface is so professional and easy to use. I applied to 5 colleges in one go and got into my dream institute!",
        name: "Rahul Sharma",
        role: "Hospitality Management Student",
        initials: "RS"
    }
];

export function Testimonials() {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 className={styles.title}>What People Say</h2>
                </div>

                <div className={styles.grid}>
                    {testimonials.map((item, idx) => (
                        <div key={idx} className={styles.card}>
                            <p className={styles.quote}>"{item.quote}"</p>
                            <div className={styles.author}>
                                <div className={styles.avatar}>{item.initials}</div>
                                <div className={styles.info}>
                                    <div className={styles.name}>{item.name}</div>
                                    <div className={styles.role}>{item.role}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
