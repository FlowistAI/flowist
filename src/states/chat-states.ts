import { atom, useRecoilState } from 'recoil'
import { ChatMessage, ChatSession } from '../types/chat-node.types'
import { produce } from 'immer'
import { useCallback, useMemo } from 'react'

export const chatSessionsState = atom<ChatSession[]>({
    key: 'chatSessionsState',
    default: [],
})

export type Setter<T> = (fn: (prev: T) => T) => void

export const addMessageFnCreater =
    (setSessions: Setter<ChatSession[]>) =>
    (sessionId: string, message: ChatMessage) => {
        setSessions((prevSessions) => {
            const r = produce<ChatSession[]>(prevSessions, (draft) => {
                const sess = draft.find((s) => s.id === sessionId)

                if (sess) {
                    sess.messages.push(message)
                }
            })

            return r
        })
    }

export const updateMessageFnCreater =
    (setSessions: Setter<ChatSession[]>) =>
    (
        sessionId: string,
        messageId: string,
        messageGetter: (prev: string) => string,
    ) => {
        setSessions((prevSessions) => {
            const r = produce<ChatSession[]>(prevSessions, (draft) => {
                const sess = draft.find((s) => s.id === sessionId)

                if (sess) {
                    const msg = sess.messages.find((m) => m.id === messageId)

                    if (msg) {
                        msg.content = messageGetter(msg.content)
                    } else {
                        throw new Error(`message ${messageId} not found`)
                    }
                }
            })

            return r
        })
    }

export const useChatSessions = () => {
    const [sessions, setSessions] = useRecoilState(chatSessionsState)
    const addMessage = useMemo(
        () => addMessageFnCreater(setSessions),
        [setSessions],
    )
    const updateMessage = useMemo(
        () => updateMessageFnCreater(setSessions),
        [setSessions],
    )
    const getMessages = useCallback(
        (sessionId: string) => {
            const sess = sessions.find((s) => s.id === sessionId)

            if (sess) {
                return sess.messages
            } else {
                return []
            }
        },
        [sessions],
    )

    return { sessions, setSessions, addMessage, updateMessage, getMessages }
}

export const useChatSession = (id: string) => {
    const [sessions, setSessions] = useRecoilState(chatSessionsState)

    const addMessage = useMemo(
        () => (msg: ChatMessage) => {
            addMessageFnCreater(setSessions)(id, msg)
        },
        [setSessions, id],
    )

    const updateMessage = useMemo(
        () => (messageId: string, messageGetter: (prev: string) => string) => {
            updateMessageFnCreater(setSessions)(id, messageId, messageGetter)
        },
        [setSessions, id],
    )

    const rawMessages = useMemo(() => {
        const sess = sessions.find((s) => s.id === id)

        if (sess) {
            return sess.messages
        } else {
            return []
        }
    }, [sessions, id])

    const getMessage = useCallback(
        (messageId: string) => {
            const sess = sessions.find((s) => s.id === id)

            if (sess) {
                return sess.messages.find((m) => m.id === messageId)
            } else {
                return undefined
            }
        },
        [sessions, id],
    )

    type InsertMessageOptions = {
        message: ChatMessage
        beforeMessageId?: string
        afterMessageId?: string
    }
    const insertMessage = useCallback(
        ({
            message,
            beforeMessageId,
            afterMessageId,
        }: InsertMessageOptions) => {
            if (!beforeMessageId && !afterMessageId) {
                throw new Error(
                    'beforeMessageId and afterMessageId cannot both be undefined',
                )
            }

            setSessions((prevSessions) => {
                const r = produce<ChatSession[]>(prevSessions, (draft) => {
                    const sess = draft.find((s) => s.id === id)

                    if (!sess) {
                        throw new Error(`session ${id} not found`)
                    }

                    let idx
                    if (beforeMessageId) {
                        idx = sess.messages.findIndex(
                            (m) => m.id === beforeMessageId,
                        )
                    } else {
                        idx = sess.messages.findIndex(
                            (m) => m.id === afterMessageId,
                        )
                    }

                    if (idx === -1) {
                        throw new Error(`message ${beforeMessageId} not found`)
                    }

                    if (beforeMessageId) {
                        sess.messages.splice(idx, 0, message)
                    } else {
                        sess.messages.splice(idx + 1, 0, message)
                    }
                })

                return r
            })
        },
        [setSessions, id],
    )

    const deleteMessage = useCallback(
        (messageId: string) => {
            setSessions((prevSessions) => {
                const r = produce<ChatSession[]>(prevSessions, (draft) => {
                    const sess = draft.find((s) => s.id === id)
                    if (!sess) {
                        throw new Error(`session ${id} not found`)
                    }

                    const idx = sess.messages.findIndex(
                        (m) => m.id === messageId,
                    )

                    if (idx === -1) {
                        throw new Error(`message ${messageId} not found`)
                    }

                    sess.messages.splice(idx, 1)
                })

                return r
            })
        },
        [setSessions, id],
    )

    const contextMessages = useMemo(() => {
        const sess = sessions.find((s) => s.id === id)
        const msgs = []

        if (sess) {
            for (let i = sess.messages.length - 1; i >= 0; i--) {
                const msg = sess.messages[i]
                if (msg.content === '---') {
                    break
                }

                msgs.push(msg)
            }
        }

        msgs.reverse()

        return msgs
    }, [sessions, id])

    const session = useMemo(
        () => sessions.find((s) => s.id === id),
        [sessions, id],
    )

    const clearMessageBefore = useCallback(
        (messageId: string) => {
            setSessions((prevSessions) => {
                const r = produce<ChatSession[]>(prevSessions, (draft) => {
                    const sess = draft.find((s) => s.id === id)
                    if (!sess) {
                        throw new Error(`session ${id} not found`)
                    }

                    const idx = sess.messages.findIndex(
                        (m) => m.id === messageId,
                    )

                    if (idx === -1) {
                        throw new Error(`message ${messageId} not found`)
                    }

                    sess.messages.splice(0, idx + 1)
                })

                return r
            })
        },
        [setSessions, id],
    )

    const clearMessageAfter = useCallback(
        (messageId: string) => {
            setSessions((prevSessions) => {
                const r = produce<ChatSession[]>(prevSessions, (draft) => {
                    const sess = draft.find((s) => s.id === id)
                    if (!sess) {
                        throw new Error(`session ${id} not found`)
                    }

                    const idx = sess.messages.findIndex(
                        (m) => m.id === messageId,
                    )

                    if (idx === -1) {
                        throw new Error(`message ${messageId} not found`)
                    }

                    sess.messages.splice(idx + 1)
                })

                return r
            })
        },
        [setSessions, id],
    )

    return {
        session,
        getMessage,
        addMessage,
        updateMessage,
        insertMessage,
        deleteMessage,
        clearMessageBefore,
        clearMessageAfter,
        rawMessages,
        contextMessages,
    }
}
