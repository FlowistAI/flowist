export type Participant = {
    type: 'bot' | 'user'
    name: string
    avatar: string
}

export type Bot = Participant & {
    type: 'bot'
    settings: BotSettings<BotModelProvider>
}

export type User = Participant & {
    type: 'user'
}

export type SessionId = string

export type BotSettings<T extends BotModelProvider> = {
    model: string
    temperature: number
    prompt: string
    maxTokens: number
    provider: BotModelProvider
    serviceSource: LLMServiceSource<T>
}

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

// export enum BotModelProviderType {
//     OpenAI = 'openai',
//     GoogleAI = 'google-ai',
// }

export const BotModelProviderType = {
    OpenAI: 'OpenAI',
    GoogleAI: 'GoogleAI',
} as const

export type BotModelProvider =
    typeof BotModelProviderType[keyof typeof BotModelProviderType]

export const botModelProviderOptions = [
    {
        label: 'OpenAI (or compatible)',
        value: BotModelProviderType.OpenAI,
    },
    {
        label: 'Google Gemini',
        value: BotModelProviderType.GoogleAI,
    },
] as const

export interface LLMServiceSource<T extends BotModelProvider> {
    type: T
    label: string
    endpoint: string
    apiKey: string
}

export const OpenAIOfficialServiceSource: LLMServiceSource<'OpenAI'> = {
    type: BotModelProviderType.OpenAI,
    label: 'OpenAI (official)',
    endpoint: 'http://localhost:8080/https://api.openai.com/v1',
    apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
} as const

export const GoogleGeminiOfficialServiceSource: LLMServiceSource<'GoogleAI'> = {
    type: BotModelProviderType.GoogleAI,
    label: 'Google Gemini (official)',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta3',
    apiKey: import.meta.env.VITE_GOOGLE_GEMINI_API_KEY || '',
} as const

export const getInitialServiceSource = (
    type: BotModelProvider,
): LLMServiceSource<BotModelProvider> => {
    switch (type) {
        case BotModelProviderType.OpenAI:
            return OpenAIOfficialServiceSource
        case BotModelProviderType.GoogleAI:
            return GoogleGeminiOfficialServiceSource
        default:
            throw new Error('Unknown provider type')
    }
}

export const getDefaultModel = (type: BotModelProvider): string => {
    switch (type) {
        case BotModelProviderType.OpenAI:
            return OpenAIModelIds.GPT35Turbo
        case BotModelProviderType.GoogleAI:
            return GoogleAIModelIds.GeminiPro
        default:
            throw new Error('Unknown provider type')
    }
}

export const botModelOptions = {
    [BotModelProviderType.OpenAI]: [
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
    [BotModelProviderType.GoogleAI]: [
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

export type BotNodePreset = {
    bot: Bot
}
