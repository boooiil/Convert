/**
 * Enum for the various encoding processes.
 */
export const enum Activity {
    CONVERT = 'convert',
    FAILED = 'failed',
    FAILED_CODEC = 'failed_codec',
    FAILED_CONTAINER = 'failed_container',
    FAILED_CORRUPT = 'failed_corrupt',
    FAILED_FILE = 'failed_file',
    FAILED_FILE_MISSING = 'failed_file_missing',
    FAILED_FILE_PERMISSIONS = 'failed_file_permissions',
    FAILED_FILE_NOT_RECOGNIZED = 'failed_file_not_recognized',
    FAILED_HARDWARE = 'failed_hardware',
    FAILED_INVALID_AUDIO_STREAMS = 'failed_invalid_audio_streams',
    FAILED_SYSTEM = 'failed_system',
    FINISHED = 'finished',
    STATISTICS = 'statistics',
    WAITING = 'waiting',
    WAITING_CONVERT = 'waiting_convert',
    WAITING_STATISTICS = 'waiting_statistics',
    WAITING_VALIDATE = 'waiting_validate',
    VALIDATE = 'validate'
}