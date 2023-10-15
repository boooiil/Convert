/**
 * This class contains information regarding a file's properties.
 */
export class MediaFile {

    /** Modified filename */
    name_modified: string = ''
    /** Modified filename with extension */
    name_modified_ext: string = ''
    /** Conversion filename with extension */
    name_convert: string = ''
    /** File Extension */
    ext: string = ''
    /** File size */
    size: number = 0
    /** New file size */
    new_size: number = 0
    /** Validation size */
    val_size: number = 0
    /** Original file path with file */
    path: string = ''
    /** Renamed file path with file */
    path_rename: string = ''
    /** Converted file path with file*/
    path_convert: string = ''
    /** Quality */
    quality: number = 0
    /** Series Name */
    series: string = ''
    /** Season Number */
    season: number = 0

    constructor() { }

}