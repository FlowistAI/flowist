import { PlusIcon } from '@primer/octicons-react';

import './FloatingMenu.css';

interface FloatingMenuProps {
    logo?: boolean;
}

export function FloatingMenu({
    logo = true
}: FloatingMenuProps) {

    const handleMouseEnter = () => {
        // 进入时打开菜单
    };

    const handleMouseLeave = () => {
        // 离开时关闭菜单
    };
    return (
        <div
            className="floating-menu"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {logo && (
                <div className="floating-menu__logo">
                    <img src="logo.png" alt="Logo" width={32} />
                    <span className="floating-menu__logo-text">
                    </span>
                </div>
            )}
            <button className="floating-menu__item" >
                <PlusIcon size={24} />
            </button>
        </div>
    )
}
