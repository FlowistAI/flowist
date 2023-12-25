/* eslint-disable @typescript-eslint/no-explicit-any */
import { AddWidgetOptions } from '../../document.atom'
import { JotaiContext } from '../../index.type'
import { PresetData, WidgetType, WidgetTypes } from '../widget.atom'
import { Bot, DefaultBot, DefaultUser } from '../../bot.type'
import { ChatBotData, chatBotAtom, chatSessionsAtom } from './chat.atom'
import { ChatSession } from './chat.type'
import { Node } from 'reactflow'

export const botFromPreset = (
    preset: PresetData & { type: 'chat-bot' },
): Bot => {
    return {
        ...DefaultBot,
        ...{
            name: preset.name,
            avatar: preset.icon ?? DefaultBot.avatar,
        },
        settings: {
            ...DefaultBot.settings,
            ...preset.settings,
        },
    }
}

export const ChatBotNodeControl = {
    create(
        { set }: JotaiContext,
        id: string,
        options: AddWidgetOptions<WidgetType>,
    ): Node {
        const preset = options.preset as
            | (PresetData & { type: 'chat-bot' })
            | undefined

        const session: ChatSession = {
            id,
            bot: preset ? botFromPreset(preset) : DefaultBot,
            user: undefined /* fill later */ ?? DefaultUser,
            sending: false,
            messages: [],
        }

        set(chatSessionsAtom, { type: 'add', session })

        return {
            id: id,
            type: WidgetTypes.ChatBot,
            position: options.data?.position ?? { x: 0, y: 0 },
            style: {
                width: 400,
                height: 600,
            },
            data: {
                id,
                ...options.data,
            },
        }
    },
    destroy({ set }: JotaiContext, id: string) {
        set(chatSessionsAtom, { type: 'remove', id })
    },
    snapshot({ get }: JotaiContext) {
        return get(chatBotAtom)
    },
    restore({ set }: JotaiContext, data: ChatBotData) {
        set(chatSessionsAtom, { type: 'restore', ...data })
    },
}
