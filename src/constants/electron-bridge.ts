import { LLMProvider } from '../hooks/Settings/types'
import { BotSettings } from '../types/bot-types'

export type ElectronBridge = {
    // llmServiceFactory: <T extends LLMProvider>(
    //     botSettings: BotSettings<T>,
    // ) => LLMService
    createLLMSession: (botSettings: BotSettings<LLMProvider>) => string
    destroyLLMSession: (sessionId: string) => void
}

export const bridge = {
    get bridge() {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (window as any).api as ElectronBridge | undefined
    },
}.bridge

export const bridgedLLMServiceFactory = <T extends LLMProvider>(
    botSettings: BotSettings<T>,
) => {
    if (bridge) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return botSettings as any
    }

    throw new Error('Electron bridge not found')
}

export const isWeb = !bridge
