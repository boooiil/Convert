/**
 * This class holds various methods to apply color to console messages.
 */
export class LogColor {

    static reset(str: string) { return '\x1b[0m' + str }
    static bright(str: string) { return '\x1b[1m' + str + '\x1b[0m' }
    static dim(str: string) { return '\x1b[2m' + str + '\x1b[0m' }
    static underscore(str: string) { return '\x1b[4m' + str + '\x1b[0m' }
    static blink(str: string) { return '\x1b[5m' + str + '\x1b[0m' }
    static reverse(str: string) { return '\x1b[7m' + str + '\x1b[0m' }
    static hidden(str: string) { return '\x1b[8m' + str + '\x1b[0m' }
    static none(str: string) { return str }

    static fgBlack(str: string) { return '\x1b[30m' + str + '\x1b[0m' }
    static fgRed(str: string) { return '\x1b[31m' + str + '\x1b[0m' }
    static fgGreen(str: string) { return '\x1b[32m' + str + '\x1b[0m' }
    static fgGray(str: string) { return '\x1b[38;2;191;191;191m' + str + '\x1b[0m' }
    static fgYellow(str: string) { return '\x1b[33m' + str + '\x1b[0m' }
    static fgBlue(str: string) { return '\x1b[34m' + str + '\x1b[0m' }
    static fgMagenta(str: string) { return '\x1b[35m' + str + '\x1b[0m' }
    static fgCyan(str: string) { return '\x1b[36m' + str + '\x1b[0m' }
    static fgWhite(str: string) { return '\x1b[37m' + str + '\x1b[0m' }

    static bgBlack(str: string) { return '\x1b[40m' + str + '\x1b[0m' }
    static bgRed(str: string) { return '\x1b[41m' + str + '\x1b[0m' }
    static bgGreen(str: string) { return '\x1b[42m' + str + '\x1b[0m' }
    static bgYellow(str: string) { return '\x1b[43m' + str + '\x1b[0m' }
    static bgBlue(str: string) { return '\x1b[44m' + str + '\x1b[0m' }
    static bgMagenta(str: string) { return '\x1b[45m' + str + '\x1b[0m' }
    static bgCyan(str: string) { return '\x1b[46m' + str + '\x1b[0m' }
    static bgWhite(str: string) { return '\x1b[47m' + str + '\x1b[0m' }

}