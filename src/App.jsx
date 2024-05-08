import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from "./components/Home";
import CustomStorage from './components/CustomStorage';
import Sidebar from "./components/Sidebar";

function App() {
  return (
    <Router>
    <div style={{ display: 'flex' }}>
      {/* Left sidebar menu */}
      <Sidebar />
      {/* Main content */}
      <div>
        <Routes>
          <Route path="/main_window" element={<Home />} />
          <Route path="/contract-layout" element={<CustomStorage />} />
        </Routes>
      </div>
    </div>
  </Router>
  );
}

export default App;
