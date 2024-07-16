import React, { useContext } from "react";
import { DarkModeContext } from "../contexts/DarkModeContext";
import "./ColorTable.css";

/**
 * Componente que muestra una tabla de colores.
 *
 * @returns {JSX.Element} Una tabla con todos los colores definidos en CSS.
 */
const ColorTable = () => {
  const { darkMode } = useContext(DarkModeContext);

  const staticColors = [
    { name: "Primary Default", variable: "--primary-default" },
    { name: "Primary Dark", variable: "--primary-dark" },
    { name: "Primary Light", variable: "--primary-light" },
    { name: "Secondary Default", variable: "--secondary-default" },
    { name: "Secondary Dark", variable: "--secondary-dark" },
    { name: "Secondary Light", variable: "--secondary-light" },
    { name: "SuperUser Default", variable: "--superUser-default" },
    { name: "SuperUser Dark", variable: "--superUser-dark" },
    { name: "SuperUser Light", variable: "--superUser-light" },
    { name: "Cleaning Default", variable: "--cleaning-default" },
    { name: "Cleaning Dark", variable: "--cleaning-dark" },
    { name: "Cleaning Light", variable: "--cleaning-light" },
    { name: "Delivery Default", variable: "--delivery-default" },
    { name: "Delivery Dark", variable: "--delivery-dark" },
    { name: "Delivery Light", variable: "--delivery-light" },
    { name: "Maintenance Default", variable: "--maintenance-default" },
    { name: "Maintenance Dark", variable: "--maintenance-dark" },
    { name: "Maintenance Light", variable: "--maintenance-light" },
  ];

  const dynamicColors = [
    { name: "Background", variable: "--clr-background" },
    { name: "On Background", variable: "--clr-OnBackground" },
    { name: "Text", variable: "--clr-text" },
    { name: "On Text", variable: "--clr-OnText" },
    { name: "SuperUser", variable: "--clr-superUser" },
    { name: "Cleaning", variable: "--clr-cleaning" },
    { name: "Delivery", variable: "--clr-delivery" },
    { name: "Maintenance", variable: "--clr-maintenance" },
  ];

  const renderColorRows = (colors) => {
    return colors.map((color) => (
      <tr key={color.variable}>
        <td>{color.name}</td>
        <td
          style={{
            backgroundColor: `var(${color.variable})`,
            color:
              color.variable === "--clr-OnBackground" ||
              color.variable === "--clr-text" ||
              color.variable.endsWith("-light")
                ? `var(--clr-OnText)`
                : darkMode,
            padding: "10px",
            textAlign: "center",
          }}
        >
          {color.variable}
        </td>
      </tr>
    ));
  };

  return (
    <div className="color-table-container">
      <h2>Tabla de Colores</h2>
      <h3>Colores Estáticos</h3>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Color</th>
          </tr>
        </thead>
        <tbody>{renderColorRows(staticColors)}</tbody>
      </table>
      <h3>Colores Dinámicos</h3>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Color</th>
          </tr>
        </thead>
        <tbody>{renderColorRows(dynamicColors)}</tbody>
      </table>
    </div>
  );
};

export default ColorTable;
