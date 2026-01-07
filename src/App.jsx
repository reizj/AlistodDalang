import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/dashboard"; // ✅ Correct path & name
import Alerts from "./pages/alert";
import DeviceMap from "./pages/Devicemap";

function App() {
  return (
    <Router>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Dashboard Page */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Alerts Page */}
        <Route path="/alerts" element={<Alerts />} />

        {/* Device Map Page */}
        <Route path="/devicemap" element={<DeviceMap />} /> 

      </Routes>
    </Router>
  );
}

export default App;

