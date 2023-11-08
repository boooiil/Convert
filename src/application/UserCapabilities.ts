import { Decoders } from 'ffmpeg/Decoders'
import { Encoders } from 'ffmpeg/Encoders'
import * as child from 'child_process'
/**
 * This class handles the operation of obtaining the hardware details of the user's system.
 */
export class UserCapabilities {

    /** User's Platform */
    platform = process.platform

    /** List of supported encoders */
    supportedEncoders: string[] = []
    /** List of supported decoders */
    supportedDecoders: string[] = []
    /** ??? */
    supportedFormats: string[] = []

    /** User's GPU provider */
    GPUProvider: 'intel' | 'nvidia' | 'amd' | 'unknown'

    constructor() { }

    /**
     * This function obtains the hardware details of the user's system.
     */
    async findHardwareDetails() {

        return new Promise((resolve, reject) => {

            if (this.platform === 'win32') {

                child.exec('wmic path win32_VideoController get name', (err, stdout, stderr) => {

                    if (err) throw err
                    if (stderr) throw stderr

                    stdout.split('\n').forEach((line) => {

                        if (/AMD/.test(line)) {

                            if (!this.GPUProvider) this.GPUProvider = 'amd'

                            this.supportedEncoders.push(Encoders.AV1_AMF)
                            this.supportedEncoders.push(Encoders.H264_AMF)
                            this.supportedEncoders.push(Encoders.HEVC_AMF)
                        }
                        else if (/NVIDIA/.test(line)) {

                            this.GPUProvider = 'nvidia'

                            this.supportedEncoders.push(Encoders.AV1_NVENC)
                            this.supportedEncoders.push(Encoders.H264_NVENC)
                            this.supportedEncoders.push(Encoders.HEVC_NVENC)

                            this.supportedDecoders.push(Decoders.AV1_CUVID)
                            this.supportedDecoders.push(Decoders.H264_CUVID)
                            this.supportedDecoders.push(Decoders.HEVC_CUVID)
                        }
                        else if (/Intel/.test(line)) {

                            this.GPUProvider = 'intel'

                            this.supportedEncoders.push(Encoders.AV1_QSV)
                            this.supportedEncoders.push(Encoders.H264_QSV)
                            this.supportedEncoders.push(Encoders.HEVC_QSV)

                            this.supportedDecoders.push(Decoders.AV1_QSV)
                            this.supportedDecoders.push(Decoders.H264_QSV)
                            this.supportedDecoders.push(Decoders.HEVC_QSV)
                        }
                        else {

                            if (!this.GPUProvider) { this.GPUProvider = 'unknown' }

                        }

                    })

                })

                this.supportedEncoders.push(Encoders.AV1)
                this.supportedEncoders.push(Encoders.H264)
                this.supportedEncoders.push(Encoders.HEVC)

                setTimeout(() => {
                    resolve(null)
                }, 1000)

            }

            else if (this.platform === 'linux') {

                child.exec('lspci | grep VGA', (err, stdout, stderr) => {

                    if (err) throw err
                    if (stderr) throw stderr

                    stdout.split('\n').forEach((line) => {

                        if (/AMD/.test(line)) {

                            if (!this.GPUProvider) this.GPUProvider = 'amd'

                            this.supportedEncoders.push(Encoders.AV1_AMF)
                            this.supportedEncoders.push(Encoders.H264_AMF)
                            this.supportedEncoders.push(Encoders.HEVC_AMF)
                        }
                        else if (/NVIDIA/.test(line)) {

                            this.GPUProvider = 'nvidia'

                            this.supportedEncoders.push(Encoders.AV1_NVENC)
                            this.supportedEncoders.push(Encoders.H264_NVENC)
                            this.supportedEncoders.push(Encoders.HEVC_NVENC)

                            this.supportedDecoders.push(Decoders.AV1_CUVID)
                            this.supportedDecoders.push(Decoders.H264_CUVID)
                            this.supportedDecoders.push(Decoders.HEVC_CUVID)
                        }
                        else if (/Intel/.test(line)) {

                            this.GPUProvider = 'intel'

                            this.supportedEncoders.push(Encoders.AV1_QSV)
                            this.supportedEncoders.push(Encoders.H264_QSV)
                            this.supportedEncoders.push(Encoders.HEVC_QSV)

                            this.supportedDecoders.push(Decoders.AV1_QSV)
                            this.supportedDecoders.push(Decoders.H264_QSV)
                            this.supportedDecoders.push(Decoders.HEVC_QSV)
                        }
                        else {

                            if (!this.GPUProvider) { this.GPUProvider = 'unknown' }

                        }

                    })

                })

                setTimeout(() => {

                    this.supportedEncoders.push(Encoders.AV1)
                    this.supportedEncoders.push(Encoders.H264)
                    this.supportedEncoders.push(Encoders.HEVC)

                    resolve(null)

                }, 1000)

            }

            else reject(new Error('Unsupported platform'))

        })

    }

}