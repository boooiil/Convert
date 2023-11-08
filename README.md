# Convert
Converts all MKV and AVI files in a root directory to MP4 files using ffmpeg utilizing hardware acceleration if specified. Defaults are extremely conservative for bitrate.

```
Usage: node convert.js [...options]
```

```
Options:

-a, --amount <number>
   Amount of media to convert at once.

-as, --audiostreams <num1,num2,...>
   Specify which audio streams to keep. (Default: All)

-b, --bitrate
    Use bitrates instead of CRF. You can only use defined resolutions with this flag.

-c, --crop
   Crop the media to the specified resolution.

-C, --constrain
    Force the encoder to use a max bitrate with CRF.

-crf, --crf <number>
   Override the CRF value for the current media.

-d, --debug
   Enable debug logging.

-e, --encoder <string>
   One of the pre-configured encoders

-h, --help
   Display this help message.

-hwe, --hardwareEncode
   Use hardware encoding.

-o, --overwrite
   Overwrite existing encoded file

-q, --quality <number>p
   Resolution of the media to convert.

-s, --start <hh:mm:ss>
   Skip the beginning by specified amount of time.

-t, --tune <string>
   One of the ffmpeg tune profiles

-tr, --trim <hh:mm:ss,hh:mm:ss>
   Trim the media.

-v, --validate <string>
   Override the validation directory

```

```
Resolutions:
    
   Custom: 
     <value>p
        CRF: 24
        BITRATE: NULL
        MIN: NULL
        MAX: NULL
        WIDTH: CALCULATED
        HEIGHT: PROVIDED
        CROP: CALCULATED (12:5)

   Configured: 
     2160p
        CRF: 24
        BITRATE: 30M
        MIN: 30M
        MAX: 40M
        WIDTH: 3840
        HEIGHT: 2160
        CROP: 3840:1600 (12:5)
        
     1440p
        CRF: 24
        BITRATE: 20M
        MIN: 20M
        MAX: 27M
        WIDTH: 2560
        HEIGHT: 1440
        CROP: 2560:1068 (12:5)

     1080p
        CRF: 24
        BITRATE: 2M
        MIN: 1.6M
        MAX: 2.2M
        WIDTH: 1920
        HEIGHT: 1080
        CROP: 1920:800 (12:5)

     1080pn (Traditional TV/Netflix Cropping)
        CRF: 24
        BITRATE: 2M
        MIN: 1.6M
        MAX: 2.2M
        WIDTH: 1920
        HEIGHT: 1080
        CROP: 1920:960 (2:1)

     1080pm (Some One-off Marvel Cropping)
        CRF: 24
        BITRATE: 2M
        MIN: 1.6M
        MAX: 2.2M
        WIDTH: 1920
        HEIGHT: 1080
        CROP: 1920:870 (64:29)

     720p
        CRF: 24
        BITRATE: 1.4M
        MIN: 1.2M
        MAX: 1.8M
        WIDTH: 1280
        HEIGHT: 720
        CROP: 1280:534 (12:5)

     720pn (Traditional TV/Netflix Cropping)
        CRF: 24
        BITRATE: 1.4M
        MIN: 1.2M
        MAX: 1.8M
        WIDTH: 1280
        HEIGHT: 720
        CROP: 1280:640 (2:1)

     720pm (Some One-off Marvel Cropping)
        CRF: 24
        BITRATE: 1.4M
        MIN: 1.2M
        MAX: 1.8M
        WIDTH: 1280
        HEIGHT: 720
        CROP: 1280:580 (64:29)

     480p
        CRF: 24
        BITRATE: 0.6M
        MIN: 0.4M
        MAX: 0.8M
        WIDTH: 854
        HEIGHT: 480
        CROP: 854:356 (12:5)

     480pc (NTSC Cropping)
        CRF: 24
        BITRATE: 0.6M
        MIN: 0.4M
        MAX: 0.8M
        WIDTH: 1138
        HEIGHT: 640
        CROP: 854:720 (32:27)
```

```
Encoders:
   NVIDIA:
        AV1_NVENC (RTX 4000 OR NEWER)
        HEVC_NVENC (GTX 600 OR NEWER)
        H264_NVENC
    
    AMD:
        AV1_AMF (RX 7000 OR NEWER)
        HEVC_AMF (CARRIZO/RX 480 OR NEWER)
        H264_AMF

    Intel:
        AV1_QSV (ARC 300 OR NEWER)
        HEVC_QSV (HD 500/ARC 300 OR NEWER)
        H264_QSV

    Software:
        AV1 (NOT RECOMMENDED)
        HEVC (NEWER i5/R5 RECOMMENDED)
        H264
```

```
Hardware Accelerators:
   NVIDIA:
        CUDA (GPU MUST SUPPORT INPUT VIDEO CODEC)

    AMD:
        AMF (APU/GPU MUST SUPPORT INPUT VIDEO CODEC)

    Intel:
        QSV (IGPU/GPU MUST SUPPORT INPUT VIDEO CODEC)

    Unused:
        VULKAN (NOT TESTED)
```
