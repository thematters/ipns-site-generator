import path from 'path'
import fs from 'fs'

import nunjucks from 'nunjucks'

import { makeArticlePage, makeHomepage } from '../src'
import { MOCK_ARTICLE_PAGE, MOCK_HOMEPAGE } from '../src/render/mock'

const paths = {
  out: path.resolve(__dirname, '../demo'),
}

// homepage
fs.promises.mkdir(paths.out, { recursive: true }).catch(console.error)
fs.writeFileSync(
  path.resolve(paths.out, 'homepage.html'),
  makeHomepage(MOCK_HOMEPAGE)
)

// article page
makeArticlePage(MOCK_ARTICLE_PAGE).then((data) => {
  const content = data.bundle[0]?.content.toString() || ''

  fs.promises.mkdir(paths.out, { recursive: true }).catch(console.error)
  fs.writeFileSync(path.resolve(paths.out, 'article.html'), content)
})

// encrypted article page
makeArticlePage({ ...MOCK_ARTICLE_PAGE, encrypted: true }).then((data) => {
  const content = data.bundle[0]?.content.toString() || ''
  console.log('key: ', data.key)
  fs.promises.mkdir(paths.out, { recursive: true }).catch(console.error)
  fs.writeFileSync(path.resolve(paths.out, 'article-encrypted.html'), content)
})

// article page w/o rss entrances
makeArticlePage({ ...MOCK_ARTICLE_PAGE, rss: undefined }).then((data) => {
  const content = data.bundle[0]?.content.toString() || ''
  fs.promises.mkdir(paths.out, { recursive: true }).catch(console.error)
  fs.writeFileSync(
    path.resolve(paths.out, 'article-no-entrances.html'),
    content
  )
})
