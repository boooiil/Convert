import { writeFileSync } from 'fs'
import { LogColor } from 'logging/LogColor'
import { Container } from './Container'
import { Display } from './Display'
import { Process } from './Process'

/**
 * This class runs the base of the application. The current running conversion count is checked against
 * the user's desired amount of conversions. If the current amount is less than the desired amount, a
 * new conversion is started.
 */
export class Ticker {

    /** Instance of Container */
    container: Container
    /** Instance of Display */
    display: Display

    /**
     * 
     * @param container The container object that contains all of the information about the current and pending conversions.
     */
    constructor(container: Container) {

        this.container = container
        this.display = new Display(container)

    }

    /**
     * This function starts the processing of the files.
     */
    startProcess() {

        //NOTE: An item gets added every second instead of all at once due to the logic being contained in an interval.
        //CONT: We could move this to a recursive function that is called every second, but that's no fun.
        setInterval(() => {

            let current_amount = Object.keys(this.container.converting).length

            if (current_amount < this.container.appEncodingDecision.amount) {

                let media = this.container.pending[0]

                if (!media || media.activity != Process.WAITING) {

                    if (current_amount === 0) {

                        this.container.logger.flushBuffer()
                        if (this.container.debug.toggle) {
                            console.log('Debugging enabled. Writing debug file.')
                            writeFileSync('container_debug.json', JSON.stringify(this.container, null, 4))
                            console.log('Debug file written.')
                            process.exit(0)
                        }
                        else process.exit(0)

                    }

                }
                else {

                    media.activity = Process.WAITING_STATISTICS
                    media.started = Date.now()

                    this.container.converting[media.name] = this.container.pending.shift()

                }

            }

            if (current_amount > this.container.appEncodingDecision.amount) {

                this.container.logger.send(LogColor.fgRed, 'CURRENT TRANSCODES ARE GREATER THAN THE ALLOWED AMOUNT.')
                this.container.logger.send(LogColor.fgRed, 'CURRENT ALLOWED AMOUNT: ' + this.container.appEncodingDecision.amount)
                this.container.logger.send(LogColor.fgRed, 'CURRENT QUEUE:')
                Object.keys(this.container.converting).forEach(media => console.error('CURRENT FILE: ' + this.container.converting[media].file.name_modified))
                process.exit(1)

            }

            Object.keys(this.container.converting).forEach(file => {

                let media = this.container.converting[file]

                // If the file is not being processed, spawn an instance for it.
                if (!media.isProcessing()) {

                    if (media.activity === Process.WAITING_STATISTICS) media.doStatistics(this.container)
                    //if (media.activity.includes('Extracting')) spawnExtractionInstance(media)
                    if (media.activity === Process.WAITING_CONVERT) media.doConvert()
                    if (media.activity === Process.WAITING_VALIDATE) media.doValidate()

                }

                // If the file has finished processing, add it to the completed queue.
                if (/finished|failed/i.test(media.activity)) {

                    media.ended = Date.now()

                    this.container.pending.push(structuredClone(media))

                    delete this.container.converting[media.name]

                }

            })

            if (this.container.debug.toggle) this.display.printDebug()
            else this.display.print()

            //console.log(this.container.converting)
            //console.log(this.container.pending)

        }, 1000)

    }

}