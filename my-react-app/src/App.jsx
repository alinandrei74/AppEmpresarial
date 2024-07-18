import Navbar from "./components/navbar/Navbar";
import SampleWebStyle from "./pages/sample_web_style/SampleWebStyle";
import Login from "./pages/login/Login";

/**
 *1/ Componente principal de la aplicación.
 *
 * @returns {JSX.Element} La interfaz principal de la aplicación.
 */
const App = () => {
  return (
    <>
      <Navbar />
      <main>
        <div className="app-container">
          <Login />
          <SampleWebStyle />
        </div>
      </main>
    </>
  );
};

export default App;
