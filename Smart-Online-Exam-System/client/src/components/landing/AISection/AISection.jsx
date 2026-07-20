import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { aiFeatures } from "../../../utils/landingData";
import {
    fadeLeft,
    fadeRight,
    staggerContainer,
    fadeUp,
} from "../../../utils/animationVariants";
import styles from "./AISection.module.css";

const AISection = () => {

    const navigate = useNavigate();

    return (
        <section
            id="ai"
            className={styles.section}
        >
            <div className={`container ${styles.container}`}>

                {/* Left */}
                <motion.div
                    className={styles.left}
                    variants={fadeLeft}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    <span className={styles.badge}>
                        AI Powered
                    </span>

                    <h2>
                        Generate Questions
                        <span className="gradient-text">
                            {" "}Using Gemini AI
                        </span>
                    </h2>

                    <p>
                        Create high-quality multiple-choice questions
                        in seconds by simply entering a topic,
                        selecting difficulty, and choosing the
                        number of questions.
                    </p>

                    <button
                        className={styles.button}
                        onClick={() => {

                            const token = localStorage.getItem("token");
                            const user = JSON.parse(localStorage.getItem("user"));

                            if (!token || !user) {
                                navigate("/login");
                                return;
                            }

                            switch (user.role) {

                                case "TEACHER":
                                    navigate("/teacher/dashboard");
                                    break;

                                case "STUDENT":
                                    navigate("/student/dashboard");
                                    break;

                                case "ADMIN":
                                case "SUPER_ADMIN":
                                    navigate("/admin/dashboard");
                                    break;

                                default:
                                    navigate("/login");
                            }

                        }}
                    >
                        Try AI Generator
                    </button>

                </motion.div>

                {/* Right */}
                <motion.div
                    className={styles.right}
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    {aiFeatures.map((item) => {
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

                                <span>{item.title}</span>
                            </motion.div>
                        );
                    })}
                </motion.div>

            </div>
        </section>
    );
};

export default AISection;