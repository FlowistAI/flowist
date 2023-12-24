/* eslint-disable @typescript-eslint/no-explicit-any */
import { IFileService } from './file.service'

export default class WebFileService implements IFileService {
    handle: any | undefined
    constructor() {
        this.handle = undefined
    }

    async saveFile(data: string) {
        if (!this.handle) {
            throw new Error('Save path not selected')
        }

        try {
            const writable = await this.handle.createWritable()
            await writable.write(data)
            await writable.close()
        } catch (error) {
            console.error('Failed to save file:', error)
        }
    }

    async selectSavePath() {
        try {
            const fileHandle = await (window as any).showSaveFilePicker()
            this.handle = fileHandle
        } catch (error) {
            console.error('Failed to select save path:', error)
        }
    }

    isSelected() {
        return !!this.handle
    }

    async selectOpenPath() {
        try {
            const fileHandles = await (window as any).showOpenFilePicker()
            this.handle = fileHandles[0]
        } catch (error) {
            console.error('Failed to select open path:', error)
        }
    }

    async readFile() {
        if (!this.handle) {
            throw new Error('Open path not selected')
        }

        console.log(this.handle)

        try {
            const file = await this.handle.getFile()
            const content = await file.text()

            return content
        } catch (error) {
            console.error('Failed to read file:', error)
        }
    }
}
