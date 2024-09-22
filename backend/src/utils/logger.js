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
    /**
     * Método estático para configurar o recuperar los caracteres de resaltado.
     * Si no se proporcionan parámetros, devuelve el valor actual de los caracteres de resaltado.
     * Si se proporciona un prefijo o sufijo no válido, no se aplicará ningún cambio.
     * Si se pasa una cadena vacía en lugar de un prefijo o sufijo, se restaurará al valor predeterminado.
     *
     * @param {string} [prefix] - El carácter de apertura (opcional). Si está vacío, restaura el predeterminado.
     * @param {string} [suffix] - El carácter de cierre (opcional). Si está vacío, restaura el predeterminado.
     * @returns {{prefix: string, suffix: string}} - Los caracteres de resaltado actuales.
     */
    static setHighlightEnclosers(prefix, suffix) {
        const { validPrefixes, validSuffixes, default: defaultEnclosers, current } = Logger.highlightEnclosers;
        //; Si no se pasa ningún parámetro, devolver los valores actuales
        if (prefix === undefined && suffix === undefined) {
            return Object.assign({}, current);
        }
        //; Validar el prefijo: si es una cadena vacía, restaurar al valor predeterminado
        if (prefix === '') {
            current.prefix = defaultEnclosers.prefix;
        }
        else if (prefix && validPrefixes.includes(prefix)) {
            current.prefix = prefix;
        }
        //; Validar el sufijo: si es una cadena vacía, restaurar al valor predeterminado
        if (suffix === '') {
            current.suffix = defaultEnclosers.suffix;
        }
        else if (suffix && validSuffixes.includes(suffix)) {
            current.suffix = suffix;
        }
        //; Devolver los valores actuales de prefijo y sufijo
        return Object.assign({}, current);
    }
    /**
     * Método privado que maneja el log para un tipo específico.
     * @param type - El tipo de log.
     * @param messages - Los mensajes o valores a registrar.
     */
    static log(type, ...messages) {
        const emoji = Logger.emojis[type];
        const color = Logger.colors[type];
        //; Formatear el emoji con su color correspondiente
        const formattedEmoji = color(`${emoji}`);
        //; Convertir los mensajes a strings apropiados, aplicando color a las cadenas de texto
        const formattedMessages = messages.map((msg) => {
            if (typeof msg === 'string') {
                //; Resaltar texto dentro de los caracteres definidos
                const highlightedMessage = Logger.applyHighlighting(msg, color);
                return color(highlightedMessage);
            }
            else {
                //; Formatear objetos con colores
                return util_1.default.inspect(msg, { colors: true, depth: null });
            }
        });
        //; Concatenar el emoji y los mensajes sin espacios adicionales
        const out = formattedEmoji + Logger.splitCharacter + formattedMessages.join(' ');
        console.log(out);
    }
    /**
     * Método para aplicar resaltado al texto dentro de los caracteres definidos.
     * @param message - El mensaje original.
     * @param color - Función de color de chalk.
     * @returns El mensaje con el texto resaltado.
     */
    static applyHighlighting(message, color) {
        const { current: { prefix: highlightPrefix, suffix: highlightSuffix } } = Logger.highlightEnclosers;
        const regex = new RegExp(`${escapeRegExp(highlightPrefix)}(.*?)${escapeRegExp(highlightSuffix)}`, 'g');
        return message.replace(regex, (match, p1) => {
            return chalk_1.default.bold.underline(p1);
        });
    }
    //; Métodos públicos para cada tipo de log
    static success(...messages) {
        Logger.log('success', ...messages);
    }
    static error(...messages) {
        Logger.log('error', ...messages);
    }
    static warning(...messages) {
        Logger.log('warning', ...messages);
    }
    static information(...messages) {
        Logger.log('information', ...messages);
    }
    static finalSuccess(...messages) {
        Logger.log('finalSuccess', ...messages);
    }
    static finalError(...messages) {
        Logger.log('finalError', ...messages);
    }
}
//; Carácter separador opcional
Logger.splitCharacter = '- ';
//; Definición de emojis y colores para cada tipo de log
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
//; Objeto que agrupa los caracteres predeterminados, actuales y las listas válidas para el resaltado
Logger.highlightEnclosers = {
    default: { prefix: '{', suffix: '}' }, //; Valores predeterminados
    current: { prefix: '{', suffix: '}' }, //; Valores actuales
    validPrefixes: ['{', '[', '(', '<'], //; Prefijos válidos
    validSuffixes: ['}', ']', ')', '>'], //; Sufijos válidos
};
/**
 * Función para escapar caracteres especiales en expresiones regulares.
 * @param string - La cadena a escapar.
 * @returns La cadena escapada.
 */
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
exports.default = Logger;
