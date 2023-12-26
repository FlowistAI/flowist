import { BotSettings } from '../../states/bot.type'
import { LLMProvider, LLMProviders } from '../../states/settings/settings.type'
import { OpenAIService } from './open-ai.service'
import { LLMService } from './llm-service.types'
import { GoogleAIService } from './google-ai.service'

// eslint-disable-next-line @typescript-eslint/no-explicit-any

export const createLLMService: <T extends LLMProvider>(
    botSettings: BotSettings<T>,
    corsProxy?: string,
) => LLMService = (botSettings, corsProxy) => {
    const type = botSettings.serviceSource.type

    if (type === LLMProviders.GoogleAI) {
        return new GoogleAIService(botSettings as BotSettings<'GoogleAI'>)
    }

    if (type === LLMProviders.OpenAI) {
        return new OpenAIService(
            botSettings as BotSettings<'OpenAI'>,
            corsProxy,
        )
    }

    throw new Error(`LLM provider ${type} not supported`)
}
