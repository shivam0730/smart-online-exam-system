import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { faqData } from "../../../utils/landingData";
import {
  fadeUp,
  staggerContainer,
} from "../../../utils/animationVariants";
import styles from "./FAQ.module.css";

const FAQ = () => {
  const [active, setActive] = useState(0);

  return (
    <section
      id="faq"
      className={styles.section}
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
            FAQ
          </span>

          <h2>
            Frequently Asked
            <span className="gradient-text">
              {" "}Questions
            </span>
          </h2>

          <p>
            Find answers to the most common questions about the Smart Online Examination System.
          </p>
        </motion.div>

        <motion.div
          className={styles.list}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {faqData.map((item, index) => (
            <motion.div
              key={item.question}
              className={styles.item}
              variants={fadeUp}
            >
              <button
                className={styles.question}
                onClick={() =>
                  setActive(active === index ? -1 : index)
                }
              >
                <span>{item.question}</span>

                <ChevronDown
                  size={20}
                  className={
                    active === index ? styles.rotate : ""
                  }
                />
              </button>

              <motion.div
                initial={false}
                animate={{
                  height: active === index ? "auto" : 0,
                  opacity: active === index ? 1 : 0,
                }}
                transition={{ duration: 0.3 }}
                style={{ overflow: "hidden" }}
              >
                <div className={styles.answer}>
                  {item.answer}
                </div>
              </motion.div>

            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default FAQ;