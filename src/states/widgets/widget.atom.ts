/* eslint-disable @typescript-eslint/no-explicit-any */
import { Atom, atom } from 'jotai'
import { chatBotAtom } from './chat/chat.atom'
import { ChatBotNodeControl } from './chat/chat.control'
import { queryBotAtom } from './query/query.atom'
import { QueryBotWidgetControl } from './query/query.control'
import { ttsDataAtom } from './tts/tts'
import { TTSWidgetControl } from './tts/tts.control'
import { ChatBotNode } from '../../components/widgets/ChatBot/ChatBotNode'
import { TextToSpeechNode } from '../../components/widgets/TextToSpeech/TextToSpeechNode'
import { QueryBotNode } from '../../components/widgets/QueryBot/QueryBotNode'
import { BotSettings } from '../bot.type'
import { LLMProvider } from '../settings/settings.type'

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

export type WidgetType = (typeof WidgetTypes)[keyof typeof WidgetTypes]

interface CommonPresetData {
    type: WidgetType
    id: string
    name: string
    icon?: string
    description?: string
}

type SpecificPresetData =
    | {
          type: 'chat-bot'
          settings: BotSettings<LLMProvider>
      }
    | {
          type: 'text-to-speech'
      }
    | {
          type: 'query-bot'
          bot: BotSettings<LLMProvider>
      }

export type PresetData = CommonPresetData & SpecificPresetData

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
