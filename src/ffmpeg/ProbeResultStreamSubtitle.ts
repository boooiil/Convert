import { ProbeResultStream } from './ProbeResultStream'

export interface ProbeResultStreamSubtitle extends ProbeResultStream {

    codec_type: 'subtitle'
    duration_ts: number
    duration: string

}