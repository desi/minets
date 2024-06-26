import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Home from "./components/Home";
import CustomStorage from "./components/CustomStorage";
import Sidebar from "./components/Sidebar";
import Builds from "./components/Builds";
import LocalNetwork from "./anvil/anvil-setup";
import NetworkInspector from "./components/NetworkInspector";

import "./App.css";

function App() {
  // Setting anvil here since we need to access it from various components
  const [anvil, setAnvil] = useState(null);
  const startServer = async (config) => {
    try {
      const server = new LocalNetwork();
      await server.start(config);
      console.log("Server started successfully.");
      setAnvil(server);
    } catch (error) {
      console.error("Error starting server:", error);
    }
  };

  const stopServer = async () => {
    try {
      await anvil.quit();
      console.log("Anvil server stopped successfully.");
      setAnvil(null);
    } catch (error) {
      console.error("Error stopping Anvil:", error);
    }
  };

  return (
    <Router>
      <div>
        {/* Left sidebar menu */}
        <Sidebar anvil={anvil} stopServer={stopServer} />
        {/* Main content */}
        <main>
          <Routes>
            <Route
              path="/main_window"
              element={
                <Home
                  anvil={anvil}
                  startServer={startServer}
                  stopServer={stopServer}
                />
              }
            />
            <Route
              path="/contract-layout"
              element={<CustomStorage anvil={anvil} />}
            />
            <Route path="/builds-layout" element={<Builds />} />
            <Route
              path="/network-inspect"
              element={
                <NetworkInspector
                anvil={anvil}
              />}
            />
          </Routes>
        </main>
      </div>
      <></>
    </Router>
  );
}

export default App;
