import { motion } from "framer-motion";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  GraduationCap,
} from "lucide-react";

import api from "../../services/api";
import styles from "./AuthPage.module.css";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
    },
  },
};

function RegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] =
    useState(false);

  const [isLoading, setIsLoading] =
    useState(false);

  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !formData.email.trim() ||
      !formData.password
    ) {
      setError("All fields are required.");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      await api.post("/auth/register", {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: "STUDENT",
      });

      navigate("/login");
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
        "Unable to create account. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={styles.authPage}>
      <motion.section
        className={styles.brandPanel}
        initial={{ x: -80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{
          duration: 0.8,
          ease: "easeOut",
        }}
      >
        <div className={styles.brandContent}>
          <div className={styles.logo}>
            <GraduationCap size={34} />
            <span>SmartExam</span>
          </div>

          <h1>
            Start learning.
            <br />
            Keep growing.
          </h1>

          <p>
            Create your student account and begin
            your secure online examination journey.
          </p>
        </div>
      </motion.section>

      <motion.section
        className={styles.formPanel}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.5,
          delay: 0.3,
        }}
      >
        <div className={styles.formContainer}>
          <Link
            className={styles.homeLink}
            to="/"
          >
            ← Back to home
          </Link>

          <motion.div
            className={styles.formHeading}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
          >
            <span>CREATE ACCOUNT</span>

            <h2>Join SmartExam</h2>

            <p>
              Enter your details to create your
              student account.
            </p>
          </motion.div>

          <motion.form
            className={styles.form}
            onSubmit={handleSubmit}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              className={styles.formGroup}
              variants={itemVariants}
            >
              <label htmlFor="firstName">
                First name
              </label>

              <input
                id="firstName"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Enter your first name"
                autoComplete="given-name"
              />
            </motion.div>

            <motion.div
              className={styles.formGroup}
              variants={itemVariants}
            >
              <label htmlFor="lastName">
                Last name
              </label>

              <input
                id="lastName"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter your last name"
                autoComplete="family-name"
              />
            </motion.div>

            <motion.div
              className={styles.formGroup}
              variants={itemVariants}
            >
              <label htmlFor="email">
                Email address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                autoComplete="email"
              />
            </motion.div>

            <motion.div
              className={styles.formGroup}
              variants={itemVariants}
            >
              <label htmlFor="password">
                Password
              </label>

              <div className={styles.passwordField}>
                <input
                  id="password"
                  name="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  autoComplete="new-password"
                />

                <button
                  type="button"
                  className={styles.passwordButton}
                  onClick={() =>
                    setShowPassword(
                      (previousValue) =>
                        !previousValue
                    )
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </motion.div>

            {error && (
              <motion.p
                className={styles.errorMessage}
                variants={itemVariants}
              >
                {error}
              </motion.p>
            )}

            <motion.button
              className={styles.submitButton}
              type="submit"
              disabled={isLoading}
              variants={itemVariants}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {isLoading
                ? "Creating account..."
                : "Create account"}
            </motion.button>
          </motion.form>

          <motion.p
            className={styles.switchText}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            Already have an account?{" "}
            <Link to="/login">
              Sign in
            </Link>
          </motion.p>
        </div>
      </motion.section>
    </main>
  );

}

export default RegisterPage;