import React, { useContext } from "react";
import "./RoleButtons.css";
import DynamicRoleButton from "./DynamicRoleButton";
import { DarkModeContext } from "../contexts/DarkModeContext";

/**
 *1/ Componente que renderiza los botones de roles con diferentes estados de darkMode.
 *
 * @returns {JSX.Element} La tabla de botones de roles.
 */
const RoleButtons = () => {
  const { darkMode } = useContext(DarkModeContext);

  return (
    <>
      <div className="role-buttons-head">
        <h2>Tabla de Botones</h2>
        <h3>Ejemplos Visuales Usando los Colores</h3>
      </div>

      <div className="role-buttons-table">
        <table>
          <thead>
            <tr>
              <th>Current Mode</th>
              <th>Dark Mode</th>
              <th>Light Mode</th>
              <th>Default Mode</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <DynamicRoleButton
                  darkMode={darkMode}
                  role="superUser"
                  label="Super Usuario"
                />
              </td>
              <td>
                <DynamicRoleButton
                  darkMode={true}
                  role="superUser"
                  label="Super Usuario"
                />
              </td>
              <td>
                <DynamicRoleButton
                  darkMode={false}
                  role="superUser"
                  label="Super Usuario"
                />
              </td>
              <td>
                <DynamicRoleButton
                  darkMode={null}
                  role="superUser"
                  label="Super Usuario"
                />
              </td>
            </tr>
            <tr>
              <td>
                <DynamicRoleButton
                  darkMode={darkMode}
                  role="cleaning"
                  label="Limpieza"
                />
              </td>
              <td>
                <DynamicRoleButton
                  darkMode={true}
                  role="cleaning"
                  label="Limpieza"
                />
              </td>
              <td>
                <DynamicRoleButton
                  darkMode={false}
                  role="cleaning"
                  label="Limpieza"
                />
              </td>
              <td>
                <DynamicRoleButton
                  darkMode={null}
                  role="cleaning"
                  label="Limpieza"
                />
              </td>
            </tr>
            <tr>
              <td>
                <DynamicRoleButton
                  darkMode={darkMode}
                  role="delivery"
                  label="Reparto"
                />
              </td>
              <td>
                <DynamicRoleButton
                  darkMode={true}
                  role="delivery"
                  label="Reparto"
                />
              </td>
              <td>
                <DynamicRoleButton
                  darkMode={false}
                  role="delivery"
                  label="Reparto"
                />
              </td>
              <td>
                <DynamicRoleButton
                  darkMode={null}
                  role="delivery"
                  label="Reparto"
                />
              </td>
            </tr>
            <tr>
              <td>
                <DynamicRoleButton
                  darkMode={darkMode}
                  role="maintenance"
                  label="Mantenimiento"
                />
              </td>
              <td>
                <DynamicRoleButton
                  darkMode={true}
                  role="maintenance"
                  label="Mantenimiento"
                />
              </td>
              <td>
                <DynamicRoleButton
                  darkMode={false}
                  role="maintenance"
                  label="Mantenimiento"
                />
              </td>
              <td>
                <DynamicRoleButton
                  darkMode={null}
                  role="maintenance"
                  label="Mantenimiento"
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
