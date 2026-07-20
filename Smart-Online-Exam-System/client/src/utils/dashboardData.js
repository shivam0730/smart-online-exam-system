import {
  LayoutDashboard,
  FileText,
  Users,
  BrainCircuit,
  BarChart3,
  Settings,
  ClipboardCheck,
  Clock3,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

/* ==========================================================
   SIDEBAR
========================================================== */

export const sidebarItems = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    active: true,
  },
  {
    icon: FileText,
    label: "Exams",
  },
  {
    icon: BrainCircuit,
    label: "AI Generator",
  },
  {
    icon: Users,
    label: "Students",
  },
  {
    icon: BarChart3,
    label: "Analytics",
  },
  {
    icon: Settings,
    label: "Settings",
  },
];

/* ==========================================================
   DASHBOARD STATS
========================================================== */

export const dashboardStats = [
  {
    title: "Total Exams",
    value: "128",
    icon: ClipboardCheck,
    color: "#2563eb",
  },
  {
    title: "Students",
    value: "2,540",
    icon: Users,
    color: "#4f46e5",
  },
  {
    title: "AI Questions",
    value: "12K+",
    icon: BrainCircuit,
    color: "#06b6d4",
  },
  {
    title: "Success Rate",
    value: "98%",
    icon: ShieldCheck,
    color: "#22c55e",
  },
];

/* ==========================================================
   RECENT EXAMS
========================================================== */

export const recentExams = [
  {
    title: "Java Programming",
    students: 120,
    status: "Completed",
  },
  {
    title: "Database Management",
    students: 94,
    status: "Active",
  },
  {
    title: "Operating Systems",
    students: 152,
    status: "Scheduled",
  },
];

/* ==========================================================
   AI BADGES
========================================================== */

export const floatingBadges = [
  {
    title: "AI Powered",
    icon: BrainCircuit,
  },
  {
    title: "Instant Results",
    icon: Sparkles,
  },
  {
    title: "Secure Exams",
    icon: ShieldCheck,
  },
  {
    title: "Live Timer",
    icon: Clock3,
  },
];

/* ==========================================================
   CHART DATA
========================================================== */

export const performanceData = [
  { month: "Jan", value: 45 },
  { month: "Feb", value: 58 },
  { month: "Mar", value: 72 },
  { month: "Apr", value: 81 },
  { month: "May", value: 89 },
  { month: "Jun", value: 96 },
];