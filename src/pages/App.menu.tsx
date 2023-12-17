import { PlusIcon } from "@primer/octicons-react";
import { MenuItem } from "../components/ContextMenu";
import { NodeManager } from "../hooks/NodeManager";
import { AppNodeTypes } from "../constants/nodeTypes";

export type MenuItemsCreator = (options: {
    nodeManager: NodeManager,
    cursor?: { x: number, y: number }
}) => MenuItem[]

export const createMenuItems: MenuItemsCreator = (
    {
        nodeManager,
        cursor
    }
) => [
        {
            key: 'new-node',
            text: '新建节点',
            icon: <PlusIcon size={24} />,
            children: [
                {
                    key: 'new-chat-node',
                    text: '新建对话节点',
                    callback: () => nodeManager.addNode({ type: AppNodeTypes.ChatBot, data: { position: cursor } })
                },
                {
                    key: 'new-tts-node',
                    text: '新建语音节点',
                    callback: () => nodeManager.addNode({ type: AppNodeTypes.TextToSpeech, data: { position: cursor } })
                }
            ]
        },
    ];

