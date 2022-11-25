import { ArticlePageContext, HomepageContext } from '../types'

const MOCK_AUTHOR = {
  userName: 'Anim',
  displayName: 'Excepteur Non',
}

const MOCK_ARTICLE = {
  author: MOCK_AUTHOR,
  title: 'Excepteur in consequat mollit consectetur.',
  description:
    'Aliquip reprehenderit elit nulla commodo sit. Aute deserunt quis cupidatat ea quis. Adipisicing magna tempor esse ea anim. Veniam aliquip laborum aliquip est laborum irure duis irure adipisicing dolore laboris in irure. Non sunt esse cillum consequat. Cupidatat qui ex fugiat ullamco cupidatat eu eu eu labore excepteur. Tempor tempor mollit nulla qui Lorem aute consectetur sint sint. Nostrud cupidatat ullamco ea elit in voluptate do mollit veniam.',
  summary: 'Ad cupidatat adipisicing consequat ad sint cillum dolore.',
  date: '2022-11-18T08:42:04.146Z',
  uri: './Qmc919SaZGj1yeDCLHx7KMY7WMzy1PF6UjixuapcG1bfAB',
  content: `
  <figure class="image">
    <img src="https://assets.matters.news/processed/1080w/profileCover/aa57a1ce-8926-4512-81d8-462f68fa3917.webp" data-asset-id="aa57a1ce-8926-4512-81d8-462f68fa3917">
    <figcaption><span>Reprehenderit proident sit consectetur id consequat officia.</span></figcaption>
  </figure>

  <h2>Duis ea voluptate cupidatat ad</h2>
  <p>Elit consequat labore tempor Lorem voluptate occaecat nostrud laborum minim. Cillum veniam ea cupidatat nulla commodo sunt amet magna amet sit culpa nulla deserunt <a href="https://google.com" target="_blank">reprehenderit</a> duis. Et nostrud sunt ad cupidatat laboris. Reprehenderit dolor dolore elit voluptate ex. Fugiat in in officia non eiusmod irure et. Velit ut aliquip ipsum exercitation exercitation nisi voluptate enim amet exercitation. Et consectetur ex nisi anim id consequat eiusmod veniam ipsum ullamco nulla deserunt nostrud.</p>

  <figure class="embed-video">
    <div class="iframe-container">
      <iframe src="https://www.youtube.com/embed/rokGy0huYEA?rel=0" frameborder="0" allowfullscreen="true" sandbox="allow-scripts allow-same-origin allow-popups">
      </iframe>
    </div>
    <figcaption><span>Nulla in fugiat labore ad.</span></figcaption>
  </figure>

  <h2>Cupidatat amet fugiat culpa id</h2>
  <p>Et ut dolore dolore ex. Deserunt adipisicing id dolor eiusmod minim ea. Pariatur veniam velit ad culpa nisi sit. Non nostrud irure nulla pariatur ipsum irure fugiat anim id Lorem duis. Ullamco incididunt ex ullamco elit. Amet voluptate minim laborum anim duis aliquip officia enim Lorem mollit aliquip laboris. <i>Mollit pariatur sunt pariatur occaecat deserunt esse</i>. Est eu ut elit id nisi duis id magna <strong>commodo ex et id sint laboris</strong>.</p>

  <blockquote>
    <strong>Enim aliqua est proident commodo dolor incididunt eiusmod. Anim anim eu pariatur aliqua qui. Sit non commodo enim ut aute officia eu. Adipisicing proident eu velit id proident.</strong>
  </blockquote>

  <p>Voluptate officia adipisicing voluptate amet dolore ad tempor aliquip reprehenderit Lorem. Ad dolor id minim occaecat ea non nulla. Ullamco exercitation consectetur duis tempor incididunt qui id. Sunt voluptate qui ex do Lorem consectetur laborum mollit culpa sunt anim occaecat esse. Velit deserunt eiusmod deserunt. Anim ullamco ad minim velit nulla aliquip culpa consequat laboris quis ad Lorem pariatur. Occaecat sunt irure reprehenderit.</p>

  <pre class="ql-syntax">query {\n&nbsp; article(\n&nbsp; &nbsp; input: { mediaHash: "zdpuAxP6uSfum74VS3pYmzBR9xvPbrBcX3J8BPpB3xdRGjVsX" }\n&nbsp; ) {\n&nbsp; &nbsp; id\n&nbsp; &nbsp; title\n&nbsp; &nbsp; summary\n&nbsp; }\n}\n</pre>

  <h2>Officia amet minim proident labore</h2>
  <h3>Proident fugiat amet</h3>
  <p>Duis eiusmod mollit ipsum exercitation voluptate sit ullamco.</p>
  <h3>Labore aute ea irure</h3>
  <ul>
    <li>
      <p>Adipisicing nisi deserunt velit proident nostrud et ipsum amet mollit.</p>
    </li>
    <li>
      <p>Esse nostrud deserunt Lorem pariatur incididunt.</p>
    </li>
    <li>
      <p>Non minim esse qui mollit consequat.</p>
      <ul>
        <li>
          <p>Exercitation dolor fugiat esse officia cupidatat anim.</p>
        </li>
        <li>
          <p>Esse eu anim irure voluptate non laborum laborum dolore dolore.</p>
        </li>
      </ul>
    </li>
    <li>
      <p>Laboris et excepteur est adipisicing magna qui do sit eiusmod.</p>
    </li>
  </ul>
  <h3>Qui aute voluptate</h3>
  <p>Labore dolor laboris anim. Laborum ut eiusmod et et minim duis aliquip deserunt laboris.</p>
  `,
}

export const MOCK_HOMEPAGE: HomepageContext = {
  meta: {
    title: `${MOCK_AUTHOR.displayName}'s homepage`,
    description:
      'Quis non enim sunt ut proident eu amet eiusmod do nulla ut laborum incididunt commodo officia.',
    authorName: `${MOCK_AUTHOR.displayName}`,
  },
  byline: {
    author: {
      name: MOCK_AUTHOR.displayName,
      uri: `https://matters.news/@${MOCK_AUTHOR.userName}`,
    },
    website: {
      name: 'Matters',
      uri: 'https://matters.news',
    },
  },
  rss: {
    ipns: 'k51qzi5uqu5dhihcpntbdym8g6desc80za48wshqs85no166wq3c8ee26cysot',
    xml: 'https://matters.news',
    json: 'https://matters.news',
  },
  articles: [
    MOCK_ARTICLE,
    MOCK_ARTICLE,
    MOCK_ARTICLE,
    MOCK_ARTICLE,
    MOCK_ARTICLE,
    MOCK_ARTICLE,
    MOCK_ARTICLE,
  ],
}

export const MOCK_ARTICLE_PAGE: ArticlePageContext = {
  encrypted: false,
  meta: {
    title: MOCK_ARTICLE.title,
    description: MOCK_ARTICLE.description,
    authorName: MOCK_ARTICLE.author.displayName,
    image:
      'https://assets.matters.news/processed/1080w/profileCover/aa57a1ce-8926-4512-81d8-462f68fa3917.webp',
  },
  byline: {
    date: '2022-11-18T08:42:04.146Z',
    author: {
      name: MOCK_AUTHOR.displayName,
      uri: `https://matters.news/@${MOCK_AUTHOR.userName}`,
    },
    website: {
      name: 'Matters',
      uri: 'https://matters.news',
    },
  },
  rss: {
    ipns: 'k51qzi5uqu5dhihcpntbdym8g6desc80za48wshqs85no166wq3c8ee26cysot',
    xml: 'https://matters.news',
    json: 'https://matters.news',
  },
  article: MOCK_ARTICLE,
}

export const MOCK_META_DATA = {
  contentHash: 'ipfs-hash',
  author: {
    name: 'Test User',
    url: 'user-home-page',
    description: 'this is a test user',
  },
  description: 'This is a piece of test content',
  image: 'image-url',
}
