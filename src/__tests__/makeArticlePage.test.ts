import fetch from 'isomorphic-fetch'
import { makeArticlePage } from '..'
import { MOCK_ARTICLE_PAGE } from '../render/mock'
import { deserializeHtmlBundle } from './utils'

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
  })

  test('can generate basic HTML bundle when `getAsset` fails', async () => {
    mockedFetch.mockImplementation(() => {
      throw new Error()
    })

    const { bundle } = await makeArticlePage(MOCK_ARTICLE_PAGE_DATA)
    expect(deserializeHtmlBundle(bundle)).toMatchSnapshot()
  })

  test('can generate HTML bundle with payment pointer', async () => {
    mockedFetch.mockResolvedValue({
      arrayBuffer: () => Promise.resolve(new ArrayBuffer(1)),
    })

    const { bundle } = await makeArticlePage({
      ...MOCK_ARTICLE_PAGE_DATA,
      paymentPointer: '$pay-me',
    })
    expect(deserializeHtmlBundle(bundle)).toMatchSnapshot()
  })
})
