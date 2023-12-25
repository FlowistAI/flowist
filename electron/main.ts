import * as path from 'path'
import { app, BrowserWindow } from 'electron'
import { ipcMain } from '../src/shared/ipcs'

const { handle, invoke } = ipcMain

process.env.DIST = path.join(__dirname, '../dist')
process.env.VITE_PUBLIC = app.isPackaged
    ? process.env.DIST
    : path.join(process.env.DIST, '../public')

let mainWindow

function createWindow() {
    mainWindow = new BrowserWindow({
        icon: path.join(process.env.VITE_PUBLIC!, 'logo.png'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            sandbox: false, // sandbox must be false
            // webSecurity: false,
        },
    })

    handle.getPing()
    handle.selectPath()
    handle.writeFile()
    handle.selectOpenPath()
    handle.readFile()

    mainWindow.webContents.on('dom-ready', () => {
        invoke.getPong(mainWindow, 'pong')
    })

    // 800x600 is the default size of our window
    mainWindow.setSize(800 + 600, 600)

    if (process.env.VITE_DEV_SERVER_URL) {
        mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL)
        mainWindow.webContents.openDevTools()
    } else {
        mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
    }

    mainWindow.on('closed', () => (mainWindow = null))
}

app.whenReady().then(() => {
    createWindow()
})

app.on('window-all-closed', () => {
    app.quit()
    mainWindow = null
})
