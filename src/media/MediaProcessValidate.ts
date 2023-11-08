import { MediaProcess } from './MediaProcess'
import { Container } from '../application/Container'
import { Media } from './Media'
import { Activity } from 'application/Activity'

import * as child_process from 'child_process'
import { existsSync, unlinkSync } from 'fs'

export class MediaProcessValidate extends MediaProcess {

    constructor(container: Container, media: Media) {
        super(container, media)
    }

    async start(): Promise<Activity> {

        return new Promise((resolve) => {

            this.child = child_process.exec(`ffprobe -hide_banner -i "${this.media.file.path_rename}"`)

            this.child.stderr.on('data', data => {

                data = data.toString()

                if (this.container.debug.toggle) console.log(data)

                // Get the converted frame amount and fps
                if (/(?<=frame=)(.*)(?=fps)/g.test(data)) {

                    let quality = data.match(/(?<=q=)(.*?)(?= )/g)
                    let bitrate = data.match(/(?<=bitrate=)(.*?)(?=kbits\/s)/g)
                    let size = data.match(/(?<=size=)(.*?)(?=kb)/ig)

                    quality = quality ? quality[0].trim() : 0
                    bitrate = bitrate ? bitrate[0].trim() : 0
                    size = size ? size[0].trim() : 0

                    this.media.file.val_size = Number(size) * 1000

                    this.media.working.completed_frames = data.match(/(?<=frame=)(.*)(?=fps)/g)[0].trim() * 1000
                    this.media.working.fps = data.match(/(?<=fps=)(.*)(?= q)/g)[0]
                    this.media.working.quality = quality
                    this.media.working.bitrate = bitrate


                }

                if (/corrupt/ig.test(data) || 
                    /invalid data found/ig.test(data) ||
                    /invalid argument/ig.test(data)) {

        
                    // Delete the testing file
                    // if (this.media.video.use_subtitle == 'hdmv') {
                    //     if (existsSync(o.settings.validate + `Testing/${media.file.name}`)) unlinkSync(o.settings.validate + `Testing/${media.file.name}`)
                    // }
                    if (existsSync(this.container.settings.validateDir + `Testing/${this.media.file.name_convert}`)) {
                        unlinkSync(this.container.settings.validateDir + `Testing/${this.media.file.name_convert}`)
                    }

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