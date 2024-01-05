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

export type TTSSettingsFormProps = {
    initialValues: TTSSection
    onSubmit: (values: TTSSection) => void
} & React.RefAttributes<SettingRefAttrs>

export const TTSSettingsForm: FC<TTSSettingsFormProps> = forwardRef(
    ({ initialValues, onSubmit }, refs) => {
        const formik = useFormik({
            initialValues,
            onSubmit,
        })

        useImperativeHandle(refs, () => ({
            save() {
                formik.submitForm()
            },
        }))

        return (
            <form onSubmit={formik.handleSubmit}>
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

                <Typography level="h4">{t('Custom TTS')}</Typography>

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
