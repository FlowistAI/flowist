/* eslint-disable @typescript-eslint/no-explicit-any */

import { Node } from 'reactflow'
import { DefaultUser, getDefaultBot } from '../../states/bot.type'
import { AddWidgetOptions } from '../../states/document.atom'
import { JotaiContext } from '../../states/index.type'
import {
    PresetData,
    WidgetType,
    WidgetTypes,
} from '../../states/widgets/widget.atom'
import { QueryBotData, queryBotAtom, querySessionsAtom } from './query-bot.atom'
import { QuerySession } from './query-bot.type'
import { botFromPreset } from '../../states/widgets/_common/bot-from-preset'

export const QueryBotWidgetControl = {
    create(
        ctx: JotaiContext,
        id: string,
        options: AddWidgetOptions<WidgetType>,
    ): Node {
        const { set } = ctx
        const defaultBot = getDefaultBot(ctx)
        const preset = options.preset as
            | (PresetData & { type: 'chat-bot' })
            | undefined
        const session: QuerySession = {
            id,
            bot: botFromPreset(defaultBot, preset),
            user: undefined /* fill later */ ?? DefaultUser,
            input: '',
            output: '',
        }

        set(querySessionsAtom, { type: 'add', session })

        return {
            id: id,
            type: WidgetTypes.QueryBot,
            position: options.data?.position ?? { x: 0, y: 0 },
            style: {
                width: 400,
                height: 300,
            },
            data: { id, ...options.data },
        }
    },
    destroy({ set }: JotaiContext, id: string) {
        set(querySessionsAtom, { type: 'remove', id })
    },
    snapshot({ get }: JotaiContext) {
        return get(queryBotAtom)
    },
    restore({ set }: JotaiContext, data: QueryBotData) {
        set(querySessionsAtom, { type: 'restore', ...data })
    },
}
