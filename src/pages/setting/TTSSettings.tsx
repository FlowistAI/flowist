import { FC, forwardRef } from 'react'
import './TtsSettings.css'
import { useAtom } from 'jotai'
import { TTSSection } from '../../states/settings/settings.type'
import { SettingRefAttrs } from './SettingRefAttrs'
import { TTSSettingsForm } from './TTSSettings.form'
import {
    ttsDefaultProviderAtom,
    ttsProvidersAtom,
} from '../../states/settings/settings.atom'

const TTSSettings: FC<React.RefAttributes<SettingRefAttrs>> = forwardRef(
    (_, ref) => {
        const [ttsDefaultProvider, setTtsDefaultProvider] = useAtom(
            ttsDefaultProviderAtom,
        )

        const [ttsProviders, setTtsProviders] = useAtom(ttsProvidersAtom)

        const handleSave = (values: TTSSection) => {
            console.log('tts, save')
            setTtsDefaultProvider(values.defaultProvider)
            setTtsProviders(values.providers)
        }

        return (
            <div className="tts-settings">
                <TTSSettingsForm
                    ref={ref}
                    initialValues={{
                        defaultProvider: ttsDefaultProvider,
                        providers: ttsProviders,
                    }}
                    onSubmit={handleSave}
                />
            </div>
        )
    },
)

export default TTSSettings
