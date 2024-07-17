import Navbar from "./components/navbar/Navbar";
import SampleColors from "./pages/sample_colors/SampleColors";

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
          <SampleColors />
        </div>
      </main>
    </>
  );
};

export default App;
