import { useFormik } from 'formik'
import { Input, Select, Button, FormControl, Option, Textarea } from '@mui/joy'

import { InputLabel } from '@mui/material'
import {
    botAvatarOptions,
    botModelOptions,
    llmProviderOptions,
    getDefaultModel,
    getInitialServiceSource,
} from '../../../states/bot.type'
import { LLMProvider } from '../../../states/settings/settings.type'
import { FC } from 'react'
import { produce } from 'immer'
import { BotWrapped } from '../../../states/widgets/chat/chat.type'
import { useTranslation } from 'react-i18next'

type Errors<T> = {
    [P in keyof T]?: T[P] extends object ? Errors<T[P]> : string
}

const validate = (values: BotWrapped) => {
    const errors: Errors<BotWrapped> = {}

    if (!values.bot.name) {
        errors.bot = { ...errors.bot, name: 'Bot Name is required' }
    }

    if (!Number.isInteger(values.bot.settings.maxTokens)) {
        errors.bot = {
            ...errors.bot,
            settings: {
                ...(errors.bot?.settings ?? {}),
                maxTokens: 'Max Tokens must be an integer',
            },
        }
    }

    console.log('errors', errors)

    return errors
}

export type BotSettingsFormProps = {
    initialValues: BotWrapped
    onSubmit: (values: BotWrapped) => void
}

const BotSettingsForm: FC<BotSettingsFormProps> = ({
    initialValues,
    onSubmit,
}) => {
    const formik = useFormik({
        initialValues,
        validate,
        onSubmit,
    })

    const { t } = useTranslation()

    return (
        <form onSubmit={formik.handleSubmit} className="flex flex-col">
            <FormControl>
                <InputLabel htmlFor="bot-name">{t('Name')}</InputLabel>
                <Input
                    id="bot-name"
                    name="bot.name"
                    value={formik.values.bot.name}
                    onChange={formik.handleChange}
                />
                {formik.errors.bot?.name && (
                    <div className="text-red-500">{formik.errors.bot.name}</div>
                )}
            </FormControl>

            <FormControl>
                <InputLabel htmlFor="bot-avatar">{t('Avatar')}</InputLabel>
                <Select
                    id="bot-avatar"
                    name="bot.avatar"
                    value={formik.values.bot.avatar}
                    onChange={(_, newValue) =>
                        formik.setFieldValue('bot.avatar', newValue)
                    }
                >
                    {botAvatarOptions.map((option) => (
                        <Option key={option.value} value={option.value}>
                            {option.label}
                        </Option>
                    ))}
                </Select>
            </FormControl>

            <FormControl>
                <InputLabel htmlFor="bot-provider">{t('Provider')}</InputLabel>
                <Select
                    id="bot-provider"
                    name="bot.settings.provider"
                    value={formik.values.bot.settings.provider}
                    onChange={(_, newValue) => {
                        if (!newValue) {
                            return
                        }

                        const newValues = produce(formik.values, (draft) => {
                            console.log('newValue', newValue)

                            draft.bot.settings.provider =
                                newValue as LLMProvider
                            draft.bot.settings.serviceSource =
                                getInitialServiceSource(newValue as LLMProvider)
                            draft.bot.settings.model = getDefaultModel(
                                newValue as LLMProvider,
                            )
                        })
                        formik.setValues(newValues)
                    }}
                >
                    {llmProviderOptions.map((option) => (
                        <Option key={option.value} value={option.value}>
                            {option.label}
                        </Option>
                    ))}
                </Select>
            </FormControl>

            <FormControl>
                <InputLabel htmlFor="bot-model">{t('Bot Model')}</InputLabel>
                <Select
                    id="bot-model"
                    name="bot.settings.model"
                    value={formik.values.bot.settings.model}
                    onChange={(_, newValue) =>
                        formik.setFieldValue('bot.settings.model', newValue)
                    }
                >
                    {botModelOptions[
                        formik.values.bot.settings.serviceSource.type
                    ].map((option) => (
                        <Option key={option.value} value={option.value}>
                            {option.label}
                        </Option>
                    ))}
                </Select>
            </FormControl>

            <FormControl>
                <InputLabel htmlFor="endpoint">{t('Endpoint')}</InputLabel>
                <Input
                    id="endpoint"
                    name="bot.settings.serviceSource.endpoint"
                    value={formik.values.bot.settings.serviceSource.endpoint}
                    onChange={formik.handleChange}
                />
            </FormControl>

            <FormControl>
                <InputLabel htmlFor="bot-key">{t('Key')}</InputLabel>
                <Input
                    id="bot-key"
                    name="bot.settings.serviceSource.apiKey"
                    value={formik.values.bot.settings.serviceSource.apiKey}
                    onChange={formik.handleChange}
                />
            </FormControl>

            <FormControl>
                <InputLabel htmlFor="bot-temperature">
                    {t('Temperature')}
                </InputLabel>
                <Input
                    id="bot-temperature"
                    name="bot.settings.temperature"
                    slotProps={{
                        input: {
                            min: 0,
                            max: 1,
                            step: 0.01,
                        },
                    }}
                    type="number"
                    value={formik.values.bot.settings.temperature}
                    onChange={formik.handleChange}
                />
            </FormControl>

            <FormControl>
                <InputLabel htmlFor="bot-prompt">{t('Prompt')}</InputLabel>
                <Textarea
                    id="bot-prompt"
                    minRows={2}
                    name="bot.settings.prompt"
                    value={formik.values.bot.settings.prompt}
                    onChange={formik.handleChange}
                />
                {formik.errors.bot?.settings?.prompt && (
                    <div className="text-red-500">
                        {formik.errors.bot.settings.prompt}
                    </div>
                )}
            </FormControl>

            <FormControl>
                <InputLabel htmlFor="bot-maxTokens">
                    {t('Max Tokens')}
                </InputLabel>
                <Input
                    id="bot-maxTokens"
                    name="bot.settings.maxTokens"
                    type="number"
                    value={formik.values.bot.settings.maxTokens}
                    onChange={formik.handleChange}
                />
                {formik.errors.bot?.settings?.maxTokens && (
                    <div className="text-red-500">
                        {formik.errors.bot.settings.maxTokens}
                    </div>
                )}
            </FormControl>
            <br />
            <Button type="submit" color="primary">
                Save
            </Button>
        </form>
    )
}

export default BotSettingsForm
