import { Node } from "reactflow";
import { AppNodeTypes } from "../constants/nodeTypes";
import { generateId } from "../util/misc-util";
import { Bot, ChatNodeData, ChatNodePreset, ChatSession, ModelIds as Models, SessionId, User } from "../types/chat-types";

export type CreateNodeOptions = {
    preset?: ChatNodePreset
    data?: Partial<Node<ChatNodeData, AppNodeTypes.ChatBox>>
}

export type ChatNodeServiceProps = {
    sessionCreateHandler: (sess: ChatSession) => void
    sessionDestroyHandler: (sessId: SessionId) => void
}

export class ChatNodeService {
    static readonly DefaultBot: Bot = {
        type: 'bot',
        name: 'Bot',
        avatar: 'chatgpt3.png',
        settings: {
            model: Models.GPT35Turbo,
            temperature: 0.7,
            maxTokens: 0,
            prompt: ''
        },
    }

    sessionCreateHandler: (sess: ChatSession) => void
    sessionDestroyHandler: (sessId: SessionId) => void

    constructor({
        sessionCreateHandler,
        sessionDestroyHandler,
    }: ChatNodeServiceProps) {
        this.sessionCreateHandler = sessionCreateHandler
        this.sessionDestroyHandler = sessionDestroyHandler
    }

    createNode({ preset, data }: CreateNodeOptions) {
        const sess = this.addSession(undefined, preset)
        const chatNodeData: ChatNodeData = {
            id: sess.id,
        }
        const posDefault = { x: 250, y: 250 }

        const node: Node<ChatNodeData, AppNodeTypes.ChatBox> = {
            id: sess.id,
            type: AppNodeTypes.ChatBox,
            data: chatNodeData,
            position: posDefault,
            style: { width: 400, height: 400 },
            ...data,
        }
        return node
    }

    private addSession(user?: User, preset?: ChatNodePreset): ChatSession {
        const sess = {
            id: generateId(),
            bot: preset?.bot ?? ChatNodeService.DefaultBot,
            user: user ?? {
                type: 'user',
                name: 'User',
                avatar: 'user-avatar.jpg',
            },
            messages: [],
        }
        console.log('addSession', sess);
        this.sessionCreateHandler(sess)

        return sess
    }

    destroyNode(nodeId: string) {
        console.log('removeSession', nodeId);
        this.sessionDestroyHandler(nodeId)
    }

}

