import * as cheerio from 'cheerio'

export * from './encrypt'

/**
 * Output clean HTML for IPFS, remove unsupported tags
 * @param html - html string to be cleaned
 */
export const cleanHTML = (html: string) => {
  const $ = cheerio.load(html, { decodeEntities: false }, false)

  // remove audio player
  $('.player').remove()

  return $.html()
}

/**
 * Strip HTML tags from HTML string to get plain text.
 * @param html - html string
 * @param tagReplacement - string to replace tags
 * @param lineReplacement - string to replace tags
 *
 * @see {@url https://github.com/thematters/ipns-site-generator/blob/main/src/utils/index.ts}
 */
export const stripHtml = (
  html: string,
  tagReplacement = '',
  lineReplacement = '\n'
) => {
  html = String(html) || ''

  html = html.replace(/\&nbsp\;/g, ' ')

  // Replace block-level elements with newlines
  html = html.replace(/<(\/?p|\/?blockquote|br\/?)>/gi, lineReplacement)

  // Remove remaining HTML tags
  let plainText = html.replace(/<\/?[^>]+(>|$)/g, tagReplacement)

  // Normalize multiple newlines and trim the result
  plainText = plainText.replace(/\n\s*\n/g, '\n').trim()

  return plainText
}

/**
 * Return beginning of text in html as summary, split on sentence break within buffer range.
 * @param html - html string to extract summary
 * @param length - target length of summary
 * @param buffer - buffer range to search for sentence break
 */
export const makeSummary = (html: string, length = 140, buffer = 20) => {
  // split on sentence breaks
  const sections = stripHtml(html, '', ' ')
    .replace(/([?!。？！]|(\.\s))\s*/g, '$1|')
    .split('|')

  // grow summary within buffer
  let summary = ''
  while (summary.length < length - buffer && sections.length > 0) {
    const el = sections.shift() || ''

    const addition =
      el.length + summary.length > length + buffer
        ? `${el.substring(0, length - summary.length)}…`
        : el

    summary = summary.concat(addition)
  }

  return summary
}

/**
 * Return date string from Date data
 * @param date - Date data
 */
export const toDateString = (date: Date) => {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
}
