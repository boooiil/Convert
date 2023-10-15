import { Encoders } from 'ffmpeg/Encoders'
import { HWAccel } from 'ffmpeg/HWAccelerators'

/**
 * This class contains internal settings for the application.
 */
export class Settings {

    /** Current working directory */
    workingDir = process.cwd()
    /** Directory to store temporary files */
    validateDir: string

    /** List of supported encoders */
    supportedEncoders: [
        Encoders.AV1,
        Encoders.AV1_AMF,
        Encoders.AV1_NVENC,
        Encoders.AV1_QSV,
        Encoders.H264,
        Encoders.H264_AMF,
        Encoders.H264_NVENC,
        Encoders.H264_QSV,
        Encoders.HEVC,
        Encoders.HEVC_AMF,
        Encoders.HEVC_NVENC,
        Encoders.HEVC_QSV
    ]

    /** List of supported hardware accelerators */
    supportedHWAccel: [
        HWAccel.AMD,
        HWAccel.NVIDIA,
        HWAccel.INTEL
    ]

    /** List containing tune patterns */
    tuneRegex = [
        new RegExp('film', 'i'),
        new RegExp('anim*', 'i'),
        new RegExp('grain', 'i'),
    ]

    /** List containing tune associations */
    tuneAssociations = [
        'film',
        'animation',
        'grain',
    ]

    /**
     * 
     * @param validateDirectory The directory to store temporary files.
     */
    constructor(validateDirectory: string = '/dev/shm/') {

        this.validateDir = validateDirectory

    }

}