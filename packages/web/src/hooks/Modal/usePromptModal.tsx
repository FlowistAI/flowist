import { useSetAtom } from 'jotai'
import { PromptModalData, promptModalAtom } from './atoms'
import { useCallback } from 'react'
import { produce } from 'immer'

export const useModal = () => {
    const setToast = useSetAtom(promptModalAtom)

    const promptModal = useCallback(
        (data: PromptModalData) => {
            setToast((prev) => {
                return produce(prev, (draft) => {
                    draft.data = data
                    draft.open = true
                })
            })
        },
        [setToast],
    )

    return {
        promptModal,
    }
}
