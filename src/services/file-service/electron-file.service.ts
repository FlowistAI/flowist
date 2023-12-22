import { IFileService } from './file.service'

export default class ElectronFileService implements IFileService {
    savePath: string | undefined
    constructor() {}

    async saveFile(data: string) {
        if (!this.savePath) {
            throw new Error('Save path not selected')
        }

        await window.api.invoke.writeFile({
            path: this.savePath,
            content: data,
        })
    }

    async selectSavePath() {
        this.savePath = (await window.api.invoke.selectPath()).path
    }

    isSelected() {
        return !!this.savePath
    }
}
