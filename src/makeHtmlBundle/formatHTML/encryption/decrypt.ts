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

// global parameter name
const paramName = 'key'

// handle input UI
const showInput = (hasKey: boolean) => {
  // get encrypted element
  const elEncrypted = document.querySelector('.encrypted') as HTMLElement | null
  if (elEncrypted) {
    // blur effect
    elEncrypted.style.cssText = `
                color:transparent;
                text-shadow:0px 0px 5px #000;
            `

    // create input place holder
    const elInput = document.createElement('input')
    elInput.setAttribute('type', 'password')
    elInput.setAttribute('name', paramName)
    elInput.style.height = '20px'

    if (hasKey) {
      elInput.setAttribute('placeholder', `wrong ${paramName}, try again`)
    } else {
      elInput.setAttribute('placeholder', 'enter key')
    }

    // create form
    const elForm = document.createElement('form')
    elForm.setAttribute('method', 'get')
    elForm.style.cssText = `
                top: 0;
                position: absolute;
                text-align: center;
                width: 100%;
            `

    // insert form and input
    elForm.appendChild(elInput)
    elEncrypted.appendChild(elForm)
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  // get secret
  const urlParams = new URLSearchParams(window.location.search)
  const keyString = urlParams.get(paramName)

  const elEncrypted = document.querySelector('.encrypted')

  if (elEncrypted) {
    if (!keyString) {
      showInput(false)
    } else {
      try {
        const decrypted = await decrypt(elEncrypted.innerHTML.trim(), keyString)
        // write to decrypted section
        elEncrypted.innerHTML = decrypted
        // update classname
        elEncrypted.className = elEncrypted.className.replace(
          /(?:^|\s)encrypted(?!\S)/,
          'decrypted'
        )
      } catch (err) {
        showInput(true)
      }
    }
  }
})
