import { Container } from 'application/Container'
import { Ticker } from 'application/Ticker'
import { Log } from 'logging/Log'

let logger: Log = null
/**
 * Because we are using hardware specific encoders,
 * we will need to get whether the user wants to use these encoders.
 *
 * We will also need to get the user's hardware details.
 */

/**
 * WALK AWAY NOTES (for when you return to this eventually):
 * 
 * 1. There is an issue with the converted_resolution, use the redesign.js as a reference to the correct values.
 * 2. Still need to add conversion child process.
 * 3. Make sure that the conversion process accounts for encoder/decoder failures and obtains new ffmpeg arguments.
 * 
 * 
 * 
 */

async function main() {

    logger = new Log()

    const container = new Container()

    await container.userCapabilities.findHardwareDetails()

    container.userArguments.parse(container)
    container.appEncodingDecision.validateInput()

    await container.scanWorkingDir()

    new Ticker(container).startProcess()

    console.log(container)

}

main()