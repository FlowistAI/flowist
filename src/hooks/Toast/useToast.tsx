import { useSetRecoilState } from 'recoil'
import { toastState, ToastMessage } from './atoms'

export const useToast = (): ((message: ToastMessage) => void) => {
    const setToast = useSetRecoilState(toastState)

    const pushMessage = (message: ToastMessage) => {
        message.content += ' - ' + new Date().toLocaleTimeString()
        setToast((prev) => [...prev, message])
    }

    return pushMessage
}
