import path from 'path'

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@my-app/ui-library': path.resolve(__dirname, '../ui-library/src')
    }
  },
  server: {
    port: 3000,
    open: true
  }
})
