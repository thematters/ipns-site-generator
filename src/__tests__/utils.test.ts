import { MOCK_ARTICLE_PAGE } from '../render/mock'
import { stripHtml, makeSummary } from '../utils'

describe('utils', () => {
  test(`"stripHtml" can generate clean text from HTML`, () => {
    expect(stripHtml(MOCK_ARTICLE_PAGE.article.content)).toMatchSnapshot()
  })

  test(`"makeSummary" can produce summary text from HTML`, () => {
    expect(makeSummary(MOCK_ARTICLE_PAGE.article.content)).toMatchSnapshot()
  })
})
