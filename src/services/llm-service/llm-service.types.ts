export type HistoryMessage = {
    content: string;
    isUser: boolean;
};

export type QueryStreamOptions = {
    input: string;
    onChunk: (chunk: string) => void;
    onDone: (output: string) => void;
};

export type ChatStreamOptions = {
    input: string;
    historyMessages: HistoryMessage[];
    onChunk: (chunk: string) => void;
    onDone: (output: string) => void;
};

export interface LLMService {
    queryStream(opts: QueryStreamOptions): Promise<void>;

    chatStream(opts: ChatStreamOptions): Promise<void>;
}

