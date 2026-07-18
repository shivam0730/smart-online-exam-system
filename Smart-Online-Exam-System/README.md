# 🎓 Smart Online Examination System

A full-stack web application for conducting secure online examinations with role-based access for Students, Teachers, Admins, and Super Admins. The system provides AI-powered question generation, automated evaluation, result analytics, and a modern responsive interface.

---

## 📌 Project Overview

The Smart Online Examination System is designed to simplify the online examination process for educational institutions. It enables teachers to create and manage exams, students to take exams securely, and administrators to monitor the overall system efficiently.

---

## ✨ Features

### 👨‍🎓 Student Module
- Student Registration & Login
- Secure JWT Authentication
- View Available Exams
- Start Exam
- Automatic Timer
- Auto Submission
- View Results
- Performance Statistics
- Exam History

### 👨‍🏫 Teacher Module
- Teacher Dashboard
- Create Exams
- Edit Exams
- Delete Exams
- Publish / Unpublish Exams
- Manage Questions
- AI Question Generation
- View Exam Statistics

### 👨‍💼 Admin Module
- Admin Dashboard
- User Management
- Activate / Deactivate Users
- System Statistics
- Role Management
- Monitor Platform Usage

### 🔐 Security Features
- JWT Authentication
- Password Hashing (bcrypt)
- Role-Based Authorization
- Protected Routes
- Input Validation
- Rate Limiting
- Helmet Security
- CORS Protection

### 🤖 AI Features
- AI-powered Question Generation
- Multiple Difficulty Levels
- Multiple Question Types
- Topic-based Question Creation

---

# 🛠 Tech Stack

## Frontend

- React.js
- React Router DOM
- Axios
- React Hook Form
- CSS Modules
- Framer Motion
- Recharts

## Backend

- Node.js
- Express.js
- Prisma ORM
- PostgreSQL
- JWT
- bcrypt

## Other Tools

- Git
- GitHub
- Vercel
- Railway / Render
- Cloudinary
- Nodemailer

---

# 📁 Project Structure

```
Smart-Online-Exam-System
│
├── client/
├── server/
├── docs/
├── design/
├── scripts/
└── README.md
```

---

# 🚀 Installation

## Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/Smart-Online-Exam-System.git
```

## Install Frontend

```bash
cd client
npm install
```

## Install Backend

```bash
cd server
npm install
```

---

# ⚙ Environment Variables

## Server

Create a `.env` file inside the server folder.

```
DATABASE_URL=

JWT_SECRET=

PORT=5000

GEMINI_API_KEY=

CLOUDINARY_CLOUD_NAME=

CLOUDINARY_API_KEY=

CLOUDINARY_API_SECRET=

EMAIL_USER=

EMAIL_PASS=
```

## Client

Create a `.env` file inside the client folder.

```
VITE_API_BASE_URL=
```

---

# 🖥 Screenshots

Add screenshots here.

- Home Page
- Login Page
- Student Dashboard
- Teacher Dashboard
- Admin Dashboard
- Create Exam
- AI Question Generator
- Result Page

---

# 📊 System Modules

- Authentication
- Student Module
- Teacher Module
- Admin Module
- AI Module
- Results Module

---

# 📈 Future Enhancements

- Live Proctoring
- Video Monitoring
- Face Recognition
- OTP Verification
- Mobile Application
- Email Notifications
- Certificate Generation
- Analytics Dashboard
- Question Bank Import (Excel/PDF)

---

# 👨‍💻 Author

**Shivam Rajput**

B.Tech Computer Science Engineering

Lovely Professional University

---

# ⭐ If you like this project

Give it a ⭐ on GitHub.