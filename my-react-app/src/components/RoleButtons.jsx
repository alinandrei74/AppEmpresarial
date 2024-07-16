import React from "react";
import "./RoleButtons.css";
import DynamicRoleButton from "./DynamicRoleButton";

const RoleButtons = ({ darkMode }) => {
  return (
    <div className="role-buttons-container">
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
                role="super-user"
                label="Super Usuario"
              />
            </td>
            <td>
              <DynamicRoleButton
                darkMode={true}
                role="super-user"
                label="Super Usuario"
              />
            </td>
            <td>
              <DynamicRoleButton
                darkMode={false}
                role="super-user"
                label="Super Usuario"
              />
            </td>
            <td>
              <DynamicRoleButton
                darkMode={null}
                role="super-user"
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
  );
};

export default RoleButtons;
