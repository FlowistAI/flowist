import { ChatBotNode } from "../components/nodes/ChatBotNode/ChatBotNode";
import { TextToSpeechNode } from "../components/TextToSpeechNode";
import { QueryBotNode } from "../components/nodes/QueryBotNode/QueryBotNode";

export const appNodeTypeComponents = {
    'chat-bot': ChatBotNode,
    'query-bot': QueryBotNode,
    'text-to-speech': TextToSpeechNode,
}


export type AppNodeType = keyof typeof appNodeTypeComponents;

export enum AppNodeTypes {
    ChatBot = 'chat-bot',
    TextToSpeech = 'text-to-speech',
    QueryBot = 'query-bot',
}
