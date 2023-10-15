import { Log } from 'logging/Log'
import { Debug } from './Debug'
import { ApplicationEncodingDecision } from './ApplicationEncodingDecision'
import { Settings } from './Settings'
import { MediaFormat } from 'media/MediaFormat'
import { UserCapabilities } from './UserCapabilities'
import { Media } from 'media/Media'
import { UserArguments } from './UserArguments'
import { readdirSync } from 'fs'
import { LogColor } from 'logging/LogColor'

/**
 * This class contains the bulk of information for the current and pending conversions
 * as well as user and application decisions.
 */
export class Container {

    logger: Log = new Log()

    /** Instance of Debug */
    debug: Debug

    /** Instance of ApplicationEncodingDecision */
    appEncodingDecision: ApplicationEncodingDecision
    /** Instance of Settings */
    settings: Settings

    /** List of supported formats */
    formats: { [key: string]: MediaFormat } = {
        '2160p': new MediaFormat(
            '2160p',
            24,
            30,
            30,
            40,
            3840,
            2160,
            '3840:1600',
            '3840:2160'
        ),
        '1440p': new MediaFormat(
            '1440p',
            24,
            20,
            20,
            27,
            2560,
            1440,
            '2560:1068',
            '2560:1440'
        ),
        '1080p': new MediaFormat(
            '1080p',
            24,
            2.0,
            1.6,
            2.2,
            1920,
            1080,
            '1920:800',
            '1920:1080'
        ),
        '1080pm': new MediaFormat(
            '1080pm',
            24,
            2.0,
            1.6,
            2.2,
            1920,
            1080,
            '1920:870',
            '1920:1080'
        ),
        '1080pn': new MediaFormat(
            '1080pn',
            24,
            2.0,
            1.6,
            2.2,
            1920,
            1080,
            '1920:960',
            '1920:1080'
        ),
        '720p': new MediaFormat(
            '720p',
            24,
            1.4,
            1.2,
            1.8,
            1280,
            720,
            '1280:534',
            '1280:720'
        ),
        '720pm': new MediaFormat(
            '720pm',
            24,
            1.4,
            1.2,
            1.8,
            1280,
            720,
            '1280:580',
            '1280:720'
        ),
        '720pn': new MediaFormat(
            '720pn',
            24,
            1.4,
            1.2,
            1.8,
            1280,
            720,
            '1280:640',
            '1280:720'
        ),
        '480p': new MediaFormat(
            '480p',
            24,
            0.6,
            0.4,
            0.8,
            854,
            480,
            '854:356',
            '854:480'
        ),
        '480pc': new MediaFormat(
            '480pc',
            24,
            0.6,
            0.4,
            0.8,
            1138,
            640,
            '854:720',
            '1138:640'
        )
    }

    /** Instance of UserCapabilities */
    userCapabilities: UserCapabilities

    /** List of files currently being processed */
    converting: { [key: string]: Media } = {}
    /** List of files pending processing */
    pending: Media[] = []

    /** Instance of UserArguments */
    userArguments: UserArguments

    constructor() {

        this.debug = new Debug()

        this.appEncodingDecision = new ApplicationEncodingDecision()
        this.settings = new Settings()

        this.userCapabilities = new UserCapabilities()

        this.userArguments = new UserArguments()

    }

    /**
     * This function adds a custom format to the formats object.
     * @param height The height of the custom format.
     */
    addCustomFormat(height: number) {

        const customFormat = new MediaFormat(`${height}p`, null, null, null, null, null, null, null, null)

        customFormat.crf = 24
        customFormat.height = height % 2 ? height++ : height
        customFormat.width = Math.ceil(customFormat.height * 1.777777777777778)

        if (customFormat.width % 2) customFormat.width++

        let cropHeight = Math.ceil(customFormat.width / 2.4)

        if (cropHeight % 2) cropHeight++

        customFormat.crop = `${customFormat.width}:${cropHeight}`
        customFormat.scale = `${customFormat.width}:${customFormat.height}`

        this.formats[`${height}p`] = customFormat

    }

    /**
     * This function scans the working directory for media files and adds them to the pending queue.
     */
    scanWorkingDir() {

        return new Promise((resolve, reject) => {
            readdirSync(this.settings.workingDir).forEach((file) => {

                if (file.endsWith('.mkv')) {

                    if (this.debug.toggle) this.logger.send(LogColor.fgRed, 'Found file: ', file)

                    let media = new Media(file, this.settings.workingDir)

                    media.rename(this)

                    this.pending.push(media)

                }

            })

            setTimeout(() => {
                resolve(null)
            }, 1000)

        })
    }

}