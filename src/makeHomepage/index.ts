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

const PUBLIC_AUDIENCE = 'https://www.w3.org/ns/activitystreams#Public'
const NON_PUBLIC_TOKENS = new Set([
  'paid',
  'paywalled',
  'subscription',
  'member',
  'members',
  'private',
  'protected',
  'followers',
  'direct',
  'encrypted',
  'draft',
  'unpublished',
])
const MESSAGE_LIKE_TYPES = new Set([
  'message',
  'chatmessage',
  'directmessage',
  'encryptedmessage',
])

const normalizeToken = (value?: string) =>
  typeof value === 'string' && value.trim() ? value.trim().toLowerCase() : null

const hasTruthyFlag = (...values: (boolean | undefined)[]) =>
  values.some((value) => value === true)

const isFederationPublicArticle = (
  article: MakeHomepageData['articles'][number]
) => {
  const visibility = normalizeToken(article.visibility)
  const access = normalizeToken(article.access)
  const status = normalizeToken(article.status ?? article.publicationStatus)
  const type = normalizeToken(article.type)

  if (visibility && visibility !== 'public') {
    return false
  }
  if (access && NON_PUBLIC_TOKENS.has(access)) {
    return false
  }
  if (status && NON_PUBLIC_TOKENS.has(status)) {
    return false
  }
  if (type && MESSAGE_LIKE_TYPES.has(type)) {
    return false
  }
  if (
    hasTruthyFlag(
      article.encrypted,
      article.isEncrypted,
      article.private,
      article.isPrivate,
      article.paid,
      article.isPaid,
      article.paywalled,
      article.draft,
      article.isDraft
    )
  ) {
    return false
  }

  return true
}

const toIsoString = (value?: Date | string) => {
  if (!value) {
    return new Date().toISOString()
  }
  return new Date(value).toISOString()
}

const buildArticleUrl = (
  webfDomain: string,
  article: MakeHomepageData['articles'][number]
) =>
  `https://${webfDomain}/${article.id}-${
    article.slug ?? slugify(article.title)
  }/`

const inferMediaType = (url: string) => {
  const lower = url.toLowerCase()
  if (lower.endsWith('.png')) return 'image/png'
  if (lower.endsWith('.gif')) return 'image/gif'
  if (lower.endsWith('.webp')) return 'image/webp'
  if (lower.endsWith('.svg')) return 'image/svg+xml'
  return 'image/jpeg'
}

const buildAttachment = (article: MakeHomepageData['articles'][number]) =>
  article.image
    ? [
        {
          type: 'Document',
          mediaType: inferMediaType(article.image),
          url: article.image,
          name: article.title,
        },
      ]
    : []

const buildTag = (article: MakeHomepageData['articles'][number]) =>
  article.tags.map((tag) => ({
    type: 'Hashtag',
    name: tag.startsWith('#') ? tag : `#${tag}`,
  }))

export const makeActivityPubBundles = (data: MakeHomepageData) => {
  const webfDomain = data.byline.author.webfDomain
  if (!webfDomain) {
    throw new Error(
      'byline.author.webfDomain is required for ActivityPub bundles'
    )
  }
  const actor = `https://${webfDomain}/about.jsonld`
  const outbox = `https://${webfDomain}/outbox.jsonld`
  const publicArticles = data.articles.filter(isFederationPublicArticle)
  const excludedCount = data.articles.length - publicArticles.length

  const outboxContent = {
    '@context': 'https://www.w3.org/ns/activitystreams',
    id: outbox,
    type: 'OrderedCollection',
    totalItems: publicArticles.length,
    orderedItems: publicArticles.map((arti) => {
      const url = buildArticleUrl(webfDomain, arti)
      const published = toIsoString(arti.createdAt ?? arti.date)
      const updated = toIsoString(arti.updatedAt ?? arti.date)

      return {
        '@context': 'https://www.w3.org/ns/activitystreams',
        type: 'Create',
        actor,
        published,
        to: [PUBLIC_AUDIENCE],
        cc: [`https://${webfDomain}/followers.jsonld`],
        object: {
          '@context': 'https://www.w3.org/ns/activitystreams',

          id: url,
          type: 'Article',
          name: arti.title,
          summary: arti.summary,
          published,
          updated,
          content: arti.content,
          url,
          attributedTo: actor,
          to: [PUBLIC_AUDIENCE],
          cc: [],
          sensitive: false,
          atomUri: url,
          inReplyToAtomUri: null,
          attachment: buildAttachment(arti),
          tag: buildTag(arti),
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
          outbox,

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
    {
      path: 'activitypub-manifest.json',
      content: JSON.stringify(
        {
          version: 1,
          generator: 'ipns-site-generator',
          actor: {
            handle: data.byline.author.userName,
            sourceActorId: actor,
            webfingerSubject: `acct:${data.byline.author.userName}@${webfDomain}`,
            profileUrl: `https://${webfDomain}`,
          },
          files: {
            actor: 'about.jsonld',
            outbox: 'outbox.jsonld',
            webfinger: '.well-known/webfinger',
            jsonFeed: 'feed.json',
            rss: 'rss.xml',
          },
          visibility: {
            federatedPublicOnly: true,
            defaultPolicy: 'missing-visibility-is-public',
            excluded: ['paid', 'encrypted', 'private', 'draft', 'message'],
          },
          stats: {
            totalArticles: data.articles.length,
            includedArticles: publicArticles.length,
            excludedArticles: excludedCount,
          },
        },
        null,
        2
      ),
    },
  ] as { path: string; content: string }[]
}
