/* eslint-disable @typescript-eslint/no-explicit-any */
import { Atom, atom } from 'jotai'
import { chatBotAtom } from './chat/chat.atom'
import { ChatBotNodeControl } from './chat/chat.control'
import { queryBotAtom } from './query/query.atom'
import { QueryBotWidgetControl } from './query/query.control'
import { ttsDataAtom } from './tts/tts'
import { TTSWidgetControl } from './tts/tts.control'
import { ChatBotNode } from '../../components/nodes/ChatBotNode/ChatBotNode'
import { TextToSpeechNode } from '../../nodes/text-to-speech/component/TextToSpeechNode'
import { QueryBotNode } from '../../components/nodes/QueryBotNode/QueryBotNode'

export type WidgetType = (typeof WidgetTypes)[keyof typeof WidgetTypes]

export const STANDARD_IO_PORTS: PortDefinition = {
    input: {
        input: {
            id: 'input',
        },
    },
    output: {
        output: {
            id: 'output',
        },
    },
} as const

export type PortDefinition = {
    input: {
        [key: string]: {
            id: string
        }
    }
    output: {
        [key: string]: {
            id: string
        }
    }
}

export const PORT_DEFINITIONS: Record<string, PortDefinition> = {
    'chat-bot': STANDARD_IO_PORTS,
    'text-to-speech': STANDARD_IO_PORTS,
    'query-bot': STANDARD_IO_PORTS,
} as const

export const WidgetTypes = {
    ChatBot: 'chat-bot',
    TextToSpeech: 'text-to-speech',
    QueryBot: 'query-bot',
} as const

export const WidgetComponents = {
    [WidgetTypes.ChatBot]: ChatBotNode,
    [WidgetTypes.TextToSpeech]: TextToSpeechNode,
    [WidgetTypes.QueryBot]: QueryBotNode,
} as const

export const widgetsDataAtom = atom((get) => ({
    [WidgetTypes.ChatBot]: get(chatBotAtom),
    [WidgetTypes.QueryBot]: get(queryBotAtom),
    [WidgetTypes.TextToSpeech]: get(ttsDataAtom),
}))

export type WidgetData = typeof widgetsDataAtom extends Atom<infer Value>
    ? Value
    : never

export const widgetHandlersAtom = atom({
    [WidgetTypes.ChatBot]: ChatBotNodeControl,
    [WidgetTypes.QueryBot]: QueryBotWidgetControl,
    [WidgetTypes.TextToSpeech]: TTSWidgetControl,
})

export type WidgetHanlders = typeof widgetHandlersAtom extends Atom<infer Value>
    ? Value
    : never
