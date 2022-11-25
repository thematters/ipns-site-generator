import { Crypto } from '@peculiar/webcrypto'

const crypto = new Crypto()

export const encrypt = async (content: string) => {
  const buf2hex = (buf: ArrayBuffer) => {
    return Array.prototype.map
      .call(new Uint8Array(buf), (x) => ('00' + x.toString(16)).slice(-2))
      .join('')
  }

  const key = await crypto.subtle.generateKey(
    {
      name: 'AES-CTR',
      length: 128,
    },
    true, // extractable
    ['encrypt', 'decrypt'] // key usages
  )

  const encrypted = buf2hex(
    await crypto.subtle.encrypt(
      {
        name: 'AES-CTR',
        counter: new Uint8Array(16),
        length: 16 * 8,
      },
      key,
      new TextEncoder().encode(content)
    )
  )

  const keyJSON = await crypto.subtle.exportKey('jwk', key)

  return {
    key: keyJSON.k,
    encrypted,
  }
}
