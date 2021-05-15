import { stripHtml, makeSummary } from '..'
import { testContent } from './utils'

describe('utils', () => {
  test(`"stripHtml" can generate clean text from HTML`, () => {
    expect(stripHtml(testContent.content)).toMatchSnapshot()
  })

  test(`"makeSummary" can produce summary text from HTML`, () => {
    expect(makeSummary(testContent.content)).toMatchSnapshot()
  })
})
