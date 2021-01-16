import { makeHtmlBundle, makeMetaData, stripHtml, makeSummary } from '..'
import { testContent, testMetaData, deserializeHtmlBundle } from './utils'

test(`"makeHtmlBundle" can generate HTML bundle`, async () => {
  const bundle = await makeHtmlBundle(testContent)
  expect(deserializeHtmlBundle(bundle)).toMatchSnapshot()
})

test(`"makeMetaData" can generate content meta data`, () => {
  expect(makeMetaData(testMetaData)).toMatchSnapshot()
})

test(`"stripHtml" can generate clean text from HTML`, () => {
  expect(stripHtml(testContent.content)).toMatchSnapshot()
})

test(`"makeSummary" can produce summary text from HTML`, () => {
  expect(makeSummary(testContent.content)).toMatchSnapshot()
})
