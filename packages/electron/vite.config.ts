import { defineConfig } from 'vite'
import electron from 'vite-plugin-electron/simple'

export default defineConfig({
    plugins: [
        electron({
            main: {
                // Shortcut of `build.lib.entry`
                entry: 'src/main.ts',
            },
            preload: {
                // Shortcut of `build.rollupOptions.input`
                input: 'src/preload.ts',
            },
        }),
    ],
})
