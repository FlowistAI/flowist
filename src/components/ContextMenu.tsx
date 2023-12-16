import React from 'react';
import { PlusIcon } from '@primer/octicons-react';

import "./ContextMenu.css"

type ContextMenuProps = {
    position: { x: number; y: number };
    onAddNode: () => void;
};

export const ContextMenu: React.FC<ContextMenuProps> = ({ position, onAddNode }) => {
    return (
        <div
            style={{
                top: `${position.y}px`,
                left: `${position.x}px`,
            }}
            className='context-menu'
        >
            <ul
                className='context-menu__items'
            >
                <li
                    className='context-menu__item'
                    onClick={onAddNode}>
                    <PlusIcon size={24} />
                    添加节点</li>
                {/* 可以添加更多的菜单项 */}
            </ul>
        </div>
    );
};
