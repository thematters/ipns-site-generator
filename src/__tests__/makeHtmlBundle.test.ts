import fetch from 'isomorphic-fetch'
import { makeHtmlBundle } from '..'
import { testContent, deserializeHtmlBundle } from './utils'

jest.mock('isomorphic-fetch');
const mockedFetch = fetch as jest.Mock

describe('makeHtmlBundle', () => {
  test('can generate basic HTML bundle', async () => {

    mockedFetch.mockResolvedValue({arrayBuffer: () => Promise.resolve(new ArrayBuffer(1))})

    const { bundle } = await makeHtmlBundle(testContent)
    expect(deserializeHtmlBundle(bundle)).toMatchSnapshot()
  })

  test('can generate HTML bundle with payment pointer', async () => {

    mockedFetch.mockResolvedValue({arrayBuffer: () => Promise.resolve(new ArrayBuffer(1))})

    const { bundle } = await makeHtmlBundle({
      paymentPointer: '$pay-me',
      ...testContent,
    })
    expect(deserializeHtmlBundle(bundle)).toMatchSnapshot()
  })
})
