import { defineConfig } from 'vite'
import electron from 'vite-plugin-electron/simple'
import react from '@vitejs/plugin-react'

export default defineConfig({
    define: {
        __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    },
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
