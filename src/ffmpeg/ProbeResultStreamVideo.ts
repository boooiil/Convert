import { ProbeResultStream } from './ProbeResultStream'

export interface ProbeResultStreamVideo extends ProbeResultStream {

    codec_type: 'video'
    profile: string
    width: number
    height: number
    coded_width: number
    coded_height: number
    closed_captions: number
    film_grain: number
    has_b_frames: number
    sample_aspect_ratio: string
    display_aspect_ratio: string
    pix_fmt: string
    level: number
    color_range: string
    color_space: string
    color_transfer: string
    color_primaries: string
    chroma_location: string
    field_order: string
    refs: number
    is_avc: number
    nal_length_size: number
    bits_per_raw_sample: string

}