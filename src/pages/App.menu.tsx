import { PlusIcon } from '@primer/octicons-react'
import { MenuItem } from '../components/ContextMenu'
import { WidgetTypes } from '../states/widgets/widget.atom'
import { useDocument } from '../states/document.atom'

export type MenuItemsCreator = (options: {
    cursor?: { x: number; y: number }
}) => MenuItem[]

export const useMenuItems: MenuItemsCreator = ({ cursor }) => {
    const { dispatch: setDocument } = useDocument()

    return [
        {
            key: 'new-node',
            text: 'Add Widget',
            icon: <PlusIcon size={24} />,
            children: [
                {
                    key: 'new-chat-widget',
                    text: 'Add ChatBot',
                    callback: () =>
                        setDocument({
                            type: 'add-widget',
                            options: {
                                type: WidgetTypes.ChatBot,
                                data: { position: cursor },
                            },
                        }),
                },
                {
                    key: 'new-query-node',
                    text: 'Add QueryBot',
                    callback: () =>
                        setDocument({
                            type: 'add-widget',
                            options: {
                                type: WidgetTypes.QueryBot,
                                data: { position: cursor },
                            },
                        }),
                },
                {
                    key: 'new-tts-node',
                    text: 'Add TextToSpeech',
                    callback: () =>
                        setDocument({
                            type: 'add-widget',
                            options: {
                                type: WidgetTypes.TextToSpeech,
                                data: { position: cursor },
                            },
                        }),
                },
            ],
        },
    ]
}
