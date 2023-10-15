import { Log } from 'logging/Log'
import { LogColor } from 'logging/LogColor'

/**
* Output a help message.
*/
export function help(logger: Log): void {

   return logger.sendPlain(`------------- ${LogColor.fgBlue('REDESIGN HELP')} -------------\n` +
       '\n' +
       `Usage: ${LogColor.fgBlue('redesign.js')} [${LogColor.fgBlue('resolution')}] [${LogColor.fgBlue('amount')}] [${LogColor.fgBlue('codec')}] [${LogColor.fgBlue('tune')}] [${LogColor.fgBlue('overrides')}]\n` +
       '\n' +
       'Resolution:\n' +
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
       `   ${LogColor.fgBlue('-validate:')}[${LogColor.fgBlue('dir')}]  - Override the validation directory\n` +
       `   ${LogColor.fgBlue('-trim:')}[${LogColor.fgBlue('hh:mm:ss,hh:mm:ss')}]   - Trim the media.\n` +
       `   ${LogColor.fgBlue('-novalidate:')}  - Skip validation .\n`)

}