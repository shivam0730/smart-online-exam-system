import { motion } from "framer-motion";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, GraduationCap } from "lucide-react";

import {
  clearAuthError,
  loginUser,
} from "../../context/authSlice";

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
    y: 25,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    isLoading,
    error,
  } = useSelector((state) => state.auth);

  const [showPassword, setShowPassword] =
    useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [validationError, setValidationError] =
    useState("");

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    setValidationError("");

    if (error) {
      dispatch(clearAuthError());
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !formData.email.trim() ||
      !formData.password.trim()
    ) {
      setValidationError(
        "Email and password are required."
      );

      return;
    }

    const result = await dispatch(
      loginUser({
        email: formData.email.trim(),
        password: formData.password,
      })
    );

    if (loginUser.fulfilled.match(result)) {
      const role = result.payload.user.role;

      if (role === "STUDENT") {
        navigate("/student/dashboard");
      } else if (role === "TEACHER") {
        navigate("/teacher/dashboard");
      } else if (
        role === "ADMIN" ||
        role === "SUPER_ADMIN"
      ) {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
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
            Learn. Assess.
            <br />
            Achieve.
          </h1>

          <p>
            A secure and intelligent examination
            platform designed for modern education.
          </p>
        </div>
      </motion.section>

      <motion.section
        className={styles.formPanel}
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{
          duration: 0.8,
          delay: 0.15,
          ease: "easeOut",
        }}
      >
        <div className={styles.formContainer}>
          <Link
            className={styles.homeLink}
            to="/"
          >
            ← Back to home
          </Link>

          <div className={styles.formHeading}>
            <span>WELCOME BACK</span>

            <h2>Sign in to your account</h2>

            <p>
              Enter your credentials to access your
              dashboard.
            </p>
          </div>

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

              <div className={styles.passwordLabel}>
                <label htmlFor="password">
                  Password
                </label>

                <Link
                  to="/forgot-password"
                  className={styles.forgotPassword}
                >
                  Forgot Password?
                </Link>
              </div>

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
                  placeholder="Enter your password"
                  autoComplete="current-password"
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

            {(validationError || error) && (
              <p className={styles.errorMessage}>
                {validationError || error}
              </p>
            )}

            <button
              className={styles.submitButton}
              type="submit"
              disabled={isLoading}
            >
              {isLoading
                ? "⏳ Signing in..."
                : "Sign in"}
            </button>
          </motion.form>

          <p className={styles.switchText}>
            Don&apos;t have an account?{" "}
            <Link to="/register">
              Create an account
            </Link>
          </p>
        </div>
      </motion.section>
    </main>
  );
}

export default LoginPage;