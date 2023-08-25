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
  domain = 'matters.news',
  onlyDomains = ['imagedelivery.net', 'matters.news', 'matters.town'],
}: {
  url: string
  path: string
  domain?: string
  onlyDomains?: string[]
  updateSrc?: () => void
}) => {
  if (!url) {
    return
  }
  try {
    let fullUrl = url

    if (url.indexOf('://') < 0) {
      // relative path
      fullUrl = new URL(url, `https://${domain}/`).href
    }

    const parsedUrl = new URL(fullUrl)
    if (
      Array.isArray(onlyDomains) &&
      onlyDomains.some((d) => parsedUrl.hostname.endsWith(d))
    ) {
      // to next fetch'ing
    } else if (!parsedUrl.hostname.endsWith(domain)) {
      // skip assets from other domain
      return
    }

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
