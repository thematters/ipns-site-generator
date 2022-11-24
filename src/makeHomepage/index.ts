import { uniqBy } from 'lodash'

import { HomepageContext } from '../types'
import { renderArticlePage, renderHomepage } from '../render'
import { encrypt } from '../utils'

export type MakeHomepageData = HomepageContext

/**
 * Make Homepage HTML from articles data
 */
export const makeHomepage = (data: MakeHomepageData) => {
  const html = renderHomepage(data)

  return html
}
