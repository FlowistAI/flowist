import React, { useRef, useEffect } from 'react';
import './Chat.css';
import { Participant, Bot } from '../types/bot-types';
import { ChatMessage } from "../types/chat-node-types";
import { Button, Textarea } from '@mui/joy';

export interface AvatarProps {
    src: string;
}

export const Avatar: React.FC<AvatarProps> = ({ src }) => (
    <img src={src} alt="Profile" className="avatar" />
);

export interface BotInfoProps {
    bot: Bot;
}

export const BotInfo: React.FC<BotInfoProps> = ({ bot: user }) => (
    <div className="user-info">
        <Avatar src={user.avatar} />
        <div>
            <div className="user-name">{user.name}</div>
            <div className="user-role">{user.settings.model}</div>
        </div>
    </div>
);

export interface MessageProps {
    message: ChatMessage;
    isOwn: boolean;
}

export const Message: React.FC<MessageProps> = ({ message, isOwn }) => (
    <div className={`message ${isOwn ? 'own' : ''}`}>
        {!isOwn && <Avatar src={message.avatar} />}
        <div className="message-content">{message.content}</div>
        {isOwn && <Avatar src={message.avatar} />}
    </div>
);

export interface MessageListProps {
    messages: ChatMessage[];
}

export const MessageList: React.FC<MessageListProps> = ({ messages }) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div className="messages nodrag">
            {messages.map((message, index) => (
                <Message key={index} message={message} isOwn={message.isOwn} />
            ))}
            <div ref={messagesEndRef} />
        </div>
    );
};

export interface MessageInputProps {
    onSendMessage?: (message: string) => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
    const [input, setInput] = React.useState('');

    const handleSend = () => {
        if (input.trim()) {
            onSendMessage?.(input);
            setInput('');
        }
    };

    return (
        <div className="message-input nodrag gap-2">
            <Textarea
                sx={{ flex: 1 }}
                placeholder="Write your message (Ctrl+Enter to submit)"
                maxRows={10}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyUp={(e) => {
                    // ctrl + enter
                    if (e.ctrlKey && e.key === 'Enter') {
                        handleSend();
                    }
                }}
            />
            <Button color="primary" onClick={handleSend}>
                Send
            </Button>
        </div>
    );
};

export interface ChatProps {
    user: Participant;
    bot: Bot;
    messages: ChatMessage[];
    onSendMessage?: (message: string) => void;
}

const Chat: React.FC<ChatProps> = ({ bot, messages, onSendMessage }) => (
    <div className="chat">
        <BotInfo bot={bot} />
        <MessageList messages={messages} />
        <MessageInput onSendMessage={onSendMessage} />
    </div>
);

export default Chat;
