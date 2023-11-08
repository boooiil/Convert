import { stdout } from 'process'
import { LogBuffer } from './LogBuffer'
import { LogColor } from './LogColor'
import { Debug } from 'application/Debug'

/**
 * Class to handle logging to the console.
 */
export class Log {

    /** Buffer instance */
    #buffer: LogBuffer | null = null

    constructor() { }

    /**
     * Send a message to the console.
     * @param color The color of the message.
     * @param messages The message to send.
     */
    static send(color: (str: string) => string, ...messages: any[]): void {

        console.log('called send')

        for (const message of messages) {

            if (typeof (message) === 'object') console.log(message)
            else stdout.write(color(message) + ' ')

        }

        stdout.write('\n')

    }

    /**
     * Send a buffered message to the console.
     * This is used to display an array or list of messages in a single line.
     * @param color The color of the message.
     * @param length The length of the buffer.
     * @param message The message to send.
     */
    sendBuffer(color: (str: string) => string, length: number, message: string): void {

        console.log('called sendbuffer, len ' + length)
        if (false) console.log('SENDING BUFFER')
        if (false) console.log('BUFFER LENGTH: ' + length)
        if (false) console.log('BUFFER MESSAGE: ' + message)

        if (!this.#buffer) {

            this.#buffer = new LogBuffer(length)
            this.#buffer.addLine(message)

        }
        else {

            this.#buffer.addLine(message)

        }

        if (this.#buffer.isFull()) {

            Log.send(color, this.#buffer.output())
            this.#buffer = null

        }

    }

    /**
     * Send a plain message to the console.
     * @param messages The message to send.
     */
    sendPlain(...messages: any[]): void {

        console.log('called sendplain')

        for (const message of messages) {

            if (typeof (message) === 'object') console.log(message)
            else stdout.write(message + ' ')

        }

        stdout.write('\n')

    }

    /**
     * Check if the buffer has a message.
     * @returns {boolean} True if the buffer has a message, false if not.
     */
    hasBuffer(): boolean {

        return this.#buffer != null

    }

    /**
     * Flush the buffer to the console.
     */
    flushBuffer(): void {

        console.log('called flushbuffer')

        if (this.#buffer) {

            Log.send(LogColor.fgRed, this.#buffer.output())
            this.#buffer = null

        }

    }

    static debug(...messages: any[]): void {

        if (Debug.toggle) this.send(LogColor.fgRed, messages)

    }

}