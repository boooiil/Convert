import { Container } from 'application/Container'
import { MediaProcess } from './MediaProcess'
import { Media } from './Media'

import * as child_process from 'child_process'
import { Activity } from 'application/Activity'

export class MediaProcessConversion extends MediaProcess {

    constructor(container: Container, media: Media) {
        super(container, media)
    }

    async start(): Promise<Activity> {

        this.media.buildFFmpegArguments(this.container)

        return new Promise((resolve) => {

            this.child = child_process.exec(`ffmpeg -hide_banner ${this.media.ffmpeg_argument.join(' ')}`)

            this.child.stderr.on('data', data => {

                data = data.toString()

                //if (this.container.debug.toggle) console.log(data)

                // Return fail IF:
                // 1&2. Encode fails to find a device
                // 3. Encode fails to load nvcuda.dll
                // 4. Encode fails to find an nvidia device
                if (/openencodesessionex failed: out of memory/ig.test(data) ||
                    /no capable devices found/ig.test(data) ||
                    /cannot load nvcuda.dll/ig.test(data) ||
                    /device type cuda needed for codec/ig.test(data)) {

                    this.stop()

                    if (this.container.appEncodingDecision.useHardwareEncode) {
                        return resolve(Activity.FAILED_HARDWARE)
                    }
                    else if (/nvenc|amf|qsv/.test(this.container.appEncodingDecision.wantedEncoder)) {
                        return resolve(Activity.FAILED_HARDWARE)
                    }
                    else throw new Error('Out of memory even though hardware encoding is disabled. This should not happen.')

                    this.container.appEncodingDecision.useHardwareDecode = false
                    return resolve(Activity.WAITING_CONVERT)

                }

                // If the file is already encoded, set the process status to validating
                else if (/already exists/ig.test(data)) {

                    return resolve(Activity.WAITING_VALIDATE)

                }

                else if (/no such file/ig.test(data)) {

                    return resolve(Activity.FAILED_FILE_MISSING)
                }

                else {

                    // Get the converted frame amount and fps
                    if (/(?<=frame=)(.*)(?=fps)/g.test(data)) {

                        let quality = data.match(/(?<=q=)(.*?)(?= )/g)
                        let bitrate = data.match(/(?<=bitrate=)(.*?)(?=kbits\/s)/g)
                        let size = data.match(/(?<=size=)(.*?)(?=kb)/ig)

                        quality = quality ? quality[0].trim() : 0
                        bitrate = bitrate ? bitrate[0].trim() : 0
                        size = size ? size[0].trim() : 0

                        this.media.working.completed_frames = data.match(/(?<=frame=)(.*)(?=fps)/g)[0].trim() //* 1000
                        this.media.working.fps = Number(data.match(/(?<=fps=)(.*)(?= q)/g)[0])
                        this.media.working.quality = Number(quality)
                        this.media.working.bitrate = Number(bitrate)
                        this.media.file.new_size = Number(size) * 1000

                    }
                }

            })

            this.child.on('error', (err) => {

                console.log('****----**** WAS ERROR')
                throw err

            })

            this.child.on('close', () => {

                if (!/failed/i.test(this.media.activity)) {

                    return resolve(Activity.WAITING_VALIDATE)

                }

            })

        })

    }

}