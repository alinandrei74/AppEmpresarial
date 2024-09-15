//;############################################################################################
//*---(configuracion de los Modulos)-------
//;############################################################################################

//todo---(Configurations)-------
/**
 *1/ Clase base que gestiona las configuraciones comunes para los módulos.
 * Esta clase no puede ser instanciada.
 */
class Configurations {
  /**
   * La configuración privada de omisión de errores por defecto.
   * @private
   */
  static _skipErrors = { value: false, return: undefined };

  constructor() {
    throw new Error("Esta clase no puede ser instanciada.");
  }

  /**
   * Obtiene la configuración actual de omisión de errores.
   * @returns {Object} - La configuración de omisión de errores.
   */
  static get skipErrors() {
    return this._skipErrors;
  }

  /**
   * Configura si los errores deben omitirse.
   * @param {boolean} value - `true` para omitir errores, `false` para no omitirlos.
   * @throws {Error} - Lanza un error si el valor no es booleano.
   */
  static set skipErrors(value) {
    if (typeof value !== "boolean") {
      throw new Error("El valor debe ser booleano.");
    }
    this._skipErrors.value = value;
  }

  /**
   * Configura el valor a retornar cuando se omiten errores.
   * @param {*} returnValue - El valor a retornar.
   */
  static set skipErrorsReturn(value) {
    this._skipErrors.return = value;
  }

  /**
   ** Maneja errores lanzando una excepción o retornando un valor configurado si se deben omitir.
   * @param {string} message - El mensaje del error.
   * @returns {*} - El valor configurado a retornar si se omiten los errores.
   * @throws {Error} - Lanza una excepción si los errores no deben omitirse.
   * @private
   * @example
   * try {
   *   Configurations.handleError("Error de prueba");
   * } catch (e) {
   *   console.error(e.message); // "Error de prueba"
   * }
   */
  static _handleError(message) {
    if (this._skipErrors.value) {
      console.warn(`Error (Omitido): ${message}`);
      return this._skipErrors.return;
    } else {
      throw new Error(message);
    }
  }
}

//;############################################################################################
//*---(Tests)-------
//;############################################################################################

//todo---(Test1)-------
/**
 *2/ Clase de ejemplo que hereda de Configurations.
 * Solo se puede usar de manera estática, no se puede instanciar.
 */
class Test1 extends Configurations {
  /////////////////////////////////////////
  //? CONFIGURACION INDIVIDUAL POR DEFECTO:

  /**
   * La configuración privada de omisión de errores.
   * @private
   */
  static _skipErrors = { value: false, return: "Error" };

  /////////////////////////////////////////
  //? METODOS ESTATICOS:

  /**
   ** Función de prueba de configuraciones.
   * @param {boolean} [isError=false] - Indica si debe simular un error.
   * @returns {*} - Resultado de la prueba o el valor configurado si se omiten errores.
   * @example
   * console.log(Test1.fnTest(true));  // Output: "Valor por defecto Test1"
   * Test1.fnTest(false);  // Output: "Ningún Error Detectado en Test1", "Fin de la Función de Test1"
   */
  static fnTest(isError = false) {
    if (isError) {
      return this._handleError("Error Detectado en Test1");
    } else {
      console.info("Ningún Error Detectado en Test1");
      console.log("Fin de la Función de Test1");
    }
  }
}

//;############################################################################################
//*---(Modulos)-------
//;############################################################################################

//todo---(DOM)-------
/**
 * Clase que proporciona utilidades sobre el DOM.
 * Solo se puede usar de manera estática, no se puede instanciar.
 */
class DOM extends Configurations {
  /////////////////////////////////////////
  //? CONFIGURACION INDIVIDUAL POR DEFECTO:

  /**
   * La configuración privada de omisión de errores.
   * @private
   */
  static _skipErrors = { value: false, return: undefined };

  /////////////////////////////////////////
  //? METODOS ESTATICOS:

  /**
   ** Espera a que un elemento esté disponible en el DOM.
   * @param {string} selector - El selector del elemento a esperar.
   * @param {number} [timeout=5000] - El tiempo máximo de espera en milisegundos.
   * @returns {Promise<Element>} - Una promesa que se resuelve con el elemento DOM.
   * @example
   * // Espera a que un elemento con id 'myElement' esté disponible en el DOM.
   * DOM.waitForElement('#myElement', 3000)
   *   .then(element => console.log('Elemento encontrado:', element))
   *   .catch(error => console.error(error));
   */
  static waitForElement(selector, timeout = 5000) {
    if (typeof selector !== "string") {
      return this._handleError("El selector debe ser una cadena de texto.");
    }
    if (typeof timeout !== "number" || timeout <= 0) {
      return this._handleError(
        "El tiempo de espera debe ser un número positivo."
      );
    }

    return new Promise((resolve, reject) => {
      const interval = 100;
      let elapsed = 0;
      const checkInterval = setInterval(() => {
        const element = document.querySelector(selector);
        if (element) {
          clearInterval(checkInterval);
          resolve(element);
        } else if (elapsed >= timeout) {
          clearInterval(checkInterval);
          reject(
            this._handleError(
              `El elemento '${selector}' no se encontró en el DOM.`
            )
          );
        }
        elapsed += interval;
      }, interval);
    });
  }

  /**
   ** Guarda los datos en sessionStorage.
   * @param {string} key - La clave bajo la cual se almacenarán los datos.
   * @param {any} value - El valor a almacenar.
   * @example
   * // Guarda un objeto en sessionStorage.
   * DOM.saveToSessionStorage('user', { name: 'Juan', age: 30 });
   */
  static saveToSessionStorage(key, value) {
    if (typeof key !== "string") {
      this._handleError("La clave debe ser una cadena de texto.");
    }

    sessionStorage.setItem(key, JSON.stringify(value));
    console.log(`'${key}' Guardado en el SessionStorage`);
  }

  /**
   ** Obtiene los datos de sessionStorage.
   * @param {string} key - La clave bajo la cual se almacenaron los datos.
   * @param {number} [timeout] - El tiempo máximo de espera en milisegundos. Si no está definido, se obtiene el valor instantáneamente.
   * @returns {object|null|Promise<object|null>} - El valor almacenado o null si no se encuentra, o una promesa si se define un tiempo de espera.
   * @example
   * // Obtiene un objeto de sessionStorage.
   * const user = DOM.getFromSessionStorage('user');
   * console.log(user); // { name: 'Juan', age: 30 } o null
   *
   * // Obtiene un objeto de sessionStorage con tiempo de espera.
   * DOM.getFromSessionStorage('user', 3000).then(user => {
   *   console.log(user); // { name: 'Juan', age: 30 } o null
   * });
   */
  static getFromSessionStorage(key, timeout) {
    if (typeof key !== "string") {
      return this._handleError("La clave debe ser una cadena de texto.");
    }

    if (timeout === undefined) {
      const value = sessionStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } else if (typeof timeout !== "number" || timeout < 0) {
      return this._handleError(
        "El tiempo de espera debe ser un número positivo."
      );
    }

    return new Promise((resolve) => {
      const interval = 100;
      let elapsed = 0;
      const checkInterval = setInterval(() => {
        const value = sessionStorage.getItem(key);
        if (value) {
          clearInterval(checkInterval);
          resolve(JSON.parse(value));
        } else if (elapsed >= timeout) {
          clearInterval(checkInterval);
          resolve(null);
        }
        elapsed += interval;
      }, interval);
    });
  }

  /**
   ** Guarda los datos en localStorage.
   * @param {string} key - La clave bajo la cual se almacenarán los datos.
   * @param {any} value - El valor a almacenar.
   * @example
   * // Guarda un objeto en localStorage.
   * DOM.saveToLocalStorage('settings', { theme: 'dark', language: 'es' });
   */
  static saveToLocalStorage(key, value) {
    if (typeof key !== "string") {
      this._handleError("La clave debe ser una cadena de texto.");
    }

    localStorage.setItem(key, JSON.stringify(value));
    console.log(`'${key}' Guardado en el LocalStorage`);
  }

  /**
   ** Obtiene los datos de localStorage.
   * @param {string} key - La clave bajo la cual se almacenaron los datos.
   * @param {number} [timeout] - El tiempo máximo de espera en milisegundos. Si no está definido, se obtiene el valor instantáneamente.
   * @returns {object|null|Promise<object|null>} - El valor almacenado o null si no se encuentra, o una promesa si se define un tiempo de espera.
   * @example
   * // Obtiene un objeto de localStorage.
   * const settings = DOM.getFromLocalStorage('settings');
   * console.log(settings); // { theme: 'dark', language: 'es' } o null
   *
   * // Obtiene un objeto de localStorage con tiempo de espera.
   * DOM.getFromLocalStorage('settings', 3000).then(settings => {
   *   console.log(settings); // { theme: 'dark', language: 'es' } o null
   * });
   */
  static getFromLocalStorage(key, timeout) {
    if (typeof key !== "string") {
      return this._handleError("La clave debe ser una cadena de texto.");
    }

    if (timeout === undefined) {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } else if (typeof timeout !== "number" || timeout < 0) {
      return this._handleError(
        "El tiempo de espera debe ser un número positivo."
      );
    }

    return new Promise((resolve) => {
      const interval = 100;
      let elapsed = 0;
      const checkInterval = setInterval(() => {
        const value = localStorage.getItem(key);
        if (value) {
          clearInterval(checkInterval);
          resolve(JSON.parse(value));
        } else if (elapsed >= timeout) {
          clearInterval(checkInterval);
          resolve(null);
        }
        elapsed += interval;
      }, interval);
    });
  }
}

//todo---(String)-------
/**
 * Clase que proporciona utilidades para la manipulación de cadenas de texto.
 * Solo se puede usar de manera estática, no se puede instanciar.
 */
class Str extends Configurations {
  /////////////////////////////////////////
  //? CONFIGURACION INDIVIDUAL POR DEFECTO:

  /**
   * La configuración privada de omisión de errores.
   * @private
   */
  static _skipErrors = { value: false, return: "" };

  /////////////////////////////////////////
  //? METODOS ESTATICOS:

  /**
   ** Capitaliza la primera letra de una cadena.
   * @param {string} string - La cadena a capitalizar.
   * @returns {string} - La cadena con la primera letra en mayúscula.
   * @example
   * // Capitaliza la primera letra de la cadena.
   * const capitalized = Str.capitalize('hello world');
   * console.log(capitalized); // 'Hello world'
   */
  static capitalize(string) {
    if (typeof string !== "string") {
      return this._handleError("El argumento debe ser una cadena de texto.");
    }
    if (string.length === 0) {
      return "";
    }

    string = string.toLowerCase();
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  /**
   ** Formatea un string para que sea un nombre válido de variable.
   * Reemplaza los caracteres no válidos y aplica las reglas necesarias.
   * @param {string} input - El string a formatear.
   * @returns {string} - El string formateado como un nombre de variable válido.
   * @example
   * // Formatea una cadena para que sea un nombre de variable válido.
   * const formatted = Str.formatAsVariableName('-3hello world-');
   * console.log(formatted); // '_3helloWorld_'
   *"Hello-world
   * // Formatea una cadena para que sea un nombre de variable válido.
   * const formatted = Str.formatAsVariableName('123&foo-bar');
   * console.log(formatted); // '_123foo_bar'
   */
  static formatAsVariableName(input) {
    if (typeof input !== "string") {
      return this._handleError("El argumento debe ser una cadena de texto.");
    }

    const validChars =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_";
    let formattedString = "";

    for (let i = 0; i < input.length; i++) {
      let char = input[i];

      if (char === "-") {
        formattedString += "_";
      } else if (char === " ") {
        if (i + 1 < input.length && /[a-zA-Z]/.test(input[i + 1])) {
          formattedString += input[++i].toUpperCase();
        }
      } else if (validChars.includes(char)) {
        formattedString += char;
      }
    }

    if (/^[0-9]/.test(formattedString)) {
      formattedString = "_" + formattedString;
    }

    return formattedString;
  }

  /**
   ** Reemplaza los caracteres específicos por una cadena de texto.
   * @param {string} input - El string a formatear.
   * @param {string} [charsToReplace=" "] - Los caracteres que se reemplazarán.
   * @param {string} [replacement=""] - La cadena que reemplazará los caracteres especificados.
   * @param {boolean} [caseSensitive=true] - Si la operación debe ser sensible a mayúsculas y minúsculas.
   * @returns {string} - El string con los caracteres reemplazados.
   * @example
   * // Reemplaza los caracteres especificados por una cadena de texto.
   * const string = Str.replaceChars("Hello-world JS", "- ", "_");
   * console.log(string); // 'Hello_world_JS'
   *
   * // Reemplaza los caracteres especificados por una cadena de texto.
   * const string = Str.replaceChars(`"Hello 'world' JS"`, `"'`, "");
   * console.log(string); // 'Hello world JS'
   */
  static replaceChars(
    input,
    charsToReplace = " ",
    replacement = "",
    caseSensitive = true
  ) {
    if (
      typeof input !== "string" ||
      typeof charsToReplace !== "string" ||
      typeof replacement !== "string"
    ) {
      return th._handleError(
        "Todos los parámetros deben ser cadenas de texto."
      );
    }

    // Escapar caracteres especiales para uso en RegExp
    const escapeRegExp = (string) =>
      string.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");

    let formattedString = input;
    const flags = caseSensitive ? "g" : "gi";

    for (const char of charsToReplace) {
      const regex = new RegExp(escapeRegExp(char), flags);
      formattedString = formattedString.replace(regex, replacement);
    }

    return formattedString;
  }

  /**
   ** Reemplaza todos los caracteres excepto los especificados por una cadena de texto.
   * @param {string} input - El string a formatear.
   * @param {string} [charsToKeep=" "] - Los caracteres que no se reemplazarán.
   * @param {string} [replacement=""] - La cadena que reemplazará los caracteres no especificados.
   * @param {boolean} [caseSensitive=true] - Si la operación debe ser sensible a mayúsculas y minúsculas.
   * @returns {string} - El string con los caracteres reemplazados.
   * @example
   * // Reemplaza todos los caracteres excepto los especificados por una cadena de texto.
   * const string = Str.replaceExceptChars("1º H-W JS", "SJ", " ");
   * console.log(string); // '       JS'
   *
   * // Reemplaza todos los caracteres excepto los especificados por una cadena de texto.
   * const string = Str.replaceExceptChars("2º  H-W JS", "SJ", "");
   * console.log(string); // 'JS'
   */
  static replaceExceptChars(
    input,
    charsToKeep = "",
    replacement = "",
    caseSensitive = true
  ) {
    if (
      typeof input !== "string" ||
      typeof charsToKeep !== "string" ||
      typeof replacement !== "string"
    ) {
      return th._handleError(
        "Todos los parámetros deben ser cadenas de texto."
      );
    }

    // Escapar caracteres especiales para uso en RegExp
    const escapeRegExp = (string) =>
      string.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");

    // Crear una expresión regular para coincidir con todos los caracteres excepto los especificados
    const flags = caseSensitive ? "g" : "gi";
    const regex = new RegExp(`[^${escapeRegExp(charsToKeep)}]`, flags);

    // Reemplazar todos los caracteres no especificados
    const formattedString = input.replace(regex, replacement);

    return formattedString;
  }
}

//todo---(Number)-------
/**
 * Clase que proporciona utilidades para la manipulación de Numeros.
 * Solo se puede usar de manera estática, no se puede instanciar.
 */
class Num extends Configurations {
  /////////////////////////////////////////
  //? CONFIGURACION INDIVIDUAL POR DEFECTO:

  /**
   * La configuración privada de omisión de errores.
   * @private
   */
  static _skipErrors = { value: false, return: NaN };

  /////////////////////////////////////////
  //? METODOS ESTATICOS:

  /**
   ** Genera un número aleatorio entre un rango dado.
   * @param {number} min - El valor mínimo del rango.
   * @param {number} max - El valor máximo del rango.
   * @param {boolean} [isDecimal=false] - Indica si se debe devolver un número decimal.
   * @returns {number} - El número aleatorio generado.
   * @example
   * // Genera un número entero aleatorio entre 1 y 10.
   * const randomInt = Num.getRandomNum(1, 10);
   * console.log(randomInt); // Un número entre 1 y 10
   *
   * // Genera un número decimal aleatorio entre 1 y 10.
   * const randomDecimal = Num.getRandomNum(1, 10, true);
   * console.log(randomDecimal); // Un número decimal entre 1 y 10
   */
  static getRandomNum(min, max, isDecimal = false) {
    if (typeof min !== "number" || typeof max !== "number") {
      return this._handleError(
        "Los valores mínimo y máximo deben ser números."
      );
    }
    if (min >= max) {
      return this._handleError(
        "El valor mínimo debe ser menor que el valor máximo."
      );
    }

    if (isDecimal) {
      return Math.random() * (max - min) + min;
    } else {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1) + min);
    }
  }
}

//todo---(Boolean)-------
/**
 * Clase que proporciona utilidades para la manipulación de Booleanos.
 * Solo se puede usar de manera estática, no se puede instanciar.
 */
class Bool extends Configurations {
  /////////////////////////////////////////
  //? CONFIGURACION INDIVIDUAL POR DEFECTO:

  /**
   * La configuración privada de omisión de errores.
   * @private
   */
  static _skipErrors = { value: false, return: null };

  /////////////////////////////////////////
  //? METODOS ESTATICOS:

  /**
   ** Función para calcular una probabilidad y devolver un resultado booleano.
   * @param {number} probabilityPercentage - El porcentaje de probabilidad de que el resultado sea true (de 0 a 100).
   * @returns {boolean} - true si el resultado está dentro del rango de probabilidad, de lo contrario, false.
   * @example
   * // Calcula la probabilidad de 70% de que el resultado sea true.
   * const result = Bool.isProbable(70);
   * console.log(result); // true o false
   */
  static isProbable(probabilityPercentage) {
    if (typeof probabilityPercentage !== "number") {
      return this._handleError(
        "El porcentaje de probabilidad debe ser un número."
      );
    }
    if (probabilityPercentage < 0 || probabilityPercentage > 100) {
      return this._handleError(
        "El porcentaje de probabilidad debe estar entre 0 y 100."
      );
    }

    const randomNumber = Math.random() * 100;
    return randomNumber <= probabilityPercentage;
  }
}

//todo---(Array)-------
/**
 * Clase que proporciona utilidades para la manipulación de Arrays.
 * Solo se puede usar de manera estática, no se puede instanciar.
 */
class Arr extends Configurations {
  /////////////////////////////////////////
  //? CONFIGURACION INDIVIDUAL POR DEFECTO:

  /**
   * La configuración privada de omisión de errores.
   * @private
   */
  static _skipErrors = { value: false, return: [] };

  /////////////////////////////////////////
  //? METODOS ESTATICOS:

  /**
   ** Recorta un array eliminando un número específico de elementos del inicio o del final.
   * @param {array} array - El array a recortar.
   * @param {number} num - El número de elementos a eliminar.
   * @param {boolean} [fromStart=true] - Indica si se deben eliminar los elementos desde el inicio (true) o desde el final (false).
   * @returns {array} - El array recortado.
   * @example
   * // Elimina los primeros 2 elementos del array.
   * const result = Arr.trimArray([1, 2, 3, 4, 5], 2);
   * console.log(result); // [3, 4, 5]
   *
   * // Elimina los últimos 3 elementos del array.
   * const result = Arr.trimArray([1, 2, 3, 4, 5], 3, false);
   * console.log(result); // [1, 2]
   */
  static trimArray(array, num, fromStart = true) {
    if (!Array.isArray(array)) {
      return this._handleError("El primer argumento debe ser un array.");
    }
    if (typeof num !== "number" || num < 0) {
      return this._handleError(
        "El segundo argumento debe ser un número positivo."
      );
    }
    if (typeof fromStart !== "boolean") {
      return this._handleError(
        "El tercer argumento debe ser un valor booleano."
      );
    }

    if (fromStart) {
      return array.slice(num);
    } else {
      return array.slice(0, -num);
    }
  }

  /**
   ** Recorta un array manteniendo un número específico de elementos y eliminando los demás,
   * ya sea desde el inicio o desde el final.
   * @param {array} array - El array a recortar.
   * @param {number} num - El número de elementos a mantener.
   * @param {boolean} [keepFromStart=true] - Indica si se deben mantener los elementos desde el inicio (true) o desde el final (false).
   * @returns {array} - El array recortado.
   * @example
   * // Mantiene los primeros 2 elementos del array.
   * const result = Arr.trimKeepArray([1, 2, 3, 4, 5], 2);
   * console.log(result); // [1, 2]
   *
   * // Mantiene los últimos 3 elementos del array.
   * const result = Arr.trimKeepArray([1, 2, 3, 4, 5], 3, false);
   * console.log(result); // [3, 4, 5]
   */
  static trimKeepArray(array, num, keepFromStart = true) {
    if (!Array.isArray(array)) {
      return this._handleError("El primer argumento debe ser un array.");
    }
    if (typeof num !== "number" || num < 0) {
      return this._handleError(
        "El segundo argumento debe ser un número positivo."
      );
    }
    if (typeof keepFromStart !== "boolean") {
      return this._handleError(
        "El tercer argumento debe ser un valor booleano."
      );
    }

    if (keepFromStart) {
      return array.slice(0, num);
    } else {
      return array.slice(-num);
    }
  }
}

//todo---(Object)-------
/**
 * Clase que proporciona utilidades para la manipulación de Objetos.
 * Solo se puede usar de manera estática, no se puede instanciar.
 */
class Obj extends Configurations {
  /////////////////////////////////////////
  //? CONFIGURACION INDIVIDUAL POR DEFECTO:

  /**
   * La configuración privada de omisión de errores.
   * @private
   */
  static _skipErrors = { value: false, return: {} };

  /////////////////////////////////////////
  //? METODOS ESTATICOS:

  //!!! Aun no hay metodos de tipo Objeto
}

//todo---(Other Utils)-------
/**
 * Clase que proporciona otras utilidades.
 * Solo se puede usar de manera estática, no se puede instanciar.
 */
class Utils extends Configurations {
  /////////////////////////////////////////
  //? CONFIGURACION INDIVIDUAL POR DEFECTO:

  /**
   * La configuración privada de omisión de errores.
   * @private
   */
  static _skipErrors = { value: false, return: null };

  /////////////////////////////////////////
  //? METODOS ESTATICOS:

  /**
   ** Realiza una copia profunda de un objeto o array utilizando JSON.
   * Nota: Esto no funciona con funciones o tipos especiales de objetos (como Date, RegExp, Map, Set).
   * Una copia profunda crea una copia completa de un objeto o array, incluyendo todos los niveles de objetos anidados.
   * @param {object|array} item - El objeto o array a copiar.
   * @returns {object|array} - La copia profunda del objeto o array.
   * @example
   * const original = { a: 1, b: { c: 3 } };
   * const copy = Utils.deepCopyJSON(original);
   * console.log(copy); // { a: 1, b: { c: 3 } }
   *
   * const arrOriginal = [1, [2, 3], { a: 4 }];
   * const arrCopy = Utils.deepCopyJSON(arrOriginal);
   * console.log(arrCopy); // [1, [2, 3], { a: 4 }]
   */
  static deepCopyJSON(item) {
    if (typeof item !== "object" || item === null) {
      return this._handleError("El argumento debe ser un objeto o un array.");
    }
    return JSON.parse(JSON.stringify(item));
  }

  /**
   ** Realiza una copia profunda de un objeto o array utilizando un método recursivo.
   * Maneja funciones y tipos especiales de objetos.
   * Una copia profunda crea una copia completa de un objeto o array, incluyendo todos los niveles de objetos anidados,
   * funciones y tipos especiales de objetos como Date, RegExp, Map y Set.
   * @param {object|array} item - El objeto o array a copiar.
   * @returns {object|array} - La copia profunda del objeto o array.
   * @example
   * const original = { a: 1, b: { c: 3, d: new Date() } };
   * const copy = Utils.deepCopyRecursive(original);
   * console.log(copy); // { a: 1, b: { c: 3, d: [Date object] } }
   *
   * const arrOriginal = [1, [2, 3], { a: 4, b: new Date() }];
   * const arrCopy = Utils.deepCopyRecursive(arrOriginal);
   * console.log(arrCopy); // [1, [2, 3], { a: 4, b: [Date object] }]
   */
  static deepCopyRecursive(item) {
    if (typeof item !== "object" || item === null) {
      return this._handleError("El argumento debe ser un objeto o un array.");
    }

    let copy;

    if (Array.isArray(item)) {
      copy = [];
      item.forEach((_, i) => {
        copy[i] = this.deepCopyRecursive(item[i]);
      });
    } else if (item instanceof Date) {
      copy = new Date(item.getTime());
    } else if (item instanceof RegExp) {
      copy = new RegExp(item);
    } else if (item instanceof Map) {
      copy = new Map();
      item.forEach((value, key) => {
        copy.set(key, this.deepCopyRecursive(value));
      });
    } else if (item instanceof Set) {
      copy = new Set();
      item.forEach((value) => {
        copy.add(this.deepCopyRecursive(value));
      });
    } else {
      copy = {};
      Object.keys(item).forEach((key) => {
        copy[key] = this.deepCopyRecursive(item[key]);
      });
    }

    return copy;
  }
}

//;############################################################################################
//*---(Exportación)-------
//;############################################################################################

//* Exportación agrupada
const Utilities = {
  DOM,
  Str,
  Num,
  Bool,
  Arr,
  Obj,
  Utils,
};

//todo: Exportación en Web (ES6/ESM):
//? Exportación default
export default Utilities;

//? Exportación individual
export { DOM, Str, Num, Bool, Arr, Obj, Utils, Utilities };

//todo: Exportación en Node.js (CommonJS):
// module.exports = {
//   DOM,
//   Str,
//   Num,
//   Bool,
//   Arr,
//   Obj,
//   Utils,
//   Utilities,
// };
