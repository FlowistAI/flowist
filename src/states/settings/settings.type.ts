/**
 * System section
 */

import * as Yup from 'yup'
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

/**
 * TTS section
 */

export type TTSProviderSettings = {
    [K in TTSProvider]: TTSSettings<K>
}

export type TTSProvider = 'TencentTTS'

export type TencentTTSSettings = {
    appId: string
    secretId: string
    secretKey: string
}

export type TTSSettings<TProvider extends TTSProvider> =
    TProvider extends 'TencentTTS' ? TencentTTSSettings : never

/**
 * Over all settings
 */

export type SettingsData = {
    system: {
        name: string
        language: SupportedLang // zh-CN, en, fr, jp
        theme: Theme // light, dark
        autoSave: boolean
    }
    llm: {
        defaultPrompt: string
        defaultProvider: LLMProvider
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

export type SystemSection = SettingsData['system']

export const systemSectionAtom = atom<SystemSection>((get) => ({
    name: get(systemNameAtom),
    language: get(systemLanguageAtom),
    theme: get(systemThemeAtom),
    autoSave: get(systemAutoSaveAtom),
}))

export const systemSectionSchema = Yup.object().shape({
    name: Yup.string().required(),
    language: Yup.string().required().oneOf(['en', 'zh-CN', 'fr', 'jp']),
    theme: Yup.string().required().oneOf(['light', 'dark']),
    autoSave: Yup.boolean().required(),
})

export type LLMSection = SettingsData['llm']

export const llmSectionAtom = atom<LLMSection>((get) => ({
    defaultPrompt: get(llmDefaultPromptAtom),
    defaultProvider: get(llmDefaultProviderAtom),
    providers: get(llmProvidersAtom),
}))

export const llmSectionSchema = Yup.object().shape({
    defaultPrompt: Yup.string().required(),
    defaultProvider: Yup.string().required().oneOf(['OpenAI', 'GoogleAI']),
    providers: Yup.object().shape({
        OpenAI: Yup.object().shape({
            label: Yup.string().required(),
            endpoint: Yup.string().required(),
            apiKey: Yup.string(),
            model: Yup.string().required(),
            temperature: Yup.number().required().min(0).max(1),
            prompt: Yup.string(),
            maxTokens: Yup.number().required(),
        }),
        GoogleAI: Yup.object().shape({
            label: Yup.string().required(),
            apiKey: Yup.string(),
            model: Yup.string().required(),
            temperature: Yup.number().required().min(0).max(1),
            prompt: Yup.string(),
            maxTokens: Yup.number().required(),
        }),
    }),
})

export type TTSSection = SettingsData['tts']

export const ttsSectionAtom = atom<TTSSection>((get) => ({
    defaultProvider: get(ttsDefaultProviderAtom),
    providers: get(ttsProvidersAtom),
}))

export const ttsSectionSchema = Yup.object().shape({
    defaultProvider: Yup.string().required().oneOf(['TencentTTS']),
    providers: Yup.object().shape({
        TencentTTS: Yup.object().shape({
            appId: Yup.string().required(),
            secretId: Yup.string().required(),
            secretKey: Yup.string().required(),
        }),
    }),
})
