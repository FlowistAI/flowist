import { useFormik } from 'formik';
import {
    Input,
    FormControl,
    FormLabel,
    Select,
    Option,
    Typography,
    FormHelperText,
    Textarea,
} from '@mui/joy';
import { llmProviderOptions } from '../../types/bot-types';
import { GoogleAIModelIds, LLMSection, OpenAIModelIds } from '../../hooks/Settings/types';
import { forwardRef, useImperativeHandle } from 'react';

export type BaseLLMSettings = {
    label: string // Provider display name
}

export type LLMSettingsFormProps = {
    initialValues: LLMSection;
    validationSchema: any;
    onSubmit: (values: LLMSection) => void;
};

const LLMSettingsForm = forwardRef(({ initialValues, validationSchema, onSubmit }: LLMSettingsFormProps, ref) => {
    // 使用Formik Hook
    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit,
    });

    useImperativeHandle(ref, () => ({
        save: () => {
            formik.handleSubmit();
        },
    }));

    return (
        <form onSubmit={formik.handleSubmit}>
            <Typography level='h3' >Language Model Provider</Typography>

            <FormControl >
                <FormLabel id="default-provider-label">Default Provider</FormLabel>
                <Select
                    id="defaultProvider"
                    name="defaultProvider"
                    value={formik.values.defaultProvider}
                    onChange={formik.handleChange}
                >
                    {llmProviderOptions.map((provider) => (
                        <Option key={provider.value} value={provider.value}>
                            {provider.label}
                        </Option>
                    ))}
                </Select>
            </FormControl>

            <Typography level='h4' >OpenAI Settings</Typography>
            <FormControl >
                <FormLabel id="openai-label">Endpoint</FormLabel>
                <Input
                    id="openai-endpoint"
                    name="providers.OpenAI.endpoint"
                    value={formik.values.providers.OpenAI.endpoint}
                    onChange={formik.handleChange}
                    error={Boolean(formik.errors.providers?.OpenAI?.endpoint)}
                />
                <FormHelperText>{formik.errors.providers?.OpenAI?.endpoint}</FormHelperText>
            </FormControl>
            <FormControl >
                <FormLabel id="openai-label">API Key</FormLabel>
                <Input
                    id="openai-apiKey"
                    name="providers.OpenAI.apiKey"
                    value={formik.values.providers.OpenAI.apiKey}
                    onChange={formik.handleChange}
                    error={Boolean(formik.errors.providers?.OpenAI?.apiKey)}
                />
                <FormHelperText>{formik.errors.providers?.OpenAI?.apiKey}</FormHelperText>
            </FormControl>
            <FormControl >
                <FormLabel id="openai-label">Model</FormLabel>
                <Select
                    id="openai-model"
                    name="providers.OpenAI.model"
                    value={formik.values.providers.OpenAI.model}
                    onChange={formik.handleChange}
                >
                    {Object.values(OpenAIModelIds).map((model) => (
                        <Option key={model} value={model}>
                            {model}
                        </Option>
                    ))}
                </Select>
                <FormHelperText>{formik.errors.providers?.OpenAI?.model}</FormHelperText>
            </FormControl>
            <FormControl >
                <FormLabel id="openai-label">Temperature</FormLabel>
                <Input
                    id="openai-temperature"
                    slotProps={{
                        input: {
                            min: 0,
                            max: 1,
                            step: 0.01,
                        }
                    }}
                    type="number"
                    name="providers.OpenAI.temperature"
                    value={formik.values.providers.OpenAI.temperature}
                    onChange={formik.handleChange}
                    error={Boolean(formik.errors.providers?.OpenAI?.temperature)}
                />
                <FormHelperText>{formik.errors.providers?.OpenAI?.temperature}</FormHelperText>
            </FormControl>
            <FormControl >
                <FormLabel id="openai-label">Prompt</FormLabel>
                <div className="flex justify-between">
                    <Typography level='body-xs'>Use {'{{input}}'} to represent user input</Typography>
                    <Typography level='body-xs'>{formik.values.providers.OpenAI.prompt.length} / 2048</Typography>
                </div>
                <Textarea
                    id="openai-prompt"
                    minRows={2}
                    name="providers.OpenAI.prompt"
                    value={formik.values.providers.OpenAI.prompt}
                    onChange={formik.handleChange}
                />
                <FormHelperText>{formik.errors.providers?.OpenAI?.prompt}</FormHelperText>
            </FormControl>
            <FormControl >
                <FormLabel id="openai-label">Max Tokens</FormLabel>
                <Typography level='body-xs'>0 means no limit</Typography>
                <Input
                    id="openai-maxTokens"
                    name="providers.OpenAI.maxTokens"
                    value={formik.values.providers.OpenAI.maxTokens}
                    onChange={formik.handleChange}
                    error={Boolean(formik.errors.providers?.OpenAI?.maxTokens)}
                />
                <FormHelperText>{formik.errors.providers?.OpenAI?.maxTokens}</FormHelperText>
            </FormControl>

            <Typography level='h4' >GoogleAI Settings</Typography>
            <FormControl >
                <FormLabel id="googleai-label">API Key</FormLabel>
                <Input
                    id="googleai-apiKey"
                    name="providers.GoogleAI.apiKey"
                    value={formik.values.providers.GoogleAI.apiKey}
                    onChange={formik.handleChange}
                    error={Boolean(formik.errors.providers?.GoogleAI?.apiKey)}
                />
                <FormHelperText>{formik.errors.providers?.GoogleAI?.apiKey}</FormHelperText>
            </FormControl>

            <FormControl >
                <FormLabel id="googleai-label">Model</FormLabel>
                <Select
                    id="googleai-model"
                    name="providers.GoogleAI.model"
                    value={formik.values.providers.GoogleAI.model}
                    onChange={formik.handleChange}
                >
                    {Object.values(GoogleAIModelIds).map((model) => (
                        <Option key={model} value={model}>
                            {model}
                        </Option>
                    ))}
                </Select>
                <FormHelperText>{formik.errors.providers?.GoogleAI?.model}</FormHelperText>
            </FormControl>

            <FormControl >
                <FormLabel id="googleai-label">Temperature</FormLabel>
                <Input
                    id="googleai-temperature"
                    slotProps={{
                        input: {
                            min: 0,
                            max: 1,
                            step: 0.01,
                        }
                    }}
                    type="number"
                    name="providers.GoogleAI.temperature"
                    value={formik.values.providers.GoogleAI.temperature}
                    onChange={formik.handleChange}
                    error={Boolean(formik.errors.providers?.GoogleAI?.temperature)}
                />
                <FormHelperText>{formik.errors.providers?.GoogleAI?.temperature}</FormHelperText>
            </FormControl>

            <FormControl >
                <FormLabel id="googleai-label">Prompt</FormLabel>
                <div className="flex justify-between">
                    <Typography level='body-xs'>Use {'{{input}}'} to represent user input</Typography>
                    <Typography level='body-xs'>{formik.values.providers.GoogleAI.prompt.length} / 2048</Typography>
                </div>
                <Textarea
                    id="googleai-prompt"
                    minRows={2}
                    name="providers.GoogleAI.prompt"
                    value={formik.values.providers.GoogleAI.prompt}
                    onChange={formik.handleChange}
                />
                <FormHelperText>{formik.errors.providers?.GoogleAI?.prompt}</FormHelperText>
            </FormControl>

            <FormControl >
                <FormLabel id="googleai-label">Max Tokens</FormLabel>
                <Typography level='body-xs'>0 means no limit</Typography>
                <Input
                    id="googleai-maxTokens"
                    name="providers.GoogleAI.maxTokens"
                    value={formik.values.providers.GoogleAI.maxTokens}
                    onChange={formik.handleChange}
                    error={Boolean(formik.errors.providers?.GoogleAI?.maxTokens)}
                />
                <FormHelperText>{formik.errors.providers?.GoogleAI?.maxTokens}</FormHelperText>

            </FormControl>
        </form>
    );
});

export default LLMSettingsForm;