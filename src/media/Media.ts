import { Activity } from 'application/Activity'
import { MediaFile } from './MediaFile'
import { MediaVideoProperties } from './MediaVideoProperties'
import { MediaWorkingProperties } from './MediaWorkingProperties'
import { Container } from 'application/Container'
import { HWAccel } from 'ffmpeg/HWAccelerators'
import { LogColor } from 'logging/LogColor'
import { existsSync, mkdirSync, renameSync } from 'fs'
import { MediaDefinedFormat } from './MediaDefinedFormat'
import { MediaProcessStatistics } from './MediaProcessStatistics'
import { MediaProcessConversion } from './MediaProcessConversion'
import { MediaProcessValidate } from './MediaProcessValidate'

/**
 * The Media class contains properties and methods for handling media files, including renaming and
 *  setting file information. 
 */
export class Media {

    /** Filename */
    name: string = ''
    /** Current file activity */
    activity: Activity = Activity.WAITING
    /** File path */
    path: string = ''

    /** Epoch since start */
    started: number = 0
    /** Epoch since end */
    ended: number = 0

    /** FFMPEG arguments */
    ffmpeg_argument: string[] = []

    /** File information */
    file: MediaFile
    /** Video information */
    video: MediaVideoProperties
    /** Conversion information */
    working: MediaWorkingProperties

    /**
     * This is a constructor function that initializes various properties related to a file and video
     * processing.
     * @param {string} name - The name of the file being processed.
     * @param {string} path - The path of the file being processed.
     */
    constructor(name: string, path: string) {

        this.name = name
        this.path = path

        this.file = new MediaFile()

        this.video = new MediaVideoProperties()

        this.working = new MediaWorkingProperties()

        this.started = 0
        this.ended = 0
        this.ffmpeg_argument = []

    }

    /**
     * This function checks if the file is being processed.
     * @returns {boolean} - Returns true if the file is being processed, false if not.
     */
    isProcessing(): boolean {

        return this.activity === Activity.STATISTICS || this.activity === Activity.CONVERT || this.activity === Activity.VALIDATE

    }

    /**
     * Spawn a statistic instance for the file.
     * @returns {Promise<void>}
     */
    async doStatistics(container: Container): Promise<void> {

        this.activity = Activity.STATISTICS
        this.activity = await new MediaProcessStatistics(container, this).start()

    }

    /**
     * Spawn a conversion instance for the file.
     * @returns {Promise<void>}
     */
    async doConvert(container: Container): Promise<void> {

        this.activity = Activity.CONVERT
        this.activity = await new MediaProcessConversion(container, this).start()
        

    }

    /**
     * Spawn a validation instance for the file.
     * @returns {Promise<null>}
     */
    async doValidate(container: Container): Promise<void> {

        this.activity = Activity.VALIDATE
        this.activity = await new MediaProcessValidate(container, this).start()

    }

    /**
     * Build specific FFmpeg arguments for the encoding process.
     * @param container The container object that contains all of the information about the current and pending conversions.
     * @param overwrite If the file should be overwritten.
     */
    buildFFmpegArguments(container: Container, overwrite: boolean = false) {

        let format = MediaDefinedFormat.formats[container.appEncodingDecision.quality]

        this.ffmpeg_argument = []

        this.ffmpeg_argument.push('-hide_banner')

        if (container.appEncodingDecision.useHardwareDecode) {

            switch (container.userCapabilities.GPUProvider) {

                case 'amd':
                    this.ffmpeg_argument.push('-hwaccel', HWAccel.AMD)
                    break

                case 'intel':
                    this.ffmpeg_argument.push('-hwaccel', HWAccel.INTEL)
                    break

                case 'nvidia':
                    this.ffmpeg_argument.push('-hwaccel', HWAccel.NVIDIA)
                    break

            }

        }

        this.ffmpeg_argument.push('-i', `"${this.file.path_rename}"`)

        /** Map video stream to index 0 */
        this.ffmpeg_argument.push('-map', '0:v:0')
        /** Map all audio streams */
        this.ffmpeg_argument.push('-map', '0:a?')
        /** Map all subtitle streams */
        this.ffmpeg_argument.push('-map', '0:s?')
        /** Map all attachment streams */
        this.ffmpeg_argument.push('-map', '0:t?')

        /** Codec video */
        this.ffmpeg_argument.push('-c:v', container.appEncodingDecision.runningEncoder)

        /** Codec attachment, Copy */
        this.ffmpeg_argument.push('-c:t', 'copy')

        /** Slow CPU preset */
        this.ffmpeg_argument.push('-preset', 'slow')

        /** Encoder level */
        this.ffmpeg_argument.push('-level', '4.1')

        if (container.appEncodingDecision.useBitrate) {

            this.ffmpeg_argument.push('-b:v', `${format.bitrate}M`)
            this.ffmpeg_argument.push('-bufsize', `${format.bitrate * 2}M`)
            this.ffmpeg_argument.push('-maxrate', `${format.max}M`)
            this.ffmpeg_argument.push('-minrate', `${format.min}M`)

        }

        else if (container.appEncodingDecision.useConstrain) {

            this.ffmpeg_argument.push('-crf', `${format.crf}`)
            this.ffmpeg_argument.push('-bufsize', `${format.bitrate * 2}M`)
            this.ffmpeg_argument.push('-maxrate', `${format.max}M`)

        }

        else {

            this.ffmpeg_argument.push('-crf', `${format.crf}`)

        }

        this.ffmpeg_argument.push('-c:a', 'copy')

        if (container.appEncodingDecision.crop) {

            this.ffmpeg_argument.push('-vf', `scale=${this.video.converted_resolution}:flags=lanczos,crop=${format.crop}`)


        }

        else this.ffmpeg_argument.push('-vf', `scale=${this.video.converted_resolution}:flags=lanczos`)

        if (container.appEncodingDecision.startBeginning) {

            this.ffmpeg_argument.push('-ss', container.appEncodingDecision.startBeginning)

        }

        if (container.appEncodingDecision.trim) {

            this.ffmpeg_argument.push('-ss', container.appEncodingDecision.trim.split(',')[0])
            this.ffmpeg_argument.push('-to', container.appEncodingDecision.trim.split(',')[1])

        }

        /** TODO: flesh out later */
        // if (this.video.subtitle_provider) {

        //     if (this.video.subtitle_provider === 'mov') this.ffmpeg_argument.push('-c:s', 'mov_text')
        //     else this.ffmpeg_argument.push('-c:s', 'copy')

        // }

        this.ffmpeg_argument.push('-c:s', 'copy')

        if (container.appEncodingDecision.tune) {

            this.ffmpeg_argument.push('-tune', container.appEncodingDecision.tune)

        }

        if (overwrite || container.appEncodingDecision.overwrite) this.ffmpeg_argument.push('-y')

        this.ffmpeg_argument.push(`"${this.file.path_convert}"`)

        if (container.debug.toggle) {

            container.logger.send(LogColor.fgRed, 'FFMPEG Arguments: ', this.ffmpeg_argument.join(' '))

        }

    }

    /**
     * This function renames the file to a standardized format.
     * @param container The container object that contains all of the information about the current and pending conversions.
     */
    rename(container: Container) {

        let mediaPattern = /(.+?)(?:[-|.| ]+)(season.?\d{1,}|s\d{1,}).?(e[e0-9-]+|x[x0-9-]+)/i
        let qualityPattern = /(1080p|720p|480p)/i
        let extensionPattern = /(\.mkv|.avi|\.srt|.idx|.sub)/i
        let extension = this.name.match(extensionPattern)[1]

        //match: (.+?)(?:[-|.| ]+)(season.?\d{1,}|s\d{1,}).?(e[e0-9-]++|x[x0-9-]++).+(1080p|720p|480p)

        if (mediaPattern.test(this.name)) {

            let media = this.name.match(mediaPattern)
            let quality = this.name.match(qualityPattern)[1]
            let episode = ''

            // series name
            this.file.series = media[1].replace(/\./, '').trim()
            // series number
            this.file.season = parseInt(media[2].replace(/season|s/i, ''))
            //episode number
            episode += media[3].toLowerCase()
            if (quality) this.file.quality = parseInt(quality.replace(/p/i, ''))

            this.file.ext = extension
            this.file.name_modified = `${this.file.series} s${this.file.season}${episode} [${this.file.quality}p]`
            this.file.name_modified_ext = this.file.name_modified + extension

        }

        else {

            this.file.ext = extension
            this.file.name_modified = this.name.replace(extension, '')
            this.file.name_modified_ext = this.name

        }

        if (extension === '.mkv' || extension === '.avi') this.file.name_convert = this.file.name_modified + '.mkv'
        else this.file.name_convert = this.file.name_modified + extension

        this.file.path = container.settings.workingDir + '/' + this.name
        this.file.path_rename = container.settings.workingDir + '/' + this.file.name_modified_ext

        // If this file includes a season, make a season folder for it
        if (this.file.season) {

            this.file.path_convert = this.path + `/${this.file.series} Season ${this.file.season}/` + this.file.name_convert

            if (!existsSync(this.path + `/${this.file.series} Season ${this.file.season}`))
                mkdirSync(this.path + `/${this.file.series} Season ${this.file.season}`)

        }
        // Otherwise, just put it in the root of the series folder
        else {
            this.file.path_convert = this.path + '/Converted/' + this.file.name_convert
            if (!existsSync(this.path + '/Converted')) mkdirSync(this.path + '/Converted')
        }

        if (extension === '.sub' || extension === '.idx') {

            //renameSync(this.path + '/' + this.file.name, this.path + '/../' + this.file.name)

        }

        renameSync(this.file.path, this.file.path_rename)

    }

}