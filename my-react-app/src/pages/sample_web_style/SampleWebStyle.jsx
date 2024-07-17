import RoleButtons from "./components/RoleButtons";
import ColorTable from "./components/ColorTable";

/**
 *1/ Componente principal de la aplicación para la página de colores de muestra.
 *
 * @returns {JSX.Element} La interfaz principal de la página de colores de muestra.
 */
const SampleWebStyle = () => {
  return (
    <>
      <br />
      <ColorTable />
      <RoleButtons />
    </>
  );
};

export default SampleWebStyle;
