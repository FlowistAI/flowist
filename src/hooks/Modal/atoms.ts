import { atom } from 'jotai'
import { ReactNode } from 'react'

export type PromptModalData = {
    title: ReactNode | string
    prompt?: ReactNode | string
    type?: 'text' | 'password' | 'textarea' | 'number' | 'confirm'
    defaultValue?: string
    placeholder?: string
    okText?: string
    cancelText?: string
    onChange?: (value: string) => void
    onOk?: (value: string) => boolean | void // return false to prevent closing
    onCancel?: () => void
}

export const promptModalAtom = atom({
    data: null as PromptModalData | null,
    open: false,
})
