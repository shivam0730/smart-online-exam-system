import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
    heroData,
} from "../../../utils/landingData";



import {
    fadeUp,
    fadeRight,
    staggerContainer,
} from "../../../utils/animationVariants";

import GradientBackground from "../../ui/GradientBackground/GradientBackground";
import BrowserWindow from "../../ui/BrowserWindow/BrowserWindow";

import styles from "./Hero.module.css";

const Hero = () => {
    return (
        <section className={styles.hero}>
            <GradientBackground />

            <div className={`container ${styles.container}`}>

                <motion.div
                    className={styles.left}
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >

                    <motion.div
                        className={styles.badge}
                        variants={fadeUp}
                    >
                        🚀 {heroData.badge}
                    </motion.div>

                    <motion.h1
                        variants={fadeUp}
                    >
                        <span className="gradient-text">
                            {heroData.title[0]}
                        </span>

                        <br />

                        {heroData.title[1]}

                        <br />

                        {heroData.title[2]}
                    </motion.h1>

                    <motion.p
                        variants={fadeUp}
                    >
                        {heroData.description}
                    </motion.p>

                    <motion.div
                        className={styles.buttons}
                        variants={fadeUp}
                    >

                        <Link
                            to="/register"
                            className={styles.primary}
                        >
                            {heroData.primaryButton}
                        </Link>

                        <Link
                            to="/login"
                            className={styles.secondary}
                        >
                            {heroData.secondaryButton}
                        </Link>

                    </motion.div>

                    <motion.div
                        className={styles.trust}
                        variants={fadeUp}
                    >
                        {heroData.trustBadges.map((item) => (
                            <span key={item}>
                                ✓ {item}
                            </span>
                        ))}
                    </motion.div>

                </motion.div>

                <motion.div
                    className={styles.right}
                    variants={fadeRight}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    <BrowserWindow />
                </motion.div>

            </div>
        </section>
    );
};

export default Hero;