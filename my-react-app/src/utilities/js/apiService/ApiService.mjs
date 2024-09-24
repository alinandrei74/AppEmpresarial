import Logger from "../../../../../backend/src/utils/logger";

/**
 * @typedef {Object} ApiResponse
 * @property {number} status - El código de estado HTTP.
 * @property {string} message - Mensaje descriptivo del resultado de la operación.
 * @property {Object} data - Datos devueltos desde el servidor.
 */

/**
 * Servicio centralizado para manejar todas las solicitudes al backend.
 */
class ApiService {
  static baseUrl = "http://localhost:3000"; // URL base del backend
  static _userToken = null; // Token de usuario opcional (privado)

  /**
   * Getter para obtener el token del usuario.
   * Si no se ha establecido, se obtiene del sessionStorage.
   */
  static get userToken() {
    return this._userToken || sessionStorage.getItem("authToken");
  }

  /**
   * Setter para establecer el token de usuario.
   * @param {string} token - Token de usuario
   */
  static set userToken(token) {
    this._userToken = token;
  }

  /**
   * URLs del backend agrupadas por entidades (con baseUrl agregada)
   */
  static urls = ApiService.addBaseUrl({
    auth: {
      //!### (register)
      register: "/api/auth/register", //!# ( Fixed return `res.data.data` )
      login: "/api/auth/login", //*#
      verify: "/api/auth/verify", //*#
    },
    users: {
      //*###
      getAll: "/api/users/all", //*#
      getById: (id) => `/api/users/user-profile/${id}`, //*#
      delete: (id) => `/api/users/${id}`, //*#
    },
    tasks: {
      //!### (create, update)
      getAll: "/api/tasks", //*#
      create: "/api/tasks", //*#
      update: (id) => `/api/tasks/${id}`, //!# ( Eliminar `completed_at` y `updated_at`)
      delete: (id) => `/api/tasks/${id}`, //!# ( Eliminar `updated_at`)
      getCompleted: (userId) => `/api/tasks/completed/${userId}`, //*#
    },
    notes: {
      //*###
      getAll: "/api/notes", //*#
      getById: (id) => `/api/notes/${id}`, //*#
      create: "/api/notes", //*#
      update: (id) => `/api/notes/${id}`, //*#
      delete: (id) => `/api/notes/${id}`, //*#
    },
    workSchedules: {
      getAll: "/api/work-schedules",
      getById: (id) => `/api/work-schedules/${id}`,
      create: "/api/work-schedules",
      update: (id) => `/api/work-schedules/${id}`,
      delete: (id) => `/api/work-schedules/${id}`,
    },
  });

  /**
   * Función para agregar baseUrl a cada ruta
   * @param {Object} urls - Objeto con rutas del API
   * @returns {Object} - Objeto con URLs completas
   */
  static addBaseUrl(urls) {
    const addPrefix = (url) =>
      typeof url === "function"
        ? (...args) => `${this.baseUrl}${url(...args)}`
        : `${this.baseUrl}${url}`;

    // Recorremos el objeto de URLs para agregar la baseUrl
    return Object.keys(urls).reduce((acc, key) => {
      if (typeof urls[key] === "object") {
        acc[key] = this.addBaseUrl(urls[key]); // Recurre si es un objeto anidado
      } else {
        acc[key] = addPrefix(urls[key]); // Agrega el prefijo
      }
      return acc;
    }, {});
  }

  /**
   * Realiza una solicitud genérica al backend.
   * @private
   * @param {string} url - La URL del recurso.
   * @param {string} method - El método HTTP (GET, POST, PUT, DELETE).
   * @param {Object} [body] - El cuerpo de la solicitud (opcional).
   * @returns {Promise<ApiResponse>} - Objeto con el estado, mensaje y datos de la respuesta.
   */
  static async request(url, method, body = null) {
    try {
      const token = this.userToken;
      // Logger.information(`userToken: {${token}}`);

      if (!token && method !== "GET") {
        throw new Error("No autorizado: se requiere autenticación.");
      }

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: body ? JSON.stringify(body) : null,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Error en la solicitud.");
      }

      return {
        status: response.status,
        message: result.message,
        data: result.data,
      };
    } catch (error) {
      console.error("Error en la solicitud:", error);
      return {
        status: 500,
        message: error.message,
        data: null,
      };
    }
  }

  /**
   * Realiza una solicitud GET al backend.
   * @param {string} url - La URL del recurso.
   * @returns {Promise<ApiResponse>} - Objeto con el estado, mensaje y datos de la respuesta.
   */
  static async get(url) {
    return this.request(url, "GET");
  }

  /**
   * Realiza una solicitud POST al backend.
   * @param {string} url - La URL del recurso.
   * @param {Object} body - El cuerpo de la solicitud.
   * @returns {Promise<ApiResponse>} - Objeto con el estado, mensaje y datos de la respuesta.
   */
  static async post(url, body) {
    return this.request(url, "POST", body);
  }

  /**
   * Realiza una solicitud PUT al backend.
   * @param {string} url - La URL del recurso.
   * @param {Object} body - El cuerpo de la solicitud.
   * @returns {Promise<ApiResponse>} - Objeto con el estado, mensaje y datos de la respuesta.
   */
  static async put(url, body) {
    return this.request(url, "PUT", body);
  }

  /**
   * Realiza una solicitud DELETE al backend.
   * @param {string} url - La URL del recurso.
   * @returns {Promise<ApiResponse>} - Objeto con el estado, mensaje y datos de la respuesta.
   */
  static async delete(url) {
    return this.request(url, "DELETE");
  }

  // Métodos específicos para diferentes entidades:

  /**
   * Registra un nuevo usuario.
   * @param {Object} user - Datos del usuario.
   * @returns {Promise<ApiResponse>} - Respuesta del backend.
   */
  static async registerUser(user) {
    const body = this.transformUserData(user);
    return this.post(this.urls.auth.register, body);
  }

  /**
   * Transforma los datos del usuario para que coincidan con el formato esperado por el backend.
   * @param {Object} user - Datos del usuario.
   * @returns {Object} - Datos transformados.
   */
  static transformUserData(user) {
    const [name, firstname, ...lastnameArray] = user.fullName.split(" ");
    const lastname = lastnameArray.join(" ");
    return {
      username: user.username,
      password: user.password,
      role: user.role.toLowerCase(),
      name,
      firstname,
      lastname,
      email: user.email,
      telephone: user.telephone,
      dni: user.dni,
      address: user.address,
      cp: user.postal_code,
      created_at: new Date().toISOString().split("T")[0],
      updated_at: new Date().toISOString().split("T")[0],
    };
  }
}

export default ApiService;
