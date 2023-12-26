import { ReactElement } from 'react'
import { ChatMessage } from '../../../states/widgets/chat/chat.type'

export const MessageMenuActions = {
    Regenerate: 'Regenerate',
    Copy: 'Copy',
    Edit: 'Edit',
    Delete: 'Delete',
    InsertContextDelimiterAbove: 'InsertContextDelimiterAbove',
    InsertContextDelimiterBelow: 'InsertContextDelimiterBelow',
    ClearMessagesAbove: 'ClearMessagesAbove',
    ClearMessagesBelow: 'ClearMessagesBelow',
} as const

export type PlainMenuData = {
    label: string
    action: MessageMenuActionType
    icon?: ReactElement
    visible?: (message: ChatMessage) => boolean
}

export type MessageMenuActionType =
    (typeof MessageMenuActions)[keyof typeof MessageMenuActions]
