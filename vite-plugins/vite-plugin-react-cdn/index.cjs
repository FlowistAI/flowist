// vite-plugin-react-cdn/index.js
function vitePluginReactCdn() {
    return {
        name: 'vite-plugin-react-cdn',
        enforce: 'pre',
        config(config) {
            const { build } = config
            if (build) {
                build.rollupOptions = {
                    ...build.rollupOptions,
                    external: ['react', 'react-dom'],
                }
            }
        },
        transformIndexHtml: {
            enforce: 'post',
            transform(html) {
                return html.replace(
                    '</head>',
                    `
            <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
            <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
            </head>
          `
                )
            },
        },
    }
}

module.exports = vitePluginReactCdn
