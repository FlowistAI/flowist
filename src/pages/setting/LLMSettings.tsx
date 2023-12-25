import { useAtom } from 'jotai'
import { FC, forwardRef } from 'react'
import {
    llmDefaultPromptAtom,
    llmDefaultProviderAtom,
    llmProvidersAtom,
} from '../../states/settings/settings.atom'
import {
    LLMSection,
    llmSectionSchema,
} from '../../states/settings/settings.type'
import './LLMSettings.css'
import LLMSettingsForm from './LLMSettings.form'
import { SettingRefAttrs } from './SettingRefAttrs'

const ModelSettings: FC<React.RefAttributes<SettingRefAttrs>> = forwardRef(
    (_, ref) => {
        const [llmDefaultPrompt, setLlmDefaultPrompt] =
            useAtom(llmDefaultPromptAtom)
        const [llmDefaultProvider, setLlmDefaultProvider] = useAtom(
            llmDefaultProviderAtom,
        )
        const [llmProviders, setLlmProviders] = useAtom(llmProvidersAtom)

        const handleSubmit = (values: LLMSection) => {
            console.log('llm settings, submit', values)
            setLlmDefaultPrompt(values.defaultPrompt)
            setLlmDefaultProvider(values.defaultProvider)
            setLlmProviders(values.providers)
        }

        return (
            <LLMSettingsForm
                ref={ref}
                initialValues={{
                    defaultPrompt: llmDefaultPrompt,
                    defaultProvider: llmDefaultProvider,
                    providers: llmProviders,
                }}
                validationSchema={llmSectionSchema}
                onSubmit={handleSubmit}
            />
        )
    },
)

export default ModelSettings
