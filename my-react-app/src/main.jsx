import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom"; // Aquí está el único Router
import DarkModeProvider from "./contexts/DarkModeContext";
import { AuthProvider } from "./contexts/AuthContext";
import "./styles.css";
import App from "./App";

/**
 * Renderiza la aplicación principal en el DOM.
 */
const root = createRoot(document.getElementById("root"));

root.render(
  <DarkModeProvider>
    <Router>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Router>
  </DarkModeProvider>
);
