import { SessionId, Bot, User } from '../../states/bot.type'

export type QuerySession = {
    id: SessionId // also as node id
    bot: Bot
    user: User
    input: string
    output: string
}

export type QueryBotNodeData = {
    id: SessionId
}
