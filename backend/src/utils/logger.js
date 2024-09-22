"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const util_1 = __importDefault(require("util"));
/**
 * @module Logger
 * @description Clase Logger para manejar logs con emojis, colores predefinidos y resaltado de texto.
 */
class Logger {
    //^MARK: Private Methods
    /**
     * Maneja el log para un tipo específico, aplicando colores y resaltado.
     *
     * @param {LogType} type - Tipo de log (success, error, warning, etc.).
     * @param {...any[]} messages - Mensajes o valores a registrar.
     */
    static log(type, ...messages) {
        const emoji = Logger.emojis[type];
        const color = Logger.colors[type];
        //; Formatear el emoji con su color correspondiente
        const formattedEmoji = color(`${emoji}`);
        //; Convertir los mensajes a strings apropiados, aplicando color
        const formattedMessages = messages.map((msg) => {
            if (typeof msg === 'string') {
                //? Aplicar resaltado al texto dentro de los delimitadores
                const highlightedMessage = Logger.applyHighlighting(msg, color);
                return color(highlightedMessage);
            }
            else {
                //? Formatear objetos con colores
                return util_1.default.inspect(msg, { colors: true, depth: null });
            }
        });
        //; Concatenar el emoji y los mensajes
        const out = formattedEmoji + Logger.splitCharacter + formattedMessages.join(' ');
        console.log(out);
    }
    /**
     * Aplica resaltado al texto dentro de los delimitadores definidos.
     *
     * @param {string} message - Mensaje original.
     * @param {(text: string) => string} color - Función de color de chalk.
     * @returns {string} - El mensaje con el texto resaltado y coloreado.
     */
    static applyHighlighting(message, color) {
        const { current: { prefix: highlightPrefix, suffix: highlightSuffix } } = Logger.highlightEnclosers;
        const regex = new RegExp(`${escapeRegExp(highlightPrefix)}(.*?)${escapeRegExp(highlightSuffix)}`, 'g');
        return message.replace(regex, (match, p1) => chalk_1.default.bold.underline(p1));
    }
    //^MARK: Public Methods
    /**
     * Establece o recupera los caracteres de resaltado.
     *
     ** Si no se proporcionan parámetros, devuelve los caracteres actuales.
     ** Si se pasa un prefijo o sufijo no válido, no se aplicará ningún cambio.
     ** Si se pasa una cadena vacía, restaura el valor predeterminado.
     *
     * @param {string} [prefix] - Carácter de apertura (opcional). Si está vacío, restaura el predeterminado.
     * @param {string} [suffix] - Carácter de cierre (opcional). Si está vacío, restaura el predeterminado.
     * @returns {{prefix: string, suffix: string}} - Los caracteres de resaltado actuales.
     */
    static setHighlightEnclosers(prefix, suffix) {
        const { validPrefixes, validSuffixes, default: defaultEnclosers, current } = Logger.highlightEnclosers;
        //; Si no se pasa ningún parámetro, devolver los valores actuales
        if (prefix === undefined && suffix === undefined) {
            return Object.assign({}, current);
        }
        //; Validar el prefijo
        if (prefix === '') {
            current.prefix = defaultEnclosers.prefix;
        }
        else if (prefix && validPrefixes.includes(prefix)) {
            current.prefix = prefix;
        }
        //; Validar el sufijo
        if (suffix === '') {
            current.suffix = defaultEnclosers.suffix;
        }
        else if (suffix && validSuffixes.includes(suffix)) {
            current.suffix = suffix;
        }
        //; Devolver los valores actuales
        return Object.assign({}, current);
    }
    //^MARK:*
    /**
     * Log para operaciones exitosas.
     * @param {...any[]} messages - Mensajes a mostrar.
     */
    static success(...messages) {
        Logger.log('success', ...messages);
    }
    /**
     * Log para errores.
     * @param {...any[]} messages - Mensajes a mostrar.
     */
    static error(...messages) {
        Logger.log('error', ...messages);
    }
    /**
     * Log para advertencias.
     * @param {...any[]} messages - Mensajes a mostrar.
     */
    static warning(...messages) {
        Logger.log('warning', ...messages);
    }
    /**
     * Log para información general.
     * @param {...any[]} messages - Mensajes a mostrar.
     */
    static information(...messages) {
        Logger.log('information', ...messages);
    }
    /**
     * Log para éxito final de un proceso.
     * @param {...any[]} messages - Mensajes a mostrar.
     */
    static finalSuccess(...messages) {
        Logger.log('finalSuccess', ...messages);
    }
    /**
     * Log para error crítico o final.
     * @param {...any[]} messages - Mensajes a mostrar.
     */
    static finalError(...messages) {
        Logger.log('finalError', ...messages);
    }
}
//^MARK: Logger Config
//* Separador entre el emoji y el mensaje (opcional)
Logger.splitCharacter = '- ';
//* Emojis y colores definidos para cada tipo de log
Logger.emojis = {
    success: '✔️  ',
    error: ' ❗',
    warning: '⚠️  ',
    information: '#️⃣  ',
    finalSuccess: '✅ ',
    finalError: '❌ ',
};
Logger.colors = {
    success: chalk_1.default.green,
    error: chalk_1.default.red,
    warning: chalk_1.default.yellow,
    information: chalk_1.default.blue,
    finalSuccess: chalk_1.default.greenBright,
    finalError: chalk_1.default.redBright,
};
//* Objeto que agrupa las opciones para caracteres de resaltado (delimitadores)
Logger.highlightEnclosers = {
    default: { prefix: '{', suffix: '}' }, //; Valores predeterminados
    current: { prefix: '{', suffix: '}' }, //; Valores actuales utilizados
    validPrefixes: ['{', '[', '(', '<'], //? Prefijos válidos
    validSuffixes: ['}', ']', ')', '>'], //? Sufijos válidos
};
//^MARK: Utilities
/**
 * Escapa caracteres especiales en una cadena para su uso en expresiones regulares.
 *
 * @param {string} string - La cadena a escapar.
 * @returns {string} - La cadena escapada.
 */
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
exports.default = Logger;
