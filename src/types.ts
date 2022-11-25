type Author = {
  userName: string
  displayName: string
}

type ArticleDigest = {
  author: Author
  title: string
  summary: string
  date: string
}

type Article = ArticleDigest & {
  content: string
  tags: string[]
}

type HomepageArticleDigest = ArticleDigest & {
  uri: string
}

type PageMeta = {
  meta: {
    title: string
    description: string
    authorName?: string
    image?: string
  }
  byline: {
    date?: string
    author: {
      name: string
      uri: string
    }
    website: {
      name: string
      uri: string
    }
  }
  rss?: {
    ipns: string
    xml: string
    json: string
  }
  paymentPointer?: string
}

export type HomepageContext = PageMeta & {
  articles: HomepageArticleDigest[]
}

export type ArticlePageContext = PageMeta & {
  encrypted: boolean
  article: Article
}
