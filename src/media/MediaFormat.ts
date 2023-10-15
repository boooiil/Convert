/**
 * This class contains information of intnernal conversion formats.
 */
export class MediaFormat {

    /** Filename */
    name: string
    /** Constant Rate Factor */
    crf: number
    /** Bitrate */
    bitrate: number
    /** Minimum bitrate */
    min: number
    /** Maximum bitrate */
    max: number
    /** Width */
    width: number
    /** Height */
    height: number
    /** Crop ratio */
    crop: string
    /** Scale ratio */
    scale: string

    /**
     * 
     * @param name Filename
     * @param crf Constant Rate Factor
     * @param bitrate Bitrate
     * @param min Minimum bitrate
     * @param max Maximum bitrate
     * @param width Width
     * @param height Height
     * @param crop Crop ratio
     * @param scale Scale ratio
     */
    constructor(name: string, crf: number, bitrate: number, min: number, max: number, width: number, height: number, crop: string, scale: string) {
        this.name = name
        this.crf = crf
        this.bitrate = bitrate
        this.min = min
        this.max = max
        this.width = width
        this.height = height
        this.crop = crop
        this.scale = scale
    }

    /**
     * Calculate the greatest common denominator of the given width and height.
     * @param width Width of the media.
     * @param height Height of the media.
     * @returns {number} The calculated greatest common denominator.
     */
    static getGCD(width: number, height: number): number {

        let x = Math.abs(width)
        let y = Math.abs(height)

        while (y) { const t = y; y = x % y; x = t }

        return x
    }

    /**
     * Calculate the resolution of a custom value from base width and height.
     * @param width Width of the media.
     * @param height Height of the media.
     * @param newWidth The new width of the media.
     * @returns {number} The calculated aspect ratio.
     */
    static getResolution(width: number, height: number, newWidth: number): number {

        let new_height = Math.ceil((height / width) * newWidth)

        new_height = new_height % 2 === 0 ? new_height : new_height - 1

        return new_height

    }
}