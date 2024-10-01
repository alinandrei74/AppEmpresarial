import "./ColorTable.css";

/**
 *1/ Componente que muestra una tabla de colores.
 *
 * @returns {JSX.Element} Una tabla con todos los colores definidos en CSS.
 */
const ColorTable = () => {
  const staticColors = [
    { name: "Primary Default", variable: "--primary-default" },
    { name: "Primary Dark", variable: "--primary-dark" },
    { name: "Primary Light", variable: "--primary-light" },

    { name: "Secondary Default", variable: "--secondary-default" },
    { name: "Secondary Dark", variable: "--secondary-dark" },
    { name: "Secondary Light", variable: "--secondary-light" },

    { name: "Desactivado", variable: "--disabled" },

    { name: "Admin Default", variable: "--admin-default" },
    { name: "Admin Dark", variable: "--admin-dark" },
    { name: "Admin Light", variable: "--admin-light" },

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

    { name: "Primary", variable: "--clr-primary" },
    { name: "On Primary", variable: "--clr-OnPrimary" },

    { name: "Secondary", variable: "--clr-secondary" },
    { name: "On Secondary", variable: "--clr-OnSecondary" },

    { name: "Info", variable: "--clr-info" },
    { name: "On Info", variable: "--clr-OnInfo" },

    { name: "Warning", variable: "--clr-warning" },
    { name: "On Warning", variable: "--clr-OnWarning" },

    { name: "Error", variable: "--clr-error" },
    { name: "On Error", variable: "--clr-OnError" },

    { name: "Success", variable: "--clr-success" },
    { name: "On Success", variable: "--clr-OnSuccess" },

    { name: "Admin", variable: "--clr-admin" },
    { name: "Admin Hover", variable: "--clr-admin-hover" },

    { name: "Cleaning", variable: "--clr-cleaning" },
    { name: "Cleaning Hover", variable: "--clr-cleaning-hover" },

    { name: "Delivery", variable: "--clr-delivery" },
    { name: "Delivery Hover", variable: "--clr-delivery-hover" },

    { name: "Maintenance", variable: "--clr-maintenance" },
    { name: "Maintenance Hover", variable: "--clr-maintenance-hover" },
  ];

  /**
   ** Renderiza filas de colores para una tabla.
   *
   * @param {Array} colors - Lista de objetos de colores con propiedades `name` y `variable`.
   * @param {boolean} isStatic - Indica si los colores son estáticos. Si es verdadero, el color del texto será siempre negro.
   * @returns {JSX.Element[]} Array de filas `<tr>` con celdas `<td>` que muestran los nombres y colores.
   */
  const renderColorRows = (colors, isStatic) => {
    return colors.map((color) => {
      let textColor;

      // Determina el color del texto basado en el nombre de la variable de color
      switch (true) {
        case color.variable.endsWith("-dark"):
          textColor = "white";
          break;
        case isStatic:
          textColor = "black";
          break;
        case color.variable === "--clr-OnBackground":
        case color.variable === "--clr-text":
        case color.variable === "--clr-OnWarning":
        case color.variable === "--clr-OnInfo":
        case color.variable === "--clr-OnPrimary":
        case color.variable.endsWith("-light"):
        case color.variable.endsWith("-hover"):
          textColor = `var(--clr-OnText)`;
          break;
        default:
          textColor = undefined;
      }

      return (
        <tr key={color.variable}>
          <td>{color.name}</td>
          <td
            style={{
              backgroundColor: `var(${color.variable})`,
              color: textColor,
              padding: "10px",
              textAlign: "center",
            }}
          >
            {color.variable}
          </td>
        </tr>
      );
    });
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
        <tbody>{renderColorRows(staticColors, true)}</tbody>
      </table>
      <h3>Colores Dinámicos</h3>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Color</th>
          </tr>
        </thead>
        <tbody>{renderColorRows(dynamicColors, false)}</tbody>
      </table>
    </div>
  );
};

export default ColorTable;
