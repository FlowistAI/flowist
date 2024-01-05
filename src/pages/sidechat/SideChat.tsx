/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Input, Typography } from '@mui/joy'
import { PencilIcon, PlusIcon, XIcon } from '@primer/octicons-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSideChatControl } from './sidechat.atom'
import { ChatOutlined, Send } from '@mui/icons-material'
import { ChatSession } from '../../states/widgets/chat/chat.type'
import { getDefaultBot, DefaultUser } from '../../states/bot.type'
import { generateUUID } from '../../util/id-generator'
import { useJotaiContext } from '../../states/index.type'
import React from 'react'
import { Resizable } from 're-resizable'
import i18next from 'i18next'
import Markdown from 'react-markdown'
import { useChat, useChatSession } from '../../states/widgets/chat/chat.atom'
import { reversedArray } from '../../util/misc.util'

const NoCurrentSession = () => (
    <div className="flex-1 flex items-center justify-center">
        <div className="text-gray-400">
            {i18next.t('No conversation selected')}
        </div>
    </div>
)

export const SideChat = () => {
    const sidechat = useSideChatControl()
    const visible = sidechat.visible
    const chat = useChat()

    console.log('sidechat', visible)

    const [query, setQuery] = useState('')

    const sideSessions = reversedArray(
        chat.sessions.filter((session) => {
            if (session.type !== 'sidechat') {
                return false
            }

            if (!query) {
                return true
            }

            return session.title?.includes(query)
        }),
    )

    const [focus, setFocus] = useState(false)
    const [editingTitle, setEditingTitle] = useState(false)
    const [sidebarClass, setSidebarClass] = useState('')
    const { t } = useTranslation()

    useEffect(() => {
        if (visible) {
            setSidebarClass('sidebar-enter')
        } else {
            setSidebarClass('sidebar-exit')
        }
    }, [visible])

    const onTransitionEnd = () => {
        if (!visible) {
            setSidebarClass('')
        }
    }

    const ctx = useJotaiContext()
    const msgsRef = React.useRef<HTMLDivElement>(null)
    const handleClickNewConversation = () => {
        const defaultBot = getDefaultBot(ctx)
        const session: ChatSession = {
            id: generateUUID(),
            type: 'sidechat',
            bot: defaultBot,
            user: undefined /* fill later */ ?? DefaultUser,
            sending: false,
            messages: [],
            title: 'No title',
        }
        chat.addSession(session)
        sidechat.setActiveSessionId(session.id)
    }

    const currentSessionControl = useChatSession(sidechat.activeSessionId)

    console.log('currentSession', currentSessionControl)

    const handleSendMessage = (message: string) => {
        if (!currentSessionControl) {
            return
        }

        currentSessionControl.sendMessage(message)
        currentSessionControl.updateInput('')

        // scroll to bottom
        setTimeout(() => {
            if (msgsRef.current) {
                msgsRef.current.scrollTop = msgsRef.current.scrollHeight
            }
        }, 100)
    }

    return (
        <div
            className={`absolute h-screen flex flex-col sidebar ${sidebarClass}`}
        >
            <Resizable
                minHeight="100%"
                maxHeight="100%"
                defaultSize={{
                    width: '80vw',
                    height: '100%',
                }}
                className={
                    'flex-1 bg-white border-r pt-6 h-screen ml-14 flex pl-4 flex-col '
                }
                // ignore the warning
                // @ts-expect-error ignore and don't delete this line
                onTransitionEnd={onTransitionEnd}
            >
                <div className="flex w-full headline pr-4">
                    <div className="flex-1">
                        <Typography level="h4">{t('Conversations')}</Typography>
                    </div>
                    <div
                        className="icon-circle-button"
                        onClick={() => sidechat.toggle()}
                    >
                        <XIcon />
                    </div>
                </div>
                <div className="flex-1 flex flex-row mt-4 border-t overflow-y-auto ">
                    {/* left list */}
                    <div className="max-w-80 pt-4 pr-4 border-r flex flex-col">
                        <div className="flex items-center">
                            <div className="flex-1 mr-2">
                                <Input
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder={t('Search')}
                                    fullWidth
                                />
                            </div>
                            <Button
                                variant="outlined"
                                color="neutral"
                                onClick={handleClickNewConversation}
                            >
                                <PlusIcon size={12} />
                                <span className="ml-1">{t('New')}</span>
                            </Button>
                        </div>
                        <ul className="mt-4 flex-1 overflow-y-auto">
                            {sideSessions.map((session) => (
                                <li
                                    key={session.id}
                                    className={`group flex items-center p-4 hover:bg-gray-200 mt-2 ${
                                        session.id ===
                                        currentSessionControl?.session.id
                                            ? 'bg-gray-100'
                                            : ''
                                    }`}
                                    onClick={() =>
                                        sidechat.setActiveSessionId(session.id)
                                    }
                                >
                                    <ChatOutlined sx={{ color: 'gray' }} />
                                    <div className="ml-2 flex-1">
                                        {session.title}
                                    </div>
                                    <div
                                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                                        onClick={() =>
                                            chat.removeSession(session.id)
                                        }
                                    >
                                        <XIcon
                                            className="cursor-pointer"
                                            size={'small'}
                                        />
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                    {/* right chat */}
                    <div className="conversation flex-1 flex flex-col">
                        {!currentSessionControl ? (
                            <NoCurrentSession />
                        ) : (
                            <div className="flex-1 flex flex-col overflow-y-auto">
                                {/* chat title */}
                                <div className="flex items-center p-4 border-b">
                                    {/* title */}
                                    <div className="flex-1">
                                        {editingTitle ? (
                                            <Input
                                                value={
                                                    currentSessionControl
                                                        .session.title
                                                }
                                                onChange={(e) =>
                                                    currentSessionControl.updateTitle(
                                                        e.target.value,
                                                    )
                                                }
                                                onBlur={() =>
                                                    setEditingTitle(false)
                                                }
                                                autoFocus
                                            />
                                        ) : (
                                            <Typography level="h4">
                                                {
                                                    currentSessionControl
                                                        .session.title
                                                }
                                            </Typography>
                                        )}
                                    </div>
                                    {/* edit */}
                                    {!editingTitle && (
                                        <div
                                            className="ml-2 transition-opacity duration-150"
                                            onClick={() =>
                                                setEditingTitle(true)
                                            }
                                        >
                                            <PencilIcon
                                                className="cursor-pointer"
                                                size={'small'}
                                            />
                                        </div>
                                    )}
                                </div>
                                {/* msg list */}
                                <div className="flex-1 overflow-y-auto">
                                    <div className="" ref={msgsRef}>
                                        {currentSessionControl.session.messages.map(
                                            (msg) => (
                                                <div
                                                    key={msg.id}
                                                    className={`p-4
                                        border-b
                                    ${msg.isUser ? 'bg-gray-50' : 'bg-white'}`}
                                                >
                                                    <div
                                                        className={
                                                            'flex items-start '
                                                        }
                                                    >
                                                        <div className="flex items-start">
                                                            <img
                                                                src={msg.avatar}
                                                                alt=""
                                                                className="w-10 h-10 rounded-md"
                                                            />
                                                        </div>
                                                        <div
                                                            className={
                                                                'flex-1 ml-2 p-2 rounded-lg'
                                                            }
                                                        >
                                                            <Markdown>
                                                                {msg.content}
                                                            </Markdown>
                                                        </div>
                                                    </div>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                </div>
                                {/* user input */}
                                <div
                                    className={`
                                    pt-4
                                    pb-4
                                    p-4
                                    border-t
                                    ${focus ? 'min-h-24' : 'min-h-12'}
                                    ${focus ? 'bg-gray-100' : 'bg-white'}
                                `}
                                >
                                    <textarea
                                        className="bg-inherit
                                        inset-0
                                        scroll-pa-4
                                        input-base
                                        resize-none
                                        outline-none
                                        w-full
                                        "
                                        placeholder="Type your message here..."
                                        value={currentSessionControl?.input}
                                        onChange={(e) => {
                                            if (!currentSessionControl) {
                                                return
                                            }

                                            currentSessionControl.updateInput(
                                                e.target.value,
                                            )
                                        }}
                                        onKeyUp={(e) => {
                                            if (
                                                e.key === 'Enter' &&
                                                !e.shiftKey
                                            ) {
                                                handleSendMessage(
                                                    currentSessionControl?.input ??
                                                        '',
                                                )
                                            }
                                        }}
                                        onBlur={() => {
                                            setFocus(false)
                                        }}
                                        onFocus={() => {
                                            setFocus(true)
                                        }}
                                        autoComplete="off"
                                    ></textarea>
                                    <div className="flex justify-end">
                                        <div
                                            className={`
                                        ${focus ? 'block' : 'hidden'}
                                        ${focus ? 'bg-gray-100' : 'bg-white'}
                                    `}
                                        >
                                            <Button
                                                variant="soft"
                                                color="neutral"
                                                onMouseDown={() => {
                                                    handleSendMessage(
                                                        currentSessionControl?.input ??
                                                            '',
                                                    )
                                                }}
                                            >
                                                <Send />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </Resizable>
        </div>
    )
}
