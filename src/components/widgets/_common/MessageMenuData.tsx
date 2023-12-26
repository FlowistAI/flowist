import { Refresh } from '@mui/icons-material'
import { ChatMessage } from '../../../states/widgets/chat/chat.type'
import { PlainMenuData, MessageMenuActions } from './MessageMenu'

export const MessageMenuData: PlainMenuData[] = [
    {
        label: 'Regenerate',
        icon: <Refresh />,
        visible: (message: ChatMessage) => !message.isUser,
        action: MessageMenuActions.Regenerate,
    },
    {
        label: 'Copy',
        action: MessageMenuActions.Copy,
    },
    {
        label: 'Edit',
        action: MessageMenuActions.Edit,
    },
    {
        label: 'Delete',
        action: MessageMenuActions.Delete,
    },
    {
        label: 'Insert context delimiter above',
        action: MessageMenuActions.InsertContextDelimiterAbove,
    },
    {
        label: 'Insert context delimiter below',
        action: MessageMenuActions.InsertContextDelimiterBelow,
    },
    {
        label: 'Clear messages above',
        action: MessageMenuActions.ClearMessagesAbove,
    },
    {
        label: 'Clear messages below',
        action: MessageMenuActions.ClearMessagesBelow,
    },
]
