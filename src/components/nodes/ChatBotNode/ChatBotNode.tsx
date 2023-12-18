import { Handle, NodeResizer, Position } from 'reactflow';
import { XIcon } from '@primer/octicons-react';
import './ChatBotNode.css';
import { BotInfo, MessageInput, MessageList } from '../../Chat';
import { ChatBotNodeData } from "../../../types/chat-node-types";
import { addMessageFnCreater, chatSessionsState, updateMessageFnCreater, useChatSession, useChatSessions } from '../../../states/chat-states';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useNodeManager } from '../../../hooks/NodeManager';
import { ChatBotDropDownMenu } from './ChatBotDropdownMenu';
import { sourceStyle, targetStyle } from '../../../constants/handle-styles';
import { useCallback, useEffect, useRef, useState } from 'react';
import { generateUUID } from '../../../util/id-generator';
import { BotModelProviderType } from '../../../types/bot-types';
import { useLLM } from '../../../services/google-ai.service';

export type ChatBotNodeProps = {
    data: ChatBotNodeData
    selected: boolean
};

export function ChatBotNode({ data, selected }: ChatBotNodeProps) {
    const { id } = data
    const { removeNode, getCommunicationNode } = useNodeManager()
    const { signal, handle } = getCommunicationNode(id)
    const [input, setInput] = useState<string>('')

    useEffect(() => {
        return handle('input', (value: string) => {
            console.log('node', id, 'recevied input', value);
            setInput(value)
        })
    }, [id, handle])

    const onReplyDone = (output: string) => {
        console.log('node', id, 'reply done', output);
        signal('output', output)
    }

    const { session, addMessage, updateMessage, messages } = useChatSession(id)
    const botMessageIdRef = useRef<string | undefined>();

    const llm = useLLM(session?.bot.settings);

    const handleSend = useCallback(async (message: string) => {
        if (!session) {
            console.error('session is undefined');
            return;
        }
        console.log('on send message', message);
        // add user message to the list
        addMessage({ id: generateUUID(), content: message, isUser: true, avatar: user.avatar });
        // add bot message to the list and store the id in the ref
        const id = generateUUID();
        botMessageIdRef.current = id;
        addMessage({ id, content: '', isUser: false, avatar: bot.avatar });
        // send message to the bot
        await llm?.chatStream({
            input: message,
            historyMessages: messages,
            onChunk: (chunk: string) => {
                const botMessageId = botMessageIdRef.current;
                if (!botMessageId) {
                    console.error('botMessageId is undefined but onResponseChunk is called');
                    return;
                }
                updateMessage(botMessageId, (prev) => prev + chunk);
            },
            onDone: () => {
                const msgId = botMessageIdRef.current;
                const msgContent = messages.find(msg => msg.id === msgId)?.content;
                botMessageIdRef.current = undefined;
                if (msgContent) {
                    onReplyDone?.(msgContent);
                }
            }
        })
    }, [session, addMessage, llm, messages, updateMessage, onReplyDone]);

    if (!session) {
        return null;
    }

    return (
        <div className="chat-bot" onContextMenu={e => {
            if (e.target !== e.currentTarget) {
                e.stopPropagation()
                return false
            }
            e.preventDefault()
            e.stopPropagation()
        }}>
            <NodeResizer minWidth={300} minHeight={200} isVisible={selected} />
            <Handle type="target" position={Position.Right} style={targetStyle} id="input">
                <div className='ml-2 pointer-events-none'>
                    Input
                </div>
            </Handle>
            <div className="chat-bot__header">
                <ChatBotDropDownMenu sessionId={session.id} />

                <span className="chat-bot__title">{session.bot.name ?? "Chat"}</span>
                <button className="chat-bot__close" onClick={() => removeNode(data.id)}>
                    <span>
                        <XIcon size={16} />
                    </span>
                </button>
            </div>
            <div className="chat-bot__content nowheel cursor-default" >
                <div className="chat">
                    <BotInfo bot={session.bot} />
                    <MessageList messages={messages} />
                    <MessageInput onSendMessage={handleSend} input={input} setInput={setInput} />
                </div>
            </div>
            <Handle type="source" position={Position.Left} style={sourceStyle} id="output">
                <div className='-ml-14 pointer-events-none'>
                    Output
                </div>
            </Handle>
        </div >
    );
}
