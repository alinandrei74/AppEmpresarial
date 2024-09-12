import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Form.css";
import { Str } from "../../../utilities/js/utilities";
import {
  loginUser, //; Importa la función correcta para la autenticación
  generateToken, //; Importa la función para generar un token de autenticación simulado
} from "../../../data_base/mockDatabase.mjs"; //; Importa desde el archivo adecuado

/**
 *1/ Componente de formulario controlado que utiliza las variables de CSS del root.
 * @returns {JSX.Element} El formulario renderizado.
 */
const Form = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate(); //; Hook para la navegación

  /**
   ** Maneja el cambio en los campos del formulario.
   * @param {React.ChangeEvent<HTMLInputElement>} e - El evento de cambio.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "username") {
      newValue = Str.replaceExceptChars(
        value,
        "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZÑ-_",
        "", //; Reemplazar caracteres no permitidos por una cadena vacía
        false //; Insensibilidad a mayúsculas y minúsculas
      );

      //; Limitar la longitud del nombre de usuario
      if (newValue.length > 20) {
        newValue = newValue.slice(0, 20);
      }

      //; Validar que el nombre de usuario no empiece ni termine con "-" o "_"
      newValue = newValue.replace(/^[-_]+|[-_]+$/g, "");
    }

    if (name === "password") {
      //; Limita la longitud de la contraseña
      if (newValue.length > 30) {
        newValue = newValue.slice(0, 30);
      }
    }

    setFormData({
      ...formData,
      [name]: newValue,
    });
  };

  /**
   ** Maneja el cambio en el checkbox para mostrar la contraseña.
   * @param {React.ChangeEvent<HTMLInputElement>} e - El evento de cambio.
   */
  const handleCheckboxChange = (e) => {
    setShowPassword(e.target.checked);
  };

  /**
   ** Maneja el envío del formulario de autenticación.
   * @param {React.FormEvent<HTMLFormElement>} e - El evento de envío.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    //; Simulación de login: obtiene usuario y verifica contraseña
    const userResult = loginUser(formData.username, formData.password);

    if (userResult.status === 200) {
      const token = generateToken(userResult.data.user_id);
      sessionStorage.setItem("authToken", token);
      console.log("Datos del usuario autenticado:", userResult.data); //; Mostrar datos del usuario en consola
      navigate(`/user-profile`); //; Redirige al perfil de usuario si la autenticación es exitosa
    } else {
      alert("Usuario o contraseña incorrectos.");
    }
  };

  /**
   ** Verifica si el nombre de usuario y la contraseña son válidos.
   * @returns {boolean} - true si el nombre de usuario y la contraseña son válidos, false en caso contrario.
   */
  const isFormValid = () => {
    const { username, password } = formData;

    //; Expresión regular para validar el nombre de usuario
    const usernameRegex = /^(?![-_])[A-Za-z0-9Ñ_-]{1,18}[A-Za-z0-9Ñ](?<![-_])$/;

    const isUsernameValid = usernameRegex.test(username);
    const isPasswordValid = password.length > 0; //; Verifica que la contraseña no esté vacía

    return isUsernameValid && isPasswordValid;
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="form-title">Inicio de Sesión</div>
      <div className="form-description">
        Por favor, inicie sesión para usar la aplicación.
      </div>
      <br />
      <div className="form-group">
        <label htmlFor="username" className="form-label">
          Usuario
        </label>
        <input
          type="text"
          id="username"
          name="username"
          className="form-input"
          value={formData.username}
          onChange={handleChange}
          autoComplete="username"
        />
      </div>
      <div className="form-group">
        <label htmlFor="password" className="form-label">
          Contraseña
        </label>
        <input
          type={showPassword ? "text" : "password"}
          id="password"
          name="password"
          className="form-input"
          value={formData.password}
          onChange={handleChange}
          autoComplete="current-password"
        />
      </div>
      <div className="form-group form-checkbox-group">
        <input
          type="checkbox"
          id="show-password"
          checked={showPassword}
          onChange={handleCheckboxChange}
          className="form-checkbox"
        />
        <label htmlFor="show-password" className="form-checkbox-label">
          Mostrar Contraseña
        </label>
      </div>
      <button
        type="submit"
        className={`form-button ${
          !isFormValid() ? "form-button-disabled" : ""
        }`}
        disabled={!isFormValid()}
      >
        Iniciar Sesión
      </button>
    </form>
  );
};

export default Form;
