import { motion } from "framer-motion";
import { securityFeatures } from "../../../utils/landingData";
import {
    fadeLeft,
    fadeRight,
    staggerContainer,
    fadeUp,
} from "../../../utils/animationVariants";
import styles from "./Security.module.css";


const Security = () => {
    return (
        <section
            id="security"
            className={styles.section}
        >
            <div className={`container ${styles.container}`}>

                {/* Left */}
                <motion.div
                    className={styles.cards}
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    {securityFeatures.map((item) => {
                        const Icon = item.icon;

                        return (
                            <motion.div
                                key={item.title}
                                className={styles.card}
                                variants={fadeUp}
                            >
                                <div className={styles.icon}>
                                    <Icon size={26} />
                                </div>

                                <h3>{item.title}</h3>
                                <p>{item.description}</p>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Right */}
                <motion.div
                    className={styles.content}
                    variants={fadeRight}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    <span className={styles.badge}>
                        Enterprise Security
                    </span>

                    <h2>
                        Secure Exams with
                        <span className="gradient-text">
                            {" "}Advanced Protection
                        </span>
                    </h2>

                    <p>
                        Built with enterprise-grade security including JWT authentication,
                        role-based access control, encrypted passwords, protected REST APIs,
                        automatic exam timers, secure auto submission, and multiple backend
                        security layers to provide a reliable online examination experience.
                    </p>

                    <ul className={styles.list}>
                        <li>✓ JWT Authentication & Secure Login</li>
                        <li>✓ Role-Based Access Control (RBAC)</li>
                        <li>✓ Password Hashing with bcrypt</li>
                        <li>✓ Protected REST APIs & Secure Exam Submission</li>
                        <li>✓ Automatic Exam Timer & Auto Submission</li>
                        <li>✓ Rate Limiting & Security Headers</li>
                    </ul>
                </motion.div>

            </div>
        </section>
    );
};

export default Security;