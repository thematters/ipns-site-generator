export function stripSpaces(content: string) {
  return content?.replaceAll(/[\b\s]+/g, ' ').trim()
}

export function addLeadingZero(num: number, len: number = 2) {
  return `00${num}`.slice(-len)
}

export function toRFC822Date(date: string) {
  const d = new Date(date)
  const dayStrings = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const monthStrings = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]

  const day = dayStrings[d.getUTCDay()]
  const dayNumber = addLeadingZero(d.getUTCDate())
  const month = monthStrings[d.getUTCMonth()]
  const year = d.getUTCFullYear()
  const time = `${addLeadingZero(d.getUTCHours())}:${addLeadingZero(
    d.getUTCMinutes()
  )}:00`

  return `${day}, ${dayNumber} ${month} ${year} ${time} GMT`
}

export function shortDate(date: string) {
  const d = new Date(date)
  const dayNumber = d.getDate()
  const month = d.getMonth() + 1 // from range 0-11 to 1-12
  const year = d.getFullYear()

  return `${year}-${addLeadingZero(month)}-${addLeadingZero(dayNumber)}`
}
