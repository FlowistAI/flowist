import { atom } from 'recoil'

export type ToastType = 'info' | 'warning' | 'success' | 'error'

export interface ToastMessage {
    type: ToastType
    content: string
}

export const toastState = atom<ToastMessage[]>({
    key: 'toastState',
    default: [],
})