import { defineConfig } from 'vite'
import electron from 'vite-plugin-electron/simple'
import react from '@vitejs/plugin-react'
import vitePluginReactCdn from './vite-plugins/vite-plugin-react-cdn/index.cjs'

export default defineConfig({
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
