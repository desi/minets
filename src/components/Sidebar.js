// Sidebar.js
import React from "react";
import { Link } from 'react-router-dom';
import './Sidebar.css';

function Sidebar() {
  return (
    <div className="sidebar">
      <ul>
        <li>
          <Link to="/main_window">Home</Link>
        </li>
        <li>
          <Link to="/contract-layout">Custom Storage</Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
