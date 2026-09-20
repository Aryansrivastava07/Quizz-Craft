import "./App.css";
import { Nav, anchor } from "./Components/Nav.jsx";
import { Home } from "./Home.jsx";
import { Dashboard } from "./Dashboard.jsx";
import { MakeQuiz } from "./MakeQuiz.jsx";
import { MakeQuizver0 } from "./Components/MakeQuizver0.jsx";
import { QuizPlatform } from "./QuizPlatform.jsx";
import { Result } from "./Result.jsx";
import JoinQuiz from "./JoinQuiz.jsx";
import { ThemeProvider } from "./Components/ThemeContext";
import { QuizProvider } from "./Components/QuizContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import ProtectedRoute from "./Components/ProtectedRoute";
import AuthRoutes from './auth/routes';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

function AppContent() {
  const location = useLocation();
  const { isLoggedIn } = useAuth();
  
  // Hide Nav on /QuizPlatform
  const hideNav =
    location.pathname.toLowerCase() === "/quizplatform" ||
    location.pathname.toLowerCase() === "/auth/login" ||
    location.pathname.toLowerCase() === "/auth/register" ||
    location.pathname.toLowerCase() === "/auth/forgot-password" ||
    location.pathname.toLowerCase() === "/auth/verifyotp"

  return (
    <>
      <ThemeProvider>
        {!hideNav && (
          <div className="mb-[10vh]">
            <Nav>
              {anchor("Home", "Home")}
              {isLoggedIn && anchor("Make a Quiz", "MakeQuiz")}
              {anchor("Join a Quiz", "JoinQuiz")}
              {!isLoggedIn && anchor("Login", "auth/Login", true)}
            </Nav>
          </div>
        )}
        <Routes>
          <Route path="/" element={<Navigate to="/Home" />} />
          <Route path="/Home" element={<Home />} />
          {/* <Route path="/auth" element={<Navigate to="/auth/login" />} /> */}
          {/* <Route path="/auth/*" element={<AuthModule />} /> */}
          <Route path="/auth/*" element={<AuthRoutes />} />
          {/* <Route path="/Login" element={<Authenticate />} /> */}
          <Route 
            path="/Dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route
            path="/MakeQuiz"
            element={
              <ProtectedRoute>
                <QuizProvider>
                  <MakeQuiz />
                </QuizProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/QuizPlatform"
            element={
              <ProtectedRoute>
                <QuizProvider>
                  <QuizPlatform />
                </QuizProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/Result"
            element={
              <ProtectedRoute>
                <QuizProvider>
                  <Result />
                </QuizProvider>
              </ProtectedRoute>
            }
          />
          <Route path="/JoinQuiz" element={<JoinQuiz />} />
          <Route 
            path="/attempt-quiz/:quizId" 
            element={
              <ProtectedRoute>
                <QuizProvider>
                  <QuizPlatform />
                </QuizProvider>
              </ProtectedRoute>
            } 
          />
          <Route path="/MakeQuizver0" element={<MakeQuizver0 />} />
        </Routes>
      </ThemeProvider>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
