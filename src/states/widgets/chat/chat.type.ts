import { SessionId, Bot, Participant } from '../../bot.type'

export type ChatSession = {
    id: SessionId
    bot: Bot
    user: Participant
    sending: boolean
    messages: ChatMessage[]
    title?: string
    input?: string
}

// if content is '---' then it is a delimiter
export type ChatMessage = {
    id: string
    avatar: string
    content: string
    isUser: boolean
}

export type ChatBotNodeData = {
    id: SessionId
}

export type BotWrapped = {
    bot: Bot
}
