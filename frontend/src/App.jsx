import AuthPage from "./components/Entering/AuthPage.jsx";
import { Navigate, Route, Routes, useParams } from "react-router-dom";
import Assessment from "./components/mcqs/Assessment.jsx";
import CandidateDashboard from "./components/Dashboard/CandidateDashboard.jsx";
import AssessmentList from "./components/Assessments/AssessmentList.jsx";

const RequireAuth = ({ children }) => (
  localStorage.getItem("token") ? children : <Navigate to="/" replace />
);

const AssessmentRoute = () => {
  const { assessmentId } = useParams();
  return <Assessment key={assessmentId} />;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />
      <Route
        path="/dashboard"
        element={<RequireAuth><CandidateDashboard /></RequireAuth>}
      />
      <Route
        path="/assessments"
        element={<RequireAuth><AssessmentList /></RequireAuth>}
      />
      <Route
        path="/junior-assessment/:assessmentId"
        element={<RequireAuth><AssessmentRoute /></RequireAuth>}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
