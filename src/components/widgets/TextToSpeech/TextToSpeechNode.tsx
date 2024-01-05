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
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Handle, NodeResizer, Position } from 'reactflow'
import { targetStyle } from '../../../constants/handle-styles'
import { useCommunicate } from '../../../states/document.atom'
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
        onClose: () => void
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
    const { t } = useTranslation()

    const { id } = data
    const { handleSignal } = useCommunicate(id)
    useEffect(() => {
        return handleSignal?.(
            NodePorts.Input,
            (input: Signal<NodePorts.Input>) => {
                setInput(input)
            },
        )
    }, [id, handleSignal])

    // when input change, reset
    useEffect(() => {
        setGenerated(null)
    }, [input])

    const llmOpenAISettings = useAtomValue(llmProvidersAtom).OpenAI
    const ttsOpenAISettings = useAtomValue(ttsProvidersAtom).OpenAI

    const apiKey = ttsOpenAISettings.apiKey || llmOpenAISettings.apiKey
    const endpoint = ttsOpenAISettings.endpoint || llmOpenAISettings.endpoint

    const corsProxy = useAtomValue(systemCorsProxyAtom)
    const corsProxyEnabled = useAtomValue(systemCorsProxyEnabledAtom)

    const toast = useToast()

    const handleGenerateOrPlay = async () => {
        if (generated) {
            const url = URL.createObjectURL(generated)
            const audio = new Audio(url)
            setPlaying(true)

            try {
                await audio.play()
            } catch (error) {
                console.error(error)
                toast({ type: 'error', content: (error as Error).message })
            } finally {
                setPlaying(false)
                URL.revokeObjectURL(url)
            }

            return
        }

        try {
            setGenerating(true)
            const client = new OpenAI({
                apiKey,
                baseURL: createOpenAIBaseURL(
                    endpoint,
                    corsProxyEnabled ? corsProxy : undefined,
                ),
                dangerouslyAllowBrowser: true,
            })
            const defaultModel = 'tts-1'
            const defaultVoice = 'alloy'

            const mp3 = await client.audio.speech.create({
                model: ttsOpenAISettings.model || defaultModel,
                voice: ttsOpenAISettings.voice || defaultVoice,
                input: input,
                response_format: 'mp3',
            })

            setGenerated(await mp3.blob())
        } catch (error) {
            console.error(error)
            toast({ type: 'error', content: (error as Error).message })
        } finally {
            setGenerating(false)
        }
    }

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
                    onClick={data.onClose}
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
                    <Checkbox color="primary" label={t('Auto trigger')} />
                    <Button
                        color="primary"
                        sx={{ flex: 1 }}
                        disabled={!input || generating || playing}
                        onClick={handleGenerateOrPlay}
                    >
                        <PlayArrow />
                        {generating
                            ? t('Generating')
                            : !generated
                            ? t('Generate')
                            : playing
                            ? t('Playing')
                            : t('Play')}
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
