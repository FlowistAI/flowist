import { GearIcon } from '@primer/octicons-react';

import './FloatingMenu.css';
import { useState } from 'react';
import { Button, Modal } from '@mui/material';
import SettingPage from '../pages/setting/SettingPage';

interface FloatingMenuProps {
    logo?: boolean;
}

export function FloatingMenu({
    logo = true
}: FloatingMenuProps) {

    const handleMouseEnter = () => {
    };

    const handleMouseLeave = () => {
    };

    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    return (
        <div
            className="floating-menu"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onContextMenu={
                (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                }
            }
        >
            {logo && (
                <div className="floating-menu__logo">
                    <img src="logo.png" alt="Logo" width={32} />
                    <span className="floating-menu__logo-text">
                    </span>
                </div>
            )}
            <button className="floating-menu__item" onClick={handleOpen}>
                <GearIcon size={24} />
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
