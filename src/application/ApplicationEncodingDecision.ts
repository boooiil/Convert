import { Encoders } from 'ffmpeg/Encoders'
import { HWAccel } from 'ffmpeg/HWAccelerators'

/**
 * This class contains application settings and handles the
 * verification of the user's desired settings.
 */
export class ApplicationEncodingDecision {

    /** The user's desired encoder */
    wantedEncoder: string = Encoders.HEVC
    /** The current encoder being used */
    runningEncoder: string = Encoders.HEVC
    /** The current decoder being used */
    runningDecoder: string = HWAccel.NVIDIA
    /** Defined MediaFormat quality */
    quality: string = '720p'
    /** Codec tune setting */
    tune: string = ''
    /** Amount of concurrent conversions */
    amount: number = 1
    /** CRF override */
    crfOverride: number = 0
    /** Crop the video */
    crop: boolean = false
    /** Start the video from this time */
    startBeginning: string = ''
    /** Trim the video to this time */
    trim: string = ''
    /** Use bitrate instead of CRF */
    useBitrate: boolean = false
    /** Use strict bitrate values instead of variable */
    useConstrain: boolean = false
    /** Validate the video after conversion */
    validate: boolean = true
    /** Use hardware decode */
    useHardwareDecode: boolean = true
    /** Use hardware encode */
    useHardwareEncode: boolean = false
    /** Overwrite existing file */
    overwrite: boolean = false
    audioStreams: string[] = []

    constructor() { }

    /**
     * This function validates the user's input and sets default values if necessary.
     */
    validateInput() {

        if (this.tune === 'film' && this.wantedEncoder.includes('hevc')) {

            this.tune = ''

        }

    }
}