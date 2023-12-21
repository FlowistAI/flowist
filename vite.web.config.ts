import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    server: {
        open: '/index.web.html',
        port: 5174,
        strictPort: true,
    },
    build: {
        rollupOptions: {
            input: {
                app: './index.web.html', // default
            },
        },
    },
})
