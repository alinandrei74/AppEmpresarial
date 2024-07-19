import React, { useMemo } from "react";
import PropTypes from "prop-types";

/**
 *1/ Botón dinámico basado en el rol y el modo de tema.
 *
 * @param {Object} props - Las propiedades del componente.
 * @param {string} props.role - El rol del botón.
 * @param {string} [props.theme="Default"] - El tema del botón (Dynamic, Reverse, Dark, Light, Default).
 * @param {string} [props.label=""] - La etiqueta del botón.
 * @param {string} [props.size="10px 20px"] - El tamaño del botón en formato CSS.
 * @param {function} [props.onClick] - La función al pulsar el botón.
 * @returns {JSX.Element} El botón de rol dinámico.
 */
const RoleButton = ({
  role,
  theme = "Default",
  label = "",
  size = "10px 20px",
  onClick,
}) => {
  // Memorizar los colores para evitar recalcular en cada render
  const { backgroundColor, hoverColor, textColor, buttonClass } =
    useMemo(() => {
      let backgroundColor, hoverColor, textColor, buttonClass;
      theme = theme.toLowerCase();
      switch (theme) {
        case "dynamic":
          backgroundColor = `var(--clr-${role})`;
          hoverColor = `var(--clr-${role}-hover)`;
          textColor = `var(--clr-text)`;
          buttonClass = `btn-${role}-dynamic`;
          break;
        case "reverse":
          backgroundColor = `var(--clr-${role}-hover)`;
          hoverColor = `var(--clr-${role})`;
          textColor = `var(--clr-OnText)`;
          buttonClass = `btn-${role}-dynamic`;
          break;
        case "dark":
          backgroundColor = `var(--${role}-dark)`;
          hoverColor = `var(--${role}-light)`;
          textColor = "white";
          buttonClass = `btn-${role}-dark`;
          break;
        case "light":
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
    padding: size,
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
  theme: function (props, propName, componentName) {
    if (!/^(default|dynamic|reverse|dark|light)$/i.test(props[propName])) {
      return new Error(
        `Invalid prop \`${propName}\` supplied to \`${componentName}\`. Validation failed.`
      );
    }
  },
  label: PropTypes.string,
  size: PropTypes.string,
  onClick: PropTypes.func,
};

export default RoleButton;
