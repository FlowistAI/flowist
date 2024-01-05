import { FC, forwardRef, useImperativeHandle } from 'react'
import { useFormik } from 'formik'
import {
    Input,
    FormLabel,
    FormControl,
    Select,
    Option,
    Typography,
} from '@mui/joy'
import { TTSSection } from '../../states/settings/settings.type'
import { SettingRefAttrs } from './SettingRefAttrs'
import { t } from 'i18next'
import { ttsProviderOptions } from '../../states/widgets/tts/tts.type'
// import { atom, useAtom, useAtomValue } from 'jotai'
// import { createOpenAIBaseURL } from '../../services/llm-service/open-ai.service'
// import {
//     systemCorsProxyAtom,
//     systemCorsProxyEnabledAtom,
// } from '../../states/settings/settings.atom'

export type TTSSettingsFormProps = {
    initialValues: TTSSection
    onSubmit: (values: TTSSection) => void
} & React.RefAttributes<SettingRefAttrs>

// const balanceAtom = atom<string>('? / ?')

export const TTSSettingsForm: FC<TTSSettingsFormProps> = forwardRef(
    ({ initialValues, onSubmit }, refs) => {
        const formik = useFormik({
            enableReinitialize: true,
            initialValues,
            onSubmit,
        })

        console.log(initialValues, formik.values)

        useImperativeHandle(refs, () => ({
            save() {
                formik.submitForm()
            },
        }))

        // const [balance, setBalance] = useAtom(balanceAtom)

        // const corsProxy = useAtomValue(systemCorsProxyAtom)
        // const corsProxyEnabled = useAtomValue(systemCorsProxyEnabledAtom)

        // const handleQueryBalance = async () => {
        //     const endpoint = formik.values.providers.OpenAI.endpoint
        //     const baseURL = createOpenAIBaseURL(
        //         endpoint,
        //         corsProxyEnabled ? corsProxy : undefined,
        //         '',
        //     )
        //     const res = await fetch(
        //         `${baseURL}/dashboard/billing/credit_grants`,
        //         {
        //             headers: {
        //                 Authorization: `Bearer ${formik.values.providers.OpenAI.apiKey}`,
        //                 ContentType: 'application/json',
        //             },
        //         },
        //     )
        //     const data = (await res.json()) as {
        //         total_granted: string
        //         total_available: string
        //     }
        //     setBalance(
        //         `${data?.total_granted ?? 'error'} / ${
        //             data?.total_available ?? 'error'
        //         }`,
        //     )
        // }

        return (
            <form onSubmit={formik.handleSubmit}>
                <Typography level="h3">TTS</Typography>

                <FormControl>
                    <FormLabel id="default-provider-label">
                        {t('Default Provider')}
                    </FormLabel>
                    <Select
                        id="defaultProvider"
                        name="defaultProvider"
                        value={formik.values.defaultProvider}
                        onChange={(_, newValue) =>
                            formik.setFieldValue('defaultProvider', newValue)
                        }
                    >
                        {ttsProviderOptions.map((provider) => (
                            <Option key={provider.value} value={provider.value}>
                                {provider.label}
                            </Option>
                        ))}
                    </Select>
                </FormControl>

                <Typography level="h4" sx={{ marginTop: '2em' }}>
                    {t('OpenAI TTS')}
                </Typography>

                {/* query openai key balance */}
                {/* <div className="flex items-center justify-between">
                    <div>Balance: {balance}</div>
                    <Button
                        variant="soft"
                        color="primary"
                        onClick={handleQueryBalance}
                        sx={{ marginLeft: '20px' }}
                    >
                        {t('Query Balance')}
                    </Button>
                </div> */}

                <FormControl component="fieldset" style={{ marginTop: '20px' }}>
                    <FormLabel component="legend">{t('API Key')}</FormLabel>
                    <Input
                        fullWidth
                        id="apiKey"
                        name="providers.OpenAI.apiKey"
                        value={formik.values.providers?.OpenAI?.apiKey}
                        onChange={formik.handleChange}
                        error={Boolean(formik.errors.providers?.OpenAI?.apiKey)}
                    />
                    {formik.errors.providers?.OpenAI?.apiKey && (
                        <div className="text-red-500">
                            {formik.errors.providers.OpenAI.apiKey}
                        </div>
                    )}
                </FormControl>

                <FormControl component="fieldset" style={{ marginTop: '20px' }}>
                    <FormLabel component="legend">
                        {t('Endpoint URL')}
                    </FormLabel>
                    <Input
                        fullWidth
                        id="endpoint"
                        name="providers.OpenAI.endpoint"
                        value={formik.values.providers?.OpenAI?.endpoint}
                        onChange={formik.handleChange}
                        error={Boolean(
                            formik.errors.providers?.OpenAI?.endpoint,
                        )}
                    />
                    {formik.errors.providers?.OpenAI?.endpoint && (
                        <div className="text-red-500">
                            {formik.errors.providers.OpenAI.endpoint}
                        </div>
                    )}
                </FormControl>

                <FormControl component="fieldset" style={{ marginTop: '20px' }}>
                    <FormLabel component="legend">{t('Model Name')}</FormLabel>
                    <Select
                        id="model"
                        name="providers.OpenAI.model"
                        value={formik.values.providers?.OpenAI?.model}
                        onChange={(_, newValue) =>
                            formik.setFieldValue(
                                'providers.OpenAI.model',
                                newValue,
                            )
                        }
                    >
                        <Option value="tts-1">tts-1</Option>
                    </Select>
                </FormControl>

                <FormControl component="fieldset" style={{ marginTop: '20px' }}>
                    <FormLabel component="legend">{t('Voice Name')}</FormLabel>
                    <Select
                        id="voice"
                        name="providers.OpenAI.voice"
                        value={formik.values.providers?.OpenAI?.voice}
                        onChange={(_, newValue) =>
                            formik.setFieldValue(
                                'providers.OpenAI.voice',
                                newValue,
                            )
                        }
                    >
                        {[
                            'alloy',
                            'echo',
                            'fable',
                            'onyx',
                            'nova',
                            'shimmer',
                        ].map((voice) => (
                            <Option key={voice} value={voice}>
                                {voice}
                            </Option>
                        ))}
                    </Select>
                </FormControl>

                <FormControl component="fieldset" style={{ marginTop: '20px' }}>
                    <FormLabel>{t('Speed')}</FormLabel>
                    <Input
                        name="providers.OpenAI.speed"
                        type="number"
                        slotProps={{
                            input: {
                                min: 0.5,
                                max: 2.0,
                            },
                        }}
                        value={formik.values.providers.OpenAI.speed}
                        onChange={formik.handleChange}
                    />
                    {formik.errors.providers?.OpenAI?.speed && (
                        <div className="text-red-500">
                            {formik.errors.providers.OpenAI.speed}
                        </div>
                    )}
                </FormControl>

                <Typography level="h4" sx={{ marginTop: '2em' }}>
                    {t('Custom TTS')}
                </Typography>

                <FormControl component="fieldset" style={{ marginTop: '20px' }}>
                    <FormLabel component="legend">{t('URL')}</FormLabel>
                    <Input
                        fullWidth
                        id="url"
                        name="providers.CustomAPI.url"
                        value={formik.values.providers?.CustomAPI?.url}
                        onChange={(e) => {
                            e.target.value = e.target.value.replace(/\/+$/, '')
                            formik.handleChange(e)
                        }}
                        error={Boolean(formik.errors.providers?.CustomAPI?.url)}
                    />
                </FormControl>
                <FormControl>
                    <FormLabel>{t('Request Method')}</FormLabel>
                    <Select
                        id="method"
                        name="method"
                        value={formik.values.providers?.CustomAPI?.method}
                        onChange={(_, newValue) =>
                            formik.setFieldValue(
                                'providers.CustomAPI.method',
                                newValue,
                            )
                        }
                    >
                        <Option value="GET">GET</Option>
                        <Option value="POST">POST</Option>
                    </Select>
                </FormControl>

                <FormControl component="fieldset" style={{ marginTop: '20px' }}>
                    <FormLabel component="legend">
                        {t('Payload Field Name')}
                    </FormLabel>
                    <Input
                        fullWidth
                        id="fieldName"
                        name="fieldName"
                        value={formik.values.providers?.CustomAPI?.fieldName}
                        onChange={formik.handleChange}
                        error={Boolean(
                            formik.errors.providers?.CustomAPI?.fieldName,
                        )}
                    />
                </FormControl>
            </form>
        )
    },
)
