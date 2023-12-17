import { CSSProperties } from "react";
import { ChatBotNode } from "../components/ChatBotNode";
import { TextToSpeechNode } from "../components/TextToSpeechNode";

export const appNodeTypeComponents = {
    'chat-bot': ChatBotNode,
    'text-to-speech': TextToSpeechNode,
}


export type AppNodeType = keyof typeof appNodeTypeComponents;

export const defaultStyles: Record<AppNodeType, CSSProperties> = {
    'chat-bot': {
        width: 400,
        height: 400,
    },
    'text-to-speech': {
        width: 400,
        height: 200,
    },
}

export enum AppNodeTypes {
    ChatBot = 'chat-bot',
    TextToSpeech = 'text-to-speech'
}
