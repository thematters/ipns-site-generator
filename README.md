# Matters HTML Formatter

Utility functions to format HTML string, generate HTML bundle, and create content metadata. Used at matters.news before adding content to IPFS.

## example

```
import { makeHtmlBundle, makeMetaData } from "matters-html-formatter"

const article = {
  title: "test article",
  author: {
    userName: "test-user",
    displayName: "test display name",
  },
  content: `<p>test article</p>`
}

// this creates an array of object containing path and buffer data,
// which IPFS recognizes as a folder
const bundle = makeHtmlBundle(article)

// this is the hash that will render out html content on IPFS gateways,
// or use ipfs-only-hash if you only want to get the hash
const contentHash = ipfs.add(htmlBundle, { pin: true })

// additional information for article, including previously generated contentHash
const articleInfo = {
  contentHash,
  author: {
    name: "test-user",
    url: "user-home-page",
    description: "this is a test user",
  },
  description: "This is a piece of test content",
  image: "image-url",
}

const metaData = makeMetaData(articleInfo)

const cid = await ipfs.dag.put(metaData, {
  format: 'dag-cbor',
  pin: true,
  hashAlg: 'sha2-256',
})
// this is the final media hash used in the end of article url at matters.news
const mediaHash = cid.toBaseEncodedString()
```
