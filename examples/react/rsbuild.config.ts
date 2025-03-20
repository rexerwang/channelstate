import { defineConfig } from '@rsbuild/core'
import { pluginReact } from '@rsbuild/plugin-react'

export default defineConfig({
  plugins: [pluginReact()],
  source: {
    entry: {
      index: './src/pages/index/index.tsx',
      replica1: './src/pages/replica1/index.tsx',
      replica2: './src/pages/replica2/index.tsx',
    },
  },
  html: {
    title({ entryName }) {
      return entryName
    },
  },
})
