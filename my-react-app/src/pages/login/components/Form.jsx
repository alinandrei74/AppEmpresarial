import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Form.css";
import { Str } from "../../../utilities/js/utilities";
import { loginUser } from "../../../../../backend/src/services/authService"; // Asegúrate de importar desde el archivo correcto
import * as Yup from "yup";
import { useFormik } from "formik";

/**
 * 1/ Componente de formulario controlado que utiliza las variables de CSS del root.
 * @returns {JSX.Element} El formulario renderizado.
 */
const Form = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate(); // Hook para la navegación

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Formato de email inválido")
        .required("Requerido"),
      password: Yup.string()
        .min(8, "La contraseña debe tener mínimo 8 caracteres")
        .max(30, "La contraseña debe tener máximo 30 caracteres")
        .matches(
          /[A-Z]/,
          "La contraseña debe contener al menos una letra mayúscula"
        )
        .matches(
          /[a-z]/,
          "La contraseña debe contener al menos una letra minúscula"
        )
        .matches(/\d/, "La contraseña debe contener al menos un número")
        .matches(/[\W_]/, "La contraseña debe contener al menos un símbolo")
        .matches(
          /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!¡?¿.\-_&%$#@+])[A-Za-z\d!¡?¿.\-_&%$#@+]{6,}$/,
          "La contraseña admite los siguientes símbolos: !¡?¿.-_&%$#@+ "
        )
        .required("Requerido"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await loginUser(values.email, values.password);
        sessionStorage.setItem("authToken", response.token);
        alert("Inicio de sesión exitoso.");
        console.log("Datos del usuario autenticado:", response.user); // Mostrar datos del usuario en consola
        navigate("/user-profile"); // Redirige al perfil de usuario si la autenticación es exitosa
      } catch (error) {
        alert("Usuario o contraseña incorrectos.");
      }
    },
  });

  return (
    <form className="form" onSubmit={formik.handleSubmit}>
      <div className="form-title">Inicio de Sesión</div>
      <div className="form-description">
        Por favor, inicie sesión para usar la aplicación.
      </div>
      <br />
      <div className="form-group">
        <label htmlFor="email" className="form-label">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          className="form-input"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.email}
          autoComplete="email"
        />
        {formik.touched.email && formik.errors.email ? (
          <div className="form-error">{formik.errors.email}</div>
        ) : null}
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
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.password}
          autoComplete="current-password"
        />
        {formik.touched.password && formik.errors.password ? (
          <div className="form-error">{formik.errors.password}</div>
        ) : null}
      </div>
      <div className="form-group form-checkbox-group">
        <input
          type="checkbox"
          id="show-password"
          checked={showPassword}
          onChange={() => setShowPassword(!showPassword)}
          className="form-checkbox"
        />
        <label htmlFor="show-password" className="form-checkbox-label">
          Mostrar Contraseña
        </label>
      </div>
      <button
        type="submit"
        className={`form-button ${
          !formik.isValid ? "form-button-disabled" : ""
        }`}
        disabled={!formik.isValid}
      >
        Iniciar Sesión
      </button>
    </form>
  );
};

export default Form;
