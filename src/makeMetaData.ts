import { toDateString } from './utils'

/**
 * Make meta data object before adding to IPFS
 * @param data - All data needed for meta data object
 * @param data.contentHash - IPFS hash for html bundle
 * @param data.author - Content author information
 * @param data.description - Description of content
 * @param data.image - Cover url image
 */
export const makeMetaData = ({
  contentHash,
  author,
  description,
  image,
}: {
  contentHash: string
  author: {
    name: string
    image?: string | null
    url: string
    description: string
  }
  description: string
  image?: string | null
}) => {
  let now = toDateString(new Date())
  if (process.env.NODE_ENV === 'test') {
    // for snapshot testing
    now = '2020-12-23'
  }

  return {
    '@context': 'http://schema.org',
    '@type': 'Article',
    '@id': `ipfs://${contentHash}`,
    author,
    dateCreated: now,
    description,
    image,
  }
}
