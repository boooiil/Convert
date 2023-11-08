import { Container } from 'application/Container'
import { MediaProcess } from './MediaProcess'
import { Media } from './Media'
import { Activity } from 'application/Activity'
import { MediaFormat } from './MediaFormat'
import { MediaDefinedFormat } from './MediaDefinedFormat'

import * as childProcess from 'child_process'
import { ProbeResultFormat } from 'ffmpeg/ProbeResultFormat'
import { ProbeResultStreamAudio } from 'ffmpeg/ProbeResultStreamAudio'
import { ProbeResultStreamVideo } from 'ffmpeg/ProbeResultStreamVideo'
import { ProbeResultStreamSubtitle } from 'ffmpeg/ProbeResultStreamSubtitle'

export class MediaProcessStatistics extends MediaProcess {
    constructor(container: Container, media: Media) {
        super(container, media)
    }

    async start(): Promise<Activity> {

        return new Promise((resolve) => {

            this.child = childProcess.exec(`ffprobe -v quiet -print_format json -show_format -show_streams "${this.media.file.renamePath}"`, (err, data) => {

                let ffprobeResult: { format: ProbeResultFormat, streams: (ProbeResultStreamAudio | ProbeResultStreamVideo | ProbeResultStreamSubtitle)[] } = JSON.parse(data)

                let videoStream = ffprobeResult.streams.find(stream => stream.codec_type === 'video') as ProbeResultStreamVideo
                //let subtitleStreams = ffprobeResult.streams.filter(stream => stream.codec_type === 'subtitle') as ProbeResultStreamSubtitle[]

                const [numerator, denominator] = videoStream.r_frame_rate.split('/').map(Number)
                const timeMatch = videoStream.tags.DURATION.match(/(\d+):(\d+):(\d+)/)
                const duration = (Number(timeMatch[1]) * 60 * 60) + (Number(timeMatch[2]) * 60) + Number(timeMatch[3])

                this.media.file.size = parseInt(ffprobeResult.format.size)
                this.media.video.fps = Math.round((numerator / denominator) * 100) / 100
                this.media.video.width = videoStream.width
                this.media.video.height = videoStream.height
                this.media.video.totalFrames = Math.ceil(duration * this.media.video.fps)

                // for subtitle in subtitleStreams
                //    if subtitle.codec_name is 'mov_text'
                //       ... etc

                if (/header parsing failed/im.test(data)) {

                    return resolve(Activity.FAILED_FILE_NOT_RECOGNIZED)

                }

            })

            this.child.on('error', (err) => {

                console.log('****----**** WAS ERROR')
                throw err

            })

            this.child.on('close', () => {

                if (/failed/i.test(this.media.activity)) resolve(null)
                else {

                    let format = MediaDefinedFormat.formats[this.container.appEncodingDecision.quality]

                    this.media.video.convertedWidth = `${format.width}`
                    this.media.video.convertedHeight = `${MediaFormat.getResolution(this.media.video.width, this.media.video.height, format.width)}`
                    this.media.video.convertedResolution = this.media.video.convertedWidth + ':' + this.media.video.convertedHeight
                    this.media.video.crf = format.crf

                    return resolve(Activity.WAITING_CONVERT)

                }

            })

        })

    }
}