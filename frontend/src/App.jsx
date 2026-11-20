import AuthPage from "./components/Entering/AuthPage.jsx";
import { Routes, Route } from "react-router-dom"
import Assessment from "./components/mcqs/Assessment.jsx"

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/junior-assessment" element={<Assessment />} />
      </Routes>
    </div>
  )
}

export default App;
