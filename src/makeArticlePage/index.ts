import type { Element } from 'domhandler'
import * as cheerio from 'cheerio'
import { uniqBy } from 'lodash'

import getAsset from './getAsset'
import { ArticlePageContext } from '../types'
import { renderArticlePage } from '../render'
import { cleanHTML, encrypt } from '../utils'

export type MakeArticlePageData = ArticlePageContext

/**
 * Make HTML bundle object from article data
 */
export const makeArticlePage = async (data: MakeArticlePageData) => {
  // load to cheerio to parse assets
  const $ = cheerio.load(data.article.content, { decodeEntities: false })

  // array for Promisses to get assets
  const assetsPromises: Promise<
    { path: string; content: Buffer } | undefined
  >[] = []

  // function to get assets and push them to array
  const addAssetToPromises = (index: number, element: Element) => {
    const elementSrc = $(element).attr('src')
    // check if it's data url
    if (elementSrc && !elementSrc.startsWith('data:')) {
      let tagName = 'text'
      if ('tagName' in element) {
        tagName = element.tagName
      }
      // assuming it's http url
      const assetPath =
        elementSrc.split('/').pop() || `${index.toString()}-${tagName}`

      const updateSrc = () => $(element).attr('src', `./${assetPath}`)

      assetsPromises.push(
        getAsset({
          url: elementSrc,
          path: assetPath,
          updateSrc,
        })
      )
    }
  }

  // handle images
  $('img').each((index, image) => {
    addAssetToPromises(index, image)
  })

  // handle audios
  $('audio source').each((index, audio) => {
    addAssetToPromises(index, audio)
  })

  const assets = await Promise.all(assetsPromises).then((results) =>
    results.filter(Boolean)
  )

  // generate html
  let content = cleanHTML($.html())

  // paywalled content
  let key = null
  if (data.encrypted) {
    const { key: decryptionKey, encrypted } = await encrypt(content)
    content = encrypted
    key = decryptionKey
  }

  const html = renderArticlePage({
    ...data,
    article: { ...data.article, content },
  })

  // bundle html
  return {
    bundle: [
      {
        path: `index.html`,
        content: Buffer.from(html),
      },
      ...uniqBy(assets, 'path'),
    ],
    key,
  }
}
