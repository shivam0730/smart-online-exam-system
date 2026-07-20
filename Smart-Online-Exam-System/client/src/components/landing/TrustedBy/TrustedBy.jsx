import { motion } from "framer-motion";
import {
  GraduationCap,
  Users,
  School,
  BookOpen,
} from "lucide-react";
import { fadeUp, staggerContainer } from "../../../utils/animationVariants";
import styles from "./TrustedBy.module.css";

const audiences = [
  {
    icon: GraduationCap,
    title: "Students",
  },
  {
    icon: Users,
    title: "Teachers",
  },
  {
    icon: School,
    title: "Schools & Colleges",
  },
  {
    icon: BookOpen,
    title: "Coaching Institutes",
  },
];

const TrustedBy = () => {
  return (
    <section className={styles.section}>
      <div className="container">
        <motion.p
          className={styles.title}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          BUILT FOR MODERN EDUCATION
        </motion.p>

        <motion.div
          className={styles.grid}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >

          {audiences.map((item) => {

            const Icon = item.icon;

            return (
              <motion.div
                key={item.title}
                className={styles.card}
                variants={fadeUp}
              >
                <Icon size={30} />

                <p>{item.title}</p>
              </motion.div>
            );

          })}

        </motion.div>
      </div>
    </section>
  );
};

export default TrustedBy;