import { JotaiContext } from './index.type'
import { appSettingAtom } from './settings/settings.atom'
import {
    LLMProvider,
    LLMProviders,
    LLMSettings,
} from './settings/settings.type'
import { OpenAIModelIds, GoogleAIModelIds } from './settings/settings.type'

export type Participant = {
    type: 'bot' | 'user'
    name: string
    avatar: string
}

export type Bot = Participant & {
    type: 'bot'
    settings: BotSettings<LLMProvider>
}

export type User = Participant & {
    type: 'user'
}

export type SessionId = string

export type BotSettings<T extends LLMProvider> = {
    model: string
    temperature: number
    prompt: string
    maxTokens: number
    provider: LLMProvider // if undefined, fallback to global settings
    serviceSource: LLMServiceSource<T>
}

export const botAvatarOptions = [
    {
        label: 'ChatGPT3.5',
        value: 'chatgpt3.png',
    },
    {
        label: 'GPT4',
        value: 'gpt4.png',
    },
    {
        label: 'Google AI',
        value: 'google-ai.png',
    },
]

export const llmProviderOptions = [
    {
        label: 'OpenAI (or compatible)',
        value: LLMProviders.OpenAI,
    },
    {
        label: 'Google Gemini',
        value: LLMProviders.GoogleAI,
    },
] as const

export interface LLMServiceSource<T extends LLMProvider> {
    type: T
    label: string
    endpoint: string
    apiKey: string
}

export const OpenAIOfficialServiceSource: LLMServiceSource<'OpenAI'> = {
    type: LLMProviders.OpenAI,
    label: 'OpenAI (official)',
    endpoint: 'https://api.openai-proxy.org',
    apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
} as const

export const GoogleGeminiOfficialServiceSource: LLMServiceSource<'GoogleAI'> = {
    type: LLMProviders.GoogleAI,
    label: 'Google Gemini (official)',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta3',
    apiKey: import.meta.env.VITE_GOOGLE_GEMINI_API_KEY || '',
} as const

export const getInitialServiceSource = (
    type: LLMProvider,
): LLMServiceSource<LLMProvider> => {
    switch (type) {
        case LLMProviders.OpenAI:
            return OpenAIOfficialServiceSource
        case LLMProviders.GoogleAI:
            return GoogleGeminiOfficialServiceSource
        default:
            throw new Error('Unknown provider type')
    }
}

export const getDefaultModel = (type: LLMProvider): string => {
    switch (type) {
        case LLMProviders.OpenAI:
            return OpenAIModelIds.GPT35Turbo
        case LLMProviders.GoogleAI:
            return GoogleAIModelIds.GeminiPro
        default:
            throw new Error('Unknown provider type')
    }
}

export const botModelOptions = {
    [LLMProviders.OpenAI]: [
        {
            label: 'GPT-3.5 Turbo',
            value: OpenAIModelIds.GPT35Turbo,
        },
        {
            label: 'GPT-3.5',
            value: OpenAIModelIds.GPT35,
        },
        {
            label: 'GPT-4',
            value: OpenAIModelIds.GPT4,
        },
    ],
    [LLMProviders.GoogleAI]: [
        {
            label: 'gemini-pro',
            value: GoogleAIModelIds.GeminiPro,
        },
        {
            label: 'text-bison-001',
            value: GoogleAIModelIds.TextBison001,
        },
    ],
}

// export const DefaultBot: Bot = {
//     type: 'bot',
//     name: 'Gemini Pro',
//     avatar: 'google-ai.png',
//     settings: {
//         model: GoogleAIModelIds.GeminiPro,
//         temperature: 0.7,
//         maxTokens: 0,
//         prompt: '',
//         provider: LLMProviders.GoogleAI,
//         serviceSource: GoogleGeminiOfficialServiceSource,
//     },
// }

export const getDefaultBot = (ctx: JotaiContext) => {
    const settings = ctx.get(appSettingAtom)
    const provider = settings.llm.defaultProvider
    const llmSettings = settings.llm.providers[provider]

    const bot: Bot = {
        type: 'bot',
        name: llmSettings.model,
        avatar: getDefaultBotAvatar(provider, llmSettings.model),
        settings: {
            // model: GoogleAIModelIds.GeminiPro,
            // temperature: 0.7,
            // maxTokens: 0,
            // prompt: '',
            // provider,
            model: llmSettings.model,
            temperature: llmSettings.temperature,
            maxTokens: llmSettings.maxTokens,
            prompt: llmSettings.prompt,
            provider,
            serviceSource: patchInitialServiceSource(provider, llmSettings),
        },
    }

    return bot
}

export const getDefaultBotAvatar = (provider: LLMProvider, model: string) => {
    switch (provider) {
        case LLMProviders.OpenAI:
            switch (model) {
                case OpenAIModelIds.GPT35Turbo:
                    return 'chatgpt3.png'
                case OpenAIModelIds.GPT35:
                    return 'chatgpt3.png'
                case OpenAIModelIds.GPT4:
                    return 'gpt4.png'
                default:
                    throw new Error('Unknown model')
            }

        case LLMProviders.GoogleAI:
            switch (model) {
                case GoogleAIModelIds.GeminiPro:
                    return 'google-ai.png'
                case GoogleAIModelIds.TextBison001:
                    return 'google-ai.png'
                default:
                    throw new Error('Unknown model')
            }

        default:
            throw new Error('Unknown provider type')
    }
}

export const patchInitialServiceSource = <T extends LLMProvider>(
    provider: T,
    llmSettings: LLMSettings<T>,
): LLMServiceSource<T> => {
    switch (provider) {
        case LLMProviders.OpenAI: {
            const k: LLMServiceSource<'OpenAI'> = {
                ...OpenAIOfficialServiceSource,
                ...llmSettings,
            }

            return k as LLMServiceSource<T>
        }

        case LLMProviders.GoogleAI: {
            const l: LLMServiceSource<'GoogleAI'> = {
                ...GoogleGeminiOfficialServiceSource,
                ...llmSettings,
            }

            return l as LLMServiceSource<T>
        }

        default:
            throw new Error('Unknown provider type')
    }
}

export const DefaultUser: User = {
    type: 'user',
    name: 'User',
    avatar: 'user-avatar.jpg',
}
