export interface IFileService {
    saveFile(data: string): Promise<void>
    selectSavePath(currentPath?: string): Promise<void>
    isSelected(): boolean
    selectOpenPath(): Promise<void>
    readFile(): Promise<string>
}
