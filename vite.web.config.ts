import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mkcert from 'vite-plugin-mkcert'
import fs from 'fs'
import { join } from 'path'

export default defineConfig({
    plugins: [
        mkcert(),
        react(),
        {
            name: 'rename-output',
            writeBundle() {
                try {
                    const from = join(__dirname, 'dist', 'index.web.html')
                    const to = join(__dirname, 'dist', 'index.html')
                    fs.renameSync(from, to)
                    console.log(`Renamed ${from} to ${to}`)
                } catch (err) {
                    console.error('Failed to rename output file', err)
                }
            },
        },
    ],
    server: {
        open: '/index.html',
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
