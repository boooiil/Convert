/**
 * This class contains information regarding a file's video properties.
 */
export class MediaVideoProperties {

    /** Video frames per second */
    fps: number = 0
    /** Total video frames */
    totalFrames: number = 0
    /** Subtitle mapping within the video */
    subtitleProvider: string = ''
    /** Video width */
    width: number = 0
    /** Video height */
    height: number = 0
    /** ??? */
    ratio: string = ''
    /** Adjusted width */
    convertedWidth: string = ''
    /** Adjusted height */
    convertedHeight: string = ''
    /** Adjusted resolution */
    convertedResolution: string = ''
    /** Crop ratio */
    crop: string = ''
    /** Constant Rate Factor */
    crf: number = 0

    constructor() { }

}