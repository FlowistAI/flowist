import { BotSettings } from "../../types/bot-types";
import OpenAI from 'openai';
import { LLMService, QueryStreamOptions, ChatStreamOptions } from "./llm-service.types";

export class OpenAIService implements LLMService {

    constructor(private botSettings: BotSettings) {
    }

    async queryStream(opts: QueryStreamOptions) {
        const { input, onChunk, onDone } = opts;
        const model = this.botSettings.model
        const apiKey = this.botSettings.serviceSource.apiKey;
        const baseURL = this.botSettings.serviceSource.endpoint;
        const client = new OpenAI({ apiKey, baseURL, dangerouslyAllowBrowser: true })

        const stream = await client.chat.completions.create({
            model,
            messages: [{
                'role': 'user',
                'content': input,
            }],
            stream: true,
        });

        let concated = ""
        for await (const chunk of stream) {
            const chunkText = chunk.choices[0]?.delta?.content || '';
            concated += chunkText;
            onChunk(chunkText);
        }
        onDone(concated);
    }

    async chatStream(opts: ChatStreamOptions) {
        const { input, historyMessages, onChunk, onDone } = opts;

        const model = this.botSettings.model
        const apiKey = this.botSettings.serviceSource.apiKey;
        const baseURL = this.botSettings.serviceSource.endpoint;
        const client = new OpenAI({ apiKey, baseURL, dangerouslyAllowBrowser: true })

        const stream = await client.chat.completions.create({
            model,
            messages: [...historyMessages.map(({ content, isUser }) => ({
                role: isUser ? 'user' : 'assistant' as 'user' | 'assistant',
                content,
            })), {
                'role': 'user',
                'content': input,
            }],
            stream: true,
        });

        let concated = ""
        for await (const chunk of stream) {
            const chunkText = chunk.choices[0]?.delta?.content || '';
            concated += chunkText;
            onChunk(chunkText);
        }
        onDone(concated);
    }
}



