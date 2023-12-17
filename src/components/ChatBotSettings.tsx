import { useFormik } from 'formik';
import { Input, Select, Button, FormControl, Option, Textarea } from '@mui/joy';

import { InputLabel } from '@mui/material';
import { ChatBotNodePreset, botAvatarOptions, botModelOptions } from '../types/chat-types';
import { FC } from 'react';

type Errors<T> = {
    [P in keyof T]?: T[P] extends object ? Errors<T[P]> : string;
};

const validate = (values: ChatBotNodePreset) => {
    const errors: Errors<ChatBotNodePreset> = {};

    if (!values.bot.name) {
        errors.bot = { ...errors.bot, name: 'Bot Name is required' };
    }

    if (!Number.isInteger(values.bot.settings.maxTokens)) {
        errors.bot = {
            ...errors.bot,
            settings: {
                ...errors.bot?.settings ?? {},
                maxTokens: 'Max Tokens must be an integer',
            },
        };
    }
    console.log("errors", errors);

    return errors;
};

export type ChatBotSettingsFormProps = {
    initialValues: ChatBotNodePreset;
    onSubmit: (values: ChatBotNodePreset) => void;
};

const ChatBotSettingsForm: FC<ChatBotSettingsFormProps> = ({ initialValues, onSubmit }) => {

    const formik = useFormik({
        initialValues,
        validate,
        onSubmit
    });

    return (
        <form onSubmit={formik.handleSubmit} className='flex flex-col'>
            <FormControl>
                <InputLabel htmlFor="bot-name">Bot Name</InputLabel>
                <Input
                    id="bot-name"
                    name="bot.name"
                    value={formik.values.bot.name}
                    onChange={formik.handleChange}
                />
                {formik.errors.bot?.name && <div className='text-red-500'>{formik.errors.bot.name}</div>}
            </FormControl>

            <FormControl>
                <InputLabel htmlFor="bot-avatar">Bot Avatar</InputLabel>
                <Select
                    id="bot-avatar"
                    name="bot.avatar"
                    value={formik.values.bot.avatar}
                    onChange={formik.handleChange}
                >
                    {botAvatarOptions.map((option) => (
                        <Option key={option.value} value={option.value}>
                            {option.label}
                        </Option>
                    ))}
                </Select>
            </FormControl>

            <FormControl>
                <InputLabel htmlFor="bot-model">Bot Model</InputLabel>
                <Select
                    id="bot-model"
                    name="bot.settings.model"
                    value={formik.values.bot.settings.model}
                    onChange={formik.handleChange}
                >
                    {botModelOptions.map((option) => (
                        <Option key={option.value} value={option.value}>
                            {option.label}
                        </Option>
                    ))}
                </Select>
            </FormControl>

            <FormControl>
                <InputLabel htmlFor="bot-temperature">Temperature</InputLabel>
                <Input
                    id="bot-temperature"
                    name="bot.settings.temperature"
                    type="number"
                    value={formik.values.bot.settings.temperature}
                    onChange={formik.handleChange}
                />
            </FormControl>

            <FormControl>
                <InputLabel htmlFor="bot-prompt">Prompt</InputLabel>
                <Textarea
                    id="bot-prompt"
                    minRows={2}
                    name="bot.settings.prompt"
                    value={formik.values.bot.settings.prompt}
                    onChange={formik.handleChange}
                />
                {formik.errors.bot?.settings?.prompt && (
                    <div className='text-red-500'>{formik.errors.bot.settings.prompt}</div>
                )}
            </FormControl>

            <FormControl>
                <InputLabel htmlFor="bot-maxTokens">Max Tokens</InputLabel>
                <Input
                    id="bot-maxTokens"
                    name="bot.settings.maxTokens"
                    type="number"
                    value={formik.values.bot.settings.maxTokens}
                    onChange={formik.handleChange}
                />
                {formik.errors.bot?.settings?.maxTokens && (
                    <div className='text-red-500'>{formik.errors.bot.settings.maxTokens}</div>
                )}
            </FormControl>
            <br />
            <Button type="submit" color="primary">
                Save
            </Button>
        </form>
    );
};

export default ChatBotSettingsForm;
