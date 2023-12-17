export type Participant = {
    type: 'bot' | 'user'
    name: string;
    avatar: string;
}

export type Bot = Participant & {
    type: 'bot';
    settings: BotSettings;
}

export type User = Participant & {
    type: 'user';
}


export type SessionId = string;

export type BotSettings = {
    model: string;
    temperature: number;
    prompt: string;
    maxTokens: number;
    provider: BotModelProviderType;
    serviceSource: GptServiceSource;
}

export enum OpenAIModelIds {
    GPT35Turbo = 'gpt-3.5-turbo',
    GPT35 = 'gpt-3.5',
    GPT4 = 'gpt-4',
}

export enum GoogleGeminiModelIds {
    GeminiPro = 'gemini-pro',
    TextBison001 = 'text-bison-001',
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
    }
]

export enum BotModelProviderType {
    OpenAI = 'openai',
    GoogleGemini = 'google-gemini',
}

export const botModelProviderOptions = [
    {
        label: 'OpenAI (or compatible)',
        value: BotModelProviderType.OpenAI,
    },
    {
        label: 'Google Gemini',
        value: BotModelProviderType.GoogleGemini,
    },
]

export interface GptServiceSource {
    type: BotModelProviderType;
    label: string;
    endpoint: string;
    apiKey: string;
}

export const OpenAIOfficialServiceSource: GptServiceSource = {
    type: BotModelProviderType.OpenAI,
    label: 'OpenAI (official)',
    endpoint: 'https://api.openai.com/v1/engines',
    apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
}

export const GoogleGeminiOfficialServiceSource: GptServiceSource = {
    type: BotModelProviderType.GoogleGemini,
    label: 'Google Gemini (official)',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta3',
    apiKey: import.meta.env.VITE_GOOGLE_GEMINI_API_KEY || '',
}

export const getInitialServiceSource = (type: BotModelProviderType): GptServiceSource => {
    switch (type) {
        case BotModelProviderType.OpenAI:
            return OpenAIOfficialServiceSource;
        case BotModelProviderType.GoogleGemini:
            return GoogleGeminiOfficialServiceSource;
        default:
            throw new Error('Unknown provider type');
    }
}

export const getDefaultModel = (type: BotModelProviderType): string => {
    switch (type) {
        case BotModelProviderType.OpenAI:
            return OpenAIModelIds.GPT35Turbo;
        case BotModelProviderType.GoogleGemini:
            return GoogleGeminiModelIds.GeminiPro;
        default:
            throw new Error('Unknown provider type');
    }
}


export const botModelOptions = {
    [BotModelProviderType.OpenAI]:
        [
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
    [BotModelProviderType.GoogleGemini]:
        [
            {
                label: 'gemini-pro',
                value: GoogleGeminiModelIds.GeminiPro,
            },
            {
                label: 'text-bison-001',
                value: GoogleGeminiModelIds.TextBison001,
            },
        ],
}

export type BotNodePreset = {
    bot: Bot;
};

