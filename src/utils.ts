import * as cheerio from "cheerio"
import { resolve as urlResolve } from "url"
import fetch from "isomorphic-fetch"
import { articleTemplate } from "./template"
export interface FormatterVars {
  title: string
  author: {
    userName: string
    displayName: string
  }
  content: string
  summary?: string
  siteDomain?: string
}

/**
 * turn HTML string into Matters content format
 * @param data - All data needed for content
 * @param data.title - Content title
 * @param data.author - Content author information
 * @param data.content - Content in HTML string format
 * @param data.siteDomain - Optional site domain to assemble author link
 * @param data.summary - Optional content summary
 */
export const formatHTML = ({
  title,
  author,
  content,
  siteDomain,
  summary,
}: FormatterVars) => {
  let now = toDateString(new Date())
  if (process.env.NODE_ENV === "test") {
    // for snapshot testing
    now = "2020-12-23"
  }

  const htmlSummary = summary || makeSummary(content)

  return articleTemplate({
    title,
    author,
    summary: htmlSummary,
    content: outputCleanHTML(content),
    publishedAt: now,
    siteDomain,
  })
}

/**
 * Return date string from Date data
 * @param date - Date data
 */
export const toDateString = (date: Date) => {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
}

/**
 * fetch asset and return JSON object with buffer data
 * @param asset - Information on the target asset
 * @param asset.url - URL of the asset
 * @param asset.path - Target path of asset
 * @param asset.updateSrc - Callback function to update original src
 * @param asset.domain - Optional domain of asset
 */
export const getAsset = async ({
  url,
  path,
  updateSrc,
  domain = "https://matters.news/",
}: {
  url: string
  path: string
  domain?: string
  updateSrc?: () => void
}) => {
  if (!url) {
    return
  }
  try {
    const fullUrl = url.indexOf("://") >= 0 ? url : urlResolve(domain, url)
    const response = await fetch(fullUrl)

    const data = await response.arrayBuffer()

    if (updateSrc) {
      updateSrc()
    }

    return { path, content: Buffer.from(data) }
  } catch (err) {
    // console.log(`Fetching data for ${url} failed`)
    return
  }
}

/**
 * Strip html tags from html string to get text.
 * @param html - html string
 * @param replacement - string to replace tags
 */
export const stripHtml = (html: string, replacement = " ") =>
  (String(html) || "")
    .replace(/(<\/p><p>|&nbsp;)/g, " ") // replace line break and space first
    .replace(/(<([^>]+)>)/gi, replacement)

/**
 * Return beginning of text in html as summary, split on sentence break within buffer range.
 * @param html - html string to extract summary
 * @param length - target length of summary
 * @param buffer - buffer range to search for sentence break
 */
export const makeSummary = (html: string, length = 140, buffer = 20) => {
  // split on sentence breaks
  const sections = stripHtml(html, "")
    .replace(/([?!。？！]|(\.\s))\s*/g, "$1|")
    .split("|")

  // grow summary within buffer
  let summary = ""
  while (summary.length < length - buffer && sections.length > 0) {
    const el = sections.shift() || ""

    const addition =
      el.length + summary.length > length + buffer
        ? `${el.substring(0, length - summary.length)}...`
        : el

    summary = summary.concat(addition)
  }

  return summary
}

/**
 * Output clean HTML for IPFS, remove unsupported tags
 * @param html - html string to be cleaned
 */
export const outputCleanHTML = (html: string) => {
  /**
   * Note: enable `xmlMode` to remove default wrapper
   *
   * @see https://github.com/cheeriojs/cheerio/issues/1031#issuecomment-368307598
   */
  const $ = cheerio.load(html, { decodeEntities: false, xmlMode: true })

  // remove audio player
  $(".player").remove()

  return $.html()
}
