import {
    BrainCircuit,
    ShieldCheck,
    BarChart3,
    GraduationCap,
    Users,
    ClipboardCheck,
    Sparkles,
    Clock3,
    Lock,
    Cpu,
    TrendingUp,
    Bot,
} from "lucide-react";

/* ==========================================================
   HERO
========================================================== */

export const heroData = {
    badge: "AI-Powered Examination Platform",

    title: [
        "AI-Powered",
        "Smart Online",
        "Examination Platform",
    ],

    description:
        "Create, manage, and conduct secure online examinations with AI-powered question generation, real-time analytics, automated evaluation, and enterprise-grade security.",

    primaryButton: "Get Started",

    secondaryButton: "Explore Platform",

    trustBadges: [
        "AI Question Generation",
        "Enterprise Security",
        "Real-Time Analytics",
    ],
};

/* ==========================================================
   TRUSTED
========================================================== */

export const trustedBy = [
    "Teachers",
    "Students",
    "Institutions",
    "Training Centers",
    "Organizations",
];

/* ==========================================================
   STATS
========================================================== */

export const statsData = [

    {
        number: 500,
        suffix: "+",
        label: "Exams Created",
    },
    {
        number: 10,
        suffix: "K+",
        label: "Questions Generated",
    },
    {
        number: 98,
        suffix: "%",
        label: "Evaluation Accuracy",
    },
    {
        number: 24,
        suffix: "/7",
        label: "Platform Availability",
    },

];

/* ==========================================================
   FEATURES
========================================================== */

export const featuresData = [
    {
        icon: BrainCircuit,
        title: "AI Question Generator",
        description:
            "Generate intelligent MCQs instantly using Google Gemini AI.",
    },
    {
        icon: ShieldCheck,
        title: "Secure Examination",
        description:
            "JWT authentication, protected routes, and role-based access.",
    },
    {
        icon: GraduationCap,
        title: "Teacher Dashboard",
        description:
            "Create exams, manage questions, publish results effortlessly.",
    },
    {
        icon: Users,
        title: "Student Portal",
        description:
            "Attempt exams, track progress, and view detailed results.",
    },
    {
        icon: ClipboardCheck,
        title: "Automatic Evaluation",
        description:
            "Instant scoring and automatic result generation after submission.",
    },
    {
        icon: BarChart3,
        title: "Performance Analytics",
        description:
            "Visualize student performance with detailed statistics.",
    },
];

/* ==========================================================
   AI FEATURES
========================================================== */

export const aiFeatures = [
    {
        icon: Bot,
        title: "Topic Based Questions",
    },
    {
        icon: Sparkles,
        title: "Multiple Difficulty Levels",
    },
    {
        icon: Cpu,
        title: "Powered by Gemini AI",
    },
    {
        icon: TrendingUp,
        title: "Higher Productivity",
    },
];

/* ==========================================================
   SECURITY
========================================================== */

export const securityFeatures = [
    {
        icon: Lock,
        title: "JWT Authentication",
        description: "Secure token-based authentication for all users.",
    },
    {
        icon: ShieldCheck,
        title: "Role-Based Access",
        description: "Separate permissions for Admins, Teachers, and Students.",
    },
    {
        icon: Clock3,
        title: "Automatic Exam Timer",
        description: "Built-in countdown with automatic exam submission.",
    },
    {
        icon: ClipboardCheck,
        title: "Secure Submission",
        description: "Protected APIs ensure safe and reliable exam submission.",
    },
];

/* ==========================================================
   FAQ
========================================================== */

export const faqData = [
    {
        question: "Who can create examinations on the platform?",
        answer:
            "Only teachers can create and manage examinations. Students can attempt published exams, while administrators manage users, roles, and the overall platform.",
    },
    {
        question: "How are exam questions generated?",
        answer:
            "Teachers can generate intelligent multiple-choice questions using the integrated Google Gemini AI or create questions manually.",
    },
    {
        question: "How is the examination process secured?",
        answer:
            "The platform uses JWT authentication, role-based access control (RBAC), protected REST APIs, password hashing, automatic exam timers, and secure submission workflows.",
    },
    {
        question: "How are results evaluated?",
        answer:
            "Objective questions are evaluated automatically after submission, and students can immediately view their results and performance statistics.",
    },
];

/* ==========================================================
   TESTIMONIALS
========================================================== */

export const testimonialsData = [
    {
        icon: GraduationCap,
        name: "Teacher Experience",
        role: "AI-Assisted Exam Creation",
        message:
            "Generate question papers quickly using AI, manage exams efficiently, and publish results with minimal manual effort.",
    },
    {
        icon: Users,
        name: "Student Experience",
        role: "Secure Online Assessment",
        message:
            "Attempt timed exams, receive instant evaluation, and track performance through a simple and intuitive dashboard.",
    },
    {
        icon: ShieldCheck,
        name: "Administrator Experience",
        role: "Centralized System Management",
        message:
            "Manage users, monitor platform activity, and maintain a secure examination environment with role-based controls.",
    },
];

/* ==========================================================
   CTA
========================================================== */

export const ctaData = {
    title: "Ready to Transform Online Examinations?",

    description:
        "Experience AI-powered assessments with secure exam management and real-time analytics.",

    button: "Get Started",
};