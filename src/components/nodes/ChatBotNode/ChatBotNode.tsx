import { XIcon } from '@primer/octicons-react'
import React, { useCallback, useEffect, useRef, useState } from 'react'

import { Handle, NodeResizer, Position } from 'reactflow'
import { sourceStyle, targetStyle } from '../../../constants/handle-styles'
import { useLLM as useLLMService } from '../../../services/llm-service/google-ai.service'
import { generateUUID } from '../../../util/id-generator'
import { BotInfo, MessageInput, MessageList } from '../../Chat'
import { ChatBotDropDownMenu } from './ChatBotDropdownMenu'

import { useCommunicate, useDocument } from '../../../states/document.atom'
import { useChatBot } from '../../../states/widgets/chat/chat.atom'
import { ChatBotNodeData } from '../../../states/widgets/chat/chat.type'
import './ChatBotNode.css'
import { Invalid } from '../../Invalid'

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
            console.log('node', sid, 'recevied input', value)
            setInput(value)
        })
    }, [sid, handleSignal])

    const onReplyDone = useCallback(
        (output: string) => {
            console.log('node', sid, 'reply done', output)
            signal?.('output', output)
        },
        [sid, signal],
    )

    const { dispatch, state } = useChatBot()
    // const session = dispatch({ type: 'getSession', sid: sid })
    const session = state.sessions.find((session) => session.id === sid)
    console.log(sid, state)

    const messages = dispatch({ type: 'getMessages', sid })
    const contextMessages = dispatch({ type: 'getContextMessages', sid })
    const botMessageIdRef = useRef<string | undefined>()
    const llmService = useLLMService(session?.bot.settings)
    const handleSend = useCallback(
        async (message: string) => {
            if (!message) {
                return
            }

            if (!session) {
                console.error('session is undefined')

                return
            }

            console.log('on send message', message)
            // add user message to the list
            dispatch({
                type: 'addMessage',
                sid,
                message: {
                    id: generateUUID(),
                    content: message,
                    isUser: true,
                    avatar: session.user.avatar,
                },
            })

            // do not send a delimiter
            if (message === '---') {
                return
            }

            // add bot message to the list and store the id in the ref
            const id = generateUUID()
            botMessageIdRef.current = id
            dispatch({
                type: 'addMessage',
                sid,
                message: {
                    id,
                    content: '',
                    isUser: false,
                    avatar: session.bot.avatar,
                },
            })

            // send message to the bot
            await llmService?.chatStream({
                input: message,
                historyMessages: contextMessages,
                onChunk: (chunk: string) => {
                    const botMessageId = botMessageIdRef.current

                    if (!botMessageId) {
                        console.error(
                            'botMessageId is undefined but onResponseChunk is called',
                        )

                        return
                    }

                    dispatch({
                        type: 'appendMessageText',
                        sid,
                        mid: botMessageId,
                        text: chunk,
                    })
                },
                onDone: (all: string) => {
                    onReplyDone(all)
                },
            })
        },
        [contextMessages, dispatch, llmService, onReplyDone, session, sid],
    )

    if (!session) {
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

    const handleClose = () => {
        setDocument({ type: 'remove-widget', id: sid })
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
