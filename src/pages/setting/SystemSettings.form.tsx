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

export type SystemSettingsFormProps = {
    initialValues: SystemSection
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
                    <FormLabel component="legend">System Name</FormLabel>
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
                    <FormLabel component="legend">Theme</FormLabel>
                    <RadioGroup
                        aria-label="theme"
                        name="theme"
                        value={formik.values.theme}
                        onChange={formik.handleChange}
                    >
                        <Radio value="light" label="Light" />
                        <Radio value="dark" label="Dark" />
                    </RadioGroup>
                </FormControl>

                <FormControl component="fieldset" style={{ marginTop: '20px' }}>
                    <FormLabel component="legend">Auto Save</FormLabel>
                    <Checkbox
                        label="Auto Save"
                        checked={formik.values.autoSave}
                        onChange={(e) =>
                            formik.setFieldValue('autoSave', e.target.checked)
                        }
                        color="primary"
                    />
                </FormControl>
            </form>
        )
    },
)
