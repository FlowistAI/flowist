import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mkcert from 'vite-plugin-mkcert'

export default defineConfig({
    plugins: [mkcert(), react()],
    server: {
        open: '/index.web.html',
        port: 5174,
        strictPort: true,
        https: true,
    },
    build: {
        rollupOptions: {
            input: {
                app: './index.web.html', // default
            },
        },
    },
})
