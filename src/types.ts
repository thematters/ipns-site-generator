type Author = {
  userName: string
  displayName: string
}

type Article = {
  id: string
  author: Author
  title: string
  summary: string
  date: string
  image?: string
  content: string
  tags: string[]
}

type HomepageArticleDigest = Article & {
  uri: string
  sourceUri: string
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
    ipnsKey: string
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
