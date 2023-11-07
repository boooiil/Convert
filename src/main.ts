import { Container } from 'application/Container'
import { Ticker } from 'application/Ticker'

/**
 * Because we are using hardware specific encoders,
 * we will need to get whether the user wants to use these encoders.
 *
 * We will also need to get the user's hardware details.
 */

/**
 * WALK AWAY NOTES (for when you return to this eventually):
 * 
 * Do validation process.
 * Refine encoding fallback process.
 * Refine error handling in conversion process.
 * 
 * 
 * 
 */

async function main() {

    const container = new Container()

    await container.userCapabilities.findHardwareDetails()

    container.userArguments.parse(container)
    container.appEncodingDecision.validateInput()

    await container.scanWorkingDir()

    new Ticker(container).startProcess()

    // handle pressing ctrl+c
    process.on('SIGINT', () => {
        // do something
        console.log('RECEIVED SIGINT')
        process.exit()
    })

}

main()