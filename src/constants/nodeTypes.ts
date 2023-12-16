import { CSSProperties } from "react";
import { ChatBoxNode } from "../components/ChatBoxNode";
import { TextToSpeechNode } from "../components/TextToSpeechNode";

export const appNodeTypeComponents = {
    'chat-box': ChatBoxNode,
    'text-to-speech': TextToSpeechNode,
}


export type AppNodeType = keyof typeof appNodeTypeComponents;

export const defaultStyles: Record<AppNodeType, CSSProperties> = {
    'chat-box': {
        width: 400,
        height: 400,
    },
    'text-to-speech': {
        width: 400,
        height: 200,
    },
}

export enum AppNodeTypes {
    ChatBox = 'chat-box',
    TextToSpeech = 'text-to-speech'
}
