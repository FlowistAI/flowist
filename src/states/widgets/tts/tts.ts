import { atom } from 'jotai'
import { TtsSession } from './tts.type'
import { createSessionfulHandler } from '../_common/sessionful-handler'

const _ttsSessionsAtom = atom<TtsSession[]>([])

export const ttsSessionsAtom = atom(
    (get) => get(_ttsSessionsAtom),
    createSessionfulHandler(_ttsSessionsAtom),
)

export const ttsDataAtom = atom(
    (get) =>
        ({
            sessions: get(ttsSessionsAtom),
        } as TtsData),
)

export type TtsData = {
    sessions: TtsSession[]
}
