import encryptHandler from './encryption/encrypt'
import fs from 'fs'
import path from 'path'

const encryptionVersion = '0.0.7'

type Link = {
  text: string
  url: string
}

export type TemplateOptions = {
  title: string
  author: {
    name: string
    link: Link
  }
  summary?: string
  content: string
  readMore?: Link
  paymentPointer?: string
  from?: Link
  encrypt?: boolean
}

export type TemplateVars = TemplateOptions & {
  publishedAt: string
  summary: string
}

export default async ({
  title,
  author,
  summary,
  content,
  publishedAt,
  readMore,
  paymentPointer,
  from = { text: 'Matters', url: 'https://matters.news' },
  encrypt = false,
}: TemplateVars) => {
  let contentProcessed = content
  let key = null
  if (encrypt) {
    const { key: decryptionKey, encrypted } = await encryptHandler(content)
    contentProcessed = encrypted
    key = decryptionKey
  }

  // prettier-ignore
  const html = /*html*/ `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${title}</title>
    <meta name="description" content="${summary}">
    <meta property="og:title" content="${author.name}: ${title}">
    <meta property="og:description" content="${summary}">
    <meta property="article:author" content="${author.name}">
    <meta name="twitter:title" content="${author.name}: ${title}">
    <meta name="twitter:description" content="${summary}">
${encrypt ? /*html*/`
    <script type="text/javascript"> ${
      fs.readFileSync(
        path.resolve(__dirname, "./encryption/decrypt.js"),
        'binary')}
    </script>
    <script type="text/javascript"> ${
      fs.readFileSync(
        path.resolve(__dirname, "./encryption/inputUI.js"),
        'binary')}
    </script>
    <script type="text/javascript"> ${
      fs.readFileSync(
        path.resolve(__dirname, "./encryption/listener.js"),
        'binary')}
    </script>
    ` : ``
}
${paymentPointer ? /*html*/`
    <meta name="monetization" content="${paymentPointer}">` : ``
}
  ${style}
  </head>
  <body itemscope itemtype="http://schema.org/Article">
    <main>
      <header>
        <h1 itemprop="headline">${title}</h1>
        <figure class="byline">
          <a href="${author.link.url}" target="_blank">${author.link.text}</a>
          <time itemprop="datePublished" datetime="${publishedAt}">${publishedAt}</time>
${
  from ? /*html*/`
        <span itemprops="provider" itemscope itemtype="http://schema.org/Organization">
          from <a href="${from.url}" target="_blank"  itemprops="name">${from.text}</a>
          <meta itemprops="url" content="${from.url}">
        </span>` : ``
}

        </figure>
        <figure class="summary">
          <p>${summary}</p>
        </figure>
      </header>

      <article itemprop="articleBody"
      ${encrypt
          ? `class="encrypted" data-encryption-version=${encryptionVersion}`
          : ``}>
        ${contentProcessed}
      </article>

${readMore ? /*html*/ `
      <footer>
        <figure class="read_more">
          <p>
            Read more: <a href="${readMore.url}" target="_blank">${readMore.text}</a>
          </p>
        </figure>
      </footer>` : ``
}

    </main>
  </body>
</html>
`
  return { html, key }
}

const style =
  // prettier-ignore
  /*html*/ `
<style>
  html, body {
    margin: 0;
    padding: 0;
  }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
    font-size: 18px;
    line-height: 1.5;
  }
  main {
    max-width: 673px;
    margin: 40px auto;
    padding: 0 20px;
  }
  hr { height: 1px; }
  h1, h2, h3, h4, h5, h6 { font-weight: 600; line-height: 1.4; }
  h1 { font-size: 28px; }
  h2 { font-size: 24px; }
  h3 { font-size: 22px; }
  h4 { font-size: 18px; }
  h5 { font-size: 16px; }
  h6 { font-size: 14px; }
  li ul, li ol { margin: 0 20px; }
  li { margin: 20px 0; }
  ul { list-style-type: disc; }
  ol { list-style-type: decimal; }
  ol ol { list-style: upper-alpha; }
  ol ol ol { list-style: lower-roman; }
  ol ol ol ol { list-style: lower-alpha; }
  img, video, audio {
    display: block;
    max-width: 100%;
    margin: 0 auto;
  }
  audio {
    width: 100%;
  }
  blockquote {
    margin-left: 20px;
    margin-right: 20px;
    color: #5F5F5F;
  }

  pre {
    white-space: pre-wrap;
  }

  header {
    margin-bottom: 40px;
  }
  header h1 {
    font-size: 32px;
  }


  figure {
    margin: 0;
  }

  figure.byline {
    font-size: 16px;
    margin: 0;
  }
  figure.byline * + * {
    padding-left: 10px;
  }
  figure.byline time {
    color: #b3b3b3;
  }
  figure.byline [ref="source"]::before {
    content: '';
    border-left: 1px solid currentColor;
    padding-left: 10px;
  }

  figure.summary {
    margin: 40px 0; 
    color: #808080;
    font-size: 18px;
    font-weight: 500;
    line-height: 32px;
  }

  figure.read_more {
    margin: 40px 0; 
  }

  article {
    position: relative;
  }

  article > * {
    margin-top: 20px;
    margin-bottom: 24px;
  }
  article a {
    border-bottom: 1px solid currentcolor;
    text-decoration: none;
    padding-bottom: 2px;
  }
  article p {
    line-height: 1.8;
  }
  figure figcaption {
    margin-top: 5px;
    font-size: 16px;
    color: #b3b3b3;
  }

  figure .iframe-container {
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 56.25%;
  }
  figure .iframe-container iframe {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
  }

  .encrypted {
    display: flex;
    justify-content: center;
    word-break: break-all;
  }
</style>
`
