import { Getter, Setter, atom, useAtom } from 'jotai'
import { ChatMessage, ChatSession } from './chat.type'
import { JotaiContext } from '../../index.type'
import { produce } from 'immer'
import { generateUUID } from '../../../util/id-generator'
import { createLLMService } from '../../../services/llm-service/createLLMService'
import { createSessionfulHandler } from '../_common/sessionful-handler'
import { getCorsProxyIfEnabled } from '../../settings/settings.atom'
import { toastControl } from '../../../hooks/Toast/toast.atom'

const _chatSessionsAtom = atom<ChatSession[]>([])

export const chatSessionsAtom = atom(
    (get) => get(_chatSessionsAtom),
    createSessionfulHandler(_chatSessionsAtom),
)

export type MessageUpdatePayload = Partial<ChatMessage> &
    Required<Pick<ChatMessage, 'id'>>

export type ChatBotAction =
    | { type: 'getSession'; sid: string }
    | { type: 'addMessage'; sid: string; message: ChatMessage }
    | { type: 'updateMessage'; sid: string; message: MessageUpdatePayload }
    | { type: 'appendMessageText'; sid: string; mid: string; text: string }
    | { type: 'deleteMessage'; sid: string; mid: string }
    | { type: 'getMessage'; sid: string; mid: string }
    | { type: 'getMessages'; sid: string }
    | { type: 'getContextMessages'; sid: string }
    | {
          type: 'insertMessageBefore'
          sid: string
          message: ChatMessage
          beforeMid: string
      }
    | {
          type: 'insertMessageAfter'
          sid: string
          message: ChatMessage
          afterMid: string
      }
    | {
          type: 'clearMessages'
          sid: string
      }
    | {
          type: 'clearMessageBefore'
          sid: string
          beforeMid: string
      }
    | {
          type: 'clearMessageAfter'
          sid: string
          afterMid: string
      }
    | {
          type: 'sendMessage'
          sid: string
          content: string
          onReplyDone?: (all: string) => void
      }
    | {
          type: 'regenerate'
          sid: string
          mid: string
          onReplyDone?: (all: string) => void
      }

export const useChatBot = () => {
    const [state, dispatch] = useAtom(chatBotAtom)

    return {
        state,
        dispatch: dispatch as Dispatch,
    }
}

type ActionResultMapping = {
    getSession: ReturnType<typeof handleGetSession>
    addMessage: ReturnType<typeof handleAddMessage>
    updateMessage: ReturnType<typeof handleUpdateMessage>
    appendMessageText: ReturnType<typeof handleAppendMessageText>
    deleteMessage: ReturnType<typeof handleDeleteMessage>
    getMessage: ReturnType<typeof handleGetMessage>
    getMessages: ReturnType<typeof handleGetMessages>
    getContextMessages: ReturnType<typeof handleGetContextMessages>
    insertMessageBefore: ReturnType<typeof handleInsertMessageBefore>
    insertMessageAfter: ReturnType<typeof handleInsertMessageAfter>
    clearMessages: ReturnType<typeof handleClearMessages>
    clearMessageBefore: ReturnType<typeof handleClearMessageBefore>
    clearMessageAfter: ReturnType<typeof handleClearMessageAfter>
    sendMessage: ReturnType<typeof handleSendMessageAsync>
    regenerate: ReturnType<typeof handleRegenerate>
}

export const chatBotAtom = atom(
    (get) =>
        ({
            sessions: get(chatSessionsAtom),
        } as ChatBotData),
    handleAction,
)

type Dispatch = <T extends ChatBotAction>(
    action: T,
) => ActionResultMapping[T['type']]

function handleAction<T extends ChatBotAction>(
    get: Getter,
    set: Setter,
    action: T,
): ActionResultMapping[T['type']] {
    const ctx = { get, set }

    switch (action.type) {
        case 'getSession':
            return handleGetSession(
                ctx,
                action.sid,
            ) as ActionResultMapping[T['type']]
        case 'addMessage':
            return handleAddMessage(
                ctx,
                action.sid,
                action.message,
            ) as ActionResultMapping[T['type']]
        case 'updateMessage':
            return handleUpdateMessage(
                ctx,
                action.sid,
                action.message,
            ) as ActionResultMapping[T['type']]
        case 'appendMessageText':
            return handleAppendMessageText(
                ctx,
                action.sid,
                action.mid,
                action.text,
            ) as ActionResultMapping[T['type']]
        case 'deleteMessage':
            return handleDeleteMessage(
                ctx,
                action.sid,
                action.mid,
            ) as ActionResultMapping[T['type']]
        case 'getMessage':
            return handleGetMessage(
                ctx,
                action.sid,
                action.mid,
            ) as ActionResultMapping[T['type']]
        case 'getMessages':
            return handleGetMessages(
                ctx,
                action.sid,
            ) as ActionResultMapping[T['type']]
        case 'getContextMessages':
            return handleGetContextMessages(
                ctx,
                action.sid,
            ) as ActionResultMapping[T['type']]
        case 'insertMessageBefore':
            return handleInsertMessageBefore(
                ctx,
                action.sid,
                action.message,
                action.beforeMid,
            ) as ActionResultMapping[T['type']]
        case 'insertMessageAfter':
            return handleInsertMessageAfter(
                ctx,
                action.sid,
                action.message,
                action.afterMid,
            ) as ActionResultMapping[T['type']]
        case 'clearMessages':
            return handleClearMessages(
                ctx,
                action.sid,
            ) as ActionResultMapping[T['type']]
        case 'clearMessageBefore':
            return handleClearMessageBefore(
                ctx,
                action.sid,
                action.beforeMid,
            ) as ActionResultMapping[T['type']]
        case 'clearMessageAfter':
            return handleClearMessageAfter(
                ctx,
                action.sid,
                action.afterMid,
            ) as ActionResultMapping[T['type']]
        case 'sendMessage':
            return handleSendMessageAsync(
                ctx,
                action.sid,
                action.content,
                action.onReplyDone,
            ) as ActionResultMapping[T['type']]
        case 'regenerate':
            return handleRegenerate(
                ctx,
                action.sid,
                action.mid,
                action.onReplyDone,
            ) as ActionResultMapping[T['type']]
        default:
            break
    }

    throw new Error(`unknown action ${action}`)
}

export type ChatBotData = {
    sessions: ChatSession[]
}

function handleAddMessage(
    ctx: JotaiContext,
    sid: string,
    message: ChatMessage,
) {
    const { set } = ctx
    set(chatSessionsAtom, {
        type: 'update',
        session: {
            id: sid,
            messages: [...getMessages(ctx, sid), message],
        },
    })
}

function handleUpdateMessageImpl(
    ctx: JotaiContext,
    sid: string,
    updaterOrMessage: ((m: ChatMessage) => ChatMessage) | MessageUpdatePayload,
) {
    const { set } = ctx
    set(chatSessionsAtom, {
        type: 'update',
        session: {
            id: sid,
            messages: getMessages(ctx, sid).map((m) => {
                if (typeof updaterOrMessage === 'function') {
                    // Call the updater function
                    return updaterOrMessage(m)
                } else if (m.id === updaterOrMessage.id) {
                    // Merge the message update payload
                    return { ...m, ...updaterOrMessage }
                }

                return m
            }),
        },
    })
}

function handleUpdateMessage(
    ctx: JotaiContext,
    sid: string,
    updater: (m: ChatMessage) => ChatMessage,
): void
function handleUpdateMessage(
    ctx: JotaiContext,
    sid: string,
    message: MessageUpdatePayload,
): void
function handleUpdateMessage(
    ctx: JotaiContext,
    sid: string,
    updaterOrMessage: ((m: ChatMessage) => ChatMessage) | MessageUpdatePayload,
): void {
    handleUpdateMessageImpl(ctx, sid, updaterOrMessage)
}

function handleAppendMessageText(
    ctx: JotaiContext,
    sid: string,
    mid: string,
    text: string,
) {
    const { set } = ctx
    set(_chatSessionsAtom, (prevSessions) => {
        const r = produce<ChatSession[]>(prevSessions, (draft) => {
            const sess = draft.find((s) => s.id === sid)

            if (sess) {
                const msg = sess.messages.find((m) => m.id === mid)

                if (msg) {
                    msg.content += text
                } else {
                    throw new Error(`message ${mid} not found`)
                }
            }
        })

        return r
    })
}

function handleDeleteMessage(ctx: JotaiContext, sid: string, mid: string) {
    const { set } = ctx
    set(chatSessionsAtom, {
        type: 'update',
        session: {
            id: sid,
            messages: getMessages(ctx, sid).filter((m) => m.id !== mid),
        },
    })
}

function handleGetMessage(ctx: JotaiContext, sid: string, mid: string) {
    return getMessages(ctx, sid).find((m) => m.id === mid)
}

function handleGetMessages(ctx: JotaiContext, sid: string) {
    return getMessages(ctx, sid)
}

function handleGetContextMessages(ctx: JotaiContext, sid: string) {
    const session = ctx.get(_chatSessionsAtom).find((s) => s.id === sid)
    const msgs = []

    if (session) {
        for (let i = session.messages.length - 1; i >= 0; i--) {
            const msg = session.messages[i]
            if (msg.content === '---') {
                break
            }

            msgs.push(msg)
        }
    }

    msgs.reverse()

    return msgs
}

function handleInsertMessageBefore(
    ctx: JotaiContext,
    sid: string,
    message: ChatMessage,
    beforeMid: string,
) {
    const { set } = ctx
    set(chatSessionsAtom, {
        type: 'update',
        session: {
            id: sid,
            messages: getMessages(ctx, sid).reduce((acc, m) => {
                if (m.id === beforeMid) {
                    acc.push(message)
                }

                acc.push(m)

                return acc
            }, [] as ChatMessage[]),
        },
    })
}

function handleInsertMessageAfter(
    ctx: JotaiContext,
    sid: string,
    message: ChatMessage,
    afterMid: string,
) {
    const { set } = ctx
    set(chatSessionsAtom, {
        type: 'update',
        session: {
            id: sid,
            messages: getMessages(ctx, sid).reduce((acc, m) => {
                acc.push(m)

                if (m.id === afterMid) {
                    acc.push(message)
                }

                return acc
            }, [] as ChatMessage[]),
        },
    })
}

function handleClearMessages(ctx: JotaiContext, sid: string) {
    const { set } = ctx
    set(chatSessionsAtom, {
        type: 'update',
        session: {
            id: sid,
            messages: [],
        },
    })
}

function handleClearMessageBefore(
    ctx: JotaiContext,
    sid: string,
    beforeMid: string,
) {
    const { set } = ctx

    const messages = []

    const sess = ctx.get(_chatSessionsAtom).find((s) => s.id === sid)

    if (!sess) {
        throw new Error(`session ${sid} not found`)
    }

    const oldMessages = sess.messages

    for (let i = 0; i < oldMessages.length; i++) {
        const m = oldMessages[i]
        if (m.id === beforeMid) {
            messages.push(m)
            break
        }
    }

    set(chatSessionsAtom, {
        type: 'update',
        session: {
            id: sid,
            messages,
        },
    })
}

function handleClearMessageAfter(
    ctx: JotaiContext,
    sid: string,
    afterMid: string,
) {
    const { set } = ctx

    const messages = []
    const sess = ctx.get(_chatSessionsAtom).find((s) => s.id === sid)
    if (!sess) {
        throw new Error(`session ${sid} not found`)
    }

    const oldMessages = sess.messages

    for (let i = oldMessages.length - 1; i >= 0; i--) {
        const m = oldMessages[i]
        if (m.id === afterMid) {
            messages.push(m)
            break
        }
    }

    set(chatSessionsAtom, {
        type: 'update',
        session: {
            id: sid,
            messages,
        },
    })
}

function getMessages(ctx: JotaiContext, sid: string) {
    const { get } = ctx
    const sess = get(_chatSessionsAtom).find((s) => s.id === sid)

    if (sess) {
        return sess.messages
    } else {
        return []
    }
}

function handleGetSession({ get }: JotaiContext, sid: string) {
    const sessions = get(_chatSessionsAtom)

    return sessions.find((s) => s.id === sid)
}

function setSending({ get, set }: JotaiContext, sid: string, sending: boolean) {
    const sess = get(_chatSessionsAtom).find((s) => s.id === sid)
    if (sess) {
        set(chatSessionsAtom, {
            type: 'update',
            session: {
                id: sid,
                sending,
            },
        })
    }
}

async function handleSendMessageAsync(
    ctx: JotaiContext,
    sid: string,
    content: string,
    onReplyDone?: (all: string) => void,
) {
    const { get } = ctx
    const session = get(_chatSessionsAtom).find((s) => s.id === sid)
    if (!session) {
        return
    }

    if (session.sending) {
        return
    }

    try {
        setSending(ctx, sid, true)
        if (!content) {
            return
        }

        // add user message to the list
        handleAddMessage(ctx, sid, {
            id: generateUUID(),
            content,
            isUser: true,
            avatar: session.user.avatar,
        })

        // do not send a delimiter
        if (content === '---') {
            return
        }

        // add bot message to the list and store the id in the ref
        const botMessageId = generateUUID()
        handleAddMessage(ctx, sid, {
            id: botMessageId,
            content: '',
            isUser: false,
            avatar: session.bot.avatar,
        })

        const botSettings = session.bot.settings
        const contextMessages = handleGetContextMessages(ctx, sid)
        const corsProxy = getCorsProxyIfEnabled(get)
        // send message to the bot
        await createLLMService(botSettings, corsProxy).chatStream({
            input: content,
            historyMessages: contextMessages,
            onChunk: (chunk: string) => {
                if (!botMessageId) {
                    console.error(
                        'botMessageId is undefined but onResponseChunk is called',
                    )

                    return
                }

                handleAppendMessageText(ctx, sid, botMessageId, chunk)
            },
            onError: (error: Error) => {
                toastControl(ctx).add({
                    type: 'error',
                    content: error.message,
                })
            },
            onDone: (all: string) => {
                onReplyDone?.(all)
            },
        })
    } finally {
        setSending(ctx, sid, false)
    }
}

async function handleRegenerate(
    ctx: JotaiContext,
    sid: string,
    mid: string,
    onReplyDone?: (all: string) => void,
) {
    const { get } = ctx
    const session = get(_chatSessionsAtom).find((s) => s.id === sid)
    if (!session) {
        return
    }

    if (session.sending) {
        return
    }

    const botMessage = getMessages(ctx, sid).find((m) => m.id === mid)

    try {
        setSending(ctx, sid, true)
        if (!botMessage) {
            return
        }

        const contextMessagesIncludingInput = getContextMessagesBefore(
            ctx,
            sid,
            mid,
        )
        console.log('regen ', contextMessagesIncludingInput)
        if (contextMessagesIncludingInput.length == 0) {
            throw new Error('no enough context message to send')
        }

        const contextMessages = contextMessagesIncludingInput.slice(0, -1)
        const input =
            contextMessagesIncludingInput[
                contextMessagesIncludingInput.length - 1
            ].content

        // clean bot message
        handleUpdateMessage(ctx, sid, {
            id: mid,
            content: '',
        })

        const botSettings = session.bot.settings

        // send message to the bot
        const corsProxy = getCorsProxyIfEnabled(get)
        await createLLMService(botSettings, corsProxy).chatStream({
            input,
            historyMessages: contextMessages,
            onChunk: (chunk: string) => {
                handleAppendMessageText(ctx, sid, botMessage.id, chunk)
            },
            onError: (error: Error) => {
                toastControl(ctx).add({
                    type: 'error',
                    content: error.message,
                })
            },
            onDone: (all: string) => {
                onReplyDone?.(all)
            },
        })
    } finally {
        setSending(ctx, sid, false)
    }
}

function getContextMessagesBefore(ctx: JotaiContext, sid: string, mid: string) {
    const messages = getMessages(ctx, sid)

    let end = -1
    let start = 0

    for (let i = messages.length - 1; i >= 0; i--) {
        if (messages[i].id === mid) {
            end = i
        }

        if (messages[i].content === '---') {
            start = i + 1
            break
        }
    }

    if (end === -1) {
        throw new Error(`message ${mid} not found`)
    }

    return messages.slice(start, end)
}
