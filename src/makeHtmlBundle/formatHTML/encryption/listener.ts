// global parameter name
const paramName = 'key'

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
