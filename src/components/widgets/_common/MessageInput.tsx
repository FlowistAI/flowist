import { Button, Textarea } from '@mui/joy'
import React, { useCallback } from 'react'
import { DeleteForever, Send } from '@mui/icons-material'
import { textAreaStyle } from './Chat'

export interface MessageInputProps {
    onSendMessage?: (message: string) => void
    onClear?: () => void
    allowClear?: boolean
    input?: string
    allowSend?: boolean
    setInput?: (input: string) => void
}

export const MessageInput: React.FC<MessageInputProps> = ({
    onSendMessage,
    onClear,
    allowClear,
    input: inputOut,
    allowSend = true,
    setInput: setInputOut,
}) => {
    const [inputInner, setInputInner] = React.useState('')

    const realInput = inputOut ?? inputInner
    const realSetInput = setInputOut ?? setInputInner

    const handleSend = useCallback(() => {
        console.log('send ', realInput)
        if (realInput.trim()) {
            onSendMessage?.(realInput)
            realSetInput('')
        }
    }, [realInput, onSendMessage, realSetInput])

    const handleKeyUp = useCallback(
        (e: React.KeyboardEvent) => {
            // ctrl + enter
            if (e.ctrlKey && e.key === 'Enter') {
                handleSend()
            }
        },
        [handleSend],
    )

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            realSetInput(e.target.value)
        },
        [realSetInput],
    )

    return (
        <div className="message-input  gap-2">
            <Button
                color="danger"
                className="nodrag"
                onClick={onClear}
                disabled={!allowClear}
            >
                <DeleteForever fontSize="small" />{' '}
            </Button>
            <div className="nodrag flex-1">
                <Textarea
                    sx={textAreaStyle}
                    placeholder="Write your message (Ctrl+Enter to submit)"
                    maxRows={10}
                    value={realInput}
                    onChange={handleChange}
                    onKeyUp={handleKeyUp}
                />
            </div>
            <Button
                className="nodrag"
                color="primary"
                onClick={handleSend}
                disabled={realInput.trim() === '' || !allowSend}
            >
                <Send fontSize="small" /> <div className="pl-2 mt-1">Send</div>
            </Button>
        </div>
    )
}
