import { XIcon } from '@primer/octicons-react'
import React, { useCallback, useEffect, useState } from 'react'

import { Handle, NodeResizer, Position } from 'reactflow'
import { sourceStyle, targetStyle } from '../../../constants/handle-styles'
import { BotInfo, MessageList } from '../_common/Chat'
import { MessageInput } from '../_common/MessageInput'
import { ChatBotDropDownMenu } from './ChatBotDropdownMenu'

import { useCommunicate, useDocument } from '../../../states/document.atom'
import { useChatBot } from '../../../states/widgets/chat/chat.atom'
import { ChatBotNodeData } from '../../../states/widgets/chat/chat.type'
import './ChatBotNode.css'
import { Invalid } from '../../ui/Invalid'
import { useToast } from '../../../hooks/Toast/useToast'

export type ChatBotNodeProps = {
    data: ChatBotNodeData
    selected: boolean
}

export function ChatBotNode({ data, selected }: ChatBotNodeProps) {
    const { id: sid } = data
    const { dispatch: setDocument } = useDocument()
    const { signal, handleSignal } = useCommunicate(sid)
    const [input, setInput] = useState<string>('')

    useEffect(() => {
        return handleSignal?.('input', (value: string) => {
            setInput(value)
        })
    }, [sid, handleSignal])

    const onReplyDone = useCallback(
        (output: string) => {
            signal?.('output', output)
        },
        [signal],
    )

    const { dispatch } = useChatBot()
    const session = dispatch({ type: 'getSession', sid: sid })

    const messages = dispatch({ type: 'getMessages', sid })
    const sending = session?.sending ?? false
    const toast = useToast()
    const handleSend = () => {
        try {
            dispatch({ type: 'sendMessage', sid, content: input, onReplyDone })
        } catch (error) {
            toast({ type: 'error', content: (error as Error).message })
        }
    }

    if (!session) {
        return <Invalid />
    }

    const onContextMenu = (e: React.MouseEvent) => {
        console.log('cc')

        if (e.target !== e.currentTarget) {
            return false
        }

        e.preventDefault()
        e.stopPropagation()
    }

    const handleClose = () => {
        setDocument({ type: 'remove-widget', id: sid })
    }

    const allowClearAllMessages = !sending

    const handleClearAllMessages = () => {
        dispatch({ type: 'clearMessages', sid })
    }

    return (
        <div className="chat-bot" onContextMenu={onContextMenu}>
            <NodeResizer minWidth={300} minHeight={200} isVisible={selected} />
            <Handle
                type="target"
                position={Position.Right}
                style={targetStyle}
                id="input"
            >
                <div className="ml-2 pointer-events-none">Input</div>
            </Handle>
            <div className="chat-bot__header">
                <ChatBotDropDownMenu sessionId={session.id} />

                <span className="chat-bot__title">
                    {session.bot.name ?? 'Chat'}
                </span>
                <button className="chat-bot__close" onClick={handleClose}>
                    <span>
                        <XIcon size={16} />
                    </span>
                </button>
            </div>
            <div className="chat-bot__content nowheel cursor-default">
                <div className="chat">
                    <BotInfo bot={session.bot} />
                    <MessageList sid={session.id} messages={messages} />
                    <MessageInput
                        onSendMessage={handleSend}
                        allowSend={!sending}
                        onClear={handleClearAllMessages}
                        allowClear={allowClearAllMessages}
                        value={input}
                        onChange={setInput}
                    />
                </div>
            </div>
            <Handle
                type="source"
                position={Position.Left}
                style={sourceStyle}
                id="output"
            >
                <div className="-ml-14 pointer-events-none">Output</div>
            </Handle>
        </div>
    )
}
