import { atomWithStorage } from 'jotai/utils'
import { ChatMessage, ChatSession } from '../../states/widgets/chat/chat.type'
import { useJotaiContext } from '../../states/index.type'
import { useAtomValue } from 'jotai'

const _showSideChatAtom = atomWithStorage('sidechat', false)

const _sideChatSessionsAtom = atomWithStorage<ChatSession[]>('sideChat', [])

const _activeSessionIdAtom = atomWithStorage<string | undefined>(
    'sideChat-activeSessionId',
    undefined,
)

export const useSideChatControl = () => {
    const ctx = useJotaiContext()
    const visible = useAtomValue(_showSideChatAtom)
    const sessions = useAtomValue(_sideChatSessionsAtom)
    const activeSessionId = useAtomValue(_activeSessionIdAtom)

    console.log('activeSessionId', activeSessionId)

    return {
        visible,
        sessions,
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
        addSession: (session: ChatSession) => {
            const sessions = ctx.get(_sideChatSessionsAtom)

            ctx.set(_sideChatSessionsAtom, [...sessions, session])
        },
        removeSession: (sessionId: string) => {
            const sessions = ctx.get(_sideChatSessionsAtom)

            ctx.set(
                _sideChatSessionsAtom,
                sessions.filter((s) => s.id !== sessionId),
            )
            if (sessionId === ctx.get(_activeSessionIdAtom)) {
                ctx.set(_activeSessionIdAtom, undefined)
            }
        },
        clearSessions: () => {
            ctx.set(_sideChatSessionsAtom, [])
            ctx.set(_activeSessionIdAtom, undefined)
        },
        withSession: (sessionId: string) => ({
            addMessage: (message: ChatMessage) => {
                const sessions = ctx.get(_sideChatSessionsAtom)

                ctx.set(
                    _sideChatSessionsAtom,
                    sessions.map((s) => {
                        if (s.id === sessionId) {
                            return {
                                ...s,
                                messages: [...s.messages, message],
                            }
                        }

                        return s
                    }),
                )
            },
            input: sessions.find((s) => s.id === sessionId)?.input ?? '',
            updateInput: (input: string) => {
                const sessions = ctx.get(_sideChatSessionsAtom)

                ctx.set(
                    _sideChatSessionsAtom,
                    sessions.map((s) => {
                        if (s.id === sessionId) {
                            return {
                                ...s,
                                input,
                            }
                        }

                        return s
                    }),
                )
            },
        }),
    }
}
