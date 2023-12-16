import React from 'react';
import { PlusIcon } from '@primer/octicons-react';

import "./ContextMenu.css"
import { NodeType, NodeTypeName } from '../constants/nodeTypes';

type ContextMenuProps = {
    position: { x: number; y: number };
    onAddNode: (type: NodeTypeName) => void;
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
                    onClick={() => onAddNode(NodeType.ChatBox)}>
                    <PlusIcon size={24} />
                    新建对话节点
                </li>
                <li
                    className='context-menu__item'
                    onClick={() => onAddNode(NodeType.TextToSpeech)}>
                    <PlusIcon size={24} />
                    新建语音节点
                </li>
            </ul>
        </div>
    );
};
