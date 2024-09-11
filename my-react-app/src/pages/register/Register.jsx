import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./components/RegisterCss.css";

//; Función simulada para crear un nuevo usuario (simula una API)
const createUser = async (userData) => {
  //; Simulación de una llamada API con validación simple
  return new Promise((resolve) => {
    setTimeout(() => {
      if (userData.username === "existe") {
        resolve({
          status: 400,
          message: "El nombre de usuario ya está en uso.",
        });
      } else {
        resolve({ status: 201, message: "Usuario creado exitosamente." });
      }
    }, 1000);
  });
};

function Register() {
  const [showPassword, setShowPassword] = useState(false);

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
      confirmPassword: "", //; Nuevo campo
    },

    validationSchema: Yup.object({
      rol: Yup.string()
        .oneOf(
          ["Limpieza", "Admin", "Entrega", "Mantenimiento"],
          "Rol inválido"
        )
        .required("Requerido"),
      username: Yup.string()
        .min(3, "El nombre de usuario debe tener mínimo 3 caracteres")
        .max(20, "El nombre de usuario debe tener máximo 20 caracteres")
        .matches(
          /^(?![-_])[A-Za-z0-9Ñ_-]{1,18}[A-Za-z0-9Ñ](?<![-_])$/,
          "El nombre de usuario puede contener números, mayúsculas, minúsculas, '-' y '_'. No puede empezar ni terminar con '-' o '_'."
        )
        .required("Requerido"),
      name: Yup.string()
        .matches(
          /^[A-Za-zÀ-ÿ\s]+$/,
          "El nombre solo puede contener letras y espacios"
        )
        .required("Requerido"),
      firstName: Yup.string()
        .matches(
          /^[A-Za-zÀ-ÿ\s]+$/,
          "El primer nombre solo puede contener letras y espacios"
        )
        .required("Requerido"),
      lastName: Yup.string()
        .matches(
          /^[A-Za-zÀ-ÿ\s]+$/,
          "El apellido solo puede contener letras y espacios"
        )
        .required("Requerido"),
      dni: Yup.string()
        .matches(
          /^[A-Za-z0-9]+$/,
          "El DNI o NIE sólo puede contener números y letras"
        )
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
          "Dirección sólo admite mayúsculas, minúsculas, números, '/' y '.' "
        )
        .required("Requerido"),
      cp: Yup.string()
        .matches(/^\d+$/, "El código postal solo puede contener números")
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
        .matches(
          /[@$!%*?&.#]/,
          "La contraseña debe contener al menos un símbolo especial"
        )
        .required("Requerido"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Las contraseñas no coinciden")
        .required("Requerido"),
    }),

    onSubmit: async (values) => {
      const response = await createUser(values);
      alert(response.message); //; Simulación de manejo de respuesta
    },
  });

  return (
    <>
      <form onSubmit={formik.handleSubmit} className="formRegister">
        {/* Otros campos del formulario */}
        {/* Campo de contraseña */}
        <div>
          <label htmlFor="password" className="required">
            Contraseña{" "}
          </label>
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
          />
          {formik.touched.password && formik.errors.password ? (
            <div>{formik.errors.password}</div>
          ) : null}
          <button type="button" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? "Ocultar Contraseña" : "Mostrar Contraseña"}
          </button>
        </div>
        {/* Confirmar contraseña */}
        <div>
          <label htmlFor="confirmPassword" className="required">
            Confirmar Contraseña{" "}
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={showPassword ? "text" : "password"}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.confirmPassword}
          />
          {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
            <div>{formik.errors.confirmPassword}</div>
          ) : null}
        </div>
        <button type="submit" className="lastButton">
          Enviar
        </button>
      </form>
    </>
  );
}

export default Register;
