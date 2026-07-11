import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";

import ExamAttemptPage from "./pages/student/ExamAttemptPage";
import HomePage from "./pages/shared/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import StudentDashboard from "./pages/student/StudentDashboard";
import ResultPage from "./pages/student/ResultPage";
import NotFoundPage from "./pages/shared/NotFoundPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/register"
          element={<RegisterPage />}
        />
        <Route
          path="/student/dashboard"
          element={<StudentDashboard />}
        />

        <Route
          path="/student/exams/:examId"
          element={<ExamAttemptPage />}
        />
        <Route
          path="/student/results/:examId"
          element={<ResultPage />}
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;