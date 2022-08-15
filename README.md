# Matters HTML Formatter

Utility functions to format HTML string. Can be used to create encrypted HTML page with decryption code embedded, generate HTML bundle, and create content metadata. Used at matters.news before adding content to IPFS.

## Installation

### NPM

```sh
npm install --save @matters/matters-html-formatter
```

## Usage

### Create an encrypted HTML

Pass in a HTML string as content, and return a HTML string with the content encrypted and the encrytion key. The returned HTML can be then written to a file or add to IPFS. During rendering, the HTML will be decrypted by adding `key=${encrytion-key}` in query parameter, and also include a simple UI to prompt key enter.

Support payment pointer for Web Monetization. See [test](./src/__tests__/formatHTML.test.ts) for more detail.

```js
import { makeHtmlBundle } from "@matters/matters-html-formatter"

const { bundle, key } = await makeHtmlBundle({
  title: "test article",
  author: {
    name: "test-user",
    link: {
      url: "https://matters.news/@test-user",
      text: "Test User",
    },
  },
  content: `<p>test article</p>`,
  paymentPointer: "$pay-me", // used for Web Monetization
  encrypt: true, // argument for whether encrypt or not, if false returned key will be null
})
```

### Create HTML bundle and metadata for uploading to IPFS

`makeHtmlBundle` returns an array of object that contains path and buffer data that can be added with IPFS API directly. See [test](./src/__tests__/makeHtmlBundle.test.ts) for more detail.

`makeMetaData` returns content metadata object used at Matters. See [test](./src/__tests__/makeMetaData.test.ts) for more detail.

```js
import { makeHtmlBundle, makeMetaData } from "@matters/matters-html-formatter"

const article = {
  title: "test article",
  author: {
    name: "test-user",
    link: {
      url: "https://matters.news/@test-user",
      text: "Test User",
    },
  },
  content: `<p>test article</p>`,
}

// this creates an array of object containing path and buffer data,
// which IPFS recognizes as a folder
const { bundle } = await makeHtmlBundle(article)

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

// this create the standard format of meta data,
// should be merged with ISCN standard in the future
const metaData = makeMetaData(articleInfo)

const cid = await ipfs.dag.put(metaData, {
  format: "dag-cbor",
  pin: true,
  hashAlg: "sha2-256",
})
// this is the final media hash used in the end of article url at matters.news
const mediaHash = cid.toBaseEncodedString()
```

## Unit test

Run test with:

```
npm run test
```

Tests were run with Jest after compiled to JavaScript. Most test are run with snapshots located in `src/__tests__/__snapshots__`.

Encryption with `formatHTML` changes in every run, since encryption is random, and we cannot use snapshot. Therefore the test write out a HTML file to `src/__tests__/__snapshots__` with decryption key as filename. You can open and test the decryption manually.
