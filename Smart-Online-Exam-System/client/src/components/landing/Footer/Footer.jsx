import {
    Globe,
    User,
    Mail,
} from "lucide-react";

import styles from "./Footer.module.css";

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={`container ${styles.container}`}>

                <div className={styles.brand}>
                    <h2>SmartExam</h2>

                    <p>
                        A secure AI-powered examination platform that enables
                        institutions, teachers, and students to conduct seamless
                        online assessments with automated evaluation,
                        real-time analytics, and intelligent exam management.
                    </p>

                    <p className={styles.tagline}>
                        Secure • Scalable • AI-Powered
                    </p>
                </div>

                <div>
                    <h4>Explore</h4>

                    <a href="#features">Features</a>

                    <a href="#ai">AI Generator</a>

                    <a href="#security">Security</a>

                    <a href="#testimonials">
                        Platform Experience
                    </a>
                </div>

                <div>
                    <h4>Quick Links</h4>

                    <a href="#faq">FAQ</a>

                    <a href="#stats">Live Statistics</a>

                    <a href="#preview">
                        Dashboard Preview
                    </a>
                </div>

                <div>
                    <h4>Follow</h4>

                    <div className={styles.social}>

                        <a
                            href="https://github.com/shivam0730"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="GitHub"
                        >
                            <Globe size={20} />
                        </a>

                        <a
                            href="https://www.linkedin.com/in/shivam-rajput-126945286/"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="LinkedIn"
                        >
                            <User size={20} />
                        </a>

                        <a
                            href="mailto:shivamrajput1351@gmail.com"
                            aria-label="Email"
                        >
                            <Mail size={20} />
                        </a>

                    </div>
                </div>

            </div>

            <div className={styles.bottom}>
                <p>
                    © {new Date().getFullYear()} Smart Online Examination System •
                    Designed & Developed by <strong>Shivam Rajput</strong>
                </p>
            </div>
        </footer>
    );
};

export default Footer;