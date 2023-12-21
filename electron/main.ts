import { app, BrowserWindow, dialog, ipcMain } from 'electron'
import * as path from 'path'

let mainWindow

async function handleFileOpen() {
    const { canceled, filePaths } = await dialog.showOpenDialog({})
    if (!canceled) {
        return filePaths[0]
    }
}

function createWindow() {
    mainWindow = new BrowserWindow({
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            webSecurity: false,
        },
    })

    // Vite DEV server URL
    if (process.env.NODE_ENV === 'development') {
        mainWindow.loadURL('http://localhost:5174')
        mainWindow.webContents.openDevTools()
    } else {
        mainWindow.loadFile(path.join(__dirname, '../../web/build/index.html'))
    }

    mainWindow.on('closed', () => (mainWindow = null))
}

app.whenReady().then(() => {
    ipcMain.handle('dialog:openFile', handleFileOpen)
    createWindow()
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (mainWindow == null) {
        createWindow()
    }
})
