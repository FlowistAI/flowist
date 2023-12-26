import { PlusIcon } from '@primer/octicons-react'
import { MenuItem } from '../components/ContextMenu'
import { WidgetTypes } from '../states/widgets/widget.atom'
import { useDocument } from '../states/document.atom'
import { t } from 'i18next'

export type MenuItemsCreator = (options: {
    cursor?: { x: number; y: number }
}) => MenuItem[]

export const useMenuItems: MenuItemsCreator = ({ cursor }) => {
    const { dispatch: setDocument } = useDocument()

    return [
        {
            key: 'new-node',
            text: t('Add Widget'),
            icon: <PlusIcon size={24} />,
            children: [
                {
                    key: 'new-chat-widget',
                    text: t('Add ChatBot'),
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
                    text: t('Add QueryBot'),
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
                    text: t('Add TextToSpeech'),
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
