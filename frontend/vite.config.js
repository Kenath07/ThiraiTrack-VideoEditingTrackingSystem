import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Configure frontend build and styling tools
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})
