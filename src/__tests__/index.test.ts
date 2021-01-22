import { makeHtmlBundle, makeMetaData, stripHtml, makeSummary } from '..'
import { testContent, testMetaData, deserializeHtmlBundle } from './utils'

describe('makeHtmlBundle', () => {
  test('can generate basic HTML bundle', async () => {
    const bundle = await makeHtmlBundle(testContent)
    expect(deserializeHtmlBundle(bundle)).toMatchSnapshot()
  })

  test('can generate HTML bundle with payment pointer', async () => {
    const bundle = await makeHtmlBundle({
      paymentPointer: '$pay-me',
      ...testContent,
    })
    expect(deserializeHtmlBundle(bundle)).toMatchSnapshot()
  })

  test('can generate HTML bundle with paywall', async () => {
    const bundle = await makeHtmlBundle({
      readMore: { text: 'test circle', url: 'test-circle-url' },
      ...testContent,
    })
    expect(deserializeHtmlBundle(bundle)).toMatchSnapshot()
  })
})

describe('makeMetaData', () => {
  test('can generate content meta data', () => {
    expect(makeMetaData(testMetaData)).toMatchSnapshot()
  })
})

describe('utils', () => {
  test(`"stripHtml" can generate clean text from HTML`, () => {
    expect(stripHtml(testContent.content)).toMatchSnapshot()
  })

  test(`"makeSummary" can produce summary text from HTML`, () => {
    expect(makeSummary(testContent.content)).toMatchSnapshot()
  })
})
