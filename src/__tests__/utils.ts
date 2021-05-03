export const deserializeHtmlBundle = (
  bundle: ({ path: string; content: Buffer } | undefined)[]
) => {
  let newBundle = []

  for (let file of bundle) {
    if (file) {
      const deserialized = { ...file, content: file.content.toString() }
      newBundle.push(deserialized)
    }
  }
  return newBundle
}

// test data
export const testMetaData = {
  contentHash: 'ipfs-hash',
  author: {
    name: 'Test User',
    url: 'user-home-page',
    description: 'this is a test user',
  },
  description: 'This is a piece of test content',
  image: 'image-url',
}

export const testContent = {
  title: 'test article',
  author: {
    userName: 'test-user',
    displayName: 'test display name',
  },
  content: `
  <h1 id="hello-world">Hello World</h1>
  <p>This is some test text.</p>
  <blockquote>
    <p>Together with some test quotations</p>
  </blockquote>
  <pre><code><span class="hljs-keyword">And </span>test <span class="hljs-meta">code</span>
  </code></pre>
  <p>Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of &quot;de Finibus Bonorum et Malorum&quot; (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, &quot;Lorem ipsum dolor sit amet..&quot;, comes from a line in section 1.10.32.</p>
  <p>The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from &quot;de Finibus Bonorum et Malorum&quot; by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.</p>
  <figure>
    <img src="https://pyxis.nymag.com/v1/imgs/9ef/336/775d89db9c8ffcd8589f3acdf37d0e323f-25-this-is-fine-lede-new.2x.rsocial.w600.jpg" alt="And this is a fine dog.">
    <figcaption>This is a fine dog hosted on another domain.</figcaption>
  </figure>
  <figure>
    <img src="https://assets.matters.news/processed/1080w/embed/9bc4a39b-9eee-486b-8242-196d2c91ec3c.webp" alt="">
    <figcaption>This is a random figure from matters.news production.</figcaption>
  </figure>
  <figure>
    <img src="https://assets-develop.matters.news/embed/da642df3-8828-4584-bc51-e10fb56437df.gif" alt="">
    <figcaption>This is a random figure from matters.news development.</figcaption>
  </figure>
  <figure>
    <div class="iframe-container"><iframe width="560" height="315" src="https://www.youtube.com/embed/cbP2N1BQdYc" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>
    <figcaption>And this is a cat video.</figcaption>
  </figure>
  <p>Good bye.</p>
  `,
}
