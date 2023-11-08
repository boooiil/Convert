import { ProbeResultStream } from './ProbeResultStream'

export interface ProbeResultStreamAudio extends ProbeResultStream {

    codec_type: 'audio'
    sample_fmt: string
    sample_rate: string
    channels: number
    channel_layout: string
    bits_per_sample: number
    initial_padding: number

}