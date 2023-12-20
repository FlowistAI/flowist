import { Node } from 'reactflow'
import { AppNodeTypes } from '../constants/nodeTypes'
import { Bot, SessionId, User } from '../types/bot-types'
import { QueryBotNodeData, QuerySession } from '../types/query-node-types'
import { BotNodePreset } from '../types/bot-types'
import { ChatBotNodeService } from './chat-bot-node.service'
import { SubManager } from '../hooks/NodeManager/SubManager'
import { NodeIdGenerator } from '../util/id-generator'

export type CreateNodeOptions = {
    preset?: BotNodePreset
    data?: Partial<Node<QueryBotNodeData, AppNodeTypes.QueryBot>>
}

export type QueryParitionSnapshot = {
    sessions: QuerySession[]
}

export type QueryBotNodeServiceProps = {
    sessionCreateHandler: (sess: QuerySession) => void
    sessionDestroyHandler: (sessId: SessionId) => void
    sessionsGetter: () => QuerySession[]
    idGeneratorGetter: () => NodeIdGenerator
}

export class QueryBotNodeService implements SubManager<AppNodeTypes.QueryBot> {
    static readonly DefaultBot: Bot = ChatBotNodeService.DefaultBot
    static readonly DefaultUser: User = ChatBotNodeService.DefaultUser


    sessionCreateHandler: (sess: QuerySession) => void
    sessionDestroyHandler: (sessId: SessionId) => void
    sessionsGetter: () => QuerySession[]
    idGeneratorGetter: () => NodeIdGenerator

    constructor({
        sessionCreateHandler,
        sessionDestroyHandler,
        sessionsGetter,
        idGeneratorGetter,
    }: QueryBotNodeServiceProps) {
        this.sessionCreateHandler = sessionCreateHandler
        this.sessionDestroyHandler = sessionDestroyHandler
        this.sessionsGetter = sessionsGetter
        this.idGeneratorGetter = idGeneratorGetter
    }

    createNode({ preset, data }: CreateNodeOptions) {
        const sess = this.addSession(undefined, preset)
        const queryBotNodeData: QueryBotNodeData = {
            id: sess.id,
        }
        const posDefault = { x: 250, y: 250 }

        const node: Node<QueryBotNodeData, AppNodeTypes.QueryBot> = {
            id: sess.id,
            type: AppNodeTypes.QueryBot,
            data: queryBotNodeData,
            position: posDefault,
            style: { width: 400, height: 400 },
            ...data,
        }

        return node
    }

    private addSession(user?: User, preset?: BotNodePreset): QuerySession {
        const sess = {
            id: this.idGeneratorGetter().next(),
            bot: preset?.bot ?? QueryBotNodeService.DefaultBot,
            user: user ?? QueryBotNodeService.DefaultUser,
            input: '',
            output: '',
        }
        console.log('add query session', sess)
        this.sessionCreateHandler(sess)

        return sess
    }

    destroyNode(nodeId: string) {
        console.log('remove query session', nodeId)
        this.sessionDestroyHandler(nodeId)
    }

    snapshot(): QueryParitionSnapshot {
        return {
            sessions: this.sessionsGetter()
        }
    }

    restore(snapshot: QueryParitionSnapshot) {
        console.log('QueryBot Partition restore', snapshot)
        snapshot.sessions.forEach(sess => {
            this.sessionCreateHandler(sess)
        })
    }
}
