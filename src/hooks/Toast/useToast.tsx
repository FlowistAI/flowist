import { useSetAtom } from 'jotai'
import { toastState, ToastMessage } from './toast.atom'

export const useToast = (): ((message: ToastMessage) => void) => {
    const setToast = useSetAtom(toastState)

    const pushMessage = (message: ToastMessage) => {
        message.content
        setToast((prev) => [...prev, message])
    }

    return pushMessage
}
