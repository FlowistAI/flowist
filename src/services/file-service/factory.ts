/* eslint-disable @typescript-eslint/no-explicit-any */
import { isWeb } from '../../constants/electron-bridge'

import WebFileService from './web-file.service'

export async function createFileService() {
    if (!isWeb) {
        const ElectronFileService = (await import('./electron-file.service'))
            .default

        return new ElectronFileService()
    } else {
        return new WebFileService()
    }
}
