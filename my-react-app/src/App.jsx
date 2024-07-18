import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Login from "./pages/login/Login";
import UserProfile from "./pages/user_profile/UserProfile";

/**
 * Componente principal de la aplicación que maneja la navegación global.
 * @component
 * @returns {JSX.Element} App
 */
const App = () => {
  return (
    <Router>
      <Navbar />
      <div className="app">
        <main>
          <div className="app-container">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/user-profile/*" element={<UserProfile />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
};

export default App;
