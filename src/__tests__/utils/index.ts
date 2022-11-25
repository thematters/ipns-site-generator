export const deserializeHtmlBundle = (
  bundle: ({ path: string; content: Buffer } | undefined)[]
) => {
  const newBundle = []

  for (const file of bundle) {
    // only compare html strings
    if (file && file.path === 'index.html') {
      const deserialized = { ...file, content: file.content.toString() }
      newBundle.push(deserialized)
    }
  }
  return newBundle
}
