// Importaciones necesarias
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./components/RegisterCss.css"; 
import { registerUser } from "../../../../backend/src/services/authService"; 

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      rol: "",
      username: "",
      name: "",
      firstName: "",
      lastName: "",
      dni: "",
      email: "",
      telephone: "",
      address: "",
      cp: "",
      password: "",
      confirmPassword: "", // nuevo campo
    },

    validationSchema: Yup.object({
      rol: Yup.string()
        .oneOf(['Limpieza', 'Admin', 'Entrega', 'Mantenimiento'], 'Rol inválido')
        .required("Requerido"),

      username: Yup.string()
        .min(5, "El nombre de usuario debe tener mínimo 5 caracteres")
        .max(20, "El nombre de usuario debe tener máximo 20 caracteres")
        .matches(
          /^(?![-_])[A-Za-z0-9_-]*(?<![-_])$/,
          "El nombre de usuario puede contener números, mayúsculas, minúsculas y - y/o _ . No puede empezar ni terminar con _ ni con -"
        )
        .required("Requerido"),

      name: Yup.string()
        .matches(/^[A-Za-zÀ-ÿ\s]+$/, "El nombre solo puede contener letras y espacios")
        .required("Requerido"),

      firstName: Yup.string()
        .matches(/^[A-Za-zÀ-ÿ\s]+$/, "El primer nombre solo puede contener letras y espacios")
        .required("Requerido"),

      lastName: Yup.string()
        .matches(/^[A-Za-zÀ-ÿ\s]+$/, "El apellido solo puede contener letras y espacios")
        .required("Requerido"),

      dni: Yup.string()
        .matches(/^[A-Za-z0-9]+$/, "El DNI o NIE sólo puede contener números y letras")
        .required("Requerido"),

      email: Yup.string()
        .email("Formato de email inválido")
        .required("Requerido"),

      telephone: Yup.string()
        .matches(/^\d+$/, "El teléfono solo puede contener números")
        .required("Requerido"),

      address: Yup.string()
        .matches(
          /^[A-Za-zÀ-ÿ\d\s/.]+$/,
          "Dirección solo admite mayúsculas, minúsculas, números, ' / ' y ' . '"
        )
        .required("Requerido"),

      cp: Yup.string()
        .matches(/^\d+$/, "El código postal solo puede contener números")
        .required("Requerido"),

      password: Yup.string()
        .min(8, "La contraseña debe tener mínimo 8 caracteres")
        .max(30, "La contraseña debe tener máximo 30 caracteres")
        .matches(/[A-Z]/, "La contraseña debe contener al menos una letra mayúscula")
        .matches(/[a-z]/, "La contraseña debe contener al menos una letra minúscula")
        .matches(/\d/, "La contraseña debe contener al menos un número")
        .matches(/[\W_]/, "La contraseña debe contener al menos un símbolo")
        .required("Requerido"),

      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Las contraseñas deben coincidir")
        .required("Requerido"),
    }),

    onSubmit: async (values) => {
      try {
        const response = await registerUser(values);
        alert('Usuario registrado con éxito');
        console.log('Respuesta del servidor:', response);
      } catch (error) {
        alert('Error en el registro');
      }
    },
  });

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="register-container">
      <form onSubmit={formik.handleSubmit} className="formRegister">
        {/* Campos del formulario */}
        <div>
          <label htmlFor="rol" className="required">Rol</label>
          <select
            id="rol"
            name="rol"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.rol}
          >
            <option value="" label="Seleccione un rol" />
            <option value="Limpieza" label="Limpieza" />
            <option value="Admin" label="Admin" />
            <option value="Entrega" label="Entrega" />
            <option value="Mantenimiento" label="Mantenimiento" />
          </select>
          {formik.touched.rol && formik.errors.rol ? (
            <div>{formik.errors.rol}</div>
          ) : null}
        </div>

        <div>
          <label htmlFor="username" className="required">Nombre de usuario</label>
          <input
            id="username"
            name="username"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.username}
          />
          {formik.touched.username && formik.errors.username ? (
            <div>{formik.errors.username}</div>
          ) : null}
        </div>

        <div>
          <label htmlFor="name" className="required">Nombre</label>
          <input
            id="name"
            name="name"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
          />
          {formik.touched.name && formik.errors.name ? (
            <div>{formik.errors.name}</div>
          ) : null}
        </div>

        <div>
          <label htmlFor="firstName" className="required">Primer apellido</label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.firstName}
          />
          {formik.touched.firstName && formik.errors.firstName ? (
            <div>{formik.errors.firstName}</div>
          ) : null}
        </div>

        <div>
          <label htmlFor="lastName" className="required">Segundo apellido</label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.lastName}
          />
          {formik.touched.lastName && formik.errors.lastName ? (
            <div>{formik.errors.lastName}</div>
          ) : null}
        </div>

        <div>
          <label htmlFor="dni" className="required">DNI / NIE / PASAPORTE</label>
          <input
            id="dni"
            name="dni"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.dni}
          />
          {formik.touched.dni && formik.errors.dni ? (
            <div>{formik.errors.dni}</div>
          ) : null}
        </div>

        <div>
          <label htmlFor="email" className="required">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
          />
          {formik.touched.email && formik.errors.email ? (
            <div>{formik.errors.email}</div>
          ) : null}
        </div>

        <div>
          <label htmlFor="telephone" className="required">Teléfono</label>
          <input
            id="telephone"
            name="telephone"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.telephone}
          />
          {formik.touched.telephone && formik.errors.telephone ? (
            <div>{formik.errors.telephone}</div>
          ) : null}
        </div>

        <div>
          <label htmlFor="address" className="required">Dirección</label>
          <input
            id="address"
            name="address"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.address}
          />
          {formik.touched.address && formik.errors.address ? (
            <div>{formik.errors.address}</div>
          ) : null}
        </div>

        <div>
          <label htmlFor="cp" className="required">Código Postal</label>
          <input
            id="cp"
            name="cp"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.cp}
          />
          {formik.touched.cp && formik.errors.cp ? (
            <div>{formik.errors.cp}</div>
          ) : null}
        </div>

        <div>
          <label htmlFor="password" className="required">Contraseña</label>
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
          />
          <button type="button" onClick={toggleShowPassword}>
            {showPassword ? "Ocultar" : "Mostrar"}
          </button>
          {formik.touched.password && formik.errors.password ? (
            <div>{formik.errors.password}</div>
          ) : null}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="required">Confirmar Contraseña</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.confirmPassword}
          />
          <button type="button" onClick={toggleShowConfirmPassword}>
            {showConfirmPassword ? "Ocultar" : "Mostrar"}
          </button>
          {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
            <div>{formik.errors.confirmPassword}</div>
          ) : null}
        </div>

        <button type="submit" className="lastButton">Enviar</button>
      </form>
    </div>
  );
}

export default Register;
