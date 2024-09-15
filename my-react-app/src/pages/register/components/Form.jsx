import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./Form.css";

/**
 * Componente para el formulario de registro de usuarios.
 * @returns {JSX.Element} El componente del formulario.
 */
const Form = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [responseMessage, setResponseMessage] = useState(""); //; Mensaje de respuesta de la API
  const [isErrorMessage, setIsErrorMessage] = useState(false); //; Nueva variable de estado para manejar el estilo del mensaje

  const formik = useFormik({
    initialValues: {
      rol: "",
      username: "",
      fullName: "",
      dni: "",
      address: "",
      postal_code: "",
      email: "",
      telephone: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      rol: Yup.string()
        .oneOf(["Admin", "Cleaning", "Delivery", "Maintenance"], "Rol inválido")
        .required(""),
      username: Yup.string()
        .min(3, "El nombre de usuario debe tener mínimo 3 caracteres")
        .max(20, "El nombre de usuario debe tener máximo 20 caracteres")
        .matches(
          /^(?![-_])[A-Za-z0-9Ñ_-]{1,18}[A-Za-z0-9Ñ](?<![-_])$/,
          "El nombre de usuario puede contener números, mayúsculas, minúsculas, '-' y '_'. No puede empezar ni terminar con '-' o '_'."
        )
        .required(""),
      fullName: Yup.string()
        .matches(
          /^[A-Za-zÀ-ÿ\s]+$/,
          "El nombre completo solo puede contener letras y espacios"
        )
        .required(""),
      dni: Yup.string()
        .matches(
          /^[A-Za-z0-9]+$/,
          "El DNI o NIE sólo puede contener números y letras"
        )
        .required(""),
      address: Yup.string()
        .matches(
          /^[A-Za-zÀ-ÿ\d\s,]+$/,
          "Dirección sólo admite letras, números, ',' y espacios"
        )
        .required(""),
      postal_code: Yup.string()
        .matches(
          /^\d{4,10}$/,
          "El código postal debe ser un número entre 4 y 10 dígitos."
        )
        .required(""),
      email: Yup.string()
        .matches(
          /^[A-Z0-9._%+-]+@[A-Z0-9-]+\.[A-Z]{2,}(?:\.[A-Z]{2,})*$/i,
          "Formato de email inválido"
        )
        .required(""),
      telephone: Yup.string()
        .matches(
          /^\d{9,15}$/,
          "El teléfono solo puede contener entre 9 y 15 números"
        )
        .required(""),
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
        .matches(
          /[@$!%*?&.#]/,
          "La contraseña debe contener al menos un símbolo especial"
        )
        .required(""),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Las contraseñas no coinciden")
        .required(""),
    }),

    onSubmit: async (values) => {
      try {
        //; Separa el nombre completo en `name`, `firstname` y `lastname`
        const [name, firstname, ...lastnameArray] = values.fullName.split(" ");
        const lastname = lastnameArray.join(" ");

        //; Estructura los datos para la petición POST al backend
        const response = await fetch(
          "http://localhost:3000/api/auth/register",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: values.username,
              password: values.password,
              role: values.rol.toLowerCase(),
              name, //; Primer nombre
              firstname, //; Segundo nombre o primer apellido
              lastname, //; Apellidos restantes
              email: values.email,
              telephone: values.telephone,
              dni: values.dni,
              address: values.address,
              cp: values.postal_code, //; Código postal
              created_at: new Date().toISOString().split("T")[0], //; Fecha actual en formato YYYY-MM-DD
              updated_at: new Date().toISOString().split("T")[0], //; Fecha actual en formato YYYY-MM-DD
            }),
          }
        );

        const data = await response.json();

        if (response.status === 201) {
          setResponseMessage("Usuario registrado con éxito.");
          setIsErrorMessage(false); //; Indica que el mensaje es de éxito
        } else {
          setResponseMessage("Error al registrar el usuario: " + data.message);
          setIsErrorMessage(true); //; Indica que el mensaje es de error
        }
      } catch (error) {
        setResponseMessage("Error al registrar el usuario: " + error.message);
        setIsErrorMessage(true); //; Indica que el mensaje es de error
      }
    },
  });

  const handlePasswordCheckboxChange = (e) => {
    setShowPassword(e.target.checked);
  };

  return (
    <form className="form" onSubmit={formik.handleSubmit}>
      <div className="form-title">Registro de Usuario</div>
      <div className="form-description">
        Por favor, complete el formulario para registrarse.
      </div>

      {/* Campo para seleccionar el rol */}
      <div className="form-group">
        <label htmlFor="rol" className="form-label required">
          Rol
        </label>
        <select
          id="rol"
          name="rol"
          className="form-input"
          value={formik.values.rol}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        >
          <option value="" label="Seleccione un rol" />
          <option value="Admin" label="Administrador" />
          <option value="Cleaning" label="Limpieza" />
          <option value="Delivery" label="Entrega" />
          <option value="Maintenance" label="Mantenimiento" />
        </select>
        {formik.touched.rol && formik.errors.rol ? (
          <div>{formik.errors.rol}</div>
        ) : null}
      </div>

      <div className="form-group">
        <label htmlFor="username" className="form-label required">
          Nombre de usuario
        </label>
        <input
          type="text"
          id="username"
          name="username"
          className="form-input"
          value={formik.values.username}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.username && formik.errors.username ? (
          <div>{formik.errors.username}</div>
        ) : null}
      </div>

      <div className="form-group">
        <label htmlFor="fullName" className="form-label required">
          Nombre Completo
        </label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          className="form-input"
          value={formik.values.fullName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.fullName && formik.errors.fullName ? (
          <div>{formik.errors.fullName}</div>
        ) : null}
      </div>

      <div className="form-group">
        <label htmlFor="dni" className="form-label required">
          DNI / NIE / PASAPORTE
        </label>
        <input
          type="text"
          id="dni"
          name="dni"
          className="form-input"
          value={formik.values.dni}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.dni && formik.errors.dni ? (
          <div>{formik.errors.dni}</div>
        ) : null}
      </div>

      <div className="form-group">
        <label htmlFor="address" className="form-label required">
          Dirección
        </label>
        <input
          type="text"
          id="address"
          name="address"
          className="form-input"
          value={formik.values.address}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.address && formik.errors.address ? (
          <div>{formik.errors.address}</div>
        ) : null}
      </div>

      <div className="form-group">
        <label htmlFor="postal_code" className="form-label required">
          Código Postal
        </label>
        <input
          type="text"
          id="postal_code"
          name="postal_code"
          className="form-input"
          value={formik.values.postal_code}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.postal_code && formik.errors.postal_code ? (
          <div>{formik.errors.postal_code}</div>
        ) : null}
      </div>

      <div className="form-group">
        <label htmlFor="email" className="form-label required">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          className="form-input"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.email && formik.errors.email ? (
          <div>{formik.errors.email}</div>
        ) : null}
      </div>

      <div className="form-group">
        <label htmlFor="telephone" className="form-label required">
          Teléfono
        </label>
        <input
          type="text"
          id="telephone"
          name="telephone"
          className="form-input"
          value={formik.values.telephone}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.telephone && formik.errors.telephone ? (
          <div>{formik.errors.telephone}</div>
        ) : null}
      </div>

      {/* Campo de Contraseña */}
      <div className="form-group">
        <label htmlFor="password" className="form-label required">
          Contraseña
        </label>
        <input
          type={showPassword ? "text" : "password"}
          id="password"
          name="password"
          className="form-input"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          unselectable="on"
        />
        {formik.touched.password && formik.errors.password ? (
          <div>{formik.errors.password}</div>
        ) : null}
      </div>

      <div className="form-group form-checkbox-group">
        <input
          type="checkbox"
          id="show-password"
          checked={showPassword}
          onChange={handlePasswordCheckboxChange}
          className="form-checkbox"
        />
        <label htmlFor="show-password" className="form-checkbox-label">
          Mostrar Contraseña
        </label>
      </div>

      {/* Confirmar Contraseña */}
      <div className="form-group">
        <label htmlFor="confirmPassword" className="form-label required">
          Confirmar Contraseña
        </label>
        <input
          type="password" //; Fijo en "password" para evitar mostrar la confirmación
          id="confirmPassword"
          name="confirmPassword"
          className="form-input"
          value={formik.values.confirmPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          unselectable="on"
        />
        {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
          <div>{formik.errors.confirmPassword}</div>
        ) : null}
      </div>

      {/* Botón de Enviar */}
      <button
        type="submit"
        className={`form-button ${
          !formik.isValid ? "form-button-disabled" : ""
        }`}
      >
        Registrar
      </button>

      {/* Mensaje de Respuesta */}
      {responseMessage && (
        <div
          className={`responseMessage ${
            isErrorMessage ? "responseMessage-error" : "responseMessage-success"
          }`}
        >
          {responseMessage}
        </div>
      )}
    </form>
  );
};

export default Form;
