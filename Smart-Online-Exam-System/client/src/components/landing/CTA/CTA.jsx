import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { ctaData } from "../../../utils/landingData";
import { fadeUp } from "../../../utils/animationVariants";
import styles from "./CTA.module.css";

const CTA = () => {
    const navigate = useNavigate();

    const handleCTA = () => {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));

        if (!token || !user) {
            navigate("/register");
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
                navigate("/register");
        }
    };
    return (
        <section className={styles.section}>
            <div className="container">
                <motion.div
                    className={styles.card}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    <span className={styles.badge}>
                        Ready to Get Started?
                    </span>

                    <h2>{ctaData.title}</h2>

                    <p>{ctaData.description}</p>

                    <button
                        className={styles.button}
                        onClick={handleCTA}
                    >
                        {ctaData.button}
                        <ArrowRight size={18} />
                    </button>

                </motion.div>
            </div>
        </section>
    );
};

export default CTA;