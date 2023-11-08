/**
 * This class contains information regarding a file's properties during the conversion process.
 */
export class MediaWorkingProperties {

    /** Current amount of frames being processed per second */
    fps: number = 0
    /** Total amount of frames converted */
    completedFrames: number = 0
    /** Conversion quality ratio */
    quality: number = 0
    /** Conversion bitrate */
    bitrate: number = 0

    constructor() { }

}