import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    ClipboardCheck,
    Users,
    GraduationCap,
    BookOpen,
} from "lucide-react";

import { getHomeData } from "../../../services/publicService";

import {
    fadeLeft,
    fadeRight,
} from "../../../utils/animationVariants";

import styles from "./DashboardPreview.module.css";

const DashboardPreview = () => {

    const [dashboardData, setDashboardData] = useState(null);

    useEffect(() => {

        const loadDashboardData = async () => {
            try {
                const data = await getHomeData();

                setDashboardData({
                    stats: [
                        {
                            title: "Published Exams",
                            value: data.statistics.publishedExams,
                            icon: ClipboardCheck,
                            color: "#2563eb",
                        },
                        {
                            title: "Students",
                            value: data.statistics.students,
                            icon: GraduationCap,
                            color: "#4f46e5",
                        },
                        {
                            title: "Teachers",
                            value: data.statistics.teachers,
                            icon: Users,
                            color: "#06b6d4",
                        },
                        {
                            title: "Questions",
                            value: data.statistics.questions,
                            icon: BookOpen,
                            color: "#22c55e",
                        },
                    ],
                    recentExams: data.recentExams,
                });

            } catch (error) {
                console.error(error);
            }
        };

        loadDashboardData();

    }, []);

    if (!dashboardData) {
        return null;
    }

    return (
        <section
            id="preview"
            className={styles.section}
        >
            <div className={`container ${styles.container}`}>

                {/* Left Content */}
                <motion.div
                    className={styles.content}
                    variants={fadeLeft}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    <span className={styles.badge}>
                        Dashboard Overview
                    </span>

                    <h2>
                        Manage Exams
                        <span className="gradient-text">
                            {" "}From One Dashboard
                        </span>
                    </h2>

                    <p>
                        Monitor exams, generate AI questions,
                        track student performance, and analyze
                        results from a modern centralized dashboard.
                    </p>

                    <ul className={styles.list}>
                        <li>✓ AI Question Generation</li>
                        <li>✓ Live Student Analytics</li>
                        <li>✓ Automatic Evaluation</li>
                        <li>✓ Secure Exam Monitoring</li>
                    </ul>
                </motion.div>

                {/* Right Dashboard */}
                <motion.div
                    className={styles.dashboard}
                    variants={fadeRight}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >

                    <div className={styles.statsGrid}>
                        {dashboardData.stats.map((item) => {

                            const Icon = item.icon;

                            return (
                                <div
                                    key={item.title}
                                    className={styles.card}
                                >
                                    <Icon
                                        size={24}
                                        color={item.color}
                                    />

                                    <h3>{item.value}</h3>

                                    <p>{item.title}</p>
                                </div>
                            );

                        })}
                    </div>

                    <div className={styles.table}>
                        <h3>Recent Published Exams</h3>

                        {dashboardData.recentExams.map((exam) => (
                            <div
                                key={exam.id}
                                className={styles.row}
                            >
                                <span>{exam.title}</span>

                                <span>{exam.totalMarks} Marks</span>

                                <span>{exam.duration} Min</span>
                            </div>
                        ))}
                    </div>

                </motion.div>

            </div>
        </section>
    );
};

export default DashboardPreview;