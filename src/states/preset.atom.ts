import { Getter, Setter, atom, useAtom } from 'jotai'
import { PresetData } from './widgets/widget.atom'
import { JotaiContext } from './index.type'
import { GoogleAIModelIds, LLMProviders } from './settings/settings.type'
import { GoogleGeminiOfficialServiceSource } from './bot.type'
import { atomWithStorage } from 'jotai/utils'
import { OptionalId } from '../types/types'
import { generateUUID } from '../util/id-generator'
import { useCallback } from 'react'

export const showPresetsSidebarAtom = atomWithStorage('presets-sidbar', false)

const initialPresets: PresetData[] = [
    {
        id: 'builtin-1',
        type: 'chat-bot',
        name: 'Demo',
        icon: 'google-ai.png',
        settings: {
            model: GoogleAIModelIds.GeminiPro,
            temperature: 0.7,
            maxTokens: 0,
            prompt: '',
            provider: LLMProviders.GoogleAI,
            serviceSource: GoogleGeminiOfficialServiceSource,
        },
    },
]

const _presetsAtom = atom<PresetData[]>(initialPresets)

export type WritePresetsAction =
    | {
          type: 'add'
          //   make id optional
          preset: OptionalId<PresetData>
      }
    | { type: 'remove'; id: string }

export type ReadPresetsAction = { type: 'list'; query?: string }

type Dispatch = <T extends WritePresetsAction>(
    action: T,
) => WriteActionResultMapping[T['type']]

export const usePresets = () => {
    const [state, dispatch] = useAtom(presetsAtom)

    return {
        state,
        select: {
            list: useCallback(
                (query?: string) => {
                    return readList(state, query ?? '')
                },
                [state],
            ),
            byId: useCallback(
                (id: string) => {
                    return state.find((p) => p.id === id)
                },
                [state],
            ),
        },
        dispatch: dispatch as Dispatch,
    }
}

type WriteActionResultMapping = {
    add: ReturnType<typeof handleAddPreset>
    remove: ReturnType<typeof handleRemovePreset>
}

export const presetsAtom = atom(
    (get) => get(_presetsAtom),
    // (get, set, action: PresetsAction) => {
    <T extends WritePresetsAction>(
        get: Getter,
        set: Setter,
        action: T,
    ): WriteActionResultMapping[T['type']] => {
        console.log('presetsAtom action', action)

        const ctx = { get, set }
        if (action.type === 'add') {
            return handleAddPreset(
                ctx,
                action.preset,
            ) as WriteActionResultMapping[T['type']]
        } else if (action.type === 'remove') {
            return handleRemovePreset(
                ctx,
                action.id,
            ) as WriteActionResultMapping[T['type']]
        }

        throw new Error(`Unknown action type ${action}`)
    },
)

const handleAddPreset = (ctx: JotaiContext, preset: OptionalId<PresetData>) => {
    const { get, set } = ctx
    const presets = get(_presetsAtom)

    if (presets.some((p: PresetData) => p.id === preset.id)) {
        throw new Error(`Preset with id ${preset.id} already exists`)
    }

    const presetWithId = {
        ...preset,
        id: preset.id ?? generateUUID(),
    } as PresetData

    set(_presetsAtom, [...presets, presetWithId])
}

const handleRemovePreset = (ctx: JotaiContext, id: string) => {
    const { get, set } = ctx
    const presets = get(_presetsAtom)

    set(
        _presetsAtom,
        presets.filter((p) => p.id !== id),
    )
}

const readList = (state: PresetData[], query: string) => {
    return state.filter((p: PresetData) => {
        return (
            p.name.toLowerCase().includes(query) ||
            p.type.toLowerCase().includes(query)
        )
    })
}
