import { LLMProvider, LLMProviders } from './settings/settings.type'
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
    apiKey:
        import.meta.env.VITE_OPENAI_API_KEY ||
        'sk-P8TA141tTz0ukjfNFMIQwuAtHvDeO3UA8What2Fjv8Zkv9LU',
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

export const DefaultBot: Bot = {
    type: 'bot',
    name: 'Gemini Pro',
    avatar: 'google-ai.png',
    settings: {
        model: GoogleAIModelIds.GeminiPro,
        temperature: 0.7,
        maxTokens: 0,
        prompt: '',
        provider: LLMProviders.GoogleAI,
        serviceSource: GoogleGeminiOfficialServiceSource,
    },
}

export const DefaultUser: User = {
    type: 'user',
    name: 'User',
    avatar: 'user-avatar.jpg',
}
