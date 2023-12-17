import React, { useRef, useEffect, useCallback } from 'react';
import './Chat.css';
import { Bot } from '../types/bot-types';
import { ChatMessage, ChatSession } from "../types/chat-node-types";
import { Button, Textarea, Tooltip } from '@mui/joy';
import { useSetRecoilState } from 'recoil';
import { addMessageFnCreater, chatSessionsState, updateMessageFnCreater } from '../states/chat-states';
import { useGoogleChatAI } from '../hooks/GenerativeAI/Google';
import { generateId } from '../util/id-generator';

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
    session: ChatSession
}

const Chat: React.FC<ChatProps> = ({ session }) => {
    const { bot, user, messages } = session;
    const setSessions = useSetRecoilState(chatSessionsState);
    const addMessage = addMessageFnCreater(setSessions);
    const updateMessage = updateMessageFnCreater(setSessions);
    const botMessageIdRef = useRef<string | undefined>();

    const { send } = useGoogleChatAI({
        apiKey: bot.settings.serviceSource.apiKey,
        model: bot.settings.model,
        historyMessages: messages,
        onResponseChunk: (chunk: string) => {
            const botMessageId = botMessageIdRef.current;
            if (!botMessageId) {
                console.error('botMessageId is undefined but onResponseChunk is called');
                return;
            }
            updateMessage(session.id, botMessageId, (prev) => prev + chunk);
        },
        onDone: () => {
            botMessageIdRef.current = undefined;
        }
    });

    const onSendMessage = useCallback(async (message: string) => {
        // add user message to the list
        addMessage(session.id, { id: generateId(), content: message, isUser: true, avatar: user.avatar });
        // add bot message to the list and store the id in the ref
        const id = generateId();
        botMessageIdRef.current = id;
        addMessage(session.id, { id, content: '', isUser: false, avatar: bot.avatar });
        // send message to the bot
        await send(message);
    }, [addMessage, bot.avatar, send, session.id, user.avatar]);

    return (
        <div className="chat">
            <BotInfo bot={bot} />
            <MessageList messages={messages} />
            <MessageInput onSendMessage={onSendMessage} />
        </div>
    );
};

export default Chat;
