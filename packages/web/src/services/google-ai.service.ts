import { BotSettings } from "../types/bot-types";
import { LLMProviders } from "../hooks/Settings/types";
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ChatStreamOptions, QueryStreamOptions } from "./ai.types";
import { OpenAIService } from "./open-ai.service";
import { LLMService } from "./ai.types";
import { useMemo } from "react";
import { Optional } from "../types/types";

export class GoogleAIService implements LLMService {

    constructor(private botSettings: BotSettings) {
    }

    async queryStream(opts: QueryStreamOptions) {
        const { input, onChunk, onDone } = opts;
        const model = this.botSettings.model;
        const apiKey = this.botSettings.serviceSource.apiKey;
        const genAIInstance = new GoogleGenerativeAI(apiKey);
        const generativeModel = genAIInstance.getGenerativeModel({ model });

        const chat = generativeModel.startChat({
            history: [],
            generationConfig: {}
        });

        const { totalTokens } = await generativeModel.countTokens(input);
        console.log('totalTokens', totalTokens);

        const result = await chat.sendMessageStream(input);
        let concated = ""
        for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            concated += chunkText;
            onChunk(chunkText);
        }
        onDone(concated);
    }

    async chatStream(opts: ChatStreamOptions) {
        const { input, onChunk, onDone, historyMessages } = opts;

        const model = this.botSettings.model;
        const apiKey = this.botSettings.serviceSource.apiKey;
        const genAIInstance = new GoogleGenerativeAI(apiKey);
        const generativeModel = genAIInstance.getGenerativeModel({ model });

        const chat = generativeModel.startChat({
            history: historyMessages.map(({ content: message, isUser }) => ({
                role: isUser ? 'user' : 'model',
                parts: message
            })),
            generationConfig: {}
        });

        const { totalTokens } = await generativeModel.countTokens(input);
        console.log('totalTokens', totalTokens);

        const result = await chat.sendMessageStream(input);
        let concated = ""
        for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            concated += chunkText;
            onChunk(chunkText);
        }
        onDone(concated);
    }
}


export const useLLM: (botSettings?: BotSettings) => Optional<LLMService> = (botSettings) => {
    return useMemo(() => {
        if (!botSettings) {
            return undefined;
        }
        return botSettings.serviceSource.type === LLMProviders.GoogleGemini ? new GoogleAIService(botSettings) : new OpenAIService(botSettings)
    }, [botSettings]);
}
