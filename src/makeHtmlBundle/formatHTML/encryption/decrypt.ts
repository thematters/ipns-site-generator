// reference implementation of decryption
async function decrypt(content: string, keyString: string) {
  // translate hex string to buffer
  function hex2buf(hex: string) {
    const bytes = []
    for (let i = 0; i < hex.length; i += 2) {
      bytes.push(Number.parseInt(hex.slice(i, i + 2), 16))
    }
    return new Uint8Array(bytes)
  }

  // import key from keyString
  const key = await crypto.subtle.importKey(
    'jwk',
    {
      alg: 'A128CTR',
      ext: true,
      k: keyString,
      key_ops: ['encrypt', 'decrypt'],
      kty: 'oct',
    },
    {
      name: 'AES-CTR',
      length: 128,
    },
    true,
    ['encrypt', 'decrypt']
  )

  // decrypt and return
  return new TextDecoder('utf-8').decode(
    await crypto.subtle.decrypt(
      {
        name: 'AES-CTR',
        counter: new Uint8Array(16),
        length: 16 * 8,
      },
      key,
      hex2buf(content)
    )
  )
}
