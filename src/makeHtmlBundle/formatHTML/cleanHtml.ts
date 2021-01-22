import * as cheerio from 'cheerio'

/**
 * Output clean HTML for IPFS, remove unsupported tags
 * @param html - html string to be cleaned
 */
export default (html: string) => {
  /**
   * Note: enable `xmlMode` to remove default wrapper
   *
   * @see https://github.com/cheeriojs/cheerio/issues/1031#issuecomment-368307598
   */
  const $ = cheerio.load(html, { decodeEntities: false, xmlMode: true })

  // remove audio player
  $('.player').remove()

  return $.html()
}
