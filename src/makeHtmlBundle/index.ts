import cheerio from 'cheerio'
import { uniqBy } from 'lodash'

import formatHTML, { FormatterVars } from './formatHTML'
import getAsset from './getAsset'

/**
 * Make HTML bundle object from HTML string before adding to IPFS
 * @param data - All data needed for html bundle
 * @param data.title - Content title
 * @param data.author - Content author information
 * @param data.content - Content in HTML string format
 * @param data.siteDomain - Optional site domain to assemble author link
 * @param data.summary - Optional content summary
 */
export const makeHtmlBundle = async ({
  title,
  author,
  content,
  siteDomain,
  summary,
  prefix = 'article',
}: FormatterVars) => {
  // format single page html
  const html = formatHTML({ title, author, content, siteDomain, summary })

  // load to cheerio to parse assets
  const $ = cheerio.load(html, { decodeEntities: false })

  // array for Promisses to get assets
  const assetsPromises: Promise<
    { path: string; content: Buffer } | undefined
  >[] = []

  // function to get assets and push them to array
  const addAssetToPromises = (index: number, element: cheerio.Element) => {
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

      const updateSrc = () => $(element).attr('src', assetPath)

      assetsPromises.push(
        getAsset({
          url: elementSrc,
          path: `${prefix}/${assetPath}`,
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

  // add analytics segment
  $('head').append(
    `<script type="text/javascript" src="//static.matters.news/analytics.js"></script>`
  )

  const assets = await Promise.all(assetsPromises).then((results) =>
    results.filter((asset) => asset)
  )

  // bundle html
  return [
    {
      path: `${prefix}/index.html`,
      content: Buffer.from($.html()),
    },
    ...uniqBy(assets, 'path'),
  ]
}

export * from './formatHTML'