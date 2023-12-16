import React, { useRef, useEffect } from 'react';
import './Chat.css'; // 假设样式保存在 Chat.css 文件中

interface User {
    imgUrl: string;
    name: string;
    role: string;
}

interface Message {
    imgUrl: string;
    content: string;
    isOwn: boolean;
}

interface AvatarProps {
    src: string;
}

const Avatar: React.FC<AvatarProps> = ({ src }) => (
    <img src={src} alt="Profile" className="avatar" />
);

interface UserInfoProps {
    user: User;
}

const UserInfo: React.FC<UserInfoProps> = ({ user }) => (
    <div className="user-info">
        <Avatar src={user.imgUrl} />
        <div>
            <div className="user-name">{user.name}</div>
            <div className="user-role">{user.role}</div>
        </div>
    </div>
);

interface MessageProps {
    message: Message;
    isOwn: boolean;
}

const Message: React.FC<MessageProps> = ({ message, isOwn }) => (
    <div className={`message ${isOwn ? 'own' : ''}`}>
        {!isOwn && <Avatar src={message.imgUrl} />}
        <div className="message-content">{message.content}</div>
        {isOwn && <Avatar src={message.imgUrl} />}
    </div>
);

interface MessageListProps {
    messages: Message[];
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
        <div className="messages">
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
        <div className="message-input">
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
    user: User;
    messages: Message[];
    onSendMessage?: (message: string) => void;
}

const Chat: React.FC<ChatProps> = ({ user, messages, onSendMessage }) => (
    <div className="chat">
        <UserInfo user={user} />
        <MessageList messages={messages} />
        <MessageInput onSendMessage={onSendMessage} />
    </div>
);

export default Chat;
