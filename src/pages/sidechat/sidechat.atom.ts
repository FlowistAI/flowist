import { atomWithStorage } from 'jotai/utils'
import { useJotaiContext } from '../../states/index.type'
import { useAtomValue } from 'jotai'

const _showSideChatAtom = atomWithStorage('sidechat', false)

const _activeSessionIdAtom = atomWithStorage<string | undefined>(
    'sideChat-activeSessionId',
    undefined,
)

export const useSideChatControl = () => {
    const ctx = useJotaiContext()
    const visible = useAtomValue(_showSideChatAtom)
    const activeSessionId = useAtomValue(_activeSessionIdAtom)

    return {
        visible,
        activeSessionId,
        toggle: (newValue?: boolean) => {
            const visible = ctx.get(_showSideChatAtom)

            if (newValue !== undefined) {
                ctx.set(_showSideChatAtom, newValue)

                return
            }

            console.log('sideChatControl toggle', !visible)
            ctx.set(_showSideChatAtom, !visible)
        },
        setActiveSessionId: (sessionId?: string) => {
            ctx.set(_activeSessionIdAtom, sessionId)
        },
    }
}
