import { atom } from 'recoil'
import { TextToSpeechSession } from './text-to-speech-node.types'

export const textToSpeechSessionsState = atom<TextToSpeechSession[]>({
    key: 'textToSpeechSessionsState',
    default: [],
})
