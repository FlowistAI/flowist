import { atom, useRecoilState } from 'recoil'
import { ChatMessage, ChatSession } from '../types/chat-node-types'
import { produce } from 'immer'
import { useCallback, useMemo } from 'react'

export const chatSessionsState = atom<ChatSession[]>({
    key: 'chatSessionsState',
    default: [],
})

export type Setter<T> = (fn: (prev: T) => T) => void

export const addMessageFnCreater = (setSessions: Setter<ChatSession[]>) => (sessionId: string, message: ChatMessage) => {
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

export const updateMessageFnCreater = (setSessions: Setter<ChatSession[]>) => (sessionId: string, messageId: string, messageGetter: (prev: string) => string) => {
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
    const addMessage = useMemo(() => addMessageFnCreater(setSessions), [setSessions])
    const updateMessage = useMemo(() => updateMessageFnCreater(setSessions), [setSessions])
    const getMessages = useCallback((sessionId: string) => {
        const sess = sessions.find((s) => s.id === sessionId)
        if (sess) {
            return sess.messages
        } else {
            return []
        }
    }, [sessions])
    return { sessions, setSessions, addMessage, updateMessage, getMessages }
}

export const useChatSession = (id: string) => {
    const [sessions, setSessions] = useRecoilState(chatSessionsState)

    const addMessage = useMemo(() => (msg: ChatMessage) => {
        addMessageFnCreater(setSessions)(id, msg)
    }, [setSessions, id])

    const updateMessage = useMemo(() => (messageId: string, messageGetter: (prev: string) => string) => {
        updateMessageFnCreater(setSessions)(id, messageId, messageGetter)
    }, [setSessions, id])

    const messages = useMemo(() => {
        const sess = sessions.find((s) => s.id === id)
        if (sess) {
            return sess.messages
        } else {
            return []
        }
    }, [sessions, id])

    const session = useMemo(() => sessions.find((s) => s.id === id), [sessions, id])
    return { session, addMessage, updateMessage, messages }
}
