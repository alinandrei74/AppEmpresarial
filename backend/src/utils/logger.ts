import chalk from 'chalk';
import util from 'util';

/**
 * @module Logger
 * @description Clase Logger para manejar logs con emojis, colores predefinidos y resaltado de texto.
 */
class Logger {

    //^MARK: Logger Config

    //* Separador entre el emoji y el mensaje (opcional)
    private static splitCharacter: string = '- ';

    //* Emojis y colores definidos para cada tipo de log
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

    //* Objeto que agrupa las opciones para caracteres de resaltado (delimitadores)
    private static highlightEnclosers = {
        default: { prefix: '{', suffix: '}' },    //; Valores predeterminados
        current: { prefix: '{', suffix: '}' },    //; Valores actuales utilizados
        validPrefixes: ['{', '[', '(', '<'],      //? Prefijos válidos
        validSuffixes: ['}', ']', ')', '>'],      //? Sufijos válidos
    };

    //^MARK: Private Methods

    /**
     * Maneja el log para un tipo específico, aplicando colores y resaltado.
     * 
     * @param {LogType} type - Tipo de log (success, error, warning, etc.).
     * @param {...any[]} messages - Mensajes o valores a registrar.
     */
    private static log(type: LogType, ...messages: any[]): void {
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
            } else {
                //? Formatear objetos con colores
                return util.inspect(msg, { colors: true, depth: null });
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
    private static applyHighlighting(message: string, color: (text: string) => string): string {
        const { current: { prefix: highlightPrefix, suffix: highlightSuffix } } = Logger.highlightEnclosers;
        const regex = new RegExp(`${escapeRegExp(highlightPrefix)}(.*?)${escapeRegExp(highlightSuffix)}`, 'g');

        return message.replace(regex, (match, p1) => chalk.bold.underline(p1));
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
    static setHighlightEnclosers(prefix?: string, suffix?: string): { prefix: string; suffix: string } {
        const { validPrefixes, validSuffixes, default: defaultEnclosers, current } = Logger.highlightEnclosers;

        //; Si no se pasa ningún parámetro, devolver los valores actuales
        if (prefix === undefined && suffix === undefined) {
            return { ...current };
        }

        //; Validar el prefijo
        if (prefix === '') {
            current.prefix = defaultEnclosers.prefix;
        } else if (prefix && validPrefixes.includes(prefix)) {
            current.prefix = prefix;
        }

        //; Validar el sufijo
        if (suffix === '') {
            current.suffix = defaultEnclosers.suffix;
        } else if (suffix && validSuffixes.includes(suffix)) {
            current.suffix = suffix;
        }

        //; Devolver los valores actuales
        return { ...current };
    }

    //^MARK:*

    /**
     * Log para operaciones exitosas.
     * @param {...any[]} messages - Mensajes a mostrar.
     */
    static success(...messages: any[]): void {
        Logger.log('success', ...messages);
    }

    /**
     * Log para errores.
     * @param {...any[]} messages - Mensajes a mostrar.
     */
    static error(...messages: any[]): void {
        Logger.log('error', ...messages);
    }

    /**
     * Log para advertencias.
     * @param {...any[]} messages - Mensajes a mostrar.
     */
    static warning(...messages: any[]): void {
        Logger.log('warning', ...messages);
    }

    /**
     * Log para información general.
     * @param {...any[]} messages - Mensajes a mostrar.
     */
    static information(...messages: any[]): void {
        Logger.log('information', ...messages);
    }

    /**
     * Log para éxito final de un proceso.
     * @param {...any[]} messages - Mensajes a mostrar.
     */
    static finalSuccess(...messages: any[]): void {
        Logger.log('finalSuccess', ...messages);
    }

    /**
     * Log para error crítico o final.
     * @param {...any[]} messages - Mensajes a mostrar.
     */
    static finalError(...messages: any[]): void {
        Logger.log('finalError', ...messages);
    }
}

//^MARK: Utilities

/**
 * Escapa caracteres especiales en una cadena para su uso en expresiones regulares.
 * 
 * @param {string} string - La cadena a escapar.
 * @returns {string} - La cadena escapada.
 */
function escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

//; Tipos de logs disponibles para tipado estricto
type LogType = 'success' | 'error' | 'warning' | 'information' | 'finalSuccess' | 'finalError';

export default Logger;
