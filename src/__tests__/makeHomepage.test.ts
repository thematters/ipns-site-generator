import fetch from 'isomorphic-fetch'
import { makeHomepage } from '../makeHomepage'
import { MOCK_HOMEPAGE } from '../render/mock'

jest.mock('isomorphic-fetch')
const mockedFetch = fetch as jest.Mock

describe('makeHomepage', () => {
  test('can generate HTML, XML and JSON of homepage', async () => {
    mockedFetch.mockResolvedValue({
      arrayBuffer: () => Promise.resolve(new ArrayBuffer(1)),
    })

    const { html, xml, json } = await makeHomepage(
      MOCK_HOMEPAGE('matters.news')
    )
    expect(html).toMatchSnapshot()
    expect(xml).toMatchSnapshot()
    expect(json).toMatchSnapshot()
  })
})
