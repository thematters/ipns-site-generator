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
type StripHTMLOptions = {
  tagReplacement?: string
  lineReplacement?: string
  ensureMentionTrailingSpace?: boolean
}

export const stripHtml = (html: string, options?: StripHTMLOptions) => {
  options = {
    tagReplacement: '',
    lineReplacement: '\n',
    ensureMentionTrailingSpace: false,
    ...options,
  }

  const { tagReplacement, lineReplacement, ensureMentionTrailingSpace } =
    options

  html = String(html) || ''

  html = html.replace(/&nbsp;/g, ' ')

  // Replace block-level elements with newlines
  html = html.replace(/<(\/?p|\/?blockquote|br\/?)>/gi, lineReplacement!)

  // Handle @user mentions and appending a space
  if (ensureMentionTrailingSpace) {
    html = html.replace(
      /<a\s+[^>]*class="mention"[^>]*>(.*?)<\/a>(.{1})/gi,
      (_, p1, p2) => {
        return `${p1}${p2 === ' ' ? ' ' : ` ${p2}`}`
      }
    )
  }

  // Remove remaining HTML tags
  let plainText = html.replace(/<\/?[^>]+(>|$)/g, tagReplacement!)

  // Normalize multiple newlines and trim the result
  plainText = plainText.replace(/\n\s*\n/g, '\n').trim()

  return plainText
}

const REGEXP_PUNCTUATION_CHINESE =
  '\u3002\uff1f\uff01\uff0c\u3001\uff1b\uff1a\u201c\u201d\u2018\u2019\uff08\uff09\u300a\u300b\u3008\u3009\u3010\u3011\u300e\u300f\u300c\u300d\ufe43\ufe44\u3014\u3015\u2026\u2014\uff5e\ufe4f\uffe5'

export const REGEXP_PUNCTUATION = `${REGEXP_PUNCTUATION_CHINESE}\x00-\x2f\x3a-\x3f\x41\x5b-\x60\x7a-\x7f` // without "@"

export const REGEXP_LATIN = '0-9A-Za-z\u00C0-\u00FF'
export const REGEXP_CJK =
  '\u4E00-\u9FFF\u3400-\u4DBF\u20000-\u2A6DF\u2A700-\u2B73F\u2B740-\u2B81F\u2B820-\u2CEAF\u2CEB0-\u2EBEF\u30000-\u3134F\u31350-\u323AF'

const countUnits = (text: string): number => {
  // Count @mentions as 1 unit
  if (text.startsWith('@')) return 1

  // Count Latin word as 1 unit
  if (new RegExp(`^[${REGEXP_LATIN}]+$`).test(text)) return 1

  // Count each CJK character as 1 unit
  return Array.from(text).reduce((count, char) => {
    // If it's a CJK character or digit, count it as 1 unit
    if (new RegExp(`[${REGEXP_CJK}]`).test(char)) {
      return count + 1
    }
    // Otherwise (punctuation, whitespace, etc.), don't count
    return count
  }, 0)
}

/**
 * Return beginning of text in html as summary, split on sentence break within buffer range.
 * @param html - html string to extract summary
 * @param maxUnits - max units of summary
 */
export const makeSummary = (
  html: string,
  maxUnits: number,
  lineReplacement?: string
) => {
  // Clean the HTML content first
  const plainText = stripHtml(html, {
    lineReplacement: lineReplacement || ' ',
    ensureMentionTrailingSpace: true,
  })
    .replace(/&[^;]+;/g, ' ') // remove html entities
    .replace(/\s+/g, ' ') // normalize whitespace
    .trim()

  // Split the content into matchable tokens
  const matches =
    plainText.match(
      new RegExp(`(@[^\\s]+|[${REGEXP_LATIN}]+|[^${REGEXP_LATIN}])`, 'g')
    ) || []

  let summary = ''
  let units = 0
  let hasMore = false

  function trimSpacesAndPunctuations(str: string) {
    return str
      .trim()
      .replace(
        new RegExp(`^[${REGEXP_PUNCTUATION}]+|[${REGEXP_PUNCTUATION}]+$`, 'g'),
        ''
      )
  }

  // Process each token
  for (const token of matches) {
    // If it's whitespace or punctuation, include it but don't count as a unit
    if (
      /^\s+$/.test(token) ||
      new RegExp(`^[${REGEXP_PUNCTUATION}]+$`, 'u').test(token)
    ) {
      if (!hasMore) {
        summary += token
      }
      continue
    }

    const tokenUnits = countUnits(token)

    // If this token would exceed the max units, mark there's more content
    if (units + tokenUnits > maxUnits) {
      hasMore = true
      break
    }

    // Add the token and count its units
    summary += token
    units += tokenUnits
  }

  // Add ellipsis if there's more content that wasn't included
  if (hasMore) {
    summary = trimSpacesAndPunctuations(summary) + '…'
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
