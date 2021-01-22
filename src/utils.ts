/**
 * Return date string from Date data
 * @param date - Date data
 */
export const toDateString = (date: Date) => {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
}
