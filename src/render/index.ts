import nunjucks from 'nunjucks'
import { ArticlePageContext, HomepageContext } from '../types'

import { shortDate, stripSpaces } from './utils'

// configure nunjucks
nunjucks
  .configure('views')
  .addFilter('shortDate', shortDate)
  .addFilter('stripSpaces', stripSpaces)

// render templates
export const renderArticlePage = (context: ArticlePageContext) => {
  return nunjucks.render('article/index.njk', context)
}

export const renderHomepage = (context: HomepageContext) => {
  return nunjucks.render('homepage/index.njk', context)
}
