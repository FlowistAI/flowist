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
import { ChatMessage } from '../types/chat-node.types'
import './Chat.css'
import { MoreHoriz, Send } from '@mui/icons-material'
import { useChatSession } from '../states/chat-states'
import { useClipboard } from '@nextui-org/use-clipboard'
import { useToast } from '../hooks/Toast/useToast'
import { useModal } from '../hooks/Modal/usePromptModal'

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

type MessageMenuActionHandler = (
    messageId: string,
    action: MessageMenuActionType,
) => void

export interface MessageProps {
    message: ChatMessage
    isUser: boolean
    onAction?: MessageMenuActionHandler
}

const textAreaStyle = { flex: 1 } as React.CSSProperties

export const MessageMenuActions = {
    Copy: 'Copy',
    Edit: 'Edit',
    Delete: 'Delete',
    InsertContextDelimiterAbove: 'Insert context delimiter above',
    InsertContextDelimiterBelow: 'Insert context delimiter below',
    ClearMessagesAbove: 'Clear messages above',
    ClearMessagesBelow: 'Clear messages below',
} as const

export type MessageMenuActionType =
    (typeof MessageMenuActions)[keyof typeof MessageMenuActions]

export type MessageMenuProps = {
    message: ChatMessage
    onAction?: MessageMenuActionHandler
}

export const MessageMenu: React.FC<MessageMenuProps> = (props) => {
    return (
        <Dropdown>
            <MenuButton variant="plain">
                <MoreHoriz />
            </MenuButton>
            <Menu>
                {Object.values(MessageMenuActions).map((action) => (
                    <MenuItem
                        onClick={() =>
                            props.onAction?.(props.message.id, action)
                        }
                        key={action}
                    >
                        {action}
                    </MenuItem>
                ))}
            </Menu>
        </Dropdown>
    )
}

export const Message: React.FC<MessageProps> = ({
    message,
    isUser,
    onAction,
}) => (
    <>
        {message.content === '---' ? (
            // delimiter
            <div className="message flex items-center">
                <hr className="flex-1 border-gray-300 border-1 border-dashed" />
                <span className="px-4 text-gray-500">Context Cleared</span>
                <hr className="flex-1 border-gray-300 border-1 border-dashed" />
            </div>
        ) : (
            <div className={`message max-w-full ${isUser ? 'own' : ''}`}>
                {!isUser && <Avatar src={message.avatar} />}
                {isUser && (
                    <MessageMenu message={message} onAction={onAction} />
                )}
                <div className="message-content break-words	 min-w-0">
                    {message.content}
                </div>
                {!isUser && (
                    <MessageMenu message={message} onAction={onAction} />
                )}
                {isUser && <Avatar src={message.avatar} />}
            </div>
        )}
    </>
)

const useMessageMenuActionHandler = (sessionId: string) => {
    const sess = useChatSession(sessionId)

    const { copy, error } = useClipboard()
    const toast = useToast()
    const modal = useModal()

    const handleAction = useCallback(
        (messageId: string, action: MessageMenuActionType) => {
            const message = sess.getMessage(messageId)
            if (!message) {
                console.error('Message not found', messageId)

                return
            }

            switch (action) {
                case MessageMenuActions.Copy: {
                    const showErr = (error: Error) =>
                        toast({
                            type: 'error',
                            content:
                                'Failed to copy message' +
                                error.message.toString(),
                        })

                    if (error) {
                        showErr(error)

                        return
                    }

                    copy(message.content)

                    if (error) {
                        showErr(error)

                        return
                    }

                    toast({
                        type: 'success',
                        content: 'Message copied',
                    })

                    break
                }

                case MessageMenuActions.Edit: {
                    modal.promptModal({
                        title: 'Edit message',
                        type: 'textarea',
                        prompt: 'Input new message content',
                        defaultValue: message.content,
                        onOk(value) {
                            sess.updateMessage(messageId, () => value)
                            toast({
                                type: 'success',
                                content: 'Message updated',
                            })
                        },
                    })
                    break
                }

                case MessageMenuActions.Delete: {
                    sess.deleteMessage(messageId)
                    toast({
                        type: 'success',
                        content: 'Message deleted',
                    })
                    break
                }

                case MessageMenuActions.InsertContextDelimiterAbove: {
                    sess.insertMessage({
                        message: {
                            id: 'context-delimiter',
                            content: '---',
                            isUser: true,
                            avatar: '',
                        },
                        beforeMessageId: messageId,
                    })
                    break
                }

                case MessageMenuActions.InsertContextDelimiterBelow: {
                    sess.insertMessage({
                        message: {
                            id: 'context-delimiter',
                            content: '---',
                            isUser: true,
                            avatar: '',
                        },
                        afterMessageId: messageId,
                    })
                    break
                }

                case MessageMenuActions.ClearMessagesAbove: {
                    sess.clearMessageBefore(messageId)
                    break
                }

                case MessageMenuActions.ClearMessagesBelow: {
                    sess.clearMessageAfter(messageId)
                    break
                }
            }
        },
        [copy, error, modal, sess, toast],
    )

    return handleAction
}

export interface MessageListProps {
    sessionId: string
    messages: ChatMessage[]
}

export const MessageList: React.FC<MessageListProps> = ({
    sessionId,
    messages,
}) => {
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleMessageMenuAction = useMessageMenuActionHandler(sessionId)

    return (
        <div className="messages nodrag">
            {messages.map((message) => (
                <Message
                    key={message.id}
                    message={message}
                    isUser={message.isUser}
                    onAction={handleMessageMenuAction}
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
                <Send fontSize="small" /> <div className="pl-2 mt-1">Send</div>
            </Button>
        </div>
    )
}
