import { BotSettings } from '../../states/bot.type'
import OpenAI from 'openai'
import {
    LLMService,
    QueryStreamOptions,
    ChatStreamOptions,
} from './llm-service.types'
import { joinUrl } from '../../util/misc.util'

function createBaseURL(endpoint: string, corsProxy?: string) {
    let url = joinUrl(endpoint, 'v1')
    if (corsProxy) {
        url = joinUrl(corsProxy, url)
    }

    return url
}

export class OpenAIService implements LLMService {
    constructor(
        private botSettings: BotSettings<'OpenAI'>,
        private corsProxy?: string,
    ) {}

    async queryStream(opts: QueryStreamOptions) {
        const { input, onChunk, onDone } = opts
        const model = this.botSettings.model
        const apiKey = this.botSettings.serviceSource.apiKey
        const baseURL = createBaseURL(
            this.botSettings.serviceSource.endpoint,
            this.corsProxy,
        )
        const client = new OpenAI({
            apiKey,
            baseURL,
            dangerouslyAllowBrowser: true,
        })

        const stream = await client.chat.completions.create({
            model,
            messages: [
                {
                    role: 'user',
                    content: input,
                },
            ],
            stream: true,
        })

        let concated = ''

        for await (const chunk of stream) {
            const chunkText = chunk.choices[0]?.delta?.content || ''
            concated += chunkText
            onChunk(chunkText)
        }

        onDone(concated)
    }

    async chatStream(opts: ChatStreamOptions) {
        const { input, historyMessages, onChunk, onDone } = opts

        const model = this.botSettings.model
        const apiKey = this.botSettings.serviceSource.apiKey
        const baseURL = createBaseURL(
            this.botSettings.serviceSource.endpoint,
            this.corsProxy,
        )
        console.log('baseURL')

        const client = new OpenAI({
            apiKey,
            baseURL,
            dangerouslyAllowBrowser: true,
        })

        const stream = await client.chat.completions.create({
            model,
            messages: [
                ...historyMessages.map(({ content, isUser }) => ({
                    role: isUser
                        ? 'user'
                        : ('assistant' as 'user' | 'assistant'),
                    content,
                })),
                {
                    role: 'user',
                    content: input,
                },
            ],
            stream: true,
        })

        let concated = ''

        for await (const chunk of stream) {
            const chunkText = chunk.choices[0]?.delta?.content || ''
            concated += chunkText
            onChunk(chunkText)
        }

        onDone(concated)
    }
}
