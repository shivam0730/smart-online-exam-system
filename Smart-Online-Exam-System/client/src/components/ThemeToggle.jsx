import { Moon, Sun } from "lucide-react";

import { useTheme } from "../context/ThemeContext";
import styles from "./ThemeToggle.module.css";

function ThemeToggle({ className = "" }) {
  const {
    isDark,
    toggleTheme,
  } = useTheme();

  return (
    <button
      className={`${styles.toggle} ${className}`}
      type="button"
      aria-label={
        isDark
          ? "Switch to light mode"
          : "Switch to dark mode"
      }
      title={
        isDark
          ? "Switch to light mode"
          : "Switch to dark mode"
      }
      onClick={toggleTheme}
    >
      <span className={styles.icon}>
        {isDark ? (
          <Sun size={19} />
        ) : (
          <Moon size={19} />
        )}
      </span>

      <span className={styles.label}>
        {isDark ? "Light" : "Dark"}
      </span>
    </button>
  );
}

export default ThemeToggle;
