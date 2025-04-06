import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import svgr from 'vite-plugin-svgr'
import fs from 'fs'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // eslint-disable-next-line no-undef
  const env = loadEnv(mode, process.cwd(), '')
  const publicEnv = Object.entries(env).reduce((acc, [key, value]) => {
    if (key.startsWith('VITE_') || ['NODE_ENV', 'HOST_ENV'].includes(key)) {
      return {
        ...acc,
        [key]: value,
      }
    }
    return acc
  }, {})
  return {
    plugins: [react(), svgr()],
    server: {
      https: {
        key: fs.readFileSync('localhost-key.pem'),
        cert: fs.readFileSync('localhost.pem'),
      },
      port: +env.PORT,
      strictPort: true,
    },
    preview: {
      port: +env.PORT,
    },
    define: {
      'process.env': publicEnv,
    },
  }
})
