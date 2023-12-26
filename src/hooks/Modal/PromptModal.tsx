import React, { useEffect } from 'react'
import {
    Box,
    Button,
    Input,
    Modal,
    ModalClose,
    Sheet,
    Textarea,
    Typography,
} from '@mui/joy'
import { useAtom } from 'jotai'
import { promptModalAtom } from './atoms'
import { produce } from 'immer'
import { useTranslation } from 'react-i18next'

const PromptModal: React.FC = () => {
    const [state, setState] = useAtom(promptModalAtom)
    const [input, setInput] = React.useState('')

    const { t } = useTranslation()

    useEffect(() => {
        if (!input && state.data?.defaultValue) {
            setInput(state.data.defaultValue)
        }
    }, [input, state.data?.defaultValue])

    const handleClose = (ok: boolean) => {
        if (!ok) {
            state.data?.onCancel?.()
        }

        setState((prev) => {
            return produce(prev, (draft) => {
                draft.open = false
                draft.data = null
            })
        })

        setInput('')
    }

    const { open, data } = state

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="parent-modal-title"
            aria-describedby="parent-modal-description"
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Box sx={{ width: 400 }}>
                <Sheet
                    variant="outlined"
                    sx={{
                        maxWidth: 500,
                        borderRadius: 'md',
                        p: 3,
                        boxShadow: 'lg',
                    }}
                >
                    <ModalClose variant="plain" sx={{ m: 1 }} />
                    <Typography
                        component="h2"
                        id="modal-title"
                        level="h4"
                        textColor="inherit"
                        fontWeight="lg"
                        mb={1}
                    >
                        {data?.title ?? 'Please input'}
                    </Typography>
                    {data?.prompt && (
                        <Typography id="modal-desc" textColor="text.tertiary">
                            {data.prompt}
                        </Typography>
                    )}
                    {data?.type === 'confirm' && null}
                    {data?.type === 'text' && (
                        <Input
                            fullWidth
                            autoFocus
                            placeholder={data?.placeholder ?? 'Please input'}
                            value={data?.defaultValue ?? ''}
                            onChange={(e) => {
                                data?.onChange?.(e.target.value)
                                setInput(e.target.value)
                            }}
                            sx={{ mt: 2 }}
                        />
                    )}
                    {data?.type === 'textarea' && (
                        <Textarea
                            autoFocus
                            minRows={3}
                            placeholder={data?.placeholder ?? 'Please input'}
                            value={input}
                            onChange={(e) => {
                                data?.onChange?.(e.target.value)
                                setInput(e.target.value)
                            }}
                            sx={{ mt: 2 }}
                        />
                    )}
                    <div className="w-full flex items-center justify-end">
                        <Button
                            variant="soft"
                            onClick={() => handleClose(false)}
                            sx={{ mt: 2 }}
                        >
                            {data?.cancelText ?? t('Cancel')}
                        </Button>
                        <Button
                            color="primary"
                            onClick={() => {
                                if (data?.onOk?.(input) !== false) {
                                    handleClose(true)
                                }
                            }}
                            sx={{ mt: 2, ml: 1 }}
                        >
                            {data?.okText ?? t('Confirm')}
                        </Button>
                    </div>
                </Sheet>
            </Box>
        </Modal>
    )
}

export default PromptModal
