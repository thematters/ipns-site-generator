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

    const bundles = await makeActivityPubBundles(MOCK_HOMEPAGE('matters.news'))

    let webfinger: string = ''
    for (const { path, content } of bundles) {
      switch (path) {
        case '.well-known/webfinger':
          webfinger = content
          break
      }
    }
    expect(webfinger).toMatchSnapshot()
  })
})
