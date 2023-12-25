import { atom, useSetAtom } from 'jotai'
import { LLMProvider } from './settings.type'
import {
    SupportedLang,
    Theme,
    LLMProviderSettings,
    TTSProvider,
    TTSProviderSettings,
    TTSSettings,
    SettingsData,
} from './settings.type'

/**
 * System section
 */

export const systemNameAtom = atom<string>('GIDE')

export const systemLanguageAtom = atom<SupportedLang>('en')

export const systemThemeAtom = atom<Theme>('light')

export const systemAutoSaveAtom = atom<boolean>(true)

/**
 * LLM section
 */

export const llmDefaultPromptAtom = atom<string>('')

export const llmDefaultProviderAtom = atom<LLMProvider>('OpenAI')

export const llmProvidersAtom = atom<LLMProviderSettings>({
    OpenAI: {
        label: 'OpenAI',
        endpoint: 'https://api.openai-proxy.org',
        apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
        model: 'gpt-3.5-turbo',
        temperature: 0.9,
        prompt: '',
        maxTokens: 0,
    },
    GoogleAI: {
        label: 'Google AI',
        apiKey: import.meta.env.VITE_GOOGLE_AI_API_KEY || '',
        model: 'gemini-pro',
        temperature: 0.9,
        prompt: '',
        maxTokens: 0,
    },
})

/**
 * TTS section
 */

export const ttsDefaultProviderAtom = atom<TTSProvider>('TencentTTS')

export const ttsProvidersAtom = atom<TTSProviderSettings>({
    TencentTTS: {
        appId: '',
        secretId: '',
        secretKey: '',
    },
} as {
    [K in TTSProvider]: TTSSettings<K>
})

export const versionAtom = atom<string>('0.0.1')

export const appSettingAtom = atom<SettingsData>((get) => ({
    system: {
        name: get(systemNameAtom),
        language: get(systemLanguageAtom),
        theme: get(systemThemeAtom),
        autoSave: get(systemAutoSaveAtom),
    },
    llm: {
        defaultPrompt: get(llmDefaultPromptAtom),
        defaultProvider: get(llmDefaultProviderAtom),
        providers: get(llmProvidersAtom),
    },
    tts: {
        defaultProvider: get(ttsDefaultProviderAtom),
        providers: get(ttsProvidersAtom),
    },
    about: {
        version: get(versionAtom),
    },
}))

export const settingsModalOpenAtom = atom<boolean>(false)

export const useSettingsModal = () => {
    const setOpen = useSetAtom(settingsModalOpenAtom)

    return {
        open: () => setOpen(true),
    }
}
