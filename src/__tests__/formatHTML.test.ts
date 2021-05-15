import fs from 'fs'
import path from 'path'

import { formatHTML } from '..'

import { testContent } from './utils'

const snapshotPath = `src/__tests__/__snapshots__/`

describe('formatHTML', () => {
  test('can generate encrypted HTML string', async () => {
    // remove older html
    const files = fs
      .readdirSync(snapshotPath)
      .filter((fn) => fn.endsWith('.html'))

    files.map((file) => {
      fs.unlinkSync(path.resolve(snapshotPath, file))
    })

    const { html, key } = await formatHTML({
      readMore: { text: 'test circle', url: 'test-circle-url' },
      encrypt: true,
      summary: 'Hello World',
      ...testContent,
    })

    // writing html to disk
    // encryption key is random so cannot use snapshot compare
    // verify manually by using html file name as decryption key
    const buffer = Buffer.from(html, 'utf-8')
    const fd = fs.openSync(`${snapshotPath}/${key}.html`, 'a')
    fs.writeSync(fd, buffer, 0, buffer.length, null)

    expect(key).toBeTruthy()
    expect(html).toBeTruthy()
  })
})
