import { useFormik } from 'formik'
import { Input, Button, FormControl, FormLabel } from '@mui/joy'
import { FC } from 'react'

export type PresetSaveFormData = {
    name: string
    icon?: string
    description?: string
}

const validate = (values: PresetSaveFormData) => {
    const errors: Partial<PresetSaveFormData> = {}

    if (!values.name) {
        errors.name = 'Name is required'
    }

    return errors
}

export type PresetSaveFormProps = {
    initialValues: PresetSaveFormData
    onSubmit: (values: PresetSaveFormData) => void
}

export const PresetSaveForm: FC<PresetSaveFormProps> = ({
    initialValues,
    onSubmit,
}) => {
    const formik = useFormik({
        initialValues,
        validate,
        onSubmit,
    })

    return (
        <form onSubmit={formik.handleSubmit} className="flex flex-col">
            <FormControl>
                <FormLabel htmlFor="preset-name">Name</FormLabel>
                <Input
                    id="preset-name"
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                />
                {formik.errors.name && (
                    <div className="text-red-500">{formik.errors.name}</div>
                )}
            </FormControl>

            <FormControl>
                <FormLabel htmlFor="preset-icon">Icon</FormLabel>
                <Input
                    id="preset-icon"
                    name="icon"
                    value={formik.values.icon}
                    onChange={formik.handleChange}
                />
            </FormControl>

            <FormControl>
                <FormLabel htmlFor="preset-description">Description</FormLabel>
                <Input
                    id="preset-description"
                    name="description"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                />
            </FormControl>

            <br />
            <Button type="submit" color="primary">
                Save
            </Button>
        </form>
    )
}
