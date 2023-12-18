import OpenAI from 'openai';
import { useState, useMemo, useCallback, useEffect } from 'react';
import { BotSettings } from '../../types/bot-types';

export type OpenAIHook = {
    output: string;
    query: (query: string) => Promise<void>;
};

export type OpenAIHookOptions = {
    botSettings: BotSettings
    onDone: (s: string) => void;
};

export const useOpenAI: (options: OpenAIHookOptions) => OpenAIHook = ({ botSettings, onDone }) => {
    const model = botSettings.model
    const apiKey = botSettings.serviceSource.apiKey;
    const baseURL = botSettings.serviceSource.endpoint;
    const [output, setOutput] = useState('');
    const [streamEnded, setStreamEnded] = useState(false);
    // Initialize the AI model using useMemo so it's not recreated on every render
    const client = useMemo(() => new OpenAI({ apiKey, baseURL, dangerouslyAllowBrowser: true }), [apiKey, baseURL]);

    useEffect(() => {
        if (streamEnded) {
            onDone(output);
        }
    }, [onDone, output, streamEnded]);

    // useCallback ensures that the same function is used unless dependencies change
    const query = useCallback(async (query: string) => {
        try {
            setOutput('');
            setStreamEnded(false);
            const stream = await client.chat.completions.create({
                model,
                messages: [{
                    'role': 'user',
                    'content': query,
                }],
                stream: true,
            });

            for await (const chunk of stream) {
                const chunkText = chunk.choices[0]?.delta?.content || '';
                console.log(chunkText);
                setOutput((prev) => prev + chunkText);
            }

        } catch (error) {
            console.error('Error querying the model:', error);
        } finally {
            setStreamEnded(true)
        }
    }, [client.chat.completions, model]);

    return { output, query };
};

export default useOpenAI;

export type HistoryMessage = {
    content: string;
    isUser: boolean;
};

export type OpenAIChatHookOptions = {
    botSettings: BotSettings
    historyMessages: HistoryMessage[];
    onResponseChunk: (chunk: string) => void;
    onDone: () => void;
};

export type OpenAIChatHook = {
    send: (msg: string) => Promise<void>;
};

export const useOpenAIChat: (options: OpenAIChatHookOptions) => OpenAIChatHook = ({ botSettings, historyMessages, onResponseChunk, onDone }) => {
    const model = botSettings.model
    const apiKey = botSettings.serviceSource.apiKey;
    const baseURL = botSettings.serviceSource.endpoint;
    const client = useMemo(() => new OpenAI({ apiKey, baseURL, dangerouslyAllowBrowser: true }), [apiKey, baseURL]);

    const send = useCallback(async (msg: string) => {
        try {
            const stream = await client.chat.completions.create({
                model,
                messages: [...historyMessages.map(({ content, isUser }) => ({
                    role: isUser ? 'user' : 'assistant' as 'user' | 'assistant',
                    content,
                })), {
                    'role': 'user',
                    'content': msg,
                }],
                stream: true,
            });

            for await (const chunk of stream) {
                const chunkText = chunk.choices[0]?.delta?.content || '';
                console.log(chunkText);
                onResponseChunk(chunkText);
            }
            onDone();
        } catch (error) {
            console.error('Error querying the model:', error);
        }

    }, [client.chat.completions, historyMessages, model, onDone, onResponseChunk]);

    return { send };
}
