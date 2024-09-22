import chalk from 'chalk';
import util from 'util';

/**
 * @module Logger
 * @description Clase Logger para manejar logs con emojis, colores predefinidos y resaltado de texto.
 */
class Logger {
    //; Carácter separador opcional
    private static splitCharacter: string = '- ';

    //; Definición de emojis y colores para cada tipo de log
    private static emojis: Record<LogType, string> = {
        success: '✔️  ',
        error: ' ❗',
        warning: '⚠️  ',
        information: '#️⃣  ',
        finalSuccess: '✅ ',
        finalError: '❌ ',
    };

    private static colors: Record<LogType, (text: string) => string> = {
        success: chalk.green,
        error: chalk.red,
        warning: chalk.yellow,
        information: chalk.blue,
        finalSuccess: chalk.greenBright,
        finalError: chalk.redBright,
    };


    //; Objeto que agrupa los caracteres predeterminados, actuales y las listas válidas para el resaltado
    private static highlightEnclosers = {
        default: { prefix: '{', suffix: '}' },    //; Valores predeterminados
        current: { prefix: '{', suffix: '}' },    //; Valores actuales
        validPrefixes: ['{', '[', '(', '<'],      //; Prefijos válidos
        validSuffixes: ['}', ']', ')', '>'],      //; Sufijos válidos
    };

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
    static setHighlightEnclosers(prefix?: string, suffix?: string): { prefix: string; suffix: string } {
        const { validPrefixes, validSuffixes, default: defaultEnclosers, current } = Logger.highlightEnclosers;

        //; Si no se pasa ningún parámetro, devolver los valores actuales
        if (prefix === undefined && suffix === undefined) {
            return { ...current };
        }

        //; Validar el prefijo: si es una cadena vacía, restaurar al valor predeterminado
        if (prefix === '') {
            current.prefix = defaultEnclosers.prefix;
        } else if (prefix && validPrefixes.includes(prefix)) {
            current.prefix = prefix;
        }

        //; Validar el sufijo: si es una cadena vacía, restaurar al valor predeterminado
        if (suffix === '') {
            current.suffix = defaultEnclosers.suffix;
        } else if (suffix && validSuffixes.includes(suffix)) {
            current.suffix = suffix;
        }

        //; Devolver los valores actuales de prefijo y sufijo
        return { ...current };
    }

    /**
     * Método privado que maneja el log para un tipo específico.
     * @param type - El tipo de log.
     * @param messages - Los mensajes o valores a registrar.
     */
    private static log(type: LogType, ...messages: any[]): void {
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
            } else {
                //; Formatear objetos con colores
                return util.inspect(msg, { colors: true, depth: null });
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
    private static applyHighlighting(message: string, color: (text: string) => string): string {
        const { current: { prefix: highlightPrefix, suffix: highlightSuffix } } = Logger.highlightEnclosers;
        const regex = new RegExp(
            `${escapeRegExp(highlightPrefix)}(.*?)${escapeRegExp(highlightSuffix)}`,
            'g'
        );

        return message.replace(regex, (match, p1) => {
            return chalk.bold.underline(p1);
        });
    }

    //; Métodos públicos para cada tipo de log
    static success(...messages: any[]): void {
        Logger.log('success', ...messages);
    }

    static error(...messages: any[]): void {
        Logger.log('error', ...messages);
    }

    static warning(...messages: any[]): void {
        Logger.log('warning', ...messages);
    }

    static information(...messages: any[]): void {
        Logger.log('information', ...messages);
    }

    static finalSuccess(...messages: any[]): void {
        Logger.log('finalSuccess', ...messages);
    }

    static finalError(...messages: any[]): void {
        Logger.log('finalError', ...messages);
    }
}

/**
 * Función para escapar caracteres especiales en expresiones regulares.
 * @param string - La cadena a escapar.
 * @returns La cadena escapada.
 */
function escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

//; Tipos de logs disponibles para tipado estricto
type LogType = 'success' | 'error' | 'warning' | 'information' | 'finalSuccess' | 'finalError';

export default Logger;
