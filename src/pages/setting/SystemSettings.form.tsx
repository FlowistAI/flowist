import { FC, forwardRef, useImperativeHandle } from 'react'
import { useFormik } from 'formik'
import {
    Input,
    Radio,
    RadioGroup,
    FormLabel,
    FormControl,
    Checkbox,
} from '@mui/joy'
import { SystemSection } from '../../states/settings/settings.type'
import { SettingRefAttrs } from './SettingRefAttrs'
import { t } from 'i18next'

export type SystemSettingsFormProps = {
    initialValues: SystemSection
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    validationSchema: any
    onSubmit: (values: SystemSection) => void
} & React.RefAttributes<SettingRefAttrs>

export const SystemSettingsForm: FC<SystemSettingsFormProps> = forwardRef(
    ({ initialValues, validationSchema, onSubmit }, refs) => {
        const formik = useFormik({
            initialValues,
            validationSchema,
            onSubmit,
        })

        useImperativeHandle(refs, () => ({
            save() {
                formik.handleSubmit()
            },
        }))

        return (
            <form onSubmit={formik.handleSubmit}>
                <FormControl component="fieldset" style={{ marginTop: '20px' }}>
                    <FormLabel component="legend">{t('System Name')}</FormLabel>
                    <Input
                        fullWidth
                        id="name"
                        name="name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        error={
                            formik.touched.name && Boolean(formik.errors.name)
                        }
                    />
                </FormControl>

                <FormControl component="fieldset" style={{ marginTop: '20px' }}>
                    <FormLabel component="legend">Language</FormLabel>
                    <RadioGroup
                        aria-label="language"
                        name="language"
                        value={formik.values.language}
                        onChange={formik.handleChange}
                    >
                        <Radio value="zh-CN" label="简体中文" />
                        <Radio value="en" label="English" />
                        <Radio value="fr" label="French" />
                        <Radio value="jp" label="Japanese" />
                    </RadioGroup>
                </FormControl>

                <FormControl component="fieldset" style={{ marginTop: '20px' }}>
                    <FormLabel component="legend">{t('Theme')}</FormLabel>
                    <RadioGroup
                        aria-label="theme"
                        name="theme"
                        value={formik.values.theme}
                        onChange={formik.handleChange}
                    >
                        <Radio value="light" label={t('Light')} />
                        <Radio value="dark" label={t('Dark')} />
                    </RadioGroup>
                </FormControl>

                <FormControl component="fieldset" style={{ marginTop: '20px' }}>
                    <FormLabel component="legend">{t('Auto Save')}</FormLabel>
                    <Checkbox
                        label={t('Auto Save')}
                        checked={formik.values.autoSave}
                        onChange={(e) =>
                            formik.setFieldValue('autoSave', e.target.checked)
                        }
                        color="primary"
                    />
                </FormControl>
                <FormControl component="fieldset" style={{ marginTop: '20px' }}>
                    <FormLabel component="legend">{t('CORS Proxy')}</FormLabel>
                    <Input
                        fullWidth
                        id="corsProxy"
                        name="corsProxy"
                        value={formik.values.corsProxy}
                        onChange={formik.handleChange}
                        error={
                            formik.touched.corsProxy &&
                            Boolean(formik.errors.corsProxy)
                        }
                    />
                </FormControl>
                <FormControl component="fieldset" style={{ marginTop: '10px' }}>
                    <Checkbox
                        label={t('Enable CORS Proxy')}
                        checked={formik.values.corsProxyEnabled}
                        onChange={(e) =>
                            formik.setFieldValue(
                                'corsProxyEnabled',
                                e.target.checked,
                            )
                        }
                        color="primary"
                    />
                </FormControl>
            </form>
        )
    },
)
