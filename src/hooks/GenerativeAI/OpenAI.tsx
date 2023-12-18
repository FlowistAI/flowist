import OpenAI from 'openai';
import { useState, useMemo, useCallback, useEffect } from 'react';

export type OpenAIHook = {
    output: string;
    query: (query: string) => Promise<void>;
};

export type OpenAIHookOptions = {
    apiKey: string;
    model: string,
    onDone: (s: string) => void;
};

export const useOpenAI: (options: OpenAIHookOptions) => OpenAIHook = ({ apiKey, model, onDone }) => {
    const [output, setOutput] = useState('');
    const [streamEnded, setStreamEnded] = useState(false);
    // Initialize the AI model using useMemo so it's not recreated on every render
    const client = useMemo(() => new OpenAI({ apiKey }), [apiKey]);

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
    apiKey: string;
    model: string
    historyMessages: HistoryMessage[];
    onResponseChunk: (chunk: string) => void;
    onDone: () => void;
};

export type OpenAIChatHook = {
    send: (msg: string) => Promise<void>;
};

export const useOpenAIChat: (options: OpenAIChatHookOptions) => OpenAIChatHook = ({ apiKey, model, historyMessages, onResponseChunk, onDone }) => {

    // Initialize the AI model using useMemo so it's not recreated on every render
    const client = useMemo(() => new OpenAI({ apiKey }), [apiKey]);


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
