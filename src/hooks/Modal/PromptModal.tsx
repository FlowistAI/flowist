import React from 'react'
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

const PromptModal: React.FC = () => {
    const [state, setState] = useAtom(promptModalAtom)
    const [input, setInput] = React.useState(state.data?.defaultValue ?? '')

    const handleClose = (ok: boolean) => {
        if (!ok) {
            state.data?.onCancel?.()
        }

        setState((prev) => {
            return produce(prev, (draft) => {
                draft.open = false
            })
        })
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
                            // onKeyUp={(e) => {
                            //     const target = e as unknown as HTMLInputElement
                            //     if (e.key === 'Enter') {
                            //         if (data?.onOk?.(target.value) !== false) {
                            //             handleClose(true)
                            //         }
                            //     }
                            // }}
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
                            // onKeyUp={(e) => {
                            //     const target = e as unknown as HTMLInputElement
                            //     if (e.key === 'Enter') {
                            //         if (data?.onOk?.(target.value) !== false) {
                            //             handleClose(true)
                            //         }
                            //     }
                            // }}
                            sx={{ mt: 2 }}
                        />
                    )}
                    <Button
                        color="primary"
                        onClick={() => {
                            if (data?.onOk?.(input) !== false) {
                                handleClose(true)
                            }
                        }}
                        sx={{ mt: 2 }}
                    >
                        {data?.okText ?? 'Confirm'}
                    </Button>
                </Sheet>
            </Box>
        </Modal>
    )
}

export default PromptModal
