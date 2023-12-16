import { Handle, NodeResizer, Position } from 'reactflow';
import { GearIcon, XIcon } from '@primer/octicons-react';
import './ChatBoxNode.css';
import Chat from './Chat';
import { useState } from 'react';

export type ChatBoxNodeProps = {
    data: {
        title: string;
        content: string;
        onClose: () => void;
    };
};
const handleStyle = { left: 10 };

export function ChatBoxNode({ data, selected }: ChatBoxNodeProps) {
    const user = {
        imgUrl: 'user-avatar.jpg',
        name: 'John Doe',
        role: 'Admin',
    };

    const initMessages = [
        {
            imgUrl: 'user-avatar.jpg',
            content: 'Hello',
            isOwn: false,
        },
        {
            imgUrl: 'user-avatar.jpg',
            content: 'Hi there!',
            isOwn: true,
        },
    ];

    const [messages, setMessages] = useState(initMessages);

    const handleSendMessage = (message: string) => {
        const newMessage = {
            imgUrl: 'user-avatar.jpg',
            content: message,
            isOwn: true,
        };
        setMessages([...messages, newMessage]);
    };

    return (
        <div className="chat-box" onContextMenu={e => {
            e.preventDefault()
            e.stopPropagation()

            return true
        }}>
            <NodeResizer minWidth={300} minHeight={200} isVisible={selected} />
            <Handle type="target" position={Position.Top} />
            <div className="chat-box__header">
                <button className="chat-box__settings nodrag" onClick={() => {
                    console.log('setting')
                }
                }>
                    <GearIcon size={16} />
                </button>
                <span className="chat-box__title">{data.title ?? "Chat"}</span>
                <button className="chat-box__close" onClick={data.onClose}>
                    <span>
                        <XIcon size={16} />
                    </span>
                </button>
            </div>
            <div className="chat-box__content nodrag nowheel cursor-default" >
                <Chat user={user} messages={messages} onSendMessage={handleSendMessage} />
            </div>
            <Handle type="source" position={Position.Bottom} id="a" />
            <Handle
                type="source"
                position={Position.Bottom}
                id="b"
                style={handleStyle}
            />
        </div>
    );
}
