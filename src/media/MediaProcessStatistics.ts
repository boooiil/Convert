import { Container } from 'application/Container'
import { MediaProcess } from './MediaProcess'
import { Media } from './Media'
import { Activity } from 'application/Activity'
import { MediaFormat } from './MediaFormat'
import { MediaDefinedFormat } from './MediaDefinedFormat'

import * as child_process from 'child_process'

export class MediaProcessStatistics extends MediaProcess {
    constructor(container: Container, media: Media) {
        super(container, media)
    }

    async start(): Promise<Activity> {

        return new Promise((resolve) => {

            this.child = child_process.exec(`ffprobe -hide_banner -i "${this.media.file.path_rename}"`)

            this.child.stderr.on('data', data => {

                let sub_override = false
                
                data = data.toString()

                data.split('\n').forEach((line: string) => {

                    //fps
                    if (/(\d+\.\d+|\d+).?fps/.test(line)) this.media.video.fps = parseFloat(line.match(/(\d+\.\d+|\d+).?fps/)[1])

                    //total frames
                    if (/(?:NUMBER_OF_FRAMES|NUMBER_OF_FRAMES-eng|DURATION).+ (\d+:\d+:\d+|\d+)/.test(line)) {

                        let match = line.match(/(?:NUMBER_OF_FRAMES|NUMBER_OF_FRAMES-eng|DURATION).+ (\d+:\d+:\d+|\d+)/)[1]

                        // if we match by duration (hh:mm:ss)
                        if (match.includes(':')) {

                            let time_match = match.split(':')
                            let time = (Number(time_match[0]) * 60 * 60) + (Number(time_match[1]) * 60) + Number(time_match[2])

                            if (time && this.media.video.fps) this.media.video.total_frames = Math.ceil(time * this.media.video.fps) * 1000

                        }
                        // if we match by frames
                        else this.media.video.total_frames = parseInt(match)

                    }

                    //resolution
                    if (/, (\d+x\d+).?/.test(line)) {

                        let match = line.match(/, (\d+x\d+).?/)[1].split('x')

                        this.media.video.width = parseInt(match[0])
                        this.media.video.height = parseInt(match[1])

                    }

                    //subtitle
                    if (/([S-s]ubtitle: .+)/.test(line)) {

                        let match = line.match(/([S-s]ubtitle: .+)/)[1]

                        if (!sub_override && /subrip|ass|mov_text/.test(match)) this.media.video.subtitle_provider = 'mov'
                        else if (!sub_override && /dvd_sub/.test(match)) this.media.video.subtitle_provider = 'dvd'
                        else if (!sub_override && /hdmv_pgs_subtitle/.test(match)) {

                            sub_override = true
                            this.media.video.subtitle_provider = 'hdmv'

                        }

                    }

                    //attachment
                    if (/([A-a]ttachment: .+)/.test(line)) {

                        if (this.media.video.subtitle_provider === 'mov') this.media.video.subtitle_provider = 'ass'

                    }

                })

            })

            this.child.on('error', (err) => {

                if (/header parsing failed/im.test(err.message)) {

                    return resolve(Activity.FAILED_FILE)

                }

                else throw err

            })
            
            this.child.on('close', () => {

                if (/failed/i.test(this.media.activity)) resolve(null)
                else {

                    let format = MediaDefinedFormat.formats[this.container.appEncodingDecision.quality]

                    this.media.video.converted_width = `${format.width}`
                    this.media.video.converted_height = `${MediaFormat.getResolution(this.media.video.width, this.media.video.height, format.width)}`
                    this.media.video.converted_resolution = this.media.video.converted_width + ':' + this.media.video.converted_height

                    return resolve(Activity.WAITING_CONVERT)

                }

            })

        })

    }
}