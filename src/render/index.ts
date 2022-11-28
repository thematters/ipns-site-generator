import path from 'path'
import nunjucks from 'nunjucks'
import { ArticlePageContext, HomepageContext } from '../types'

import { shortDate, stripSpaces, toRFC822Date } from './utils'

// configure nunjucks
nunjucks
  .configure(path.resolve(__dirname, 'views'))
  .addFilter('shortDate', shortDate)
  .addFilter('toRFC822Date', toRFC822Date)
  .addFilter('stripSpaces', stripSpaces)

// render templates
export const renderArticlePage = (context: ArticlePageContext) => {
  return nunjucks.render('article/index.njk', context)
}

export const renderHomepage = (context: HomepageContext) => {
  return {
    html: nunjucks.render('homepage/index.njk', context),
    xml: nunjucks.render('homepage/rss.xml.njk', context),
  }
}
