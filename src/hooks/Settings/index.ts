import { atom } from 'jotai'
import {
    GoogleAIModelId,
    BotModelProvider as LLMProvider,
    OpenAIModelId,
} from '../../types/bot-types'

export type BaseLLMSettings = {
    label: string // Provider display name
}

export type OpenAILLMSettings = BaseLLMSettings & {
    endpoint: string
    apiKey: string
    model: OpenAIModelId
    temperature: number
    prompt: string
    maxTokens: number
}

export type GoggleAILLMSettings = BaseLLMSettings & {
    apiKey: string
    model: GoogleAIModelId
    temperature: number
    prompt: string
    maxTokens: number
}

export type LLMSettings<TProvider extends LLMProvider> =
    TProvider extends 'OpenAI'
        ? OpenAILLMSettings
        : TProvider extends 'GoogleAI'
        ? GoggleAILLMSettings
        : never

export type TencentTTSSettings = {
    appId: string
    secretId: string
    secretKey: string
}

export type TTSProvider = 'TencentTTS'

export type TTSSettings<TProvider extends TTSProvider> =
    TProvider extends 'TencentTTS' ? TencentTTSSettings : never

export type Theme = 'light' | 'dark'

export type SupportedLang = 'zh-CN' | 'en' | 'fr' | 'jp'

export type LLMProviderSettings = {
    [K in LLMProvider]: LLMSettings<K>
}

export type TTSProviderSettings = {
    [K in TTSProvider]: TTSSettings<K>
}

export type SettingsData = {
    system: {
        name: string
        language: SupportedLang // zh-CN, en, fr, jp
        theme: Theme // light, dark
        autoSave: boolean
    }
    llm: {
        defaultProvider: LLMProvider | undefined
        providers: LLMProviderSettings
    }
    tts: {
        defaultProvider: string | undefined
        providers: TTSProviderSettings
    }
    about: {
        version: string
    }
}

export type SettingsSection = keyof SettingsData

export const systemNameAtom = atom<string>('GIDE')

export const systemLanguageAtom = atom<SupportedLang>('en')

export const systemThemeAtom = atom<Theme>('light')

export const systemAutoSaveAtom = atom<boolean>(true)

export const llmDefaultProviderAtom = atom<LLMProvider>('OpenAI')

export const llmProvidersAtom = atom<LLMProviderSettings>({
    OpenAI: {
        label: 'OpenAI',
        endpoint: 'https://api.openai.com/v1',
        apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
        model: 'gpt-3.5-turbo',
        temperature: 0.9,
        prompt: '',
        maxTokens: 150,
    },
    GoogleAI: {
        label: 'Google AI',
        apiKey: import.meta.env.VITE_GOOGLE_AI_API_KEY || '',
        model: 'gemini-pro',
        temperature: 0.9,
        prompt: '',
        maxTokens: 150,
    },
})

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

export const systemSettingAtom = atom<SettingsData>((get) => ({
    system: {
        name: get(systemNameAtom),
        language: get(systemLanguageAtom),
        theme: get(systemThemeAtom),
        autoSave: get(systemAutoSaveAtom),
    },
    llm: {
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
