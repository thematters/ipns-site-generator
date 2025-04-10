import fetch from 'isomorphic-fetch'
import { makeArticlePage } from '..'
import { MOCK_ARTICLE_PAGE } from '../render/mock'
import { deserializeHtmlBundle } from './utils'
import * as cheerio from 'cheerio'

jest.mock('isomorphic-fetch')
const mockedFetch = fetch as jest.Mock

const MOCK_ARTICLE_PAGE_DATA = MOCK_ARTICLE_PAGE('matters.town')

describe('makeArticlePage', () => {
  test('can generate basic HTML bundle', async () => {
    mockedFetch.mockResolvedValue({
      arrayBuffer: () => Promise.resolve(new ArrayBuffer(1)),
    })

    const { bundle } = await makeArticlePage(MOCK_ARTICLE_PAGE_DATA)
    expect(deserializeHtmlBundle(bundle)).toMatchSnapshot()

    // Image src should be relative path
    const $ = cheerio.load(bundle[0]?.content.toString('utf-8')!)
    expect($('img').attr('src')).not.toContain('https://')
  })

  test('can generate basic HTML bundle when `getAsset` fails', async () => {
    mockedFetch.mockImplementation(() => {
      throw new Error()
    })

    const { bundle } = await makeArticlePage(MOCK_ARTICLE_PAGE_DATA)
    expect(deserializeHtmlBundle(bundle)).toMatchSnapshot()
  })

  test('skipAssets option should not include assets in bundle', async () => {
    mockedFetch.mockResolvedValue({
      arrayBuffer: () => Promise.resolve(new ArrayBuffer(1)),
    })

    const { bundle: bundleWithoutAssets } = await makeArticlePage({
      ...MOCK_ARTICLE_PAGE_DATA,
      skipAssets: true,
    })

    expect(bundleWithoutAssets.length).toBe(1)
    expect(bundleWithoutAssets[0]?.path).toBe('index.html')
    expect(deserializeHtmlBundle(bundleWithoutAssets)).toMatchSnapshot()

    // Image src should be absolute path
    const $ = cheerio.load(bundleWithoutAssets[0]?.content.toString('utf-8')!)
    expect($('img').attr('src')).toContain('https://')
  })
})
