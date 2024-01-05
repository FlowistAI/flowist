import { atom, useSetAtom } from 'jotai'
import { LLMProvider } from './settings.type'
import {
    SupportedLang,
    Theme,
    LLMProviderSettings,
    TTSProvider,
    TTSProviderSettings,
    SettingsData,
} from './settings.type'
import { atomWithStorage } from 'jotai/utils'
import { Getter } from 'jotai/vanilla'

/**
 * System section
 */

export const systemNameAtom = atomWithStorage<string>(
    'systemName',
    'Flowist AI',
)

export const systemLanguageAtom = atomWithStorage<SupportedLang>(
    'systemLanguage',
    'en',
)

export const systemThemeAtom = atomWithStorage<Theme>('systemTheme', 'light')

export const systemAutoSaveAtom = atomWithStorage<boolean>(
    'systemAutoSave',
    true,
)

export const systemCorsProxyAtom = atomWithStorage<string>(
    'systemCorsProxy',
    'https://api-proxy.neuflow.net',
)

export const systemCorsProxyEnabledAtom = atomWithStorage<boolean>(
    'systemCorsProxyEnabled',
    true,
)

export const getCorsProxyIfEnabled = (get: Getter) => {
    const enabled = get(systemCorsProxyEnabledAtom)
    const proxy = get(systemCorsProxyAtom)

    return enabled ? proxy : undefined
}

/**
 * LLM section
 */

export const llmDefaultPromptAtom = atomWithStorage<string>(
    'llmDefaultPrompt',
    '',
)

export const llmDefaultProviderAtom = atomWithStorage<LLMProvider>(
    'llmDefaultProvider',
    'OpenAI',
)

export const llmProvidersAtom = atomWithStorage<LLMProviderSettings>(
    'llmProviders',
    {
        OpenAI: {
            label: 'OpenAI',
            endpoint: 'https://play-proxy.flowist.net',
            apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
            model: 'gpt-3.5-turbo',
            temperature: 0.9,
            prompt: '',
            maxTokens: 0,
        },
        GoogleAI: {
            label: 'Google AI',
            apiKey: import.meta.env.VITE_GOOGLE_AI_API_KEY || '',
            model: 'gemini-pro',
            temperature: 0.9,
            prompt: '',
            maxTokens: 0,
        },
    },
)

/**
 * TTS section
 */

export const ttsDefaultProviderAtom = atomWithStorage<TTSProvider>(
    'ttsDefaultProvider',
    'CustomAPI',
)

export const ttsProvidersAtom = atomWithStorage<TTSProviderSettings>(
    'ttsProviders',
    {
        OpenAI: {
            endpoint: 'https://api.openai.com',
            apiKey: '',
            model: 'tts-1',
            voice: 'alloy',
            speed: 1,
        },
        TencentTTS: {
            appId: '',
            secretId: '',
            secretKey: '',
        },
        CustomAPI: {
            url: '',
            method: 'POST',
            fieldName: 'text',
        },
    },
)

export const versionAtom = atom<string>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    () => (globalThis as any).__APP_VERSION__,
)

export const appSettingAtom = atom<SettingsData>((get) => ({
    system: {
        name: get(systemNameAtom),
        language: get(systemLanguageAtom),
        theme: get(systemThemeAtom),
        autoSave: get(systemAutoSaveAtom),
        corsProxy: get(systemCorsProxyAtom),
        corsProxyEnabled: get(systemCorsProxyEnabledAtom),
    },
    llm: {
        defaultPrompt: get(llmDefaultPromptAtom),
        defaultProvider: get(llmDefaultProviderAtom),
        providers: get(llmProvidersAtom),
    },
    tts: {
        defaultProvider: get(ttsDefaultProviderAtom),
        providers: get(ttsProvidersAtom),
    },
    about: {
        version: get(versionAtom),
    },
    plugin: {
        enabled: false,
    },
}))

export const settingsModalOpenAtom = atomWithStorage<boolean>(
    'settingsModalOpen',
    false,
)

export const useSettingsModal = () => {
    const setOpen = useSetAtom(settingsModalOpenAtom)

    return {
        open: () => setOpen(true),
    }
}
