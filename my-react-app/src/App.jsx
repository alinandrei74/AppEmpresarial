import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Login from "./pages/login/Login";
import UserProfile from "./pages/user_profile/UserProfile";
import Register from "./pages/register/Register";
import SampleWebStyle from "./pages/sample_web_style/SampleWebStyle";
import NotFound from "./pages/not_found/NotFound"; // Importar el nuevo componente

/**
 *1/ Componente principal de la aplicación que maneja la navegación global.
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
              <Route path="/" element={<Login />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/user-profile/*" element={<UserProfile />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            {/* <SampleWebStyle /> */}
          </div>
        </main>
      </div>
    </Router>
  );
};

export default App;
