import { defineConfig } from 'vite'
import electron from 'vite-plugin-electron/simple'
import react from '@vitejs/plugin-react'

export default defineConfig({
    build: {
        rollupOptions: {
            external: ['react', 'react-dom'],
            output: {
                globals: {
                    react: 'React',
                    'react-dom': 'ReactDOM',
                },
            },
        },
    },
    plugins: [
        react(),
        electron({
            main: {
                entry: 'electron/main.ts',
            },
            preload: {
                input: 'electron/preload.ts',
            },
        }),
    ],
})
