import { atom } from 'jotai'

export type PromptModalData = {
    title: string
    prompt?: string
    type?: 'text' | 'password' | 'textarea' | 'number'
    defaultValue?: string
    placeholder?: string
    okText?: string
    onChange?: (value: string) => void
    onOk?: (value: string) => boolean | void // return false to prevent closing
    onCancel?: () => void
}

export const promptModalAtom = atom({
    data: null as PromptModalData | null,
    open: false,
})
