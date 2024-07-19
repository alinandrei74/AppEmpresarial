/**
 * Clase para manejar los datos de los usuarios utilizando una API.
 */
class UserManager {
  #users = null;

  // Instancia singleton
  static instance;

  /**
   * Constructor de la clase UserManager.
   */
  constructor(apiEndpoint) {
    if (UserManager.instance) {
      return UserManager.instance;
    }

    this.apiEndpoint = apiEndpoint;
    this.#loadUsers();
    UserManager.instance = this;
  }

  /**
   * Carga los datos de los usuarios desde la API.
   * @private
   */
  async #loadUsers() {
    try {
      const response = await fetch(`${this.apiEndpoint}/users`);
      if (!response.ok) {
        throw new Error("Error al cargar los usuarios");
      }
      this.#users = await response.json();
    } catch (error) {
      console.error("Error al cargar los usuarios:", error);
      this.#users = [];
    }
  }

  /**
   * Guarda los datos de los usuarios en la API.
   * @private
   */
  async #saveUsers() {
    try {
      const response = await fetch(`${this.apiEndpoint}/users`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(this.#users, null, 2),
      });
      if (!response.ok) {
        throw new Error("Error al guardar los usuarios");
      }
    } catch (error) {
      console.error("Error al guardar los usuarios:", error);
    }
  }

  /**
   * Agrega un nuevo usuario a la lista.
   * @param {Object} user - Objeto usuario.
   * @param {string} user.username - Nombre de usuario.
   * @param {string} user.password - Contraseña.
   * @param {string} user.rol - Rol del usuario.
   * @param {string} user.name - Nombre.
   * @param {string} user.firstSurname - Primer apellido.
   * @param {string} user.secondSurname - Segundo apellido.
   * @param {string} user.email - Correo electrónico.
   * @param {string} user.phone - Teléfono.
   * @param {string} user.dni - DNI.
   * @param {string} user.address - Dirección.
   * @param {string} user.postalCode - Código postal.
   */
  async addUser(user) {
    this.#users.push(user);
    await this.#saveUsers();
  }

  /**
   * Elimina un usuario de la lista por su nombre de usuario.
   * @param {string} username - Nombre de usuario.
   */
  async deleteUser(username) {
    this.#users = this.#users.filter((user) => user.username !== username);
    await this.#saveUsers();
  }

  /**
   * Actualiza los datos de un usuario.
   * @param {string} username - Nombre de usuario.
   * @param {Object} newUserData - Nuevos datos del usuario.
   */
  async updateUser(username, newUserData) {
    const index = this.#users.findIndex((user) => user.username === username);
    if (index !== -1) {
      this.#users[index] = { ...this.#users[index], ...newUserData };
      await this.#saveUsers();
    }
  }

  /**
   * Busca un usuario por su nombre de usuario.
   * @param {string} username - Nombre de usuario.
   * @returns {Object|null} El usuario encontrado o null si no existe.
   */
  findUser(username) {
    return this.#users.find((user) => user.username === username) || null;
  }

  /**
   * Obtiene la lista de todos los usuarios.
   * @returns {Array} Lista de usuarios.
   */
  getAllUsers() {
    return this.#users;
  }
}

// Ejemplo de uso:
const userManager = new UserManager("https://api.example.com");

// Agregar un nuevo usuario
userManager.addUser({
  username: "NuevoUsuario",
  password: "password",
  rol: "user",
  name: "Nuevo",
  firstSurname: "Usuario",
  secondSurname: "Ejemplo",
  email: "nuevo@example.com",
  phone: "5678901234",
  dni: "567890123E",
  address: "123 Nueva St",
  postalCode: "56789",
});

// Eliminar un usuario
userManager.deleteUser("Limpieza");

// Actualizar un usuario
userManager.updateUser("Entrega", { email: "newemail@example.com" });

// Buscar un usuario
const foundUser = userManager.findUser("Admin");

// Obtener todos los usuarios
const allUsers = userManager.getAllUsers();

console.log(allUsers);
