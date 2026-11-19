import AuthPage from "./components/Entering/AuthPage.jsx";
import { Routes, Route } from "react-router-dom"
import Assessment from "./components/mcqs/Assessment.jsx"
import CandidateDashboard from "./components/dashboard/CandidateDashboard.jsx";
import { Navigate } from "react-router-dom";
import RegistrationReview from "./components/Entering/RegistrationReview.jsx";

const RequireAuth = ({ children }) => (
  localStorage.getItem("token") ? children : <Navigate to="/" replace />
);

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/registration-review" element={<RegistrationReview />} />
        <Route path="/junior-dashboard" element={<RequireAuth><CandidateDashboard /></RequireAuth>} />
        <Route path="/junior-assessment" element={<RequireAuth><Assessment /></RequireAuth>} />
      </Routes>
    </div>
  )
}

export default App;
