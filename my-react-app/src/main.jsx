import React from "react";
import { createRoot } from "react-dom/client";

import DarkModeProvider from "./contexts/DarkModeContext";

import "./styles.css";

import App from "./App";

/**
 *todo: Renderiza la aplicación principal en el DOM.
 */
const root = createRoot(document.getElementById("root"));

root.render(
  // <React.StrictMode>
  <DarkModeProvider>
    <App />
  </DarkModeProvider>
  // </React.StrictMode>
);
