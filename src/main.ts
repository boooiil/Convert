import { Container } from 'application/Container'
import { Debug } from 'application/Debug'
import { Ticker } from 'application/Ticker'
import { writeFileSync } from 'fs'
import { Log } from 'logging/Log'

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
 * Refine encoding fallback process.
 * Add a way to skip validation.
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
        if (Debug.toggle) {
            Log.debug('Debugging enabled. Writing debug file.')
            writeFileSync('container_debug.json', JSON.stringify(container, null, 4))
            Log.debug('Debug file written.')
            process.exit(0)
        }
        else process.exit()
    })

}

main()