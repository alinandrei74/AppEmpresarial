import React from "react";
import PropTypes from "prop-types";
import "./DynamicRoleButton.css";

/**
 * Botón dinámico basado en el rol y el modo oscuro.
 *
 * @param {Object} props - Las propiedades del componente.
 * @param {boolean} [props.darkMode=null] - Indica si el modo oscuro está activado.
 * @param {string} props.role - El rol del botón.
 * @param {string} props.label - La etiqueta del botón.
 * @returns {JSX.Element} El botón de rol dinámico.
 */
const DynamicRoleButton = ({ darkMode = null, role, label }) => {
  const roleColor = `var(--${role}-color)`;
  const roleDarkColor = `var(--${role}-dark)`;
  const roleLightColor = `var(--${role}-light)`;

  const backgroundColor =
    darkMode === null ? roleColor : darkMode ? roleDarkColor : roleLightColor;
  const hoverColor =
    darkMode === null
      ? roleLightColor
      : darkMode
      ? roleLightColor
      : roleDarkColor;

  return (
    <button
      className={`btn btn-${role}`}
      style={{
        backgroundColor: backgroundColor,
        color: darkMode ? "white" : "black",
      }}
      onMouseEnter={(e) => (e.target.style.backgroundColor = hoverColor)}
      onMouseLeave={(e) => (e.target.style.backgroundColor = backgroundColor)}
    >
      {label}
    </button>
  );
};

DynamicRoleButton.propTypes = {
  darkMode: PropTypes.bool,
  role: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};

export default DynamicRoleButton;
