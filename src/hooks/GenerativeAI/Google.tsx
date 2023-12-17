import { GoogleGenerativeAI } from '@google/generative-ai';
import { useState, useMemo, useCallback } from 'react';

export type GoogleAIHook = {
    output: string;
    query: (query: string) => Promise<void>;
};

export type GoogleAIHookOptions = {
    apiKey: string;
    model: string
};

export const useGoogleAI: (options: GoogleAIHookOptions) => GoogleAIHook = ({ apiKey, model }) => {
    const [output, setOutput] = useState('');

    // Initialize the AI model using useMemo so it's not recreated on every render
    const generativeModel = useMemo(() => {
        const genAIInstance = new GoogleGenerativeAI(apiKey);
        const generativeModel = genAIInstance.getGenerativeModel({ model });
        return generativeModel;
    }, [apiKey, model]);


    // useCallback ensures that the same function is used unless dependencies change
    const query = useCallback(async (query: string) => {
        try {
            setOutput('');
            const { totalTokens } = await generativeModel.countTokens(query);
            console.log('totalTokens', totalTokens);

            const result = await generativeModel.generateContentStream([query]);
            for await (const chunk of result.stream) {
                const chunkText = chunk.text();
                console.log(chunkText);
                setOutput((prev) => prev + chunkText);
            }
        } catch (error) {
            console.error('Error querying the model:', error);
        }
    }, [generativeModel]);

    return { output, query };
};

export default useGoogleAI;

export type HistoryMessage = {
    content: string;
    isUser: boolean;
};

export type GoogleChatAIHookOptions = {
    apiKey: string;
    model: string
    historyMessages: HistoryMessage[];
    onResponseChunk: (chunk: string) => void;
    onDone: () => void;
};

export type GoogleChatAIHook = {
    send: (msg: string) => Promise<void>;
};

export const useGoogleChatAI: (options: GoogleChatAIHookOptions) => GoogleChatAIHook = ({ apiKey, model, historyMessages, onResponseChunk, onDone }) => {

    // Initialize the AI model using useMemo so it's not recreated on every render
    const generativeModel = useMemo(() => {
        const genAIInstance = new GoogleGenerativeAI(apiKey);
        const generativeModel = genAIInstance.getGenerativeModel({ model });
        return generativeModel;
    }, [apiKey, model]);

    const chat = useMemo(() => {
        return generativeModel.startChat({
            history: historyMessages.map(({ content: message, isUser }) => ({
                role: isUser ? 'user' : 'model',
                parts: message
            })),
            generationConfig: {}
        });

    }, [generativeModel, historyMessages])

    const send = useCallback(async (msg: string) => {
        try {
            const { totalTokens } = await generativeModel.countTokens(msg);
            console.log('totalTokens', totalTokens);

            const result = await chat.sendMessageStream(msg);
            for await (const chunk of result.stream) {
                const chunkText = chunk.text();
                console.log(chunkText);
                onResponseChunk(chunkText);
            }
            onDone();
        } catch (error) {
            console.error('Error querying the model:', error);
        }

    }, [chat, generativeModel, onDone, onResponseChunk]);

    return { send };
}
