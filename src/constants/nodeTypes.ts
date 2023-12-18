import { ChatBotNode } from "../components/nodes/ChatBotNode/ChatBotNode";
import { TextToSpeechNode } from "../components/TextToSpeechNode";
import { QueryBotNode } from "../components/nodes/QueryBotNode/QueryBotNode";
import { PortDefinition } from "../hooks/NodeManager/NodeManager";

export const COMPONENT_BY_NODE_TYPE = {
    'chat-bot': ChatBotNode,
    'query-bot': QueryBotNode,
    'text-to-speech': TextToSpeechNode,
} as const;


export type AppNodeType = keyof typeof COMPONENT_BY_NODE_TYPE;

export enum AppNodeTypes {
    ChatBot = 'chat-bot',
    TextToSpeech = 'text-to-speech',
    QueryBot = 'query-bot',
}

export const STANDARD_IO_PORTS = {
    input: {
        'input': {
            id: 'input',
        }
    },
    output: {
        'output': {
            id: 'output',
        }
    },
} as const;

export const PORT_DEFINITIONS: Record<string, PortDefinition> = {
    'chat-bot': STANDARD_IO_PORTS,
    'text-to-speech': STANDARD_IO_PORTS,
    'query-bot': STANDARD_IO_PORTS,
} as const;
