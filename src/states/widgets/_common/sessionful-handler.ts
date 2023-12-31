import { Getter, PrimitiveAtom, Setter } from 'jotai'
import { HasId } from '../../../types/types'

export type SessionfulAction<T extends HasId> =
    | { type: 'add'; session: T }
    | { type: 'remove'; id: string }
    | { type: 'update'; session: Partial<T> & Required<Pick<T, 'id'>> }
    | { type: 'restore'; sessions: T[] }

export const createSessionfulHandler =
    <T extends HasId>(a: PrimitiveAtom<T[]>) =>
    (_get: Getter, set: Setter, action: SessionfulAction<T>) => {
        if (action.type == 'add') {
            return set(a, (prev) => [...prev, action.session])
        }

        if (action.type == 'remove') {
            return set(a, (prev) => prev.filter((s) => s.id !== action.id))
        }

        if (action.type == 'restore') {
            return set(a, action.sessions)
        }

        if (action.type == 'update') {
            return set(a, (prev) =>
                prev.map((s) => {
                    if (s.id === action.session.id) {
                        return { ...s, ...action.session }
                    }

                    return s
                }),
            )
        }
    }
