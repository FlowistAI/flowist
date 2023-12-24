import { atom, useSetAtom } from 'jotai'
import { QuerySession } from './query.type'
import { createSessionfulHandler } from '../_common/sessionful-handler'
import { JotaiContext } from '../../index.type'

const _querySessionsAtom = atom<QuerySession[]>([])

export const querySessionsAtom = atom(
    (get) => get(_querySessionsAtom),
    createSessionfulHandler(_querySessionsAtom),
)

export type QueryBotAction = { type: 'getSession'; id: string }

export const useQueryBot = () => {
    return {
        dispatch: useSetAtom(queryBotAtom),
    }
}

export const queryBotAtom = atom(
    (get) =>
        ({
            sessions: get(querySessionsAtom),
        } as QueryBotData),
    (get, set, action: QueryBotAction) => {
        const ctx = { get, set }
        if (action.type == 'getSession') {
            return handleGetSession(ctx, action.id)
        }

        throw new Error(`unknown action type ${action.type}`)
    },
)

export type QueryBotData = {
    sessions: QuerySession[]
}

function handleGetSession(
    { get }: JotaiContext,
    id: string,
): QuerySession | undefined {
    const sessions = get(querySessionsAtom)

    return sessions.find((s) => s.id === id)
}
