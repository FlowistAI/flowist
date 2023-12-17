import { SessionId, Bot, Participant } from "./bot-types";


export type ChatSession = {
    id: SessionId; // also as node id
    bot: Bot;
    user: Participant;
    messages: ChatMessage[];
};

export type ChatMessage = {
    avatar: string;
    content: string;
    isOwn: boolean;
};

export type ChatBotNodeData = {
    id: SessionId;
};


