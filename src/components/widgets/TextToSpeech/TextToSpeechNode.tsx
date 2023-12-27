import { Button } from '@mui/joy'
import { XIcon } from '@primer/octicons-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Handle, NodeResizer, Position } from 'reactflow'
import AudioPlayer from './AudioPlayer'
import './TextToSpeechNode.css'

export type TextToSpeechNodeProps = {
    data: {
        title: string
        content: string
        onClose: () => void
    }
    selected: boolean
}

export function TextToSpeechNode({ data, selected }: TextToSpeechNodeProps) {
    const [text, setText] = useState('')
    const { t } = useTranslation()

    const handleGenerate = () => {
        // 在这里编写将文本转换为语音并播放的逻辑
        // 可以使用浏览器的 Web Speech API 或其他文本转语音的库
        // 在播放完成后可以添加一些回调逻辑
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
            <Handle type="target" position={Position.Top} />
            <NodeResizer minWidth={200} isVisible={selected} minHeight={70} />

            <div className="text-to-speech-node__header">
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
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder={t('Enter text...')}
                    className="text-to-speech-node__input"
                />
                <Button onClick={handleGenerate} color="primary">
                    {t('Generate')}
                </Button>
                {/* player */}
                <AudioPlayer src="" />
            </div>
            <Handle type="source" position={Position.Bottom} id="a" />
            <Handle
                type="source"
                position={Position.Bottom}
                id="b"
                style={{ left: 10 }}
            />
        </div>
    )
}
