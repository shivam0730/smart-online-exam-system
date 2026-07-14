import {
  ArrowRight,
  BarChart3,
  BookOpenCheck,
  CheckCircle2,
  Clock3,
  GraduationCap,
  Menu,
  ShieldCheck,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

import ThemeToggle from "../../components/ThemeToggle";
import styles from "./HomePage.module.css";

const features = [
  {
    icon: ShieldCheck,
    title: "Secure Examinations",
    description:
      "Role-based access and reliable exam controls help keep every assessment protected.",
  },
  {
    icon: Clock3,
    title: "Smart Exam Experience",
    description:
      "Timed attempts, answer saving, and automatic submission create a smooth exam journey.",
  },
  {
    icon: BarChart3,
    title: "Instant Analytics",
    description:
      "Students and teachers can review results, performance statistics, and exam insights.",
  },
];

const roles = [
  {
    icon: GraduationCap,
    title: "For Students",
    description:
      "Discover available exams, attempt assessments, and track your performance.",
  },
  {
    icon: BookOpenCheck,
    title: "For Teachers",
    description:
      "Create exams, manage questions, publish assessments, and review results.",
  },
  {
    icon: Users,
    title: "For Administrators",
    description:
      "Manage users, monitor platform activity, and view system-wide analytics.",
  },
];

function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <main className={styles.page}>
      <header className={styles.navbar}>
        <div className={styles.navContainer}>
          <Link
            className={styles.logo}
            to="/"
            onClick={closeMenu}
          >
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
            onClick={() => setIsMenuOpen((current) => !current)}
          >
            {isMenuOpen ? <X size={23} /> : <Menu size={23} />}
          </button>

          <nav
            className={`${styles.navigation} ${
              isMenuOpen ? styles.navigationOpen : ""
            }`}
            aria-label="Main navigation"
          >
            <a href="#features" onClick={closeMenu}>
              Features
            </a>

            <a href="#roles" onClick={closeMenu}>
              Solutions
            </a>

            <ThemeToggle />

            <Link
              className={styles.signInLink}
              to="/login"
              onClick={closeMenu}
            >
              Sign in
            </Link>

            <Link
              className={styles.navCta}
              to="/register"
              onClick={closeMenu}
            >
              Get started
            </Link>
          </nav>
        </div>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroCopy}>
            <div className={styles.eyebrow}>
              <Sparkles size={16} />
              Secure. Smart. Simple.
            </div>

            <h1>
              A smarter way to
              <span> conduct online examinations</span>
            </h1>

            <p>
              Create, manage, and attempt online exams through
              one secure platform built for students, teachers,
              and administrators.
            </p>

            <div className={styles.heroActions}>
              <Link
                className={styles.primaryButton}
                to="/register"
              >
                Create your account
                <ArrowRight size={19} />
              </Link>

              <Link
                className={styles.secondaryButton}
                to="/login"
              >
                Sign in to dashboard
              </Link>
            </div>

            <div className={styles.trustPoints}>
              <span>
                <CheckCircle2 size={17} />
                Role-based access
              </span>

              <span>
                <CheckCircle2 size={17} />
                Automatic evaluation
              </span>

              <span>
                <CheckCircle2 size={17} />
                Performance insights
              </span>
            </div>
          </div>

          <div className={styles.heroVisual}>
            <div className={styles.dashboardCard}>
              <div className={styles.cardHeader}>
                <div>
                  <span>Student dashboard</span>
                  <strong>Welcome back!</strong>
                </div>

                <span className={styles.liveBadge}>
                  <span />
                  Live
                </span>
              </div>

              <div className={styles.progressCard}>
                <div className={styles.progressTop}>
                  <span>Overall performance</span>
                  <strong>84%</strong>
                </div>

                <div className={styles.progressTrack}>
                  <span />
                </div>
              </div>

              <div className={styles.statGrid}>
                <div>
                  <BookOpenCheck size={21} />
                  <strong>12</strong>
                  <span>Exams</span>
                </div>

                <div>
                  <CheckCircle2 size={21} />
                  <strong>10</strong>
                  <span>Passed</span>
                </div>

                <div>
                  <BarChart3 size={21} />
                  <strong>84%</strong>
                  <span>Average</span>
                </div>
              </div>

              <div className={styles.upcomingExam}>
                <div className={styles.examIcon}>
                  <Clock3 size={22} />
                </div>

                <div>
                  <span>Upcoming examination</span>
                  <strong>Web Development Assessment</strong>
                  <small>60 minutes · 40 questions</small>
                </div>

                <span className={styles.readyBadge}>Ready</span>
              </div>
            </div>

            <div className={styles.floatingSecurity}>
              <ShieldCheck size={21} />
              <div>
                <strong>Secure platform</strong>
                <span>Protected exam experience</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className={styles.featuresSection}
        id="features"
      >
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeading}>
            <span>Platform features</span>

            <h2>Everything needed for better assessments</h2>

            <p>
              Powerful tools that simplify the complete
              examination workflow without compromising the
              user experience.
            </p>
          </div>

          <div className={styles.featureGrid}>
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <article
                  className={styles.featureCard}
                  key={feature.title}
                >
                  <div className={styles.featureIcon}>
                    <Icon size={25} />
                  </div>

                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className={styles.rolesSection} id="roles">
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeading}>
            <span>Built for everyone</span>

            <h2>One platform, every role</h2>

            <p>
              Purpose-built dashboards give every user the
              tools and information they need.
            </p>
          </div>

          <div className={styles.roleGrid}>
            {roles.map((role) => {
              const Icon = role.icon;

              return (
                <article
                  className={styles.roleCard}
                  key={role.title}
                >
                  <div className={styles.roleIcon}>
                    <Icon size={25} />
                  </div>

                  <div>
                    <h3>{role.title}</h3>
                    <p>{role.description}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className={styles.ctaCard}>
          <div>
            <span>Start your journey</span>
            <h2>Ready for a smarter exam experience?</h2>
            <p>
              Create your student account and access a secure,
              simple, and intelligent examination platform.
            </p>
          </div>

          <div className={styles.ctaActions}>
            <Link
              className={styles.ctaPrimary}
              to="/register"
            >
              Get started
              <ArrowRight size={19} />
            </Link>

            <Link
              className={styles.ctaSecondary}
              to="/login"
            >
              Sign in
            </Link>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <Link className={styles.logo} to="/">
            <span className={styles.logoIcon}>
              <GraduationCap size={22} />
            </span>

            <span>SmartExam</span>
          </Link>

          <p>
            Smart Online Examination System — secure
            assessments and meaningful insights.
          </p>

          <span>© 2026 SmartExam</span>
        </div>
      </footer>
    </main>
  );
}

export default HomePage;


