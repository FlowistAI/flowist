import { useSetRecoilState } from 'recoil';
import { toastState, ToastMessage } from './atoms';

export const useToast = (): ((message: ToastMessage) => void) => {
    const setToast = useSetRecoilState(toastState);

    const showToast = (message: ToastMessage) => {
        setToast(message);
    };

    return showToast;
};
