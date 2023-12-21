import { Node } from 'reactflow'
import { AppNodeTypes } from '../../constants/nodeTypes'
import { Bot, SessionId, User } from '../../types/bot-types'
import {
    TextToSpeechNodeData,
    TextToSpeechSession,
} from './text-to-speech-node.types'
import { BotNodePreset } from '../../types/bot-types'
import { ChatBotNodeService } from '../../services/chat-bot-node.service'
import { SubManager } from '../../hooks/NodeManager/SubManager'
import { NodeIdGenerator } from '../../util/id-generator'

export type CreateNodeOptions = {
    preset?: BotNodePreset
    data?: Partial<Node<TextToSpeechNodeData, AppNodeTypes.TextToSpeech>>
}

export type TextToSpeechParitionSnapshot = {
    sessions: TextToSpeechSession[]
}

export type TextToSpeechNodeServiceProps = {
    sessionCreateHandler: (sess: TextToSpeechSession) => void
    sessionDestroyHandler: (sessId: SessionId) => void
    sessionsGetter: () => TextToSpeechSession[]
    idGeneratorGetter: () => NodeIdGenerator
}

export class TextToSpeechNodeService
    implements SubManager<AppNodeTypes.TextToSpeech>
{
    static readonly DefaultBot: Bot = ChatBotNodeService.DefaultBot
    static readonly DefaultUser: User = ChatBotNodeService.DefaultUser

    sessionCreateHandler: (sess: TextToSpeechSession) => void
    sessionDestroyHandler: (sessId: SessionId) => void
    sessionsGetter: () => TextToSpeechSession[]
    idGeneratorGetter: () => NodeIdGenerator

    constructor({
        sessionCreateHandler,
        sessionDestroyHandler,
        sessionsGetter,
        idGeneratorGetter,
    }: TextToSpeechNodeServiceProps) {
        this.sessionCreateHandler = sessionCreateHandler
        this.sessionDestroyHandler = sessionDestroyHandler
        this.sessionsGetter = sessionsGetter
        this.idGeneratorGetter = idGeneratorGetter
    }

    createNode({ data }: CreateNodeOptions) {
        const sess = this.addSession()
        const textToSpeechNodeData: TextToSpeechNodeData = {
            id: sess.id,
        }
        const posDefault = { x: 250, y: 250 }

        const node: Node<TextToSpeechNodeData, AppNodeTypes.TextToSpeech> = {
            id: sess.id,
            type: AppNodeTypes.TextToSpeech,
            data: textToSpeechNodeData,
            position: posDefault,
            style: { width: 400, height: 400 },
            ...data,
        }

        return node
    }

    private addSession(): TextToSpeechSession {
        const sess: TextToSpeechSession = {
            id: this.idGeneratorGetter().next(),
            input: '',
            output: '',
        }
        console.log('add textToSpeech session', sess)
        this.sessionCreateHandler(sess)

        return sess
    }

    destroyNode(nodeId: string) {
        console.log('remove textToSpeech session', nodeId)
        this.sessionDestroyHandler(nodeId)
    }

    snapshot(): TextToSpeechParitionSnapshot {
        return {
            sessions: this.sessionsGetter(),
        }
    }

    restore(snapshot: TextToSpeechParitionSnapshot) {
        console.log('TextToSpeech Partition restore', snapshot)
        snapshot.sessions.forEach((sess) => {
            this.sessionCreateHandler(sess)
        })
    }
}
