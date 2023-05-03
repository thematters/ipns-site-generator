import path from 'path'
import fs from 'fs'

import { makeArticlePage, makeHomepage } from '../src'
import { MOCK_ARTICLE_PAGE, MOCK_HOMEPAGE } from '../src/render/mock'

const paths = {
  out: path.resolve(__dirname, '../demo'),
}

// MOCK_ARTICLE_PAGE.meta.siteDomain = MOCK_HOMEPAGE.meta.siteDomain = 'matters.town'
const MOCK_ARTICLE_PAGE_DATA = MOCK_ARTICLE_PAGE()
const MOCK_HOMEPAGE_DATA = MOCK_HOMEPAGE()

// homepage
const { html, xml, json } = makeHomepage(MOCK_HOMEPAGE_DATA)
fs.promises.mkdir(paths.out, { recursive: true }).catch(console.error)
fs.writeFileSync(path.resolve(paths.out, 'homepage.html'), html)
fs.writeFileSync(path.resolve(paths.out, 'rss.xml'), xml)
fs.writeFileSync(path.resolve(paths.out, 'feed.json'), json)

// article page
makeArticlePage(MOCK_ARTICLE_PAGE_DATA).then((data) => {
  const content = data.bundle[0]?.content.toString() || ''

  fs.promises.mkdir(paths.out, { recursive: true }).catch(console.error)
  fs.writeFileSync(path.resolve(paths.out, 'article.html'), content)
})

// encrypted article page
makeArticlePage({ ...MOCK_ARTICLE_PAGE_DATA, encrypted: true }).then((data) => {
  const content = data.bundle[0]?.content.toString() || ''
  console.log('key: ', data.key)
  fs.promises.mkdir(paths.out, { recursive: true }).catch(console.error)
  fs.writeFileSync(path.resolve(paths.out, 'article-encrypted.html'), content)
})

// article page w/o rss entrances
makeArticlePage({ ...MOCK_ARTICLE_PAGE_DATA, rss: undefined }).then((data) => {
  const content = data.bundle[0]?.content.toString() || ''
  fs.promises.mkdir(paths.out, { recursive: true }).catch(console.error)
  fs.writeFileSync(
    path.resolve(paths.out, 'article-no-entrances.html'),
    content
  )
})
