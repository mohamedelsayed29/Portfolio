import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

const resolvePath = (path) => fileURLToPath(new URL(path, import.meta.url))

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    // Order matters: alias entries are matched as prefixes in order, so the
    // bare '@' catch-all has to come last or it swallows '@app', '@lib', etc.
    alias: [
      { find: '@app', replacement: resolvePath('./src/app') },
      { find: '@components', replacement: resolvePath('./src/components') },
      { find: '@features', replacement: resolvePath('./src/features') },
      { find: '@hooks', replacement: resolvePath('./src/hooks') },
      { find: '@lib', replacement: resolvePath('./src/lib') },
      { find: '@data', replacement: resolvePath('./src/data') },
      { find: '@constants', replacement: resolvePath('./src/constants') },
      { find: '@styles', replacement: resolvePath('./src/styles') },
      { find: '@', replacement: resolvePath('./src') },
    ],
  },
  server: { port: 5173, open: false },
  build: { outDir: 'dist', sourcemap: false },
})
