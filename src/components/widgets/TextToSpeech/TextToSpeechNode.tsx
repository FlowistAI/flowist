import { PlayArrow } from '@mui/icons-material'
import {
    Button,
    Checkbox,
    Menu,
    MenuButton,
    MenuItem,
    Dropdown,
} from '@mui/joy'
import { ArrowDownIcon, XIcon } from '@primer/octicons-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Handle, NodeResizer, Position } from 'reactflow'
import { targetStyle } from '../../../constants/handle-styles'
import { useCommunicate, useDocument } from '../../../states/document.atom'
import { TTSDropDownMenu } from './TTSDropdownMenu'
import './TextToSpeechNode.css'

import { useAtomValue } from 'jotai'
import OpenAI from 'openai'
import { useToast } from '../../../hooks/Toast/useToast'
import { createOpenAIBaseURL } from '../../../services/llm-service/open-ai.service'
import {
    llmProvidersAtom,
    systemCorsProxyAtom,
    systemCorsProxyEnabledAtom,
    ttsProvidersAtom,
} from '../../../states/settings/settings.atom'

export type TextToSpeechNodeProps = {
    data: {
        id: string
        title: string
        content: string
    }
    selected: boolean
}

enum NodePorts {
    Input = 'input',
}

type InputSignal = string

type Signal<T extends NodePorts> = T extends NodePorts.Input
    ? InputSignal
    : never

export function TextToSpeechNode({ data, selected }: TextToSpeechNodeProps) {
    const [input, setInput] = useState('')
    const [generating, setGenerating] = useState(false)
    const [playing, setPlaying] = useState(false)
    const [generated, setGenerated] = useState<Blob | null>(null)
    const [autoTrigger, setAutoTrigger] = useState(false)
    const handleAutoTrigger = () => setAutoTrigger((v) => !v)
    const { t } = useTranslation()
    const { id } = data
    console.log('tts id', id)
    const { dispatch: setDocument } = useDocument()
    const handleClose = () => {
        setDocument({ type: 'remove-widget', id })
    }

    // when input change, reset
    useEffect(() => {
        setGenerated(null)
    }, [input])

    const llmOpenAISettings = useAtomValue(llmProvidersAtom).OpenAI
    const ttsOpenAISettings = useAtomValue(ttsProvidersAtom).OpenAI

    const apiKey = useMemo(
        () => ttsOpenAISettings.apiKey || llmOpenAISettings.apiKey,
        [llmOpenAISettings.apiKey, ttsOpenAISettings.apiKey],
    )
    const endpoint = useMemo(
        () => ttsOpenAISettings.endpoint || llmOpenAISettings.endpoint,
        [llmOpenAISettings.endpoint, ttsOpenAISettings.endpoint],
    )

    const corsProxy = useAtomValue(systemCorsProxyAtom)
    const corsProxyEnabled = useAtomValue(systemCorsProxyEnabledAtom)
    const baseURL = useMemo(
        () =>
            createOpenAIBaseURL(
                endpoint,
                corsProxyEnabled ? corsProxy : undefined,
            ),
        [endpoint, corsProxyEnabled, corsProxy],
    )

    const toast = useToast()

    const handlePlay = useCallback(async () => {
        if (!generated) {
            console.error('generated is null')

            return
        }

        const url = URL.createObjectURL(generated)
        const audio = new Audio(url)

        try {
            audio.addEventListener('playing', () => {
                setPlaying(true)
            })

            audio.addEventListener('ended', () => {
                setPlaying(false)

                URL.revokeObjectURL(url)
            })

            await audio.play()
        } catch (error) {
            console.error(error)
            toast({ type: 'error', content: (error as Error).message })
        }

        return
    }, [generated, toast])

    const handlePlayFromStream = useCallback(async (stream: ReadableStream) => {
        if (!window.MediaSource) {
            console.error('MediaSource API is not available')

            return
        }

        const mediaSource = new MediaSource()
        const url = URL.createObjectURL(mediaSource)

        const audio = new Audio()
        audio.src = url
        const chunks: BlobPart[] = []
        mediaSource.addEventListener(
            'sourceopen',
            async () => {
                try {
                    const sourceBuffer =
                        mediaSource.addSourceBuffer('audio/mpeg') // Example codec, adjust as needed

                    // Fetch the audio chunks from the ReadableStream
                    const reader = stream.getReader()

                    // Recursive function to read and append each chunk
                    const readAndAppendChunk = async () => {
                        const { done, value } = await reader.read()
                        if (done) {
                            mediaSource.endOfStream() // Signal that we've reached the end of the stream

                            return
                        }

                        // Append the chunk to the SourceBuffer
                        sourceBuffer.appendBuffer(value)
                        chunks.push(value)
                        // Wait for the 'updateend' event to read and append the next chunk
                        sourceBuffer.addEventListener(
                            'updateend',
                            readAndAppendChunk,
                            { once: true },
                        )
                    }

                    // Start reading and appending chunks
                    readAndAppendChunk()

                    // Play the audio when enough data has been loaded
                    audio.addEventListener('canplay', () => {
                        audio.play()
                        setPlaying(true)
                    })

                    // Listen for the audio to finish playing
                    audio.addEventListener('ended', () => {
                        const blob = new Blob(chunks, {
                            type: 'audio/mpeg',
                        })
                        setGenerated(blob)
                        console.log('generated', chunks, blob)

                        setPlaying(false)
                    })
                } catch (error) {
                    console.error('Error while handling audio stream', error)
                }
            },
            { once: true },
        )
    }, [])

    const handleGenerateOrPlay = useCallback(async () => {
        if (generated) {
            console.log('generated, now play')
            handlePlay()

            return
        }

        try {
            setGenerating(true)
            const client = new OpenAI({
                apiKey,
                baseURL,
                dangerouslyAllowBrowser: true,
            })
            const defaultModel = 'tts-1'
            const defaultVoice = 'alloy'

            const resp = await client.audio.speech.create({
                model: ttsOpenAISettings.model || defaultModel,
                voice: ttsOpenAISettings.voice || defaultVoice,
                input: input,
            })

            if (!resp.body) {
                throw new Error('resp.body is null')
            }

            console.log('got resp')

            await handlePlayFromStream(resp.body)
        } catch (error) {
            console.error(error)
            toast({ type: 'error', content: (error as Error).message })
        } finally {
            setGenerating(false)
        }
    }, [
        apiKey,
        baseURL,
        generated,
        handlePlay,
        handlePlayFromStream,
        input,
        toast,
        ttsOpenAISettings.model,
        ttsOpenAISettings.voice,
    ])

    const handleDownload = () => {
        if (!generated) {
            return
        }

        const url = URL.createObjectURL(generated)
        const a = document.createElement('a')
        a.href = url
        a.download = 'audio.mp3'
        a.click()
        URL.revokeObjectURL(url)
    }

    const { handleSignal } = useCommunicate(id)
    const [fromSignal, setFromSignal] = useState(false)
    useEffect(() => {
        return handleSignal?.(
            NodePorts.Input,
            (input: Signal<NodePorts.Input>) => {
                console.log('get signal', input)
                setInput(input)
                setFromSignal(true)
            },
        )
    }, [id, handleSignal, handleGenerateOrPlay])

    useEffect(() => {
        if (fromSignal && autoTrigger) {
            handleGenerateOrPlay()
            setFromSignal(false)
        }
    }, [autoTrigger, fromSignal, handleGenerateOrPlay])

    const playButtonText = useMemo(() => {
        if (playing) {
            return t('Playing')
        }

        if (generating) {
            return t('Generating')
        }

        if (generated) {
            return t('Play')
        }

        return t('Generate')
    }, [generating, generated, playing, t])

    return (
        <div
            className="text-to-speech-node"
            onContextMenu={(e) => {
                e.preventDefault()
                e.stopPropagation()

                return true
            }}
        >
            <Handle
                type="target"
                position={Position.Right}
                style={targetStyle}
                id="input"
            >
                <div className="ml-2 pointer-events-none">Input</div>
            </Handle>
            <NodeResizer minWidth={200} isVisible={selected} minHeight={70} />

            <div className="text-to-speech-node__header">
                <TTSDropDownMenu sessionId={id} />
                <span className="text-to-speech-node__title">
                    {data.title ?? t('Text to Speech')}
                </span>
                <button
                    className="text-to-speech-node__close"
                    onClick={handleClose}
                >
                    <span>
                        <XIcon size={16} />
                    </span>
                </button>
            </div>
            <div className="text-to-speech-node__content nodrag nowheel cursor-default">
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={t('Enter text...')}
                    className="text-to-speech-node__input"
                />
                <div className="flex items-center gap-2">
                    <Checkbox
                        checked={autoTrigger}
                        onChange={handleAutoTrigger}
                        color="primary"
                        label={t('Auto trigger')}
                    />
                    <Button
                        color="primary"
                        sx={{ flex: 1 }}
                        disabled={!input || generating || playing}
                        onClick={handleGenerateOrPlay}
                    >
                        <PlayArrow />
                        {playButtonText}
                    </Button>
                    {/* Dropdown menu */}
                    <Dropdown>
                        <MenuButton>
                            <ArrowDownIcon />
                        </MenuButton>
                        <Menu>
                            <MenuItem
                                disabled={!generated}
                                onClick={handleDownload}
                            >
                                Download
                            </MenuItem>
                        </Menu>
                    </Dropdown>
                </div>
            </div>
        </div>
    )
}
