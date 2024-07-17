import React from "react";
import "./RoleButtons.css";
import RoleButton from "../../utilities/components/RoleButton";

/**
 *1/ Componente que renderiza los botones de roles con diferentes estados de theme.
 *
 * @returns {JSX.Element} La tabla de botones de roles.
 */
const RoleButtons = () => {
  return (
    <>
      <div className="role-buttons-head">
        <h2>Ejemplos de Botones</h2>
        <h3>Usando los Colores de la Tabla Anterior</h3>
      </div>

      <div className="role-buttons-table">
        <table>
          <thead>
            <tr>
              <th>Dynamic Mode</th>
              <th>Dark Mode</th>
              <th>Light Mode</th>
              <th>Default Mode</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <RoleButton
                  theme="Dynamic"
                  role="superUser"
                  label="Super Usuario"
                  onClick={() => console.log("Super Usuario - Dynamic Mode")}
                />
              </td>
              <td>
                <RoleButton
                  theme="Dark"
                  role="superUser"
                  label="Super Usuario"
                  onClick={() => console.log("Super Usuario - Dark Mode")}
                />
              </td>
              <td>
                <RoleButton
                  theme="Light"
                  role="superUser"
                  label="Super Usuario"
                  onClick={() => console.log("Super Usuario - Light Mode")}
                />
              </td>
              <td>
                <RoleButton
                  theme="Default"
                  role="superUser"
                  label="Super Usuario"
                  onClick={() => console.log("Super Usuario - Default Mode")}
                />
              </td>
            </tr>
            <tr>
              <td>
                <RoleButton
                  theme="Dynamic"
                  role="cleaning"
                  label="Limpieza"
                  onClick={() => console.log("Limpieza - Dynamic Mode")}
                />
              </td>
              <td>
                <RoleButton
                  theme="Dark"
                  role="cleaning"
                  label="Limpieza"
                  onClick={() => console.log("Limpieza - Dark Mode")}
                />
              </td>
              <td>
                <RoleButton
                  theme="Light"
                  role="cleaning"
                  label="Limpieza"
                  onClick={() => console.log("Limpieza - Light Mode")}
                />
              </td>
              <td>
                <RoleButton
                  theme="Default"
                  role="cleaning"
                  label="Limpieza"
                  onClick={() => console.log("Limpieza - Default Mode")}
                />
              </td>
            </tr>
            <tr>
              <td>
                <RoleButton
                  theme="Dynamic"
                  role="delivery"
                  label="Reparto"
                  onClick={() => console.log("Reparto - Dynamic Mode")}
                />
              </td>
              <td>
                <RoleButton
                  theme="Dark"
                  role="delivery"
                  label="Reparto"
                  onClick={() => console.log("Reparto - Dark Mode")}
                />
              </td>
              <td>
                <RoleButton
                  theme="Light"
                  role="delivery"
                  label="Reparto"
                  onClick={() => console.log("Reparto - Light Mode")}
                />
              </td>
              <td>
                <RoleButton
                  theme="Default"
                  role="delivery"
                  label="Reparto"
                  onClick={() => console.log("Reparto - Default Mode")}
                />
              </td>
            </tr>
            <tr>
              <td>
                <RoleButton
                  theme="Dynamic"
                  role="maintenance"
                  label="Mantenimiento"
                  onClick={() => console.log("Mantenimiento - Dynamic Mode")}
                />
              </td>
              <td>
                <RoleButton
                  theme="Dark"
                  role="maintenance"
                  label="Mantenimiento"
                  onClick={() => console.log("Mantenimiento - Dark Mode")}
                />
              </td>
              <td>
                <RoleButton
                  theme="Light"
                  role="maintenance"
                  label="Mantenimiento"
                  onClick={() => console.log("Mantenimiento - Light Mode")}
                />
              </td>
              <td>
                <RoleButton
                  theme="Default"
                  role="maintenance"
                  label="Mantenimiento"
                  onClick={() => console.log("Mantenimiento - Default Mode")}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default RoleButtons;
