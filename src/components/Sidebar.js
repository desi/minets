// Header.js
import React from "react";
import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <header className="header">
      <div className="logo">
        <Link to="/main_window">Minets</Link>
      </div>
      <nav className="nav">
        <div className="nav-link">
          <Link to="/contract-layout">Storage Laboratory</Link>
        </div>
        <div className="nav-link">
          <Link to="/builds-layout">Builds</Link>
        </div>
      </nav>
    </header>
  );
}

export default Sidebar;
