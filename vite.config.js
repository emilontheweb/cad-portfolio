import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ command }) => ({
  plugins: [
    tailwindcss(),
    react(),
  ],
  // In dev, serve at / so the preview panel works.
  // In production builds, use the GitHub Pages repo subpath.
  // ⚠️  Change 'cad-portfolio' to match your actual GitHub repo name.
  base: command === 'build' ? '/cad-portfolio/' : '/',
}))
