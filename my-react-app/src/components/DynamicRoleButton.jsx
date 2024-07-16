import React, { useMemo } from "react";
import PropTypes from "prop-types";

/**
 *1/ Botón dinámico basado en el rol y el modo oscuro.
 *
 * @param {Object} props - Las propiedades del componente.
 * @param {boolean} [props.darkMode=null] - Indica si el modo oscuro está activado.
 * @param {string} props.role - El rol del botón.
 * @param {string} props.label - La etiqueta del botón.
 * @returns {JSX.Element} El botón de rol dinámico.
 */
const DynamicRoleButton = ({ darkMode = null, role, label }) => {
  // Memorizar los colores para evitar recalcular en cada render
  const { backgroundColor, hoverColor, textColor } = useMemo(() => {
    const roleColor = `var(--${role}-default)`;
    const roleDarkColor = `var(--${role}-dark)`;
    const roleLightColor = `var(--${role}-light)`;

    let backgroundColor;
    let hoverColor;
    let textColor;

    if (darkMode === null) {
      backgroundColor = roleColor;
      hoverColor = roleLightColor;
      textColor = "black";
    } else if (darkMode) {
      backgroundColor = roleDarkColor;
      hoverColor = roleLightColor;
      textColor = "white";
    } else {
      backgroundColor = roleLightColor;
      hoverColor = roleDarkColor;
      textColor = "black";
    }

    return { backgroundColor, hoverColor, textColor };
  }, [darkMode, role]);

  const buttonStyle = {
    padding: "10px 20px",
    backgroundColor: backgroundColor,
    color: textColor,
  };

  return (
    <button
      //! Actualmente no se usa pero es una buena practica
      className={`btn-${role}`}
      style={buttonStyle}
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
