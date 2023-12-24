import { SessionId } from '../../bot.type'

export type TtsSession = {
    id: SessionId
    input: string
    output: string
}

export type TtsData = {
    id: SessionId
}
