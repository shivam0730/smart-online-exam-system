import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import AnimatedCounter from "../../ui/AnimatedCounter/AnimatedCounter";
import { getHomeData } from "../../../services/publicService";

import {
    fadeUp,
    staggerContainer,
} from "../../../utils/animationVariants";

import styles from "./Stats.module.css";

const Stats = () => {

    const [stats, setStats] = useState(null);

    useEffect(() => {
        const loadStatistics = async () => {
            try {
                const data = await getHomeData();

                setStats([
                    {
                        number: data.statistics.students,
                        suffix: "+",
                        label: "Registered Students",
                    },
                    {
                        number: data.statistics.teachers,
                        suffix: "+",
                        label: "Teachers",
                    },
                    {
                        number: data.statistics.publishedExams,
                        suffix: "+",
                        label: "Published Exams",
                    },
                    {
                        number: data.statistics.questions,
                        suffix: "+",
                        label: "Questions",
                    },
                ]);
            } catch (error) {
                console.error(error);
            }
        };

        loadStatistics();
    }, []);

    if (!stats) {
        return (
            <section
                id="stats"
                className={styles.section}
            >
                <div className="container">
                    <h2>Loading Statistics...</h2>
                </div>
            </section>
        );
    }
    return (
        <section
            id="stats"
            className={styles.section}
        >
            <div className="container">

                <div className={styles.header}>

                    <span className={styles.badge}>
                        Platform Statistics
                    </span>

                    <h2>
                        Our Platform in Numbers
                    </h2>

                    <p>
                        Real-time metrics highlighting our growing community,
                        published examinations, and question repository.
                    </p>

                </div>

                <motion.div
                    className={styles.grid}
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    {stats.map((item) => (
                        <motion.div
                            key={item.label}
                            className={styles.card}
                            variants={fadeUp}
                        >
                            <AnimatedCounter
                                end={item.number}
                                suffix={item.suffix}
                            />

                            <p>{item.label}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );

};

export default Stats;