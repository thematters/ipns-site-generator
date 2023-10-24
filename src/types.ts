type Author = {
  userName: string
  displayName: string
  description?: string
}

type Article = {
  id: string
  author: Author
  title: string
  slug?: string
  summary: string
  date: string
  image?: string
  content: string
  tags: string[]
  createdAt?: Date | string
}

type HomepageArticleDigest = Article & {
  uri: string
  sourceUri: string
}

type PageMeta = {
  meta: {
    siteDomain?: string
    title: string
    description: string
    authorName?: string
    image?: string
  }
  byline: {
    date?: string
    author: Author & {
      name: string // byline composed name, like `{displayName} (@{userName})`
      uri: string
      ipnsKey?: string
      webfDomain?: string // webfinger host, e.g. can be the ENS name at limo
    }
    website: {
      name: string
      uri: string
    }
  }
  rss?: {
    xml: string // path to xml rss; default to './rss.xml'
    json: string // path to json feed; default to './feed.json'
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
