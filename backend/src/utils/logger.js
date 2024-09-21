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
     * Método estático para configurar los caracteres de resaltado.
     * @param prefix - Carácter de apertura.
     * @param suffix - Carácter de cierre.
     */
    static setHighlightEnclosers(prefix, suffix) {
        Logger.highlightPrefix = prefix;
        Logger.highlightSuffix = suffix;
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
        const { highlightPrefix, highlightSuffix } = Logger;
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
//; Caracteres para resaltar texto
Logger.highlightPrefix = '{';
Logger.highlightSuffix = '}';
/**
 * Función para escapar caracteres especiales en expresiones regulares.
 * @param string - La cadena a escapar.
 * @returns La cadena escapada.
 */
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
exports.default = Logger;
