import fetch from 'isomorphic-fetch'
import { makeHomepage } from '../makeHomepage'
import { MOCK_HOMEPAGE } from '../render/mock'

jest.mock('isomorphic-fetch')
const mockedFetch = fetch as jest.Mock

describe('makeHomepage', () => {
  test('can generate basic HTML bundle', async () => {
    mockedFetch.mockResolvedValue({
      arrayBuffer: () => Promise.resolve(new ArrayBuffer(1)),
    })

    const html = await makeHomepage(MOCK_HOMEPAGE)
    expect(html).toMatchSnapshot()
  })
})
