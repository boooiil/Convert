import { Process } from 'application/Process'
import { MediaFile } from './MediaFile'
import { MediaVideoProperties } from './MediaVideoProperties'
import { MediaWorkingProperties } from './MediaWorkingProperties'
import { Container } from 'application/Container'
import * as child from 'child_process'
import { MediaFormat } from './MediaFormat'
import { HWAccel } from 'ffmpeg/HWAccelerators'
import { LogColor } from 'logging/LogColor'
import { existsSync, mkdirSync, renameSync } from 'fs'

/**
 * The Media class contains properties and methods for handling media files, including renaming and
 *  setting file information. 
 */
export class Media {

    /** Filename */
    name: string = ''
    /** Current file activity */
    activity: Process = Process.WAITING
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

        return this.activity === Process.STATISTICS || this.activity === Process.CONVERT || this.activity === Process.VALIDATE

    }

    /**
     * Spawn a statistic instance for the file.
     * @returns {Promise<null>}
     */
    async doStatistics(container: Container): Promise<null> {

        this.activity = Process.STATISTICS

        return new Promise((resolve, reject) => {

            child.exec(`ffprobe -hide_banner -i "${this.file.path_rename}"`, (err, stdout, stderr) => {

                if (err) {

                    if (/header parsing failed/im.test(err.message)) {

                        this.activity = Process.FAILED_FILE

                    }

                    else throw err

                }
                //if (stderr) throw stderr

                let data = stderr.toString()
                let sub_override = false

                data.split('\n').forEach((line) => {

                    //fps
                    if (/(\d+\.\d+|\d+).?fps/.test(line)) this.video.fps = parseFloat(line.match(/(\d+\.\d+|\d+).?fps/)[1])

                    //total frames
                    if (/(?:NUMBER_OF_FRAMES|NUMBER_OF_FRAMES-eng|DURATION).+ (\d+:\d+:\d+|\d+)/.test(line)) {

                        let match = line.match(/(?:NUMBER_OF_FRAMES|NUMBER_OF_FRAMES-eng|DURATION).+ (\d+:\d+:\d+|\d+)/)[1]

                        // if we match by duration (hh:mm:ss)
                        if (match.includes(':')) {

                            let time_match = match.split(':')
                            let time = (Number(time_match[0]) * 60 * 60) + (Number(time_match[1]) * 60) + Number(time_match[2])

                            if (time && this.video.fps) this.video.total_frames = Math.ceil(time * this.video.fps) * 1000

                        }
                        // if we match by frames
                        else this.video.total_frames = parseInt(match)

                    }

                    //resolution
                    if (/, (\d+x\d+).?/.test(line)) {

                        let match = line.match(/, (\d+x\d+).?/)[1].split('x')

                        this.video.width = parseInt(match[0])
                        this.video.height = parseInt(match[1])

                    }

                    //subtitle
                    if (/([S-s]ubtitle: .+)/.test(line)) {

                        let match = line.match(/([S-s]ubtitle: .+)/)[1]

                        if (!sub_override && /subrip|ass|mov_text/.test(match)) this.video.subtitle_provider = 'mov'
                        else if (!sub_override && /dvd_sub/.test(match)) this.video.subtitle_provider = 'dvd'
                        else if (!sub_override && /hdmv_pgs_subtitle/.test(match)) {

                            sub_override = true
                            this.video.subtitle_provider = 'hdmv'

                        }

                    }

                    //attachment
                    if (/([A-a]ttachment: .+)/.test(line)) {

                        if (this.video.subtitle_provider === 'mov') this.video.subtitle_provider = 'ass'

                    }

                })

            }).on('close', () => {

                if (/failed/i.test(this.activity)) resolve(null)
                else {

                    let format = container.formats[container.appEncodingDecision.quality]

                    this.video.converted_width = `${format.width}`
                    this.video.converted_height = `${MediaFormat.getResolution(this.video.height, this.video.width, format.width)}`
                    this.video.converted_resolution = this.video.converted_width + ':' + this.video.converted_height

                    this.activity = Process.WAITING_CONVERT
                    resolve(null)

                }

            })

        })

    }

    /**
     * Spawn a conversion instance for the file.
     * @returns {Promise<null>}
     */
    async doConvert(): Promise<null> {

        return new Promise((resolve, reject) => {

            this.activity = Process.CONVERT

            setTimeout(() => {
                this.activity = Process.WAITING_VALIDATE
                resolve(null)
            }, 2000)

        })

    }

    /**
     * Spawn a validation instance for the file.
     * @returns {Promise<null>}
     */
    async doValidate(): Promise<null> {

        return new Promise((resolve, reject) => {

            this.activity = Process.VALIDATE

            setTimeout(() => {
                this.activity = Process.FINISHED
                resolve(null)
            }, 2000)

        })

    }

    /**
     * Build specific FFmpeg arguments for the encoding process.
     * @param container The container object that contains all of the information about the current and pending conversions.
     * @param overwrite If the file should be overwritten.
     */
    buildFFmpegArguments(container: Container, overwrite: boolean = false) {

        let format = container.formats[container.appEncodingDecision.quality]

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

        this.ffmpeg_argument.push('-i', this.file.path_rename)

        /** Map video stream to index 0 */
        this.ffmpeg_argument.push('-map', '0:v:0')
        /** Map all audio streams */
        this.ffmpeg_argument.push('-map', '0:a?')
        /** Map all subtitle streams */
        this.ffmpeg_argument.push('-map', '0:s?')
        /** Map all attachment streams */
        this.ffmpeg_argument.push('-map', '0:t?')

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
        if (this.video.subtitle_provider) {

            if (this.video.subtitle_provider === 'mov') this.ffmpeg_argument.push('-c:s', 'mov_text')
            else this.ffmpeg_argument.push('-c:s', 'copy')

        }

        if (container.appEncodingDecision.tune) {

            this.ffmpeg_argument.push('-tune', container.appEncodingDecision.tune)

        }

        if (overwrite) this.ffmpeg_argument.push('-y')

        this.ffmpeg_argument.push(this.file.path_convert)

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

        if (extension === '.mkv' || extension === '.avi') this.file.name_convert = this.file.name_modified + '.mp4'
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