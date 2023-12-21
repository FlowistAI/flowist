import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronBridge', {
    openFile: () => ipcRenderer.invoke('dialog:openFile'),
})
