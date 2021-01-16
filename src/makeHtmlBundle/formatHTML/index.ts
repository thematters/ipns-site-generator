import { toDateString } from '../../utils'
import articleTemplate, { TemplateOptions } from './articleTemplate'
import cleanHtml from './cleanHtml'
import { makeSummary } from './text'

export type FormatterVars = TemplateOptions & {
  prefix?: string
  summary?: string
}

/**
 * turn HTML string into Matters content format
 * @param data - All data needed for content
 * @param data.title - Content title
 * @param data.author - Content author information
 * @param data.content - Content in HTML string format
 * @param data.siteDomain - Optional site domain to assemble author link
 * @param data.summary - Optional content summary
 * @param readMore - Link to full article for paywalled content
 */
export default ({
  title,
  author,
  content,
  siteDomain,
  summary,
  readMore,
}: FormatterVars) => {
  let now = toDateString(new Date())
  if (process.env.NODE_ENV === 'test') {
    // for snapshot testing
    now = '2020-12-23'
  }

  // use content as summary for paywalled content
  const htmlSummary = readMore ? content : summary || makeSummary(content)

  return articleTemplate({
    title,
    author,
    summary: htmlSummary,
    content: cleanHtml(content),
    publishedAt: now,
    siteDomain,
  })
}

export * from './text'
