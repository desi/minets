import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "@fontsource-variable/inter";
import "../node_modules/@metamask/design-tokens/src/css/design-tokens.css";
import App from "./App.jsx";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
