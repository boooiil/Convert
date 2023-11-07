import { Container } from 'application/Container'
import { Ticker } from 'application/Ticker'

/**
 * Because we are using hardware specific encoders,
 * we will need to get whether the user wants to use these encoders.
 *
 * We will also need to get the user's hardware details.
 *

/**
 * WALK AWAY NOTES (for when you return to this eventually):
 * 
 * Container gets pushed around a lot.
 *  - Maybe it should be a singleton?
 *  - We could just refine what is passed to other methods.
 * 
 * Do validation process.
 * Refine encoding fallback process.
 * Refine error handling in conversion process.
 * 
 * AV1 has different encoding options.
 *  - https://trac.ffmpeg.org/wiki/Encode/AV1
 *  - Preset 8 appears to be HEVC medium.
 *  - Keyframe placement might be different.
 * 
 * H264 might be wanted in an mp4 container.
 *  - Specify container as an argument to avoid this issue.
 *  - Add a failure for container in Activity enum.
 * 
 * Since H264/H265/AV1 use different encoding options,
 * it might be best to have a different class for each
 * with its own ffmpeg argument builder.
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