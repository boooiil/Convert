export interface ProbeResultStream {
    
    index: number
    codec_name: string
    codec_long_name: string
    codec_tag_string: string
    codec_tag: string
    r_frame_rate: string
    avg_frame_rate: string
    time_base: string
    start_pts: number
    start_time: string
    extradata_size: number
    disposition: {
        default: number
        dub: number
        original: number
        comment: number
        lyrics: number
        karaoke: number
        forced: number
        hearing_impaired: number
        visual_impaired: number
        clean_effects: number
        attached_pic: number
        timed_thumbnails: number
        captions: number
        descriptions: number
        metadata: number
        dependent: number
        still_image: number
    }
    tags: {
        title: string
        BPS: string
        NUMBER_OF_FRAMES: string
        NUMBER_OF_BYTES: string
        _STATISTICS_WRITING_APP: string
        _STATISTICS_WRITING_DATE_UTC: string
        _STATISTICS_TAGS: string
        ENCODER: string
        DURATION: string
    }

}