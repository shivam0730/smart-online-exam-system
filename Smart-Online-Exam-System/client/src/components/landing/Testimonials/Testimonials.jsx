import { motion } from "framer-motion";
import { testimonialsData } from "../../../utils/landingData";
import {
  fadeUp,
  staggerContainer,
} from "../../../utils/animationVariants";
import styles from "./Testimonials.module.css";

const Testimonials = () => {
  return (
    <section
      id="testimonials"
      className={styles.section}
    >
      <div className="container">

        {/* Header */}
        <motion.div
          className={styles.header}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <span className={styles.badge}>
            Platform Experience
          </span>

          <h2>
            Designed for
            <span className="gradient-text">
              {" "}Every User Role
            </span>
          </h2>

          <p>
            Explore how Teachers, Students, and Administrators benefit from
            the Smart Online Examination System through features designed
            specifically for their responsibilities.
          </p>
        </motion.div>

        {/* Cards */}
        <motion.div
          className={styles.grid}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {testimonialsData.map((item) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.name}
                className={styles.card}
                variants={fadeUp}
              >
                <div className={styles.icon}>
                  <Icon size={22} />
                </div>

                <div className={styles.user}>
                  <h4>{item.name}</h4>
                  <span>{item.role}</span>
                </div>

                <p className={styles.message}>
                  {item.message}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
};

export default Testimonials;