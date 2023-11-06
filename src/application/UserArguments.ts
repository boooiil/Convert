import { help } from 'utils/Help'
import { Container } from './Container'
import { LogColor } from 'logging/LogColor'
import { Log } from 'logging/Log'
import { MediaDefinedFormat } from 'media/MediaDefinedFormat'

/**
 * This class handles parsing of user arguments.
 */
export class UserArguments {

    /**
     * Parse the user's arguments and set the appropriate values.
     * @param container The container object that contains all of the information about the current and pending conversions.
     */
    parse(container: Container) {

        process.argv.forEach((argument, index) => {

            if (argument.startsWith('-')) {

                switch (argument) {

                    case '-h':
                    case '--help':
                        help(container.logger)
                        process.exit(0)

                    case '-d':
                    case '--debug':
                        container.debug.toggle = true
                        break

                    case '-e':
                    case '--encoder':

                        if (container.userCapabilities.supportedEncoders.includes(process.argv[index + 1])) {
                            container.appEncodingDecision.wantedEncoder = process.argv[index + 1]
                        }
                        else {
                            this.invalid(argument)
                            process.exit(1)
                        }
                        break

                    case '-q':
                    case '--quality':

                        if (MediaDefinedFormat.formats[process.argv[index + 1]]) {

                            container.appEncodingDecision.quality = process.argv[index + 1]
                            break

                        }

                        else {

                            MediaDefinedFormat.addCustomFormat(parseInt(process.argv[index + 1].replace('p', '')))

                        }

                    case '-t':
                    case '--tune':

                        for (let i = 0; i < container.settings.tuneRegex.length; i++) {

                            if (container.settings.tuneRegex[i].test(process.argv[index + 1])) {

                                container.appEncodingDecision.tune = container.settings.tuneAssociations[i]
                                break

                            }

                        }

                        if (!container.appEncodingDecision.tune) container.appEncodingDecision.tune = container.settings.tuneAssociations[0]
                        break

                    case '-a':
                    case '--amount':
                        container.appEncodingDecision.amount = parseInt(process.argv[index + 1])
                        break

                    case '-c':
                    case '--crop':
                        container.appEncodingDecision.crop = true
                        break

                    case '-s':
                    case '--start':
                        container.appEncodingDecision.startBeginning = process.argv[index + 1]
                        break

                    case '-tr':
                    case '--trim':
                        container.appEncodingDecision.trim = process.argv[index + 1]
                        break

                    case '-b':
                    case '--bitrate':
                        container.appEncodingDecision.useBitrate = true
                        break

                    case '-C':
                    case '--constrain':
                        container.appEncodingDecision.useConstrain = true
                        break

                    case '-v':
                    case '--validate':
                        container.appEncodingDecision.validate = true
                        break

                    case '-crf':
                    case '--crf':
                        container.appEncodingDecision.crfOverride = parseInt(process.argv[index + 1])
                        break

                    case '-hwe':
                    case '--hardwareEncode':
                        container.appEncodingDecision.useHardwareEncode = true
                        break

                    case '-hwd':
                    case '--hardwareDecode':
                        container.appEncodingDecision.useHardwareDecode = true
                        break

                    default:
                        this.invalid(argument)
                        break

                }

            }

        })

    }

    /**
     * Send an invalid argument message to the console.
     * @param argument The argument that was invalid.
     */
    invalid(argument: string): void {

        new Log().send(LogColor.fgRed, 'Invalid argument: ', argument)

    }

}