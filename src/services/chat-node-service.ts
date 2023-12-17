import { Node } from "reactflow";
import { AppNodeTypes } from "../constants/nodeTypes";
import { generateId } from "../util/id-generator";
import { Bot, BotModelProviderType, GoogleGeminiModelIds, GoogleGeminiOfficialServiceSource, OpenAIModelIds as Models, SessionId, User } from "../types/bot-types";
import { ChatBotNodeData, ChatSession } from "../types/chat-node-types";
import { BotNodePreset } from "../types/bot-types";
import { SubManager } from "../hooks/NodeManager/SubManager";

export type CreateNodeOptions = {
    preset?: BotNodePreset
    data?: Partial<Node<ChatBotNodeData, AppNodeTypes.ChatBot>>
}

export type ChatBotNodeServiceProps = {
    sessionCreateHandler: (sess: ChatSession) => void
    sessionDestroyHandler: (sessId: SessionId) => void
    sessionsGetter: () => ChatSession[]
}

export class ChatBotNodeService implements SubManager<AppNodeTypes.ChatBot> {
    static readonly DefaultBot: Bot = {
        type: 'bot',
        name: 'Gemini Pro',
        avatar: 'google-ai.png',
        settings: {
            model: GoogleGeminiModelIds.GeminiPro,
            temperature: 0.7,
            maxTokens: 0,
            prompt: '',
            provider: BotModelProviderType.GoogleGemini,
            serviceSource: GoogleGeminiOfficialServiceSource
        },
    }

    static readonly DefaultUser: User = {
        type: 'user',
        name: 'User',
        avatar: 'user-avatar.jpg',
    }

    sessionCreateHandler: (sess: ChatSession) => void
    sessionDestroyHandler: (sessId: SessionId) => void
    sessionsGetter: () => ChatSession[]

    constructor({
        sessionCreateHandler,
        sessionDestroyHandler,
        sessionsGetter,
    }: ChatBotNodeServiceProps) {
        this.sessionCreateHandler = sessionCreateHandler
        this.sessionDestroyHandler = sessionDestroyHandler
        this.sessionsGetter = sessionsGetter
    }

    createNode({ preset, data }: CreateNodeOptions) {
        const sess = this.addSession(undefined, preset)
        const chatBotNodeData: ChatBotNodeData = {
            id: sess.id,
        }
        const posDefault = { x: 250, y: 250 }

        const node: Node<ChatBotNodeData, AppNodeTypes.ChatBot> = {
            id: sess.id,
            type: AppNodeTypes.ChatBot,
            data: chatBotNodeData,
            position: posDefault,
            style: { width: 400, height: 400 },
            ...data,
        }
        return node
    }

    private addSession(user?: User, preset?: BotNodePreset): ChatSession {
        const sess = {
            id: generateId(),
            bot: preset?.bot ?? ChatBotNodeService.DefaultBot,
            user: user ?? ChatBotNodeService.DefaultUser,
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

    snapshot(): ChatSession[] {
        return this.sessionsGetter()
    }

    restore(snapshot: ChatSession[]) {
        console.log('ChatBot Partition restore', snapshot);

        snapshot.forEach(sess => {
            this.sessionCreateHandler(sess)
        })
    }
}

