import './FloatingMenu.css'
import { useState } from 'react'
import { Modal } from '@mui/joy'
import SettingPage from '../pages/setting/SettingPage'
import { SaveOutlined, SettingsOutlined } from '@mui/icons-material'
import BrowserUpdatedOutlinedIcon from '@mui/icons-material/BrowserUpdatedOutlined'
import { useAtomValue } from 'jotai'
import { systemNameAtom } from '../states/settings/settings.atom'
interface FloatingMenuProps {
    logo?: boolean
}

const iconStyle = { width: 24, height: 24, color: 'var(--color-gray-80)' }

export function FloatingMenu({ logo = false }: FloatingMenuProps) {
    const handleMouseEnter = () => {}

    const handleMouseLeave = () => {}

    const [open, setOpen] = useState(false)

    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)
    const handleSave = async () => {}

    const handleLoad = async () => {}

    const sysName = useAtomValue(systemNameAtom)

    return (
        <div
            className="floating-menu px-2"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onContextMenu={(e) => {
                e.preventDefault()
                e.stopPropagation()
            }}
        >
            {logo && (
                <div className="floating-menu__logo select-none pointer-events-none mr-2">
                    <img src="logo.png" alt="Logo" width={32} />
                    <span className="floating-menu__logo-text font-light cursor-default mx-1">
                        {sysName}
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
            <Modal open={open} onClose={handleClose}>
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
        </div>
    )
}
