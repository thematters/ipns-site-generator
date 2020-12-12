import { resolve as urlResolve } from "url"
import cheerio from "cheerio"
import { uniqBy } from "lodash"

import { outputCleanHTML, makeSummary } from "./utils"
import { articleTemplate } from "./template"

interface FormatterVars {
  title: string
  author: {
    userName: string
    displayName: string
  }
  content: string
  summary?: string
  siteDomain?: string
}

export const formatHTML = ({
  title,
  author,
  content,
  siteDomain,
  summary,
}: FormatterVars) => {
  const now = new Date()
  const htmlSummary = summary || makeSummary(content)

  return articleTemplate({
    title,
    author,
    summary: htmlSummary,
    content: outputCleanHTML(content),
    publishedAt: now,
    siteDomain,
  })
}

// fetch data and return buffer
const getDataAsFile = async ({
  url,
  path,
  mutateOrigin,
  domain = "http://matters.news/",
}: {
  url: string
  path: string
  domain?: string
  mutateOrigin?: () => void
}) => {
  if (!url) {
    return
  }
  try {
    const fullUrl = url.indexOf("://") >= 0 ? url : urlResolve(domain, url)
    const response = await fetch(fullUrl)

    const data = await response.json()
    // const { data } = await axios.get(fullUrl, { responseType: "arraybuffer" })

    if (mutateOrigin) {
      mutateOrigin()
    }

    return { path, content: Buffer.from(data, "binary") }
  } catch (err) {
    // console.log(`Fetching data for ${url} failed`)
    return
  }
}

export const htmlToBundle = async (html: string) => {
  const prefix = "article"

  // get image assets
  const assetsPromises: Promise<
    { path: string; content: Buffer } | undefined
  >[] = []
  const $ = cheerio.load(html, { decodeEntities: false })

  const getSrc = (index: number, element: cheerio.Element) => {
    const elementSrc = $(element).attr("src")
    // check if it's data url
    if (elementSrc && !elementSrc.startsWith("data:")) {
      let tagName = "text"
      if ("tagName" in element) {
        tagName = element.tagName
      }
      // assuming it's http url
      const assetPath =
        elementSrc.split("/").pop() || `${index.toString()}-${tagName}`
      const mutateOrigin = () => $(element).attr("src", assetPath)
      assetsPromises.push(
        getDataAsFile({
          url: elementSrc,
          path: `${prefix}/${assetPath}`,
          mutateOrigin,
        })
      )
    }
  }

  // handle images
  $("img").each((index, image) => {
    getSrc(index, image)
  })

  // handle audios
  $("audio source").each((index, audio) => {
    getSrc(index, audio)
  })

  // add segment
  $("head").append(
    `<script type="text/javascript" src="//static.matters.news/analytics.js"></script>`
  )

  const assets = await Promise.all(assetsPromises)

  // bundle html
  return [
    {
      path: `${prefix}/index.html`,
      content: Buffer.from($.html()),
    },
    ...uniqBy(
      assets.filter((asset) => asset),
      "path"
    ),
  ]
}
