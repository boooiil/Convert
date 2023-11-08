import { Activity } from 'application/Activity'
import { MediaFile } from './MediaFile'
import { MediaVideoProperties } from './MediaVideoProperties'
import { MediaWorkingProperties } from './MediaWorkingProperties'
import { Container } from 'application/Container'
import { HWAccel } from 'ffmpeg/HWAccelerators'
import { existsSync, mkdirSync, renameSync } from 'fs'
import { MediaDefinedFormat } from './MediaDefinedFormat'
import { MediaProcessStatistics } from './MediaProcessStatistics'
import { MediaProcessConversion } from './MediaProcessConversion'
import { MediaProcessValidate } from './MediaProcessValidate'
import { Log } from 'logging/Log'

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
    ffmpegArguments: string[] = []

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
        this.ffmpegArguments = []

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

        this.ffmpegArguments = []

        this.ffmpegArguments.push('-hide_banner')

        if (container.appEncodingDecision.useHardwareDecode) {

            switch (container.userCapabilities.GPUProvider) {

                case 'amd':
                    this.ffmpegArguments.push('-hwaccel', HWAccel.AMD)
                    break

                case 'intel':
                    this.ffmpegArguments.push('-hwaccel', HWAccel.INTEL)
                    break

                case 'nvidia':
                    this.ffmpegArguments.push('-hwaccel', HWAccel.NVIDIA)
                    break

            }

        }

        this.ffmpegArguments.push('-i', `"${this.file.renamePath}"`)

        /** Map video stream to index 0 */
        this.ffmpegArguments.push('-map', '0:v:0')

        if (container.appEncodingDecision.audioStreams.length) {

            for (const stream of container.appEncodingDecision.audioStreams) {

                this.ffmpegArguments.push('-map', `0:a:${stream}`)

            }

        }
        else {

            /** Map all audio streams */
            this.ffmpegArguments.push('-map', '0:a?')

        }

        /** Map all subtitle streams */
        this.ffmpegArguments.push('-map', '0:s?')
        /** Map all attachment streams */
        this.ffmpegArguments.push('-map', '0:t?')

        /** Codec video */
        this.ffmpegArguments.push('-c:v', container.appEncodingDecision.runningEncoder)

        /** Codec attachment, Copy */
        this.ffmpegArguments.push('-c:t', 'copy')

        this.ffmpegArguments.push('-c:a', 'copy')

        /** Slow CPU preset */
        this.ffmpegArguments.push('-preset', 'slow')

        /** Encoder level */
        this.ffmpegArguments.push('-level', '4.1')

        if (container.appEncodingDecision.useBitrate) {

            this.ffmpegArguments.push('-b:v', `${format.bitrate}M`)
            this.ffmpegArguments.push('-bufsize', `${format.bitrate * 2}M`)
            this.ffmpegArguments.push('-maxrate', `${format.max}M`)
            this.ffmpegArguments.push('-minrate', `${format.min}M`)

        }

        else if (container.appEncodingDecision.useConstrain) {

            this.ffmpegArguments.push('-crf', `${format.crf}`)
            this.ffmpegArguments.push('-bufsize', `${format.bitrate * 2}M`)
            this.ffmpegArguments.push('-maxrate', `${format.max}M`)

        }

        else {

            this.ffmpegArguments.push('-crf', `${format.crf}`)

        }

        if (container.appEncodingDecision.crop) {

            this.ffmpegArguments.push('-vf', `scale=${this.video.convertedResolution}:flags=lanczos,crop=${format.crop}`)


        }

        else this.ffmpegArguments.push('-vf', `scale=${this.video.convertedResolution}:flags=lanczos`)

        if (container.appEncodingDecision.startBeginning) {

            this.ffmpegArguments.push('-ss', container.appEncodingDecision.startBeginning)

        }

        if (container.appEncodingDecision.trim) {

            this.ffmpegArguments.push('-ss', container.appEncodingDecision.trim.split(',')[0])
            this.ffmpegArguments.push('-to', container.appEncodingDecision.trim.split(',')[1])

        }

        /** TODO: flesh out later */
        // if (this.video.subtitle_provider) {

        //     if (this.video.subtitle_provider === 'mov') this.ffmpeg_argument.push('-c:s', 'mov_text')
        //     else this.ffmpeg_argument.push('-c:s', 'copy')

        // }

        this.ffmpegArguments.push('-c:s', 'copy')

        if (container.appEncodingDecision.tune) {

            this.ffmpegArguments.push('-tune', container.appEncodingDecision.tune)

        }

        if (overwrite || container.appEncodingDecision.overwrite) this.ffmpegArguments.push('-y')

        this.ffmpegArguments.push(`"${this.file.conversionPath}"`)

        Log.debug('FFMPEG Arguments:', this.ffmpegArguments.join(' '))

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
            this.file.modifiedFileName = `${this.file.series} s${this.file.season}${episode} [${this.file.quality}p]`
            this.file.modifiedFileNameExt = this.file.modifiedFileName + extension

        }

        else {

            this.file.ext = extension
            this.file.modifiedFileName = this.name.replace(extension, '')
            this.file.modifiedFileNameExt = this.name

        }

        if (extension === '.mkv' || extension === '.avi') this.file.conversionName = this.file.modifiedFileName + '.mkv'
        else this.file.conversionName = this.file.modifiedFileName + extension

        this.file.path = container.settings.workingDir + '/' + this.name
        this.file.renamePath = container.settings.workingDir + '/' + this.file.modifiedFileNameExt

        // If this file includes a season, make a season folder for it
        if (this.file.season) {

            this.file.conversionPath = this.path + `/${this.file.series} Season ${this.file.season}/` + this.file.conversionName

            if (!existsSync(this.path + `/${this.file.series} Season ${this.file.season}`))
                mkdirSync(this.path + `/${this.file.series} Season ${this.file.season}`)

        }
        // Otherwise, just put it in the root of the series folder
        else {
            this.file.conversionPath = this.path + '/Converted/' + this.file.conversionName
            if (!existsSync(this.path + '/Converted')) mkdirSync(this.path + '/Converted')
        }

        if (extension === '.sub' || extension === '.idx') {

            //renameSync(this.path + '/' + this.file.name, this.path + '/../' + this.file.name)

        }

        renameSync(this.file.path, this.file.renamePath)

    }

}