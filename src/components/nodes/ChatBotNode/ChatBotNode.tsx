import React, { useEffect, useRef, useState, useCallback } from 'react'
import { XIcon } from '@primer/octicons-react'

import { Handle, NodeResizer, Position } from 'reactflow'
import { BotInfo, MessageInput, MessageList } from '../../Chat'
import { ChatBotNodeData } from '../../../types/chat-node.types'
import { useChatSession } from '../../../states/chat-states'
import { useDocumentManager } from '../../../hooks/DocumentManager'
import { ChatBotDropDownMenu } from './ChatBotDropdownMenu'
import { sourceStyle, targetStyle } from '../../../constants/handle-styles'
import { generateUUID } from '../../../util/id-generator'
import { useLLM as useLLMService } from '../../../services/llm-service/google-ai.service'

import './ChatBotNode.css'
import { useCurrentCommunicationNode } from '../../../hooks/DocumentManager/useDocumentManager'
import { Invalid } from '../../Invalid'

export type ChatBotNodeProps = {
    data: ChatBotNodeData
    selected: boolean
}

export function ChatBotNode({ data, selected }: ChatBotNodeProps) {
    const { id } = data
    const { removeNode } = useDocumentManager()
    const { signal, handleSignal } = useCurrentCommunicationNode(id)
    const [input, setInput] = useState<string>('')

    useEffect(() => {
        return handleSignal?.('input', (value: string) => {
            console.log('node', id, 'recevied input', value)
            setInput(value)
        })
    }, [id, handleSignal])

    const onReplyDone = useCallback(
        (output: string) => {
            console.log('node', id, 'reply done', output)
            signal?.('output', output)
        },
        [id, signal],
    )

    const chat = useChatSession(id)

    const botMessageIdRef = useRef<string | undefined>()
    const llmService = useLLMService(chat.session?.bot.settings)
    const handleSend = useCallback(
        async (message: string) => {
            if (!message) {
                return
            }

            if (!chat.session) {
                console.error('session is undefined')

                return
            }

            console.log('on send message', message)
            // add user message to the list
            chat.addMessage({
                id: generateUUID(),
                content: message,
                isUser: true,
                avatar: chat.session.user.avatar,
            })

            // do not send a delimiter
            if (message === '---') {
                return
            }

            // add bot message to the list and store the id in the ref
            const id = generateUUID()
            botMessageIdRef.current = id
            chat.addMessage({
                id,
                content: '',
                isUser: false,
                avatar: chat.session.bot.avatar,
            })

            // send message to the bot
            await llmService?.chatStream({
                input: message,
                historyMessages: chat.contextMessages,
                onChunk: (chunk: string) => {
                    const botMessageId = botMessageIdRef.current

                    if (!botMessageId) {
                        console.error(
                            'botMessageId is undefined but onResponseChunk is called',
                        )

                        return
                    }

                    chat.updateMessage(botMessageId, (prev) => prev + chunk)
                },
                onDone: (all: string) => {
                    onReplyDone(all)
                },
            })
        },
        [chat, llmService, onReplyDone],
    )

    if (!chat.session) {
        return <Invalid />
    }

    const onContextMenu = (e: React.MouseEvent) => {
        if (e.target !== e.currentTarget) {
            e.stopPropagation()

            return false
        }

        e.preventDefault()
        e.stopPropagation()
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
                <ChatBotDropDownMenu sessionId={chat.session.id} />

                <span className="chat-bot__title">
                    {chat.session.bot.name ?? 'Chat'}
                </span>
                <button
                    className="chat-bot__close"
                    onClick={() => removeNode(data.id)}
                >
                    <span>
                        <XIcon size={16} />
                    </span>
                </button>
            </div>
            <div className="chat-bot__content nowheel cursor-default">
                <div className="chat">
                    <BotInfo bot={chat.session.bot} />
                    <MessageList
                        sessionId={chat.session.id}
                        messages={chat.rawMessages}
                    />
                    <MessageInput
                        onSendMessage={handleSend}
                        input={input}
                        setInput={setInput}
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
