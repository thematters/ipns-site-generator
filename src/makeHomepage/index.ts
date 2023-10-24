import slugify from '@matters/slugify'
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

export const makeHomepageBundles = (data: MakeHomepageData) => {
  const { html, xml } = renderHomepage(data)
  const json = makeHomepageJSONFeed(data)

  return [
    { path: 'index.html', content: html },
    { path: 'rss.xml', content: xml },
    { path: 'feed.json', content: json },
  ] as { path: string; content: string }[]
}

export const makeActivityPubBundles = (data: MakeHomepageData) => {
  const webfDomain = data.byline.author.webfDomain
  const actor = `https://${webfDomain}/about.jsonld`

  const outboxContent = {
    '@context': 'https://www.w3.org/ns/activitystreams',
    id: actor,
    type: 'OrderedCollection',
    totalItems: data.articles.length,
    orderedItems: data.articles.map((arti) => {
      const url = `https://${webfDomain}/${arti.id}-${
        arti.slug ?? slugify(arti.title)
      }/`

      return {
        '@context': 'https://www.w3.org/ns/activitystreams',
        type: 'Create',
        actor,
        published: arti.createdAt,
        to: ['https://www.w3.org/ns/activitystreams#Public'],
        cc: [`https://${webfDomain}/followers.jsonld`],
        object: {
          '@context': 'https://www.w3.org/ns/activitystreams',

          id: url,
          type: 'Note',
          summary: arti.summary,
          published: arti.createdAt as Date,
          content: `${arti.title}<br>${arti.summary}`,
          url,
          attributedTo: actor,
          to: ['https://www.w3.org/ns/activitystreams#Public'],
          cc: [],
          sensitive: false,
          atomUri: url,
          inReplyToAtomUri: null,
          attachment: [],
          tag: arti.tags,
        },
      }
    }),
  }

  return [
    {
      path: `.well-known/webfinger`,
      content: JSON.stringify(
        {
          subject: `acct:${data.byline.author.userName}@${webfDomain}`,
          aliases: Array.from(
            new Set(
              [
                `https://${webfDomain}`,
                `https://${data.byline.author.ipnsKey}.ipns.cf-ipfs.com`,
                `https://matters.town/@${data.byline.author.userName}`,
              ].filter(Boolean)
            )
          ),
          links: [
            {
              rel: 'http://webfinger.net/rel/profile-page',
              type: 'text/html',
              href: `https://${webfDomain}`,
            },
            {
              rel: 'self',
              type: 'application/activity+json',
              href: actor,
            },
          ],
        },
        null,
        2
      ),
    },
    {
      path: 'about.jsonld',
      content: JSON.stringify(
        {
          '@context': [
            'https://www.w3.org/ns/activitystreams',
            'https://w3id.org/security/v1',
            {
              // "@language": "en- US",
              toot: 'http://joinmastodon.org/ns#',
              discoverable: 'toot:discoverable',
              alsoKnownAs: {
                '@id': 'as:alsoKnownAs',
                '@type': '@id',
              },
            },
          ],
          type: 'Person',
          id: actor,
          inbox: `https://${webfDomain}/inbox.jsonld`, // TO accept POST
          outbox: `https://${webfDomain}/outbox.jsonld`,

          preferredUsername: data.byline.author.userName,
          name: `${data.byline.author.displayName}`.trim(),
          summary: (data.byline.author.description || '').trim(),
          discoverable: true,

          icon: data.meta.image
            ? [
                {
                  url: data.meta.image, // avatarUrl,
                },
              ]
            : undefined,
          publicKey: {
            '@context': 'https://w3id.org/security/v1',
            '@type': 'Key',
            id: `https://${webfDomain}/about.jsonld#main-key`,
            owner: actor,
          },
          published:
            outboxContent.orderedItems?.[0]?.object?.published ?? new Date(),
          url: `https://${webfDomain}`,
        },
        null,
        2
      ),
    },

    {
      path: 'outbox.jsonld',
      content: JSON.stringify(outboxContent, null, 2),
    },
  ] as { path: string; content: string }[]
}
