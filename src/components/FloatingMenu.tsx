import { PlusIcon, GearIcon } from '@primer/octicons-react';

import './FloatingMenu.css';

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
            <button className="floating-menu__item" >
                <GearIcon size={24} />
            </button>
        </div>
    )
}
