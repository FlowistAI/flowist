import { defineConfig } from 'vite'
import electron from 'vite-plugin-electron/simple'
import react from '@vitejs/plugin-react'
import vitePluginReactCdn from './vite-plugins/vite-plugin-react-cdn/index.cjs'

export default defineConfig({
    optimizeDeps: {
        exclude: ['react', 'react-dom'],
    },
    resolve: {
        alias: {
            react: 'https://unpkg.com/react@18/umd/react.development.js',
            'react-dom':
                'https://unpkg.com/react-dom@18/umd/react-dom.development.js',
        },
    },
    plugins: [
        vitePluginReactCdn(),

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
