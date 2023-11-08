import { Log } from 'logging/Log'
import { LogColor } from 'logging/LogColor'

//TODO: format to make it look better

/**
* Output a help message.
*/
export function help(logger: Log): void {

    return logger.sendPlain(`------------- ${LogColor.fgBlue('REDESIGN HELP')} -------------\n` +
        '\n' +
        `Usage: node ${LogColor.fgBlue('convert.js')} [${LogColor.fgBlue('...options')}]\n` +
        '\n' +
        'Options:\n' +
        '\n' +
        '   ' + LogColor.fgBlue('-a, --amount <number>') + '\n' +
        '       - Amount of media to convert at once.\n\n' +
        '   ' + LogColor.fgBlue('-as, --audiostreams <num1, num2, ...>') + '\n' +
        '       - Specify which audio streams to keep.\n\n' +
        '   ' + LogColor.fgBlue('-b, --bitrate') + '\n' +
        '       - Use bitrates instead of CRF. You can only use defined resolutions with this flag.\n\n' +
        '   ' + LogColor.fgBlue('-c, --crop') + '\n' +
        '       - Crop the media to the specified resolution.\n\n' +
        '   ' + LogColor.fgBlue('-co, --constrain') + '\n' +
        '       - Force the encoder to use a max bitrate with CRF.\n\n' +
        '   ' + LogColor.fgBlue('-crf, --crf <number>') + '\n' +
        '       - Override the CRF value for the current media.\n\n' +
        '   ' + LogColor.fgBlue('-d, --debug') + '\n' +
        '       - Enable debug logging.\n\n' +
        '   ' + LogColor.fgBlue('-e, --encoder <encoder>') + '\n' +
        '       - Specify the encoder to use.\n\n' +
        '   ' + LogColor.fgBlue('-h, --help') + '\n' +
        '       - Output this help message.\n\n' +
        '   ' + LogColor.fgBlue('-hwe, --hardwareencode') + '\n' +
        '       - Use hardware encoding.\n\n' +
        '   ' + LogColor.fgBlue('-o, --overwrite') + '\n' +
        '       - Overwrite existing files.\n\n' +
        '   ' + LogColor.fgBlue('-q, --quality <number>p') + '\n' +
        '       - Specify the resolution.\n\n' +
        '   ' + LogColor.fgBlue('-s, --start <hh:mm:ss>') + '\n' +
        '       - Skip the beginning by specified amount of time.\n\n' +
        '   ' + LogColor.fgBlue('-t, --tune <tune>') + '\n' +
        '       - Specify the encoder tune.\n\n' +
        '   ' + LogColor.fgBlue('-t, --trim <hh:mm:ss,hh:mm:ss>') + '\n' +
        '       - Trim the media.\n\n' +
        'Resolutions:\n' +
        '    Custom:\n' +
        '      <value>p\n' +
        '        CRF: 24\n' +
        '        BITRATE: NULL\n' +
        '        MIN: NULL\n' +
        '        MAX: NULL\n' +
        '        WIDTH: CALCULATED\n' +
        '        HEIGHT: PROVIDED\n' +
        '        CROP: CALCULATED (12:5)\n\n' +
        '    Configured\n' +
        '      2160p\n' +
        '        CRF: 24\n' +
        '        BITRATE: 30M\n' +
        '        MIN: 30M\n' +
        '        MAX: 40M\n' +
        '        WIDTH: 3840\n' +
        '        HEIGHT: 2160\n' +
        '        CROP: 3840:1600 (12:5)\n\n' +
        '      1440p\n' +
        '        CRF: 24\n' +
        '        BITRATE: 20M\n' +
        '        MIN: 20M\n' +
        '        MAX: 27M\n' +
        '        WIDTH: 2560\n' +
        '        HEIGHT: 1440\n' +
        '        CROP: 2560:1068 (12:5)\n\n' +
        '      1080p\n' +
        '        CRF: 24\n' +
        '        BITRATE: 2M\n' +
        '        MIN: 1.6M\n' +
        '        MAX: 2.2M\n' +
        '        WIDTH: 1920\n' +
        '        HEIGHT: 1080\n' +
        '        CROP: 1920:800 (12:5)\n\n' +
        '      1080pn (Traditional TV/Netflix Cropping)\n' +
        '        CRF: 24\n' +
        '        BITRATE: 2M\n' +
        '        MIN: 1.6M\n' +
        '        MAX: 2.2M\n' +
        '        WIDTH: 1920\n' +
        '        HEIGHT: 800\n' +
        '        CROP: 1920:960 (2:1)\n\n' +
        '      1080pm (Marvel Cropping)\n' +
        '        CRF: 24\n' +
        '        BITRATE: 2M\n' +
        '        MIN: 1.6M\n' +
        '        MAX: 2.2M\n' +
        '        WIDTH: 1920\n' +
        '        HEIGHT: 800\n' +
        '        CROP: 1920:870 (64:29)\n\n' +
        '      720p\n' +
        '        CRF: 24\n' +
        '        BITRATE: 1.4M\n' +
        '        MIN: 1.2M\n' +
        '        MAX: 1.8M\n' +
        '        WIDTH: 1280\n' +
        '        HEIGHT: 720\n' +
        '        CROP: 1280:534 (12:5)\n\n' +
        '      720pn (Traditional TV/Netflix Cropping)\n' +
        '        CRF: 24\n' +
        '        BITRATE: 1.4M\n' +
        '        MIN: 1.2M\n' +
        '        MAX: 1.8M\n' +
        '        WIDTH: 1280\n' +
        '        HEIGHT: 720\n' +
        '        CROP: 1280:640 (2:1)\n\n' +
        '      720pm (Marvel Cropping)\n' +
        '        CRF: 24\n' +
        '        BITRATE: 1.4M\n' +
        '        MIN: 1.2M\n' +
        '        MAX: 1.8M\n' +
        '        WIDTH: 1280\n' +
        '        HEIGHT: 720\n' +
        '        CROP: 1280:580 (64:29)\n\n' +
        '      480p\n' +
        '        CRF: 24\n' +
        '        BITRATE: 600K\n' +
        '        MIN: 400K\n' +
        '        MAX: 800K\n' +
        '        WIDTH: 854\n' +
        '        HEIGHT: 480\n' +
        '        CROP: 854:356 (12:5)\n\n' +
        '      480pc (NTSC Cropping)\n' +
        '        CRF: 24\n' +
        '        BITRATE: 600K\n' +
        '        MIN: 400K\n' +
        '        MAX: 800K\n' +
        '        WIDTH: 1138\n' +
        '        HEIGHT: 640\n' +
        '        CROP: 854:720 (32:27)\n\n' +
        'Tunes:\n' +
        '   film\n' +
        '   animation\n' +
        '   grain\n\n' +
        'Encoders:\n' +
        '   NVIDIA:\n' +
        '      AV1_NVENC (RTX 4000 OR NEWER)\n' +
        '      HEVC_NVENC (GTX 600 OR NEWER)\n' +
        '      H264_NVENC\n\n' +
        '   AMD:\n' +
        '      AV1_AMF (RX 7000 OR NEWER)\n' +
        '      HEVC_AMF (CARRIZO/RX 480 OR NEWER)\n' +
        '      H264_AMF\n\n' +
        '   INTEL:\n' +
        '      AV1_QSV (ARC 300 OR NEWER)\n' +
        '      HEVC_QSV (HD 500/ARC 300 OR NEWER)\n' +
        '      H264_QSV\n\n' +
        '   SOFTWARE:\n' +
        '      AV1 (NOT RECOMMENDED, SLOW)\n' +
        '      HEVC (NEWER i5/R5 RECOMMENDED)\n' +
        '      H264\n\n' +
        'Hardware Acceleration:\n' +
        '   NVIDIA:\n' +
        '      CUDA (GPU MUST SUPPORT INPUT CODEC)\n' +
        '   AMD:\n' +
        '      AMF (GPU MUST SUPPORT INPUT CODEC)\n' +
        '   INTEL:\n' +
        '      QSV (GPU MUST SUPPORT INPUT CODEC)\n' +
        '   VULKAN:\n' +
        '      VAAPI (UNTESTED)\n' +









        '   One of the pre-configured resolutons [' +
        `${LogColor.fgBlue('2160p')}, ${LogColor.fgBlue('1440p')}, ${LogColor.fgBlue('1080pn')}, ${LogColor.fgBlue('720p')}, ${LogColor.fgBlue('480p')}` +
        '] (must include the p)\n' +
        '\n' +
        '   Special Formats:\n' +
        `      ${LogColor.fgBlue('1080pn')} - Netflix cropping (${LogColor.fgBlue('2:1')})\n` +
        `      ${LogColor.fgBlue('720pn')}  - Netflix cropping (${LogColor.fgBlue('2:1')})\n` +
        `      ${LogColor.fgBlue('1080pm')} - Marvel cropping  (${LogColor.fgBlue('64:29')})\n` +
        `      ${LogColor.fgBlue('720pm')}  - Marvel cropping  (${LogColor.fgBlue('64:29')})\n` +
        `      ${LogColor.fgBlue('480pc')}  - NTSC cropping    (${LogColor.fgBlue('32:27')})\n` +
        '\n' +
        'Amount:\n' +
        '   Amount of media to convert at once.\n' +
        '\n' +
        'Codec:\n' +
        `   One of the pre-configured codecs [${LogColor.fgBlue('hevc')}, ${LogColor.fgBlue('nvenc')}, ${LogColor.fgBlue('h264')}]\n` +
        '\n' +
        'Tune:\n' +
        `   One of the ffmpeg tune profiles [${LogColor.fgBlue('film')}, ${LogColor.fgBlue('animaton')}, ${LogColor.fgBlue('grain')}]\n` +
        '\n' +
        'Overrides:' +
        '\n' +
        `   ${LogColor.fgBlue('-bitrate')}[${LogColor.fgBlue('mbps')}]  - Use bitrates instead of CRF. You can only use defined resolutions with this flag.\n` +
        `   ${LogColor.fgBlue('-constrain')}  - Force the encoder to use a max bitrate with CRF.\n` +
        `   ${LogColor.fgBlue('-skip-beginning:')}[${LogColor.fgBlue('hh:mm:ss')}]  - Skip the beginning by specified amount of time.\n` +
        `   ${LogColor.fgBlue('-crf:')}[${LogColor.fgBlue('crf')}]  - Override the CRF value for the current media.\n` +
        `   ${LogColor.fgBlue('-trim:')}[${LogColor.fgBlue('hh:mm:ss,hh:mm:ss')}]   - Trim the media.\n` +
        `   ${LogColor.fgBlue('-novalidate:')}  - Skip validation .\n`)

}