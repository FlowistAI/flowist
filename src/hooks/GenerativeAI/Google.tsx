import { GoogleGenerativeAI } from '@google/generative-ai';
import { useState, useMemo, useCallback } from 'react';

export type GoogleAIHook = {
    output: string;
    onQuery: (query: string) => Promise<void>;
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
    const onQuery = useCallback(async (query: string) => {
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

    return { output, onQuery };
};

export default useGoogleAI;
