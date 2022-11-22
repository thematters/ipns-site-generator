import articleTemplate, { TemplateOptions } from './articleTemplate'
import cleanHtml from './cleanHtml'

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
export const formatHTML = (data: TemplateOptions) => {
  const { content, summary } = data

  let now = new Date()
  if (process.env.NODE_ENV === 'test') {
    // for snapshot testing
    now = new Date('2022-11-22T10:55:38.292Z')
  }

  return articleTemplate({
    ...data,
    summary,
    content: cleanHtml(content),
    publishedAt: now,
  })
}

export * from './text'
export { TemplateOptions } from './articleTemplate'
