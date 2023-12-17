import { SessionId, Bot, Participant } from "./bot-types";


export type QuerySession = {
    id: SessionId; // also as node id
    bot: Bot;
    user: Participant;
    input: string;
    output: string;
};

export type QueryBotNodeData = {
    id: SessionId;
};


