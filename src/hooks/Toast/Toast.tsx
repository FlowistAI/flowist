import React from 'react';
import { useRecoilValue, useResetRecoilState } from 'recoil';
import { Snackbar } from '@mui/joy';
import { toastState } from './atoms';
import { InfoIcon } from '@primer/octicons-react';
import { CheckOutlined, ErrorOutline, InfoOutlined, WarningOutlined } from '@mui/icons-material';

type Color = 'primary' | 'neutral' | 'danger' | 'success' | 'warning'
const severityMap: Record<string, Color> = {
    info: 'primary',
    warning: 'warning',
    success: 'success',
    error: 'danger',
}
const iconMap: Record<Color, React.ReactNode> = {
    neutral: <InfoOutlined />,
    primary: <InfoOutlined />,
    warning: <WarningOutlined />,
    success: <CheckOutlined />,
    danger: <ErrorOutline />,
}

const Toast: React.FC = () => {
    const message = useRecoilValue(toastState);
    const resetToast = useResetRecoilState(toastState);

    const handleClose = () => {
        resetToast();
    };

    if (!message) {
        return null
    }

    const severity = severityMap[message.type] ?? 'primary'
    const icon = iconMap[severity] ?? <InfoIcon size={24} />

    return (
        <Snackbar
            anchorOrigin={
                {
                    vertical: 'top',
                    horizontal: 'center',
                }
            }
            open={!!message
            }
            autoHideDuration={3000}
            onClose={handleClose}
            variant='soft'
            color={severity}
            key={message.content}
        >
            {icon}
            {message.content}
        </Snackbar >
    );
};

export default Toast;
