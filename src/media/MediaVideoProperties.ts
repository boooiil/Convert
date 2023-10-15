/**
 * This class contains information regarding a file's video properties.
 */
export class MediaVideoProperties {

    /** Video frames per second */
    fps: number = 0
    /** Total video frames */
    total_frames: number = 0
    /** Subtitle mapping within the video */
    subtitle_provider: string = ''
    /** Video width */
    width: number = 0
    /** Video height */
    height: number = 0
    /** ??? */
    ratio: string = ''
    /** Adjusted width */
    converted_width: string = ''
    /** Adjusted height */
    converted_height: string = ''
    /** Adjusted resolution */
    converted_resolution: string = ''
    /** Crop ratio */
    crop: string = ''
    /** Constant Rate Factor */
    crf: number = 0

    constructor() { }

}