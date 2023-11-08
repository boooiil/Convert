import { time } from 'utils/Time'
import { LogColor } from 'logging/LogColor'
import { truncateString } from 'utils/Strings'
import { Container } from './Container'
import { Activity } from './Activity'
import { Debug } from './Debug'

/**
 * This class handles the logging of messages to the console pertaining to the current
 * and pending conversions.
 */
export class Display {

    /** Instance of Container */
    container: Container

    /**
     * @param container The container object that contains all of the information about the current and pending conversions.
     */
    constructor(container: Container) {

        this.container = container

    }

    /**
     * Print the current and pending conversions to the console.
     */
    print() {

        let bufferLength = Object.keys(this.container.converting).length + this.container.pending.length + 1

        let ob = LogColor.fgGray('[')
        let cb = LogColor.fgGray(']')
        let t = `${ob + LogColor.fgBlue('TIME') + cb} ${LogColor.fgGray(time(null, null))} `
        let encoder = `${ob + LogColor.fgBlue('TARGET ENC') + cb} ${LogColor.fgGray(this.container.appEncodingDecision.wantedEncoder.toUpperCase())} `
        let runningEncoder = `${ob + LogColor.fgBlue('ENC') + cb} ${LogColor.fgGray(this.container.appEncodingDecision.runningEncoder.toUpperCase())} `
        let runningDecoder = `${ob + LogColor.fgBlue('DEC') + cb} ${LogColor.fgGray(this.container.appEncodingDecision.runningDecoder.toUpperCase())} `
        let quality = `${ob + LogColor.fgBlue('RES') + cb} ${LogColor.fgGray(this.container.appEncodingDecision.quality.toUpperCase())} `
        let tune = this.container.appEncodingDecision.tune ? `${ob + LogColor.fgBlue('TUNE') + cb} ${LogColor.fgGray(this.container.appEncodingDecision.tune.toUpperCase())} ` : ''
        let amount = `${ob + LogColor.fgBlue('AMOUNT') + cb} ${LogColor.fgGray(this.container.appEncodingDecision.amount.toString())} `
        let constrain = this.container.appEncodingDecision.useConstrain ? ob + LogColor.fgRed('CONSTRAIN') + cb + ' ' : ''
        let debug = Debug.toggle ? ob + LogColor.fgRed('DEBUG') + cb + ' ' : ''
        let crop = this.container.appEncodingDecision.crop ? ob + LogColor.fgRed('CROP') + cb + ' ' : ''

        let line = `${t}${amount}${encoder}${runningEncoder}${runningDecoder}${tune}${quality}${crop}${constrain}${debug}\n`

        console.clear()
        this.container.logger.sendBuffer(LogColor.none, bufferLength, line)

        Object.keys(this.container.converting).forEach(file => {

            let media = this.container.converting[file]

            let fileName = `${ob + LogColor.fgBlue('FILE') + cb} ${LogColor.fgGray(truncateString(media.file.modifiedFileName))}`

            let totalFrames = media.video.totalFrames

            let completedFrames = media.working.completedFrames
            let mediaFPS = media.working.fps
            let bitrate = `${ob + LogColor.fgBlue('BIT') + cb} ${LogColor.fgGray(media.working.bitrate.toString())}`
            let cq = `${ob + LogColor.fgBlue('QUAL') + cb} ${LogColor.fgGray(Math.trunc((media.video.crf / media.working.quality) * 100).toString())}%`
            let speed = `${ob + LogColor.fgBlue('SPEED') + cb} ${LogColor.fgGray((Math.trunc((mediaFPS / media.video.fps) * 100) / 100).toString())}`
            let eta = `${ob + LogColor.fgBlue('ETA') + cb} ${LogColor.fgGray(time((Math.ceil((totalFrames - completedFrames) / mediaFPS) * 1000), true))}`

            let activity = `${ob + LogColor.fgBlue('ACT') + cb} ${LogColor.fgGray(media.activity)}`
            let started = `${ob + LogColor.fgBlue('START') + cb} ${LogColor.fgGray(time(media.started, null))}`

            let percent = `${ob + LogColor.fgBlue('PROG') + cb} ${LogColor.fgGray(Math.ceil((completedFrames / totalFrames) * 100) + '%')}`

            let message = `${fileName} ${activity} ${started} ${percent} ${cq} ${bitrate} ${speed} ${eta} `

            this.container.logger.sendBuffer(LogColor.none, bufferLength, message)

        })

        this.container.pending.forEach(media => {

            let fileName = `${ob + LogColor.fgBlue('FILE') + cb} ${LogColor.fgGray(truncateString(media.file.modifiedFileName))}`
            let activity = `${ob + LogColor.fgBlue('STATUS') + cb} ${LogColor.fgGray(media.activity)}`

            if (media.activity === Activity.WAITING) {

                return this.container.logger.sendBuffer(LogColor.none, bufferLength, `${fileName} ${activity}`)

            }
            else {

                let calculated = Math.floor(((media.file.size - media.file.newSize) / media.file.size) * 100)

                let ended = `${ob + LogColor.fgBlue('COMPLETION') + cb} ${LogColor.fgGray(time(media.ended, false))}`
                let elapsed = `${ob + LogColor.fgBlue('ELAPSED') + cb} ${LogColor.fgGray(time(media.ended - media.started, true))}`
                let reduced = `${ob + LogColor.fgBlue('REDUCED') + cb} ${media.file.newSize ? LogColor.fgGray(calculated + '%') : '???'}`

                let message = `${fileName} ${activity} ${reduced} ${ended} ${elapsed}`

                this.container.logger.sendBuffer(LogColor.none, bufferLength, message)

            }

        })

    }

    /**
     * Print the current and pending conversions to the console in debug format.
     */
    printDebug() {
        
        return ''

    }

}