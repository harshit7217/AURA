import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuraAuth from "./AuraAuth";
import Dashboard from "./Dashboard";
import Assessment from "./Assessment";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuraAuth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/assessment" element={<Assessment />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;