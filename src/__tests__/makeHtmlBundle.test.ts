import { makeHtmlBundle } from '..'
import { testContent, deserializeHtmlBundle } from './utils'

describe('makeHtmlBundle', () => {
  test('can generate basic HTML bundle', async () => {
    const { bundle } = await makeHtmlBundle(testContent)
    expect(deserializeHtmlBundle(bundle)).toMatchSnapshot()
  })

  test('can generate HTML bundle with payment pointer', async () => {
    const { bundle } = await makeHtmlBundle({
      paymentPointer: '$pay-me',
      ...testContent,
    })
    expect(deserializeHtmlBundle(bundle)).toMatchSnapshot()
  })
})
