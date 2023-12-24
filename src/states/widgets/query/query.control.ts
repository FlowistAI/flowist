/* eslint-disable @typescript-eslint/no-explicit-any */

import { Node } from 'reactflow'
import { DefaultBot, DefaultUser } from '../../bot.type'
import { AddWidgetOptions } from '../../document.atom'
import { JotaiContext } from '../../index.type'
import { BotWrapped } from '../chat/chat.type'
import { WidgetType, WidgetTypes } from '../widget.atom'
import { QueryBotData, queryBotAtom, querySessionsAtom } from './query.atom'
import { QuerySession } from './query.type'

export const QueryBotWidgetControl = {
    create(
        { set }: JotaiContext,
        id: string,
        options: AddWidgetOptions<WidgetType>,
        preset?: BotWrapped,
    ): Node {
        const session: QuerySession = {
            id,
            bot: preset?.bot ?? DefaultBot,
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
