import { SessionId, Bot, Participant } from './bot-types'


export type ChatSession = {
    id: SessionId // also as node id
    bot: Bot
    user: Participant
    messages: ChatMessage[]
};

export type ChatMessage = {
    id: string
    avatar: string
    content: string
    isUser: boolean
};

export type ChatBotNodeData = {
    id: SessionId
};


