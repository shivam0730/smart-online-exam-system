import { motion } from "framer-motion";
import { featuresData } from "../../../utils/landingData";
import {
    fadeUp,
    staggerContainer,
} from "../../../utils/animationVariants";
import styles from "./Features.module.css";

const Features = () => {
    return (
        <section
            id="features"
            className={styles.features}
        >
            <div className="container">

                <motion.div
                    className={styles.header}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    <span className={styles.badge}>
                        Platform Features
                    </span>

                    <h2>
                        Everything You Need to Conduct
                        <span className="gradient-text">
                            {" "}Smart Examinations
                        </span>
                    </h2>

                    <p>
                        From AI-powered question generation to automated evaluation
                        and detailed analytics, SOES provides everything required for
                        modern online assessments.
                    </p>
                </motion.div>

                <motion.div
                    className={styles.grid}
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                >
                    {featuresData.map((feature) => {
                        const Icon = feature.icon;

                        return (
                            <motion.div
                                key={feature.title}
                                className={styles.card}
                                variants={fadeUp}
                                whileHover={{
                                    y: -8,
                                }}
                            >
                                <div className={styles.icon}>
                                    <Icon size={28} />
                                </div>

                                <h3>{feature.title}</h3>

                                <p>{feature.description}</p>
                            </motion.div>
                        );
                    })}
                </motion.div>

            </div>
        </section>
    );
};

export default Features;