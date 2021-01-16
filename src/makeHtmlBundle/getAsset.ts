import { resolve as urlResolve } from 'url'
import fetch from 'isomorphic-fetch'

/**
 * fetch asset and return JSON object with buffer data
 * @param asset - Information on the target asset
 * @param asset.url - URL of the asset
 * @param asset.path - Target path of asset
 * @param asset.updateSrc - Callback function to update original src
 * @param asset.domain - Optional domain of asset
 */
export default async ({
  url,
  path,
  updateSrc,
  domain = 'https://matters.news/',
}: {
  url: string
  path: string
  domain?: string
  updateSrc?: () => void
}) => {
  if (!url) {
    return
  }
  try {
    const fullUrl = url.indexOf('://') >= 0 ? url : urlResolve(domain, url)
    const response = await fetch(fullUrl)

    const data = await response.arrayBuffer()

    if (updateSrc) {
      updateSrc()
    }

    return { path, content: Buffer.from(data) }
  } catch (err) {
    // console.log(`Fetching data for ${url} failed`)
    return
  }
}
