/**
 * This class handles the buffering of messages to the console.
 */
export class LogBuffer {

    /** Current amount of messages in the buffer */
    #current: number
    /** Maximum amount of messages in the buffer */
    readonly max: number

    /** The line to output */
    line: string = ''

    /**
     * 
     * @param max The maximum amount of messages in the buffer.
     */
    constructor(max: number) {

        this.#current = 0
        this.max = max

    }

    /**
     * Add a line to the buffer.
     * @param line The line to add to the buffer.
     */
    addLine(line: string): void {

        if (this.#current >= this.max)
            throw new Error('LogBuffer overflow')

        this.line += line + '\n'
        this.#current++

    }

    /**
     * Check if the buffer is full.
     * @returns {boolean} True if the buffer is full, false if not.
     */
    isFull(): boolean {

        return this.#current >= this.max

    }

    /**
     * Output the buffer.
     * @returns {string} The buffer's output.
     */
    output(): string {

        return this.line

    }

}