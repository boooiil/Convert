import { MediaFormat } from './MediaFormat'

export class MediaDefinedFormat {

    static formats: { [key: string]: MediaFormat } = {
        '2160p': new MediaFormat(
            '2160p',
            24,
            30,
            30,
            40,
            3840,
            2160,
            '3840:1600',
            '3840:2160'
        ),
        '1440p': new MediaFormat(
            '1440p',
            24,
            20,
            20,
            27,
            2560,
            1440,
            '2560:1068',
            '2560:1440'
        ),
        '1080p': new MediaFormat(
            '1080p',
            24,
            2.0,
            1.6,
            2.2,
            1920,
            1080,
            '1920:800',
            '1920:1080'
        ),
        '1080pm': new MediaFormat(
            '1080pm',
            24,
            2.0,
            1.6,
            2.2,
            1920,
            1080,
            '1920:870',
            '1920:1080'
        ),
        '1080pn': new MediaFormat(
            '1080pn',
            24,
            2.0,
            1.6,
            2.2,
            1920,
            1080,
            '1920:960',
            '1920:1080'
        ),
        '720p': new MediaFormat(
            '720p',
            24,
            1.4,
            1.2,
            1.8,
            1280,
            720,
            '1280:534',
            '1280:720'
        ),
        '720pm': new MediaFormat(
            '720pm',
            24,
            1.4,
            1.2,
            1.8,
            1280,
            720,
            '1280:580',
            '1280:720'
        ),
        '720pn': new MediaFormat(
            '720pn',
            24,
            1.4,
            1.2,
            1.8,
            1280,
            720,
            '1280:640',
            '1280:720'
        ),
        '480p': new MediaFormat(
            '480p',
            24,
            0.6,
            0.4,
            0.8,
            854,
            480,
            '854:356',
            '854:480'
        ),
        '480pc': new MediaFormat(
            '480pc',
            24,
            0.6,
            0.4,
            0.8,
            1138,
            640,
            '854:720',
            '1138:640'
        )
    }

    /**
     * This function adds a custom format to the formats object.
     * @param height The height of the custom format.
     */
    static addCustomFormat(height: number) {

        const customFormat = new MediaFormat(`${height}p`, null, null, null, null, null, null, null, null)

        customFormat.crf = 24
        customFormat.height = height % 2 ? height++ : height
        customFormat.width = Math.ceil(customFormat.height * 1.777777777777778)

        if (customFormat.width % 2) customFormat.width++

        let cropHeight = Math.ceil(customFormat.width / 2.4)

        if (cropHeight % 2) cropHeight++

        customFormat.crop = `${customFormat.width}:${cropHeight}`
        customFormat.scale = `${customFormat.width}:${customFormat.height}`

        this.formats[`${height}p`] = customFormat

    }
}