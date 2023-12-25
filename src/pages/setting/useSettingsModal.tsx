import { useState, useEffect } from 'react'
import { Modal } from '@mui/joy'
import { useAtom } from 'jotai'
import { settingsModalOpenAtom } from '../../states/settings/settings.atom'
import { SettingPage } from './SettingPage'

export const SettingsModal = () => {
    const [open, setOpen] = useAtom(settingsModalOpenAtom)
    const [disableBackdropClick, setDisableBackdropClick] = useState(true)

    // avoid unintended touch
    useEffect(() => {
        if (open) {
            setDisableBackdropClick(true)
            const timer = setTimeout(() => {
                setDisableBackdropClick(false)
            }, 500)

            return () => clearTimeout(timer)
        }
    }, [open])

    const handleClose = () => setOpen(false)

    return (
        <Modal
            open={open}
            onClose={(_, reason) => {
                if (reason === 'backdropClick' && disableBackdropClick) {
                    return
                }

                handleClose()
            }}
        >
            <div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white shadow-md p-4"
                style={{ width: '40rem' }}
            >
                <h1 className="text-2xl font-bold">Settings</h1>
                <div style={{ height: '30rem' }}>
                    <SettingPage onClose={handleClose}></SettingPage>
                </div>
            </div>
        </Modal>
    )
}
