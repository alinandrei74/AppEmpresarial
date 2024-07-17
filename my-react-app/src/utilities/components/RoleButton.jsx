import React, { useMemo } from "react";
import PropTypes from "prop-types";

/**
 *1/ Botón dinámico basado en el rol y el modo de tema.
 *
 * @param {Object} props - Las propiedades del componente.
 * @param {string} props.role - El rol del botón.
 * @param {string} [props.theme="Default"] - El tema del botón (Dark, Light, Default, Dynamic).
 * @param {string} [props.label=""] - La etiqueta del botón.
 * @param {function} [props.onClick] - La función al pulsar el botón.
 * @returns {JSX.Element} El botón de rol dinámico.
 */
const RoleButton = ({ role, theme = "Default", label = "", onClick }) => {
  // Memorizar los colores para evitar recalcular en cada render
  const { backgroundColor, hoverColor, textColor, buttonClass } =
    useMemo(() => {
      let backgroundColor, hoverColor, textColor, buttonClass;

      switch (theme) {
        case "Dynamic":
          backgroundColor = `var(--clr-${role})`;
          hoverColor = `var(--clr-${role}-hover)`;
          textColor = `var(--clr-text)`;
          buttonClass = `btn-${role}-dynamic`;
          break;
        case "Dark":
          backgroundColor = `var(--${role}-dark)`;
          hoverColor = `var(--${role}-light)`;
          textColor = "white";
          buttonClass = `btn-${role}-dark`;
          break;
        case "Light":
          backgroundColor = `var(--${role}-light)`;
          hoverColor = `var(--${role}-dark)`;
          textColor = "black";
          buttonClass = `btn-${role}-light`;
          break;
        default:
          backgroundColor = `var(--${role}-default)`;
          hoverColor = `var(--${role}-light)`;
          textColor = "black";
          buttonClass = `btn-${role}-default`;
      }

      return { backgroundColor, hoverColor, textColor, buttonClass };
    }, [role, theme]);

  const buttonStyle = {
    padding: "10px 20px",
    backgroundColor: backgroundColor,
    color: textColor,
  };

  return (
    <button
      className={buttonClass}
      style={buttonStyle}
      onClick={onClick}
      onMouseEnter={(e) => (e.target.style.backgroundColor = hoverColor)}
      onMouseLeave={(e) => (e.target.style.backgroundColor = backgroundColor)}
    >
      {label}
    </button>
  );
};

RoleButton.propTypes = {
  role: PropTypes.string.isRequired,
  theme: PropTypes.oneOf(["Dark", "Light", "Default", "Dynamic"]),
  label: PropTypes.string,
  onClick: PropTypes.func,
};

export default RoleButton;
