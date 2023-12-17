import { atom } from 'recoil';
import { ChatSession } from "../types/chat-node-types";

export const chatSessionsState = atom<ChatSession[]>({
    key: 'chatSessionsState',
    default: [],
});
