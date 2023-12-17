import { atom } from 'recoil';
import { ChatMessage, ChatSession } from "../types/chat-node-types";
import { produce } from 'immer';

export const chatSessionsState = atom<ChatSession[]>({
    key: 'chatSessionsState',
    default: [],
});

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
