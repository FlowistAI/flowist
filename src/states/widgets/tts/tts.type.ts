import { SessionId } from '../../bot.type'
import { TTSSettingsTypes } from '../../settings/settings.type'

export type TtsSession = {
    id: SessionId
    input: string
    output: string
}

export type TtsData = {
    id: SessionId
}

export const ttsProviderOptions = [
    {
        label: 'CustomAPI',
        value: TTSSettingsTypes.CustomAPI,
    },
    {
        label: 'Tencent Cloud TTS',
        value: TTSSettingsTypes.TencentTTS,
    },
] as const
