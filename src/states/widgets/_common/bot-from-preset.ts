import { Bot } from '../../bot.type'
import { PresetData } from '../widget.atom'

export const botFromPreset = (
    defaultBot: Bot,
    preset: (PresetData & { type: 'chat-bot' }) | undefined,
): Bot => {
    if (!preset) {
        return defaultBot
    }

    return {
        ...defaultBot,
        ...{
            name: preset.name,
            avatar: preset.icon ?? defaultBot.avatar,
        },
        settings: {
            ...defaultBot.settings,
            ...preset.settings,
        },
    }
}
