import { Getter, Setter } from 'jotai'
import { useAtomCallback } from 'jotai/utils'

export type JotaiContext = {
    get: Getter
    set: Setter
}

export const useJotaiContext = (): JotaiContext => {
    return useAtomCallback((get, set) => ({ get, set }))()
}
