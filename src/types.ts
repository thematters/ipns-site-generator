type Author = {
  userName: string
  displayName: string
}

type Article = {
  author: Author
  title: string
  description: string
  summary: string
  date: string
  uri: string
  content: string
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
  rss: {
    ipns: string
    xml: string
    json: string
  }
}

export type HomepageContext = PageMeta & {
  articles: Article[]
}

export type ArticlePageContext = PageMeta & {
  encrypted: boolean
  article: Article
}
