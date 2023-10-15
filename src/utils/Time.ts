/**
 * Time conversion.
 * @param value MS value to convert
 * @param type Should elapsed time be returned?
 */
export function time(value: number | null, type: boolean | null) {

    if (value == null) {

        let date = new Date()

        let a = date.getHours()
        let b = date.getMinutes()
        let c = date.getSeconds()
        let d = a == 12 ? 'PM' : a > 12 ? 'PM' : 'AM'
        let h = a == 12 || (a > 9 && a < 12) ? `${a}` : a > 12 ? a - 12 > 9 ? `${a - 12}` : `0${a - 12}` : `0${a}`
        let m = String(b).length == 2 ? b : `0${b}`
        let s = String(c).length == 2 ? c : `0${c}`

        return `${h}:${m}:${s}-${d} - ${date.toDateString()}`

    }

    else if (!type) {

        let date = new Date(value)

        let a = date.getHours()
        let b = date.getMinutes()
        let c = date.getSeconds()
        let d = a == 12 ? 'PM' : a > 12 ? 'PM' : 'AM'
        let h = a == 12 || (a > 9 && a < 12) ? `${a}` : a > 12 ? a - 12 > 9 ? `${a - 12}` : `0${a - 12}` : `0${a}`
        let m = String(b).length == 2 ? b : `0${b}`
        let s = String(c).length == 2 ? c : `0${c}`

        return `${h}:${m}:${s}-${d}`

    } else {

        let h: string | number = 0
        let m: string | number = 0
        let s: string | number = Math.floor(value / 1000)

        m = Math.floor(s / 60)
        s -= m * 60

        h = Math.floor(m / 60)
        m -= h * 60

        //return `${h ? h + ' Hour(s) ' : ''}${m ? m + ' Minute(s) ' : ''}${s ? s + ' Second(s) ' : ''}`

        h = h > 0 ? h < 10 ? '0' + h + ':' : h + ':' : null

        //if minutes are greater than 0, check to see if they are less than 10
        //if there is an hour we need to make it not display null
        m = m > 0 || h ? m < 10 ? '0' + m + ':' : m + ':' : null

        s = s < 10 ? '0' + s : s

        return `${h ? h : ''}${m ? m : ''}${s}`

    }
}