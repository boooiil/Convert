/**
 * Enum for the various encoding processes.
 */
export const enum Process {
    CONVERT = 'convert',
    FAILED = 'failed',
    FAILED_CODEC = 'failed_codec',
    FAILED_FILE = 'failed_file',
    FAILED_HARDWARE = 'failed_hardware',
    FAILED_PERMISSIONS = 'failed_permissions',
    FAILED_SYSTEM = 'failed_system',
    FINISHED = 'finished',
    STATISTICS = 'statistics',
    WAITING = 'waiting',
    WAITING_CONVERT = 'waiting_convert',
    WAITING_STATISTICS = 'waiting_statistics',
    WAITING_VALIDATE = 'waiting_validate',
    VALIDATE = 'validate'
}