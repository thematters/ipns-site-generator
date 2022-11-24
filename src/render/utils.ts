export function stripSpaces(content: string) {
  return content?.replaceAll(/[\b\s]+/g, ' ').trim()
}

export function addLeadingZero(num: number, len: number = 2) {
  return `00${num}`.slice(-len)
}

export function shortDate(date: string) {
  const d = new Date(date)
  const dayNumber = d.getDate()
  const month = d.getMonth() + 1 // from range 0-11 to 1-12
  const year = d.getFullYear()

  return `${year}-${addLeadingZero(month)}-${addLeadingZero(dayNumber)}`
}
