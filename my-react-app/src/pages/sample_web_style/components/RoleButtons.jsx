import React from "react";
import "./RoleButtons.css";
import RoleButton from "../../../utilities/components/RoleButton";

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
        <h3>Usando el Componente RoleButton</h3>
      </div>

      <div className="role-buttons-table">
        <table>
          <thead>
            <tr>
              <th>Default Theme</th>
              <th>Dynamic Theme</th>
              <th>Reverse Theme</th>
              <th>Dark Theme</th>
              <th>Light Theme</th>
            </tr>
          </thead>
          <tbody>
            {["admin", "cleaning", "delivery", "maintenance"].map(
              (role) => (
                <tr key={role}>
                  <td>
                    <RoleButton
                      theme="Default"
                      role={role}
                      label={role.charAt(0).toUpperCase() + role.slice(1)}
                      onClick={() => console.log(`${role} - Default Theme`)}
                    />
                  </td>
                  <td>
                    <RoleButton
                      theme="Dynamic"
                      role={role}
                      label={role.charAt(0).toUpperCase() + role.slice(1)}
                      onClick={() => console.log(`${role} - Dynamic Theme`)}
                    />
                  </td>
                  <td>
                    <RoleButton
                      theme="Reverse"
                      role={role}
                      label={role.charAt(0).toUpperCase() + role.slice(1)}
                      onClick={() => console.log(`${role} - Reverse Theme`)}
                    />
                  </td>
                  <td>
                    <RoleButton
                      theme="Dark"
                      role={role}
                      label={role.charAt(0).toUpperCase() + role.slice(1)}
                      onClick={() => console.log(`${role} - Dark Theme`)}
                    />
                  </td>
                  <td>
                    <RoleButton
                      theme="Light"
                      role={role}
                      label={role.charAt(0).toUpperCase() + role.slice(1)}
                      onClick={() => console.log(`${role} - Light Theme`)}
                    />
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default RoleButtons;
