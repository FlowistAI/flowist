
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

export type ChatMessage = {
    avatar: string;
    content: string;
    isOwn: boolean;
}

export type SessionId = string;

export type BotSettings = {
    model: string;
    temperature: number;
    prompt: string;
    maxTokens: number;
}

export type ChatSession = {
    id: SessionId; // also as node id
    bot: Bot;
    user: Participant;
    messages: ChatMessage[];
}

export type ChatBotNodeData = {
    id: SessionId;
}

export type ChatBotNodePreset = {
    bot: Bot,
}

export enum ModelIds {
    GPT35Turbo = 'gpt-3.5-turbo',
    GPT35 = 'gpt-3.5',
    GPT4 = 'gpt-4',
}

export const botAvatarOptions = [
    {
        label: 'ChatGPT3.5',
        value: 'chatgpt3.png',
    },
    {
        label: 'GPT4',
        value: 'gpt4.png',
    }
]

export const botModelOptions = [
    {
        label: 'GPT-3.5 Turbo',
        value: ModelIds.GPT35Turbo,
    },
    {
        label: 'GPT-3.5',
        value: ModelIds.GPT35,
    },
    {
        label: 'GPT-4',
        value: ModelIds.GPT4,
    },
]
