import { createInterprocess } from 'interprocess'

export const { ipcMain, ipcRenderer, exposeApiToGlobalWindow } =
    createInterprocess({
        main: {
            async getPing(_, data: 'ping') {
                const message = `from renderer: ${data} on main process`

                console.log(message)

                return message
            },

            async selectPath() {
                const { dialog } = await import('electron')

                const result = await dialog.showSaveDialog({
                    properties: ['showOverwriteConfirmation'],
                })

                if (result.canceled) {
                    throw new Error('File open cancelled')
                }

                const path = result.filePath
                console.log(path)

                return { path }
            },

            async writeFile(_, data: { path: string; content: string }) {
                const { path, content } = data

                const writeFile = await import('fs').then(
                    (m) => m.promises.writeFile,
                )
                await writeFile(path, content)
            },
        },

        renderer: {
            async getPong(_, data: 'pong') {
                const message = `from main: ${data} on renderer process`

                console.log(message)

                return message
            },
        },
    })

export const key = 'api'

declare global {
    interface Window {
        [key]: typeof ipcRenderer
    }
}
