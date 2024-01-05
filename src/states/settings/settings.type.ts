/**
 * System section
 */

import {
    systemNameAtom,
    systemLanguageAtom,
    systemThemeAtom,
    systemAutoSaveAtom,
    llmDefaultPromptAtom,
    llmDefaultProviderAtom,
    llmProvidersAtom,
    ttsDefaultProviderAtom,
    ttsProvidersAtom,
    systemCorsProxyAtom,
} from './settings.atom'

import { atom } from 'jotai'

export type Theme = 'light' | 'dark'

export type SupportedLang = 'zh-CN' | 'en' | 'fr' | 'jp'

/**
 * LLM section
 */

export const OpenAIModelIds = {
    GPT35Turbo: 'gpt-3.5-turbo',
    GPT35: 'gpt-3.5',
    GPT4: 'gpt-4',
} as const

export type OpenAIModelId = (typeof OpenAIModelIds)[keyof typeof OpenAIModelIds]

export const GoogleAIModelIds = {
    GeminiPro: 'gemini-pro',
    TextBison001: 'text-bison-001',
} as const

export type GoogleAIModelId =
    (typeof GoogleAIModelIds)[keyof typeof GoogleAIModelIds]

export const LLMProviders = {
    OpenAI: 'OpenAI',
    GoogleAI: 'GoogleAI',
} as const

export type LLMProvider = (typeof LLMProviders)[keyof typeof LLMProviders]

export type BaseLLMSettings = {
    label: string // Provider display name
}

export type LLMProviderSettings = {
    [K in LLMProvider]: LLMSettings<K>
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

export type LLMSettingsType = LLMSettings<LLMProvider>

/**
 * TTS section
 */

export type TTSProviderSettings = {
    [K in TTSProvider]: TTSSettings<K>
}

export type TTSProvider = 'OpenAI' | 'TencentTTS' | 'CustomAPI'

export type OpenAITTSSettings = {
    endpoint: string
    apiKey: string
    model: string
    voice: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer'
    speed: number
}

export type TencentTTSSettings = {
    appId: string
    secretId: string
    secretKey: string
}

export type CustomAPITTSSettings = {
    url: string
    method: 'GET' | 'POST'
    fieldName: string
}

export type TTSSettings<Provider extends TTSProvider> =
    Provider extends 'TencentTTS'
        ? TencentTTSSettings
        : Provider extends 'CustomAPI'
        ? CustomAPITTSSettings
        : Provider extends 'OpenAI'
        ? OpenAITTSSettings
        : never

export const TTSSettingsTypes = {
    OpenAI: 'OpenAI',
    TencentTTS: 'TencentTTS',
    CustomAPI: 'CustomAPI',
} as const

export type TTSSettingsWithProvider<T extends TTSProvider> = TTSSettings<T> & {
    provider: T
}

/**
 * Over all settings
 */

export type SettingsData = {
    system: {
        name: string
        language: SupportedLang // zh-CN, en, fr, jp
        theme: Theme // light, dark
        autoSave: boolean
        corsProxy: string
        corsProxyEnabled: boolean
    }
    llm: {
        defaultPrompt: string
        defaultProvider: LLMProvider
        providers: LLMProviderSettings
    }
    tts: {
        defaultProvider: TTSProvider
        providers: TTSProviderSettings
    }
    about: {
        version: string
    }
    plugin: {
        enabled: boolean
    }
}

export type SettingsSection = keyof SettingsData

export type SystemSection = SettingsData['system']

export const systemSectionAtom = atom<SystemSection>((get) => ({
    name: get(systemNameAtom),
    language: get(systemLanguageAtom),
    theme: get(systemThemeAtom),
    autoSave: get(systemAutoSaveAtom),
    corsProxy: get(systemCorsProxyAtom),
    corsProxyEnabled: !!get(systemCorsProxyAtom),
}))

export type LLMSection = SettingsData['llm']

export const llmSectionAtom = atom<LLMSection>((get) => ({
    defaultPrompt: get(llmDefaultPromptAtom),
    defaultProvider: get(llmDefaultProviderAtom),
    providers: get(llmProvidersAtom),
}))

export type TTSSection = SettingsData['tts']

export const ttsSectionAtom = atom<TTSSection>((get) => ({
    defaultProvider: get(ttsDefaultProviderAtom),
    providers: get(ttsProvidersAtom),
}))
