import React, { useRef, useEffect } from 'react';
import './Chat.css';
import { Participant, ChatMessage, Bot } from '../types/chat-types';

interface AvatarProps {
    src: string;
}

const Avatar: React.FC<AvatarProps> = ({ src }) => (
    <img src={src} alt="Profile" className="avatar" />
);

interface BotInfoProps {
    bot: Bot;
}

const BotInfo: React.FC<BotInfoProps> = ({ bot: user }) => (
    <div className="user-info">
        <Avatar src={user.avatar} />
        <div>
            <div className="user-name">{user.name}</div>
            <div className="user-role">{user.settings.model}</div>
        </div>
    </div>
);

interface MessageProps {
    message: ChatMessage;
    isOwn: boolean;
}

const Message: React.FC<MessageProps> = ({ message, isOwn }) => (
    <div className={`message ${isOwn ? 'own' : ''}`}>
        {!isOwn && <Avatar src={message.avatar} />}
        <div className="message-content">{message.content}</div>
        {isOwn && <Avatar src={message.avatar} />}
    </div>
);

interface MessageListProps {
    messages: ChatMessage[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
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

interface MessageInputProps {
    onSendMessage?: (message: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
    const [input, setInput] = React.useState('');

    const handleSend = () => {
        if (input.trim()) {
            onSendMessage?.(input);
            setInput('');
        }
    };

    return (
        <div className="message-input nodrag">
            <input
                type="text"
                placeholder="Write your message!"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <button onClick={handleSend}>Send</button>
        </div>
    );
};

interface ChatProps {
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
