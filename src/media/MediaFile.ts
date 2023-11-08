/**
 * This class contains information regarding a file's properties.
 */
export class MediaFile {

    /** Modified filename */
    modifiedFileName: string = ''
    /** Modified filename with extension */
    modifiedFileNameExt: string = ''
    /** Conversion filename with extension */
    conversionName: string = ''
    /** File Extension */
    ext: string = ''
    /** File size */
    size: number = 0
    /** New file size */
    newSize: number = 0
    /** Validation size */
    validationSize: number = 0
    /** Original file path with file */
    path: string = ''
    /** Renamed file path with file */
    renamePath: string = ''
    /** Converted file path with file*/
    conversionPath: string = ''
    /** Quality */
    quality: number = 0
    /** Series Name */
    series: string = ''
    /** Season Number */
    season: number = 0

    constructor() { }

}