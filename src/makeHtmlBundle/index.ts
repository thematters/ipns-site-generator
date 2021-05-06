import cheerio from 'cheerio'
import { uniqBy } from 'lodash'

import { formatHTML, TemplateOptions } from './formatHTML'
import getAsset from './getAsset'

/**
 * Make HTML bundle object from HTML string before adding to IPFS
 *
 * @param data - All data needed for html bundle
 * @param data.title - Content title
 * @param data.author - Content author information
 * @param data.content - Content in HTML string format
 * @param data.siteDomain - Optional site domain to assemble author link
 * @param data.summary - Optional content summary
 * @param data.readMore - Optional link (text & url) to full article for paywalled content
 * @param data.paymentPointer - Optional ILP payment pointer
 */
export const makeHtmlBundle = async (data: TemplateOptions) => {
  // format single page html
  const { html, key } = await formatHTML(data)

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
    results.filter((asset) => asset)
  )

  // bundle html
  return {
    bundle: [
      {
        path: `index.html`,
        content: Buffer.from($.html()),
      },
      ...uniqBy(assets, 'path'),
    ],
    key,
  }
}

export * from './formatHTML'
