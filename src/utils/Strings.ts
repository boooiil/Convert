/**
 * Truncate a string to a specified length.
 * @param str String to truncate
 * @returns Truncated string
 */
export function truncateString(str: string): string {
    const maxLength = 25
    if (str.length <= maxLength) {
        return str
    }
    const ellipsis = '... '
    const leftHalfLength = Math.ceil((maxLength - ellipsis.length) / 2)
    const rightHalfLength = Math.floor((maxLength - ellipsis.length) / 2)
    const leftHalf = str.slice(0, leftHalfLength)
    const rightHalf = str.slice(str.length - rightHalfLength)
    return leftHalf + ellipsis + rightHalf
}