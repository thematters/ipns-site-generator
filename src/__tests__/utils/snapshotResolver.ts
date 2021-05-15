const distDir = 'dist'
const srcDir = 'src'

// resolves from test to snapshot path
export const resolveSnapshotPath = (
  testPath: string,
  snapshotExtension: string
) =>
  testPath
    .replace('__tests__', '__tests__/__snapshots__')
    .replace(distDir, srcDir) + snapshotExtension

// resolves from snapshot to test path
export const resolveTestPath = (
  snapshotFilePath: string,
  snapshotExtension: string
) =>
  snapshotFilePath
    .replace('__snapshots__/', '')
    .replace(srcDir, distDir)
    .slice(0, -snapshotExtension.length)

// Example test path, used for preflight consistency check of the implementation above
export const testPathForConsistencyCheck =
  'dist/__tests__/makeHtmlBundle.test.js'
