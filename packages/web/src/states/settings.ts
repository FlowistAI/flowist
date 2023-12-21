import { atom } from 'recoil'
import { LangId } from '../types/settings-types'

export const currentLanguageState = atom<LangId>({
    key: 'currentLanguageState',
    default: 'en',
})
