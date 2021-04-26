import { toDateString } from "../../utils"
import articleTemplate, { TemplateOptions } from "./articleTemplate"
import cleanHtml from "./cleanHtml"
import { makeSummary } from "./text"

/**
 * Turn HTML string into Matters content format
 *
 * @param data - All data needed for content
 * @param data.title - Content title
 * @param data.author - Content author information
 * @param data.content - Content in HTML string format
 * @param data.siteDomain - Optional site domain to assemble author link
 * @param data.summary - Optional content summary
 * @param data.readMore - Optional link (text & url) to full article for paywalled content
 * @param data.paymentPointer - Optional ILP payment pointer
 */
export default (data: TemplateOptions) => {
  const { content, summary } = data

  let now = toDateString(new Date())
  if (process.env.NODE_ENV === "test") {
    // for snapshot testing
    now = "2020-12-23"
  }

  return articleTemplate({
    ...data,
    summary: summary || makeSummary(content),
    content: cleanHtml(content),
    publishedAt: now,
  })
}

export * from "./text"
export { TemplateOptions } from "./articleTemplate"
