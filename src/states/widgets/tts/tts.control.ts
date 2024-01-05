/* eslint-disable @typescript-eslint/no-explicit-any */

import { AddWidgetOptions } from '../../document.atom'
import { JotaiContext } from '../../index.type'
import { WidgetType, WidgetTypes } from '../widget.atom'
import { TtsData, ttsDataAtom, ttsSessionsAtom } from './tts'
import { TtsSession } from './tts.type'

export const TTSWidgetControl = {
    create(
        { set }: JotaiContext,
        id: string,
        options: AddWidgetOptions<WidgetType>,
    ) {
        console.assert(id)
        const session: TtsSession = {
            id,
            input: '',
            output: '',
        }

        set(ttsSessionsAtom, { type: 'add', session })

        return {
            id: id,
            type: WidgetTypes.TextToSpeech,
            position: options.data?.position ?? { x: 0, y: 0 },
            data: { id, ...options.data },
        }
    },
    destroy({ set }: JotaiContext, id: string) {
        set(ttsSessionsAtom, { type: 'remove', id })
    },
    snapshot({ get }: JotaiContext) {
        return get(ttsDataAtom)
    },
    restore({ set }: JotaiContext, data: TtsData) {
        set(ttsSessionsAtom, { type: 'restore', ...data })
    },
}
