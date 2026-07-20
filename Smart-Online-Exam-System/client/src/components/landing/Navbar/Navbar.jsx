import { AnimatePresence, motion } from "framer-motion";
import { GraduationCap, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import ThemeToggle from "../../ThemeToggle";
import styles from "./Navbar.module.css";

const menuVariants = {
  hidden: {
    opacity: 0,
    y: -40,
    scale: 0.98,
  },

  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 220,
      damping: 22,
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },

  exit: {
    opacity: 0,
    y: -20,
    scale: 0.98,
    transition: {
      duration: 0.2,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 15,
  },

  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
    },
  },
};

function Navbar({ isMenuOpen, setIsMenuOpen }) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent page scrolling when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        duration: 0.6,
        ease: "easeOut",
      }}
      className={`${styles.navbar} ${isScrolled ? styles.scrolled : ""}`}
    >
      <div className={styles.navContainer}>
        <Link className={styles.logo} to="/" onClick={closeMenu}>
          <span className={styles.logoIcon}>
            <GraduationCap size={24} />
          </span>

          <span>SmartExam</span>
        </Link>

        <button
          className={styles.menuButton}
          type="button"
          aria-label={
            isMenuOpen
              ? "Close navigation menu"
              : "Open navigation menu"
          }
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <AnimatePresence>
          <motion.nav
            className={`${styles.navigation} ${isMenuOpen ? styles.navigationOpen : ""
              }`}
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.a
              href="#features"
              variants={itemVariants}
              onClick={closeMenu}
            >
              Features
            </motion.a>

            <motion.a
              href="#stats"
              variants={itemVariants}
              onClick={closeMenu}
            >
              Statistics
            </motion.a>

            <motion.a
              href="#ai"
              variants={itemVariants}
              onClick={closeMenu}
            >
              AI
            </motion.a>

            <motion.a
              href="#faq"
              variants={itemVariants}
              onClick={closeMenu}
            >
              FAQ
            </motion.a>

            <motion.div variants={itemVariants}>
              <Link
                to="/login"
                className={styles.signInLink}
                onClick={closeMenu}
              >
                Sign In
              </Link>
            </motion.div>

            <motion.div variants={itemVariants}>
              <ThemeToggle className={styles.themeToggle} />
            </motion.div>

            <motion.div variants={itemVariants}>
              <Link
                to="/register"
                className={styles.navCta}
                onClick={closeMenu}
              >
                Get Started →
              </Link>
            </motion.div>
          </motion.nav>
        </AnimatePresence>
      </div>
    </motion.header>
  );
}

export default Navbar;