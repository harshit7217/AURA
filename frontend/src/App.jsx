import AuthPage from "./components/Entering/AuthPage.jsx";
import { Routes, Route } from "react-router-dom"

function App() {
  return (
    <div>
      <Routes>
        <Route path="/"  element={<AuthPage />} />
      </Routes>
    </div>
  )
}

export default App;
