export interface IFileService {
    saveFile(data: string): Promise<void>
    selectSavePath(currentPath?: string): Promise<void>
}
