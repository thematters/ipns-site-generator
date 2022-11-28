import { HomepageContext } from '../types'
import { renderHomepage } from '../render'
import { stripSpaces } from '../render/utils'

export type MakeHomepageData = HomepageContext

/**
 * Make Homepage HTML from articles data
 */
const makeHomepageJSONFeed = (data: MakeHomepageData) => {
  const feed = {
    version: 'https://jsonfeed.org/version/1.1',
    title: data.meta.title,
    icon: data.meta.image,
    home_page_url: data.byline.author.uri,
    // feed_url,
    description: data.meta.description,
    authors: [
      {
        name: data.byline.author.name,
        url: data.byline.author.uri,
        avatar: data.meta.image,
      },
    ],
    items: data.articles.map((article) => ({
      id: article.id,
      title: article.title,
      image: article.image,
      content_html: article.content,
      summary: stripSpaces(article.summary),
      date_published: new Date(article.date).toISOString(),
      tags: article.tags,
      url: article.uri,
      external_url: article.sourceUri,
    })),
  }

  return JSON.stringify(feed, null, 2)
}

export const makeHomepage = (data: MakeHomepageData) => {
  const { html, xml } = renderHomepage(data)
  const json = makeHomepageJSONFeed(data)
  return { html, xml, json }
}
