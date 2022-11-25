import { makeMetaData } from '..'
import { MOCK_META_DATA } from '../render/mock'

describe('makeMetaData', () => {
  test('can generate content meta data', () => {
    expect(makeMetaData(MOCK_META_DATA)).toMatchSnapshot()
  })
})
