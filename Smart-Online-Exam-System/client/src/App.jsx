import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";

import "./App.css";

import TeacherProfilePage
  from "./pages/teacher/TeacherProfilePage";

import ExamAttemptPage from "./pages/student/ExamAttemptPage";
import HomePage from "./pages/shared/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentResultsPage from "./pages/student/StudentResultsPage";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminResultsPage
  from "./pages/admin/AdminResultsPage";
import AdminExamsPage from "./pages/admin/AdminExamsPage";
import AdminExamDetailsPage
  from "./pages/admin/AdminExamDetailsPage";
import AdminResultDetailsPage from "./pages/admin/AdminResultDetailsPage";
import TeacherExamsPage from "./pages/teacher/TeacherExamsPage";
import TeacherResultsPage from "./pages/teacher/TeacherResultsPage";
import ExamResultsPage from "./pages/teacher/ExamResultsPage";
import CreateExamPage from "./pages/teacher/CreateExamPage";
import EditExamPage from "./pages/teacher/EditExamPage";
import ManageQuestionsPage from "./pages/teacher/ManageQuestionsPage";
import CreateQuestionPage from "./pages/teacher/CreateQuestionPage";
import EditQuestionPage from "./pages/teacher/EditQuestionPage";
import ResultPage from "./pages/student/ResultPage";
import NotFoundPage from "./pages/shared/NotFoundPage";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route
            path="/"
            element={<HomePage />}
          />

          <Route
            path="/login"
            element={<LoginPage />}
          />

          <Route
            path="/register"
            element={<RegisterPage />}
          />

          <Route
            path="/student/dashboard"
            element={<StudentDashboard />}
          />

          <Route
            path="/student/results"
            element={<StudentResultsPage />}
          />

          <Route
            path="/teacher/dashboard"
            element={<TeacherDashboard />}
          />

          <Route
            path="/admin/dashboard"
            element={<AdminDashboard />}
          />

          <Route
            path="/admin/users"
            element={<AdminUsersPage />}
          />

          <Route
            path="/admin/results"
            element={
              <AdminResultsPage />
            }
          />

          <Route
            path="/admin/exams"
            element={<AdminExamsPage />}
          />

          <Route
            path="/admin/exams/:examId"
            element={
              <AdminExamDetailsPage />
            }
          />

          <Route
            path="/admin/results/:resultId"
            element={
              <AdminResultDetailsPage />
            }
          />

          <Route
            path="/teacher/exams"
            element={<TeacherExamsPage />}
          />

          <Route
            path="/teacher/results"
            element={
              <TeacherResultsPage />
            }
          />
          <Route
            path="/teacher/exams/:examId/results"
            element={
              <ExamResultsPage />
            }
          />
          <Route
            path="/teacher/exams/create"
            element={<CreateExamPage />}
          />

          <Route
            path="/teacher/exams/:examId/edit"
            element={<EditExamPage />}
          />

          <Route
            path="/teacher/exams/:examId/questions"
            element={<ManageQuestionsPage />}
          />

          <Route
            path="/teacher/exams/:examId/questions/create"
            element={<CreateQuestionPage />}
          />


          <Route
            path="/teacher/exams/:examId/questions/:questionId/edit"
            element={<EditQuestionPage />}
          />
          <Route
            path="/student/exams/:examId"
            element={<ExamAttemptPage />}
          />

          <Route
            path="/student/results/:examId"
            element={<ResultPage />}
          />
          <Route
            path="/teacher/profile"
            element={
              <TeacherProfilePage />
            }
          />
          <Route
            path="*"
            element={<NotFoundPage />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

