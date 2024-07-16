import React from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import App from "./App";
import { DarkModeProvider } from "./contexts/DarkModeContext";

/**
 ** Renderiza la aplicación principal en el DOM.
 */
const root = createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <DarkModeProvider>
      <App />
    </DarkModeProvider>
  </React.StrictMode>
);
