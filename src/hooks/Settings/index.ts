import { atom, useAtom } from 'jotai'
import {
    GoogleAIModelId,
    BotModelProvider as LLMProvider,
    OpenAIModelId,
} from '../../types/bot-types'
import { produce } from 'immer'

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

export type SettingsData = {
    system: {
        name: string
        language: string // zh-CN, en, fr, jp
        theme: 'light' | 'dark' // light, dark
    }
    llm: {
        defaultProvider: LLMProvider | undefined
        providers: {
            [K in LLMProvider]: LLMSettings<K>
        }
    }
    tts: {
        defaultProvider: string | undefined
        providers: {
            [K in TTSProvider]: TTSSettings<K>
        }
    }
}

const defaultSettings: SettingsData = {
    system: {
        name: 'GIDE',
        language: 'en',
        theme: 'light',
    },
    llm: {
        defaultProvider: 'OpenAI',
        providers: {
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
        },
    },
    tts: {
        defaultProvider: 'TencentTTS',
        providers: {
            TencentTTS: {
                appId: '',
                secretId: '',
                secretKey: '',
            },
        },
    },
}

export const systemSettingAtom = atom(defaultSettings)

export const useSettings = () => {
    const [settings, setSettings] = useAtom(systemSettingAtom)

    const getSection = <T extends keyof SettingsData>(section: T) => {
        return settings?.[section]
    }

    const getSetting = <
        T extends keyof SettingsData,
        K extends keyof SettingsData[T],
    >(
        section: T,
        key: K,
    ) => {
        return settings?.[section]?.[key]
    }

    const updateSection = <T extends keyof SettingsData>(
        section: T,
        value: SettingsData[T],
    ) => {
        setSettings((prev) =>
            produce(prev, (draft) => {
                draft[section] = value
            }),
        )
    }

    return {
        settings,
        getSection,
        getSetting,
        updateSection,
    }
}
