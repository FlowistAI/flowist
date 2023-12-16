import { CSSProperties } from "react";
import { ChatBoxNode } from "../components/ChatBoxNode";
import { TextToSpeechNode } from "../components/TextToSpeechNode";
import { TodoList } from "../components/TodoList";

export const nodeTypes = {
    'chat-box': ChatBoxNode,
    'text-to-speech': TextToSpeechNode,
    'todo': TodoList,
}

export enum NodeType {
    ChatBox = 'chat-box',
    TextToSpeech = 'text-to-speech'
}

export type NodeTypeName = keyof typeof nodeTypes;

export const defaultStyles: Record<NodeTypeName, CSSProperties> = {
    'chat-box': {
        width: 400,
        height: 400,
    },
    'text-to-speech': {
        width: 400,
        height: 200,
    },
    'todo': {
        width: 400,
        height: 200,
    }
}  
