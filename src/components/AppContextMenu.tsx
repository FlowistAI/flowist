import React from 'react';
import { PlusIcon } from '@primer/octicons-react';

import "./ContextMenu.css"
import { AppNodeTypes } from '../constants/nodeTypes';
import { useNodeManager } from '../hooks/NodeManager';

type AppContextMenuProps = {
    position: { x: number; y: number };
    isOpen?: boolean;
    onClose?: () => void;
};

export const AppContextMenu: React.FC<AppContextMenuProps> = ({ position, isOpen, onClose }) => {
    const nodeManager = useNodeManager()

    const handleAddNode = (options: Parameters<typeof nodeManager.addNode>[0]) => {
        nodeManager.addNode(options);
        onClose?.();
    }

    if (!isOpen) {
        return null;
    }

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
                    onClick={() => handleAddNode({ type: AppNodeTypes.ChatBot })}
                >
                    <PlusIcon size={24} />
                    新建对话节点
                </li>
                <li
                    className='context-menu__item'
                    onClick={() => handleAddNode({ type: AppNodeTypes.TextToSpeech })}
                >
                    <PlusIcon size={24} />
                    新建语音节点
                </li>
            </ul>
        </div>
    );
};
