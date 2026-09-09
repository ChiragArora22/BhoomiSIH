import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    // dev-only: lets the app be reached through a proxied/tunneled hostname
    // (sandbox previews, ngrok, `ip addr` LAN testing). No effect on `vite build`.
    allowedHosts: true
  }
})
