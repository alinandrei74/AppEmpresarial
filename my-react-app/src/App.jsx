import "./App.css";

import Navbar from "./components/navbar/Navbar";
import RoleButtons from "./components/sample_colors/RoleButtons";
import ColorTable from "./components/sample_colors/ColorTable";

/**
 ** Componente principal de la aplicación.
 *
 * @returns {JSX.Element} La interfaz principal de la aplicación.
 */
const App = () => {
  return (
    <>
      <Navbar />
      <main>
        <div className="app-container">
          <br />
          <ColorTable />
          <RoleButtons />
        </div>
      </main>
    </>
  );
};

export default App;
