import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  GraduationCap,
} from "lucide-react";

import api from "../../services/api";
import styles from "./AuthPage.module.css";

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
      <section className={styles.brandPanel}>
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
      </section>

      <section className={styles.formPanel}>
        <div className={styles.formContainer}>
          <Link
            className={styles.homeLink}
            to="/"
          >
            ← Back to home
          </Link>

          <div className={styles.formHeading}>
            <span>CREATE ACCOUNT</span>

            <h2>Join SmartExam</h2>

            <p>
              Enter your details to create your
              student account.
            </p>
          </div>

          <form
            className={styles.form}
            onSubmit={handleSubmit}
          >
            <div className={styles.formGroup}>
              <label htmlFor="firstName">
                First name
              </label>

              <input
                id="firstName"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Exam"
                autoComplete="given-name"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="lastName">
                Last name
              </label>

              <input
                id="lastName"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Student"
                autoComplete="family-name"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email">
                Email address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="examstudent@test.com"
                autoComplete="email"
              />
            </div>

            <div className={styles.formGroup}>
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
            </div>

            {error && (
              <p className={styles.errorMessage}>
                {error}
              </p>
            )}

            <button
              className={styles.submitButton}
              type="submit"
              disabled={isLoading}
            >
              {isLoading
                ? "Creating account..."
                : "Create account"}
            </button>
          </form>

          <p className={styles.switchText}>
            Already have an account?{" "}
            <Link to="/login">
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}

export default RegisterPage;