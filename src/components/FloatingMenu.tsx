import './FloatingMenu.css'
import { useState } from 'react'
import { Button, Modal } from '@mui/joy'
import SettingPage from '../pages/setting/SettingPage'
import { SaveOutlined, SettingsOutlined } from '@mui/icons-material'
import { useNodeManager } from '../hooks/NodeManager'
import { persistData, retrieveData } from '../constants/persistence'
import { NodeManagerSnapshot } from '../hooks/NodeManager/NodeManager'
import { useToast } from '../hooks/Toast/useToast'
import BrowserUpdatedOutlinedIcon from '@mui/icons-material/BrowserUpdatedOutlined'
interface FloatingMenuProps {
    logo?: boolean
}

const iconStyle = { width: 24, height: 24, color: 'var(--color-gray-80)' }

export function FloatingMenu({
    logo = false
}: FloatingMenuProps) {

    const handleMouseEnter = () => {
    }

    const handleMouseLeave = () => {
    }

    const [open, setOpen] = useState(false)

    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)
    const nm = useNodeManager()
    const toast = useToast()
    const handleSave = async () => {
        await persistData('nm-data', nm.snapshot())
        toast({ type: 'success', content: 'Saved' })
    }

    const handleLoad = async () => {
        const data = await retrieveData<NodeManagerSnapshot>('nm-data')

        if (data) {
            console.log('restore from data', data)

            nm.restore(data)
        }
    }

    return (
        <div
            className="floating-menu px-2"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onContextMenu={
                (e) => {
                    e.preventDefault()
                    e.stopPropagation()
                }
            }
        >
            {logo && (
                <div className="floating-menu__logo select-none pointer-events-none border-r mr-2">
                    <img src="logo.png" alt="Logo" width={32} />
                    <span className="floating-menu__logo-text font-light cursor-default mx-1">
                        GIDE
                    </span>
                </div>
            )}
            <button className="floating-menu__item" onClick={handleSave}>
                <SaveOutlined sx={iconStyle} />
            </button>
            <button className="floating-menu__item" onClick={handleLoad}>
                <BrowserUpdatedOutlinedIcon sx={iconStyle} />
            </button>
            <button className="floating-menu__item" onClick={handleOpen}>
                <SettingsOutlined sx={iconStyle} />
            </button>
            <Modal
                open={open}
                onClose={handleClose}
            >
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white shadow-md p-4"
                    style={{ width: '40rem' }}
                >
                    <h1 className="text-2xl font-bold">Settings</h1>
                    <div style={{ height: '30rem' }}>
                        <SettingPage></SettingPage>
                    </div>
                    <div className="flex items-center justify-end">
                        <Button onClick={handleClose}>Close</Button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}
