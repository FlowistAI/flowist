import { Button, Checkbox } from '@mui/joy'
import { XIcon } from '@primer/octicons-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Handle, NodeResizer, Position } from 'reactflow'
import './TextToSpeechNode.css'
import { targetStyle } from '../../../constants/handle-styles'
import { PlayArrow } from '@mui/icons-material'
import { useCommunicate } from '../../../states/document.atom'
import { TTSDropDownMenu } from './TTSDropdownMenu'

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
    const [generated, setGenerated] = useState<string | null>(null)
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

    const handleGenerateOrPlay = () => {
        setGenerated(input)
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
                        sx={{ flex: 1 }}
                        disabled={!input}
                        onClick={handleGenerateOrPlay}
                        color="primary"
                    >
                        <PlayArrow />
                        {generated ? t('Play') : t('Generate')}
                    </Button>
                </div>
            </div>
        </div>
    )
}
