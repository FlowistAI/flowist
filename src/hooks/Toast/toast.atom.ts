import { atom } from 'jotai'
import { JotaiContext } from '../../states/index.type'

export type ToastType = 'info' | 'warning' | 'success' | 'error'

export interface ToastMessage {
    type: ToastType
    content: string
}

export const toastState = atom<ToastMessage[]>([])

export const toastControl = (ctx: JotaiContext) => ({
    add: (message: ToastMessage) => {
        const { set } = ctx
        set(toastState, (messages) => [...messages, message])
    },
    remove: (message: ToastMessage) => {
        const { set } = ctx
        set(toastState, (messages) => messages.filter((m) => m !== message))
    },
})
