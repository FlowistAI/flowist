import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('bride', {
    openFile: () => ipcRenderer.invoke('dialog:openFile'),
})
