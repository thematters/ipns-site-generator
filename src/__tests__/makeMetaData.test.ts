import { makeMetaData } from '..'
import { testMetaData } from './utils'

describe('makeMetaData', () => {
  test('can generate content meta data', () => {
    expect(makeMetaData(testMetaData)).toMatchSnapshot()
  })
})
