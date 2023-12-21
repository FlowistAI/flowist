import React, { useCallback, useEffect, useState } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { Snackbar, SnackbarCloseReason } from '@mui/joy'
import { ToastMessage, toastState } from './atoms'
import { InfoIcon } from '@primer/octicons-react'
import {
    CheckOutlined,
    ErrorOutline,
    InfoOutlined,
    WarningOutlined,
} from '@mui/icons-material'
import { Portal } from '@mui/material'

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
    const messages = useRecoilValue(toastState)
    const setMessages = useSetRecoilState(toastState)
    const [open, setOpen] = useState(false)
    const [currentMessage, setCurrentMessage] = useState<
        ToastMessage | undefined
    >(undefined)

    // Function to show the next message
    const showNextMessage = useCallback(() => {
        if (messages.length > 0) {
            const [nextMessage, ...rest] = messages
            setCurrentMessage(nextMessage)
            setOpen(true)
            // Remove the displayed message from the queue
            setMessages(rest)
        }
    }, [messages, setMessages])

    // Effect to trigger showNextMessage when messages array changes and there is no current message
    useEffect(() => {
        if (!currentMessage && messages.length > 0) {
            showNextMessage()
        }
    }, [messages, currentMessage, showNextMessage])

    // Handle close event
    const handleClose = (_: unknown, reason: SnackbarCloseReason) => {
        if (reason === 'clickaway') {
            return
        }

        setOpen(false)
        setCurrentMessage(undefined)
    }

    // Effect to automatically close the snackbar after a delay
    useEffect(() => {
        if (currentMessage && open) {
            const timer = setTimeout(() => {
                setOpen(false)
                setCurrentMessage(undefined)
            }, 3000)

            return () => clearTimeout(timer)
        }
    }, [currentMessage, open])

    // Effect to show the next message after the current message is closed
    useEffect(() => {
        if (!open && !currentMessage && messages.length > 0) {
            showNextMessage()
        }
    }, [open, currentMessage, messages, showNextMessage])

    if (!currentMessage) {
        return null
    }

    const severity = severityMap[currentMessage.type] ?? 'primary'
    const icon = iconMap[severity] ?? <InfoIcon size={24} />

    return (
        <Portal>
            <Snackbar
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                open={open}
                onClose={handleClose}
                variant="soft"
                color={severity}
                key={currentMessage.content}
            >
                {icon}
                {currentMessage.content}
            </Snackbar>
        </Portal>
    )
}

export default Toast
