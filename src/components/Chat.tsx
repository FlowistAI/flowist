import {
    Button,
    Dropdown,
    Menu,
    MenuButton,
    MenuItem,
    Textarea,
    Tooltip,
} from '@mui/joy'
import React, { useCallback, useEffect, useRef } from 'react'
import { Bot } from '../types/bot-types'
import { ChatMessage } from '../types/chat-node-types'
import './Chat.css'
import { MoreHoriz } from '@mui/icons-material'

export interface AvatarProps {
    src: string
}

export const Avatar: React.FC<AvatarProps> = ({ src }) => (
    <img src={src} alt="Profile" className="avatar" />
)

export interface BotInfoProps {
    bot: Bot
}

export const BotInfo: React.FC<BotInfoProps> = ({ bot }) => (
    <div className="user-info">
        <Avatar src={bot.avatar} />
        <div className="flex-1">
            <div className="user-name">{bot.name}</div>
            <div className="user-role">{bot.settings.model}</div>
        </div>
        <Tooltip
            title={
                <div>
                    <div>Model: {bot.settings.model}</div>
                    <div>Max Tokens: {bot.settings.maxTokens}</div>
                    <div>Temperature: {bot.settings.temperature}</div>
                    <div>Prompt: {bot.settings.prompt}</div>
                </div>
            }
            arrow
            placement="right"
        >
            <span className="px-2">...</span>
        </Tooltip>
    </div>
)

export interface MessageProps {
    message: ChatMessage
    isUser: boolean
}

const textAreaStyle = { flex: 1 } as React.CSSProperties

export const MessageMenu: React.FC = () => {
    return (
        <Dropdown>
            <MenuButton variant="plain">
                <MoreHoriz />
            </MenuButton>
            <Menu>
                <MenuItem>Copy</MenuItem>
                <MenuItem>Edit</MenuItem>
                <MenuItem>Set context delimiter above</MenuItem>
                <MenuItem>Set context delimiter below</MenuItem>
                <MenuItem>Clear</MenuItem>
                <MenuItem>Clear messages above</MenuItem>
                <MenuItem>Clear messages below</MenuItem>
            </Menu>
        </Dropdown>
    )
}

export const Message: React.FC<MessageProps> = ({ message, isUser }) => (
    <div className={`message max-w-full ${isUser ? 'own' : ''}`}>
        {!isUser && <Avatar src={message.avatar} />}
        {isUser && <MessageMenu />}
        <div className="message-content break-words	 min-w-0">
            {message.content}
        </div>
        {isUser && <Avatar src={message.avatar} />}
    </div>
)

export interface MessageListProps {
    messages: ChatMessage[]
}

export const MessageList: React.FC<MessageListProps> = ({ messages }) => {
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    return (
        <div className="messages nodrag">
            {messages.map((message, index) => (
                <Message
                    key={index}
                    message={message}
                    isUser={message.isUser}
                />
            ))}
            <div ref={messagesEndRef} />
        </div>
    )
}

export interface MessageInputProps {
    onSendMessage?: (message: string) => void
    input?: string
    allowSend?: boolean
    setInput?: (input: string) => void
}

export const MessageInput: React.FC<MessageInputProps> = ({
    onSendMessage,
    input: inputOut,
    allowSend = true,
    setInput: setInputOut,
}) => {
    const [inputInner, setInputInner] = React.useState('')
    console.log('inputOut', inputOut, 'inputInner', inputInner)

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
        <div className="message-input nodrag gap-2">
            <Textarea
                sx={textAreaStyle}
                placeholder="Write your message (Ctrl+Enter to submit)"
                maxRows={10}
                value={realInput}
                onChange={handleChange}
                onKeyUp={handleKeyUp}
            />
            <Button
                color="primary"
                onClick={handleSend}
                disabled={realInput.trim() === '' || !allowSend}
            >
                Send
            </Button>
        </div>
    )
}
