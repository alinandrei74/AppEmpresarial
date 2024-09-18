import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./Form.css";

const Form = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [isErrorMessage, setIsErrorMessage] = useState(false);

  const formik = useFormik({
    initialValues: {
      role: "",
      username: "",
      name: "",
      firstname: "",
      lastname: "",
      dni: "",
      email: "",
      telephone: "",
      address: "",
      cp: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      role: Yup.string()
        .oneOf(["admin", "cleaning", "delivery", "maintenance"], "Rol inválido")
        .required("El rol es requerido"),
      username: Yup.string()
        .min(3, "El nombre de usuario debe tener mínimo 3 caracteres")
        .max(20, "El nombre de usuario debe tener máximo 20 caracteres")
        .matches(
          /^(?![-_])[A-Za-z0-9Ñ_-]{1,18}[A-Za-z0-9Ñ](?<![-_])$/,
          "El nombre de usuario puede contener números, mayúsculas, minúsculas, '-' y '_'. No puede empezar ni terminar con '-' o '_'."
        )
        .required("El nombre de usuario es requerido"),
      name: Yup.string()
        .matches(
          /^[A-Za-zÀ-ÿ\s]+$/,
          "El nombre solo puede contener letras y espacios"
        )
        .required("El nombre es requerido"),
      firstname: Yup.string()
        .matches(
          /^[A-Za-zÀ-ÿ\s]+$/,
          "El primer apellido solo puede contener letras y espacios"
        )
        .required("El primer apellido es requerido"),
      lastname: Yup.string()
        .matches(
          /^[A-Za-zÀ-ÿ\s]+$/,
          "El segundo apellido solo puede contener letras y espacios"
        )
        .required("El segundo apellido es requerido"),
      dni: Yup.string()
        .matches(
          /^[A-Za-z0-9]+$/,
          "El DNI o NIE sólo puede contener números y letras"
        )
        .required("El DNI o NIE es requerido"),
      email: Yup.string()
        .email("Formato de email inválido")
        .required("El email es requerido"),
      telephone: Yup.string()
        .matches(
          /^\d{9,15}$/,
          "El teléfono solo puede contener entre 9 y 15 números"
        )
        .required("El teléfono es requerido"),
      address: Yup.string()
        .required("La dirección es requerida"),
      cp: Yup.string()
        .matches(
          /^\d{4,10}$/,
          "El código postal debe ser un número entre 4 y 10 dígitos."
        )
        .required("El código postal es requerido"),
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
        .required("La contraseña es requerida"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Las contraseñas no coinciden")
        .required("Confirmar la contraseña es requerido"),
    }),

    onSubmit: async (values) => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/auth/register",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              role: values.role,
              username: values.username,
              name: values.name,
              firstname: values.firstname,
              lastname: values.lastname,
              dni: values.dni,
              email: values.email,
              telephone: values.telephone,
              address: values.address,
              cp: values.cp,
              password: values.password,
            }),
          }
        );

        const data = await response.json();

        if (response.status === 201) {
          setResponseMessage("Usuario registrado con éxito.");
          setIsErrorMessage(false);
        } else {
          setResponseMessage("Error al registrar el usuario: " + data.message);
          setIsErrorMessage(true);
        }
      } catch (error) {
        setResponseMessage("Error al registrar el usuario: " + error.message);
        setIsErrorMessage(true);
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

      <div className="form-group">
        <label htmlFor="role" className="form-label required">
          Rol
        </label>
        <select
          id="role"
          name="role"
          className="form-input"
          value={formik.values.role}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        >
          <option value="" label="Seleccione un rol" />
          <option value="admin" label="Administrador" />
          <option value="cleaning" label="Limpieza" />
          <option value="delivery" label="Entrega" />
          <option value="maintenance" label="Mantenimiento" />
        </select>
        {formik.touched.role && formik.errors.role ? (
          <div>{formik.errors.role}</div>
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
        <label htmlFor="name" className="form-label required">
          Nombre
        </label>
        <input
          type="text"
          id="name"
          name="name"
          className="form-input"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.name && formik.errors.name ? (
          <div>{formik.errors.name}</div>
        ) : null}
      </div>

      <div className="form-group">
        <label htmlFor="firstname" className="form-label required">
          Primer Apellido
        </label>
        <input
          type="text"
          id="firstname"
          name="firstname"
          className="form-input"
          value={formik.values.firstname}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.firstname && formik.errors.firstname ? (
          <div>{formik.errors.firstname}</div>
        ) : null}
      </div>

      <div className="form-group">
        <label htmlFor="lastname" className="form-label required">
          Segundo Apellido
        </label>
        <input
          type="text"
          id="lastname"
          name="lastname"
          className="form-input"
          value={formik.values.lastname}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.lastname && formik.errors.lastname ? (
          <div>{formik.errors.lastname}</div>
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
        <label htmlFor="cp" className="form-label required">
          Código Postal
        </label>
        <input
          type="text"
          id="cp"
          name="cp"
          className="form-input"
          value={formik.values.cp}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.cp && formik.errors.cp ? (
          <div>{formik.errors.cp}</div>
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
          autoComplete="new-password"
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

      <div className="form-group">
        <label htmlFor="confirmPassword" className="form-label required">
          Confirmar Contraseña
        </label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          className="form-input"
          value={formik.values.confirmPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          autoComplete="new-password"
        />
        {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
          <div>{formik.errors.confirmPassword}</div>
        ) : null}
      </div>

      <button
        type="submit"
        className={`form-button ${
          !formik.isValid ? "form-button-disabled" : ""
        }`}
      >
        Registrar
      </button>

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