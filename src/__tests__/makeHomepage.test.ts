import fetch from 'isomorphic-fetch'
import {
  makeHomepage,
  makeHomepageBundles,
  makeActivityPubBundles,
} from '../makeHomepage'
import { MOCK_HOMEPAGE } from '../render/mock'

jest.mock('isomorphic-fetch')
const mockedFetch = fetch as jest.Mock

describe('makeHomepage', () => {
  test('can generate HTML, XML and JSON of homepage', async () => {
    mockedFetch.mockResolvedValue({
      arrayBuffer: () => Promise.resolve(new ArrayBuffer(1)),
    })

    const { html, xml, json } = await makeHomepage(
      MOCK_HOMEPAGE('matters.news')
    )
    expect(html).toMatchSnapshot()
    expect(xml).toMatchSnapshot()
    expect(json).toMatchSnapshot()
  })

  test('can generate bundles of HTML, XML and JSON', async () => {
    mockedFetch.mockResolvedValue({
      arrayBuffer: () => Promise.resolve(new ArrayBuffer(1)),
    })

    const bundles = await makeHomepageBundles(MOCK_HOMEPAGE('matters.news'))

    let html = ''
    let xml = ''
    let json = ''
    for (const { path, content } of bundles) {
      switch (path) {
        case 'index.html':
          html = content
          break
        case 'rss.xml':
          xml = content
          break
        case 'feed.json':
          json = content
          break
      }
    }
    expect(html).toMatchSnapshot()
    expect(xml).toMatchSnapshot()
    expect(json).toMatchSnapshot()
  })

  test('can generate activitypub file bundles of webfinger, outbox, etc.', async () => {
    mockedFetch.mockResolvedValue({
      arrayBuffer: () => Promise.resolve(new ArrayBuffer(1)),
    })

    const context = MOCK_HOMEPAGE('matters.news')
    const bundles = await makeActivityPubBundles({
      ...context,
      articles: [
        {
          ...context.articles[0],
          image: 'https://assets.example/article-cover.webp',
        },
        ...context.articles.slice(1),
      ],
    })

    let webfinger: string = ''
    let outbox: string = ''
    let manifest: string = ''
    for (const { path, content } of bundles) {
      switch (path) {
        case '.well-known/webfinger':
          webfinger = content
          break
        case 'outbox.jsonld':
          outbox = content
          break
        case 'activitypub-manifest.json':
          manifest = content
          break
      }
    }
    expect(webfinger).toMatchSnapshot()

    const outboxPayload = JSON.parse(outbox)
    expect(outboxPayload.id).toBe('https://example.eth.limo/outbox.jsonld')
    expect(outboxPayload.totalItems).toBe(8)
    expect(outboxPayload.orderedItems[0].object.type).toBe('Article')
    expect(outboxPayload.orderedItems[0].object.name).toBe(
      'Excepteur in consequat mollit consectetur.'
    )
    expect(outboxPayload.orderedItems[0].object.content).toContain(
      '<figure class="image">'
    )
    expect(outboxPayload.orderedItems[0].object.attachment[0].type).toBe(
      'Document'
    )
    expect(outboxPayload.orderedItems[0].object.tag[0]).toEqual({
      type: 'Hashtag',
      name: '#tag1',
    })

    const manifestPayload = JSON.parse(manifest)
    expect(manifestPayload.version).toBe(1)
    expect(manifestPayload.generator).toBe('ipns-site-generator')
    expect(manifestPayload.actor.webfingerSubject).toBe(
      'acct:Anim@example.eth.limo'
    )
    expect(manifestPayload.files.outbox).toBe('outbox.jsonld')
    expect(manifestPayload.visibility.federatedPublicOnly).toBe(true)
    expect(manifestPayload.visibility.defaultPolicy).toBe(
      'missing-visibility-is-public'
    )
    expect(manifestPayload.stats).toEqual({
      totalArticles: 8,
      includedArticles: 8,
      excludedArticles: 0,
    })
  })

  test('filters explicit non-public articles from ActivityPub bundles', async () => {
    const context = MOCK_HOMEPAGE('matters.news')
    const bundles = await makeActivityPubBundles({
      ...context,
      articles: [
        { ...context.articles[0], id: 'public', visibility: 'public' },
        {
          ...context.articles[1],
          id: 'private',
          visibility: 'private',
          title: 'private title should not leak',
          content: 'private body should not leak',
        },
        {
          ...context.articles[2],
          id: 'paid',
          paid: true,
          title: 'paid title should not leak',
          content: 'paid body should not leak',
        },
        {
          ...context.articles[3],
          id: 'message',
          type: 'Message',
          title: 'message title should not leak',
          content: 'message body should not leak',
        },
      ],
    })

    const outbox = JSON.parse(
      bundles.find(({ path }) => path === 'outbox.jsonld')?.content ?? '{}'
    )
    const manifest = JSON.parse(
      bundles.find(({ path }) => path === 'activitypub-manifest.json')
        ?.content ?? '{}'
    )

    expect(outbox.totalItems).toBe(1)
    expect(outbox.orderedItems[0].object.id).toBe(
      'https://example.eth.limo/public-excepteur-in-consequat-mollit-consectetur/'
    )
    expect(JSON.stringify(outbox)).not.toContain(
      'private title should not leak'
    )
    expect(JSON.stringify(outbox)).not.toContain('paid body should not leak')
    expect(JSON.stringify(outbox)).not.toContain('message body should not leak')
    expect(manifest.stats).toEqual({
      totalArticles: 4,
      includedArticles: 1,
      excludedArticles: 3,
    })
  })
})
