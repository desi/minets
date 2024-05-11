// Sidebar.js
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";

function Sidebar({ anvil, stopServer }) {
  return (
    <header className="sidebar">
      <nav>
        <Link className="logo" to="/main_window">
          Minets!
        </Link>
        <div className="links">
            <div>
            <Link className="link" to="/network-inspect">
              Network Inspector
            </Link>
          </div>
          <div>
            <Link className="link" to="/contract-layout">
              Storage Laboratory
            </Link>
          </div>
          <div>
            <Link className="link" to="/builds-layout">
              Builds
            </Link>
          </div>
        </div>
      </nav>
      <div className="anvil">
        {/* Render the "Stop Server" button if Anvil is running */}
        {anvil && (
          <button className="stop-btn" onClick={stopServer}>
            Stop Server
          </button>
        )}
        <div className={`status ${anvil ? "on" : "off"}`}>
          <span>Anvil status:</span>
          <div className={anvil ? "ball-green" : "ball-red"} />
        </div>
      </div>
    </header>
  );
}

export default Sidebar;
