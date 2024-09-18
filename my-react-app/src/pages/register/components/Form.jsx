import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify"; //; Importa react-toastify para notificaciones
import "./Form.css";

const Form = () => {
  const [showPassword, setShowPassword] = useState(false);

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
        .required("El rol es requerido"),
      username: Yup.string()
        .min(3, "El nombre de usuario debe tener mínimo 3 caracteres")
        .max(20, "El nombre de usuario debe tener máximo 20 caracteres")
        .matches(
          /^(?![-_])[A-Za-z0-9Ñ_-]{1,18}[A-Za-z0-9Ñ](?<![-_])$/,
          "El nombre de usuario puede contener números, mayúsculas, minúsculas, '-' y '_'. No puede empezar ni terminar con '-' o '_'."
        )
        .required("El nombre de usuario es requerido"),
      fullName: Yup.string()
        .matches(
          /^[A-Za-zÀ-ÿ\s]+$/,
          "El nombre completo solo puede contener letras y espacios"
        )
        .required("El nombre completo es requerido"),
      dni: Yup.string()
        .matches(
          /^[A-Za-z0-9]+$/,
          "El DNI o NIE sólo puede contener números y letras"
        )
        .required("El DNI o NIE es requerido"),
      address: Yup.string()
        .matches(
          /^[A-Za-zÀ-ÿ\d\s,]+$/,
          "Dirección sólo admite letras, números, ',' y espacios"
        )
        .required("La dirección es requerida"),
      postal_code: Yup.string()
        .matches(
          /^\d{4,10}$/,
          "El código postal debe ser un número entre 4 y 10 dígitos."
        )
        .required("El código postal es requerido"),
      email: Yup.string()
        .matches(
          /^[A-Z0-9._%+-]+@[A-Z0-9-]+\.[A-Z]{2,}(?:\.[A-Z]{2,})*$/i,
          "Formato de email inválido"
        )
        .required("El email es requerido"),
      telephone: Yup.string()
        .matches(
          /^\d{9,15}$/,
          "El teléfono solo puede contener entre 9 y 15 números"
        )
        .required("El teléfono es requerido"),
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
        .required("La confirmación de la contraseña es requerida"),
    }),

    onSubmit: async (values) => {
      try {
        const [name, firstname, ...lastnameArray] = values.fullName.split(" ");
        const lastname = lastnameArray.join(" ");

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
              name,
              firstname,
              lastname,
              email: values.email,
              telephone: values.telephone,
              dni: values.dni,
              address: values.address,
              cp: values.postal_code,
              created_at: new Date().toISOString().split("T")[0],
              updated_at: new Date().toISOString().split("T")[0],
            }),
          }
        );

        const data = await response.json();

        if (response.status === 201) {
          toast.success("Usuario registrado con éxito."); //; Notificación de éxito
        } else {
          toast.error("Error al registrar el usuario: " + data.message); //; Notificación de error
        }
      } catch (error) {
        toast.error("Error al registrar el usuario: " + error.message); //; Notificación de error
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
        <label
          htmlFor="rol"
          className={`form-label ${
            formik.touched.rol && formik.errors.rol ? "required" : ""
          }`}
        >
          Rol
        </label>
        <select
          id="rol"
          name="rol"
          className={`form-input ${
            formik.touched.rol && formik.errors.rol ? "input-error" : ""
          }`}
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
          <div className="error-message">{formik.errors.rol}</div>
        ) : null}
      </div>

      {/* Campo de Nombre de Usuario */}
      <div className="form-group">
        <label
          htmlFor="username"
          className={`form-label ${
            formik.touched.username && formik.errors.username ? "required" : ""
          }`}
        >
          Nombre de usuario
        </label>
        <input
          type="text"
          id="username"
          name="username"
          className={`form-input ${
            formik.touched.username && formik.errors.username
              ? "input-error"
              : ""
          }`}
          value={formik.values.username}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.username && formik.errors.username ? (
          <div className="error-message">{formik.errors.username}</div>
        ) : null}
      </div>

      {/* Campo de Nombre Completo */}
      <div className="form-group">
        <label
          htmlFor="fullName"
          className={`form-label ${
            formik.touched.fullName && formik.errors.fullName ? "required" : ""
          }`}
        >
          Nombre Completo
        </label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          className={`form-input ${
            formik.touched.fullName && formik.errors.fullName
              ? "input-error"
              : ""
          }`}
          value={formik.values.fullName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.fullName && formik.errors.fullName ? (
          <div className="error-message">{formik.errors.fullName}</div>
        ) : null}
      </div>

      {/* Campo de DNI */}
      <div className="form-group">
        <label
          htmlFor="dni"
          className={`form-label ${
            formik.touched.dni && formik.errors.dni ? "required" : ""
          }`}
        >
          DNI / NIE / PASAPORTE
        </label>
        <input
          type="text"
          id="dni"
          name="dni"
          className={`form-input ${
            formik.touched.dni && formik.errors.dni ? "input-error" : ""
          }`}
          value={formik.values.dni}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.dni && formik.errors.dni ? (
          <div className="error-message">{formik.errors.dni}</div>
        ) : null}
      </div>

      {/* Campo de Dirección */}
      <div className="form-group">
        <label htmlFor="address" className="form-label required">
          Dirección
        </label>
        <input
          type="text"
          id="address"
          name="address"
          className={`form-input ${
            formik.touched.address && formik.errors.address ? "input-error" : ""
          }`}
          value={formik.values.address}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.address && formik.errors.address ? (
          <div className="error-message">{formik.errors.address}</div>
        ) : null}
      </div>

      {/* Campo de Código Postal */}
      <div className="form-group">
        <label htmlFor="postal_code" className="form-label required">
          Código Postal
        </label>
        <input
          type="text"
          id="postal_code"
          name="postal_code"
          className={`form-input ${
            formik.touched.postal_code && formik.errors.postal_code
              ? "input-error"
              : ""
          }`}
          value={formik.values.postal_code}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.postal_code && formik.errors.postal_code ? (
          <div className="error-message">{formik.errors.postal_code}</div>
        ) : null}
      </div>

      {/* Campo de Email */}
      <div className="form-group">
        <label htmlFor="email" className="form-label required">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          className={`form-input ${
            formik.touched.email && formik.errors.email ? "input-error" : ""
          }`}
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.email && formik.errors.email ? (
          <div className="error-message">{formik.errors.email}</div>
        ) : null}
      </div>

      {/* Campo de Teléfono */}
      <div className="form-group">
        <label htmlFor="telephone" className="form-label required">
          Teléfono
        </label>
        <input
          type="text"
          id="telephone"
          name="telephone"
          className={`form-input ${
            formik.touched.telephone && formik.errors.telephone
              ? "input-error"
              : ""
          }`}
          value={formik.values.telephone}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.telephone && formik.errors.telephone ? (
          <div className="error-message">{formik.errors.telephone}</div>
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
          className={`form-input ${
            formik.touched.password && formik.errors.password
              ? "input-error"
              : ""
          }`}
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.password && formik.errors.password ? (
          <div className="error-message">{formik.errors.password}</div>
        ) : null}
      </div>

      {/* Campo para Mostrar/Ocultar Contraseña */}
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

      {/* Campo de Confirmar Contraseña */}
      <div className="form-group">
        <label htmlFor="confirmPassword" className="form-label required">
          Confirmar Contraseña
        </label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          className={`form-input ${
            formik.touched.confirmPassword && formik.errors.confirmPassword
              ? "input-error"
              : ""
          }`}
          value={formik.values.confirmPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
          <div className="error-message">{formik.errors.confirmPassword}</div>
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
    </form>
  );
};

export default Form;
