import { PlusIcon } from '@primer/octicons-react'
import { MenuItem } from '../components/ContextMenu'
import { DocumentManager } from '../hooks/DocumentManager'
import { AppNodeTypes } from '../constants/nodeTypes'

export type MenuItemsCreator = (options: {
    documentManager: DocumentManager
    cursor?: { x: number; y: number }
}) => MenuItem[]

export const createMenuItems: MenuItemsCreator = ({
    documentManager,
    cursor,
}) => [
    {
        key: 'new-node',
        text: '新建节点',
        icon: <PlusIcon size={24} />,
        children: [
            {
                key: 'new-chat-node',
                text: '新建对话节点',
                callback: () =>
                    documentManager.addNewNode({
                        type: AppNodeTypes.ChatBot,
                        data: { position: cursor },
                    }),
            },
            {
                key: 'new-query-node',
                text: '新建查询节点',
                callback: () =>
                    documentManager.addNewNode({
                        type: AppNodeTypes.QueryBot,
                        data: { position: cursor },
                    }),
            },
            {
                key: 'new-tts-node',
                text: '新建语音节点',
                callback: () =>
                    documentManager.addNewNode({
                        type: AppNodeTypes.TextToSpeech,
                        data: { position: cursor },
                    }),
            },
        ],
    },
]
