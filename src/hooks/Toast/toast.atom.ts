import { atom } from 'jotai'

export type ToastType = 'info' | 'warning' | 'success' | 'error'

export interface ToastMessage {
    type: ToastType
    content: string
}

export const toastState = atom<ToastMessage[]>([])
