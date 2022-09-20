import * as cheerio from 'cheerio'

/**
 * Output clean HTML for IPFS, remove unsupported tags
 * @param html - html string to be cleaned
 */
export default (html: string) => {
  const $ = cheerio.load(html, { decodeEntities: false }, false)

  // remove audio player
  $('.player').remove()

  return $.html()
}
