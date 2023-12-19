import { GoogleGenerativeAI } from '@google/generative-ai'
import { useState, useMemo, useCallback, useEffect } from 'react'
import { BotSettings } from '../../types/bot-types'

export type GoogleAIHook = {
    output: string
    query: (query: string) => Promise<void>
};

export type GoogleAIHookOptions = {
    botSettings: BotSettings
    onDone: (s: string) => void
};

export const useGoogleAI: (options: GoogleAIHookOptions) => GoogleAIHook = ({ botSettings, onDone }) => {
    const model = botSettings.model
    const apiKey = botSettings.serviceSource.apiKey
    const [output, setOutput] = useState('')
    const [streamEnded, setStreamEnded] = useState(false)
    // Initialize the AI model using useMemo so it's not recreated on every render
    const generativeModel = useMemo(() => {
        const genAIInstance = new GoogleGenerativeAI(apiKey)
        const generativeModel = genAIInstance.getGenerativeModel({ model })

        return generativeModel
    }, [apiKey, model])

    useEffect(() => {
        if (streamEnded) {
            onDone(output)
        }
    }, [onDone, output, streamEnded])

    // useCallback ensures that the same function is used unless dependencies change
    const query = useCallback(async (query: string) => {
        try {
            setOutput('')
            setStreamEnded(false)
            const { totalTokens } = await generativeModel.countTokens(query)
            console.log('totalTokens', totalTokens)

            const result = await generativeModel.generateContentStream([query])

            for await (const chunk of result.stream) {
                const chunkText = chunk.text()
                console.log(chunkText)
                setOutput((prev) => prev + chunkText)
            }

        } catch (error) {
            console.error('Error querying the model:', error)
        } finally {
            setStreamEnded(true)
        }
    }, [generativeModel])

    return { output, query }
}

export default useGoogleAI

export type HistoryMessage = {
    content: string
    isUser: boolean
};

export type GoogleAIChatHookOptions = {
    botSettings: BotSettings
    historyMessages: HistoryMessage[]
    onResponseChunk: (chunk: string) => void
    onDone: () => void
};

export type GoogleAIChatHook = {
    send: (msg: string) => Promise<void>
};

export const useGoogleAIChat: (options: GoogleAIChatHookOptions) => GoogleAIChatHook = ({ botSettings, historyMessages, onResponseChunk, onDone }) => {
    const model = botSettings.model
    const apiKey = botSettings.serviceSource.apiKey
    // Initialize the AI model using useMemo so it's not recreated on every render
    const generativeModel = useMemo(() => {
        const genAIInstance = new GoogleGenerativeAI(apiKey)
        const generativeModel = genAIInstance.getGenerativeModel({ model })

        return generativeModel
    }, [apiKey, model])

    const chat = useMemo(() => {
        return generativeModel.startChat({
            history: historyMessages.map(({ content: message, isUser }) => ({
                role: isUser ? 'user' : 'model',
                parts: message
            })),
            generationConfig: {}
        })

    }, [generativeModel, historyMessages])

    const send = useCallback(async (msg: string) => {
        try {
            const { totalTokens } = await generativeModel.countTokens(msg)
            console.log('totalTokens', totalTokens)

            const result = await chat.sendMessageStream(msg)

            for await (const chunk of result.stream) {
                const chunkText = chunk.text()
                console.log(chunkText)
                onResponseChunk(chunkText)
            }

            onDone()
        } catch (error) {
            console.error('Error querying the model:', error)
        }

    }, [chat, generativeModel, onDone, onResponseChunk])

    return { send }
}
