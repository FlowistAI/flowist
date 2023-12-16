import { Handle, NodeResizer, Position } from 'reactflow';
import { XIcon } from '@primer/octicons-react';
import './ChatBoxNode.css';
import Chat from './Chat';
import { useState } from 'react';
import { ChatNodeData } from '../types/chat-types';
import { chatSessionsState } from '../states/chat-states';
import { useRecoilValue } from 'recoil';
import { useNodeManager } from '../hooks/NodeManager';
import { ChatBoxDropDownMenu } from './ChatBoxDropdownMenu';
import { Invalid } from './Invalid';

export type ChatBoxNodeProps = {
    data: ChatNodeData
    selected: boolean
};

const handleStyle = { left: 10 };

export function ChatBoxNode({ data, selected }: ChatBoxNodeProps) {
    const { id } = data
    const { removeNode } = useNodeManager()
    const session = useRecoilValue(chatSessionsState).find(session => session.id === id);

    const initMessages = [
        {
            avatar: 'chatgpt3.png',
            content: 'Hello',
            isOwn: false,
        },
        {
            avatar: 'user-avatar.jpg',
            content: 'Hi there!',
            isOwn: true,
        },
    ];

    const [messages, setMessages] = useState(initMessages);

    const handleSendMessage = (message: string) => {
        const newMessage = {
            avatar: 'user-avatar.jpg',
            content: message,
            isOwn: true,
        };
        setMessages([...messages, newMessage]);
    };

    if (!session) {
        console.error('session not found', id)
        return <Invalid />
    }
    const { bot, user } = session

    return (
        <div className="chat-box" onContextMenu={e => {
            e.preventDefault()
            e.stopPropagation()

            return true
        }}>
            <NodeResizer minWidth={300} minHeight={200} isVisible={selected} />
            <Handle type="target" position={Position.Top} />
            <div className="chat-box__header">
                <ChatBoxDropDownMenu sessionId={session.id} />

                <span className="chat-box__title">{session.bot.name ?? "Chat"}</span>
                <button className="chat-box__close" onClick={() => removeNode(data.id)}>
                    <span>
                        <XIcon size={16} />
                    </span>
                </button>
            </div>
            <div className="chat-box__content nowheel cursor-default" >
                <Chat user={user} bot={bot} messages={messages} onSendMessage={handleSendMessage} />
            </div>
            <Handle type="source" position={Position.Bottom} id="a" />
            <Handle
                type="source"
                position={Position.Bottom}
                id="b"
                style={handleStyle}
            />
        </div >
    );
}
