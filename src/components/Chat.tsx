import './Chat.css';
import React, { useRef, useEffect } from 'react';
import { Bot } from '../types/bot-types';
import { ChatMessage } from "../types/chat-node-types";
import { Button, Textarea, Tooltip } from '@mui/joy';

export interface AvatarProps {
    src: string;
    show?: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({ src, show = true }) => (
    show ? <img src={src} alt="Profile" className="avatar" />
        : <div className="avatar" />
);

export interface BotInfoProps {
    bot: Bot;
}

export const BotInfo: React.FC<BotInfoProps> = ({ bot }) => (
    <div className="user-info">
        <Avatar src={bot.avatar} />
        <div className='flex-1'>
            <div className="user-name">{bot.name}</div>
            <div className="user-role">{bot.settings.model}</div>
        </div>
        <Tooltip title={
            <div>
                <div>Model: {bot.settings.model}</div>
                <div>Max Tokens: {bot.settings.maxTokens}</div>
                <div>Temperature: {bot.settings.temperature}</div>
                <div>Prompt: {bot.settings.prompt}</div>
            </div>
        } arrow placement="right">
            <span className='px-2'>...</span>
        </Tooltip>
    </div>
);

export interface MessageProps {
    message: ChatMessage;
    isUser: boolean;
}

export const Message: React.FC<MessageProps> = ({ message, isUser }) => (
    <div className={`message max-w-full ${isUser ? 'own' : ''}`}>
        <Avatar show={!isUser} src={message.avatar} />
        <div className="message-content min-w-0">{message.content}</div>
        <Avatar show={isUser} src={message.avatar} />
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
                <Message key={index} message={message} isUser={message.isUser} />
            ))}
            <div ref={messagesEndRef} />
        </div>
    );
};

export interface MessageInputProps {
    onSendMessage?: (message: string) => void;
    input?: string;
    setInput?: (input: string) => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, input: inputOut, setInput: setInputOut }) => {
    const [inputInner, setInputInner] = React.useState('');
    console.log('inputOut', inputOut, 'inputInner', inputInner);

    const realInput = inputOut ?? inputInner
    const realSetInput = setInputOut ?? setInputInner

    const handleSend = () => {
        console.log('send ', realInput);

        if (realInput.trim()) {
            onSendMessage?.(realInput);
            realSetInput('');
        }
    };

    return (
        <div className="message-input nodrag gap-2">
            <Textarea
                sx={{ flex: 1 }}
                placeholder="Write your message (Ctrl+Enter to submit)"
                maxRows={10}
                value={realInput}
                onChange={(e) => realSetInput(e.target.value)}
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

