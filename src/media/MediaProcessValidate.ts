import { MediaProcess } from './MediaProcess'
import { Container } from '../application/Container'
import { Media } from './Media'
import { Activity } from 'application/Activity'

import * as childProcess from 'child_process'

export class MediaProcessValidate extends MediaProcess {

    constructor(container: Container, media: Media) {
        super(container, media)
    }

    async start(): Promise<Activity> {

        return new Promise((resolve) => {

            this.child = childProcess.exec(`ffmpeg -hide_banner -i "${this.media.file.conversionPath}" -f null -`)

            this.child.stderr.on('data', data => {

                data = data.toString()

                // Get the converted frame amount and fps
                if (/(?<=frame=)(.*)(?=fps)/g.test(data)) {

                    let quality = data.match(/(?<=q=)(.*?)(?= )/g)
                    let bitrate = data.match(/(?<=bitrate=)(.*?)(?=kbits\/s)/g)
                    let size = data.match(/(?<=size=)(.*?)(?=kb)/ig)

                    quality = quality ? quality[0].trim() : 0
                    bitrate = bitrate ? bitrate[0].trim() : 0
                    size = size ? size[0].trim() : 0

                    this.media.file.validationSize = Number(size) * 1000

                    this.media.working.completedFrames = data.match(/(?<=frame=)(.*)(?=fps)/g)[0].trim()
                    this.media.working.fps = data.match(/(?<=fps=)(.*)(?= q)/g)[0]
                    this.media.working.quality = quality
                    this.media.working.bitrate = bitrate

                }

                if (/corrupt/ig.test(data) || 
                    /invalid data found/ig.test(data) ||
                    /invalid argument/ig.test(data)) {

                    return resolve(Activity.FAILED_CORRUPT)
        
                }

            })

            this.child.on('error', (err) => {

                console.log('****----**** WAS ERROR')
                throw err

            })

            this.child.on('close', () => {

                if (!/failed/i.test(this.media.activity)) {

                    return resolve(Activity.FINISHED)

                }

            })

        })
    }

}