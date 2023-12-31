import { Handle, NodeResizer, Position } from 'reactflow'
import { XIcon } from '@primer/octicons-react'
import './QueryBotNode.css'
import { QueryBotDropDownMenu } from './QueryBotDropdownMenu'
import { useEffect, useState } from 'react'
import { sourceStyle, targetStyle } from '../../../constants/handle-styles'
import { BotInfo } from '../../../components/widgets/_common/Chat'
import { TextArea } from '../../../components/ui/TextArea'
import { Button } from '@mui/joy'
import { replacePrompt } from '../../../util/misc.util'
import { useCommunicate, useDocument } from '../../../states/document.atom'
import { useQueryBot } from '../query-bot.atom'
import { QueryBotNodeData } from '../query-bot.type'
import { createLLMService } from '../../../services/llm-service/createLLMService'
import { useAtomValue } from 'jotai'
import {
    systemCorsProxyAtom,
    systemCorsProxyEnabledAtom,
} from '../../../states/settings/settings.atom'
import { useToast } from '../../../hooks/Toast/useToast'
import { Invalid } from '../../../components/ui/Invalid'

export type QueryBotNodeProps = {
    data: QueryBotNodeData
    selected: boolean
}

enum NodePorts {
    Input = 'input',
    Output = 'output',
}

type InputSignal = string
type OutputSignal = string[]

type Signal<T extends NodePorts> = T extends NodePorts.Input
    ? InputSignal
    : OutputSignal

export function QueryBotNode({ data, selected }: QueryBotNodeProps) {
    const { id } = data
    const { dispatch: setDocument } = useDocument()
    const { signal, handleSignal } = useCommunicate(id)

    const { dispatch } = useQueryBot()
    const session = dispatch({ type: 'getSession', id })
    const botSettings = session?.bot.settings
    const [input, setInput] = useState<string>('')
    const [output, setOutput] = useState<string>('')

    const corsProxy = useAtomValue(systemCorsProxyAtom)
    const corsProxyEnabled = useAtomValue(systemCorsProxyEnabledAtom)
    const toast = useToast()

    const handleQuery = (input: string) => {
        if (!botSettings) {
            return
        }

        const queryAI = createLLMService(
            botSettings,
            corsProxyEnabled ? corsProxy : undefined,
        )
        if (!queryAI) {
            return
        }

        queryAI.queryStream({
            input,
            onChunk: (chunk) => {
                setOutput((prev) => prev + chunk)
            },
            onDone: (output: string) => {
                console.log('[QueryBotNode] query done', output)

                signal?.(NodePorts.Output, output)
            },
            onError: (error) => {
                toast({ type: 'error', content: (error as Error).message })
            },
        })
    }

    useEffect(() => {
        return handleSignal?.(
            NodePorts.Input,
            (input: Signal<NodePorts.Input>) => {
                setOutput('')
                setInput(input)
            },
        )
    }, [id, handleSignal])

    if (!session) {
        return <Invalid />
    }

    const handleClose = () => {
        setDocument({ type: 'remove-widget', id })
    }

    return (
        <div
            className="chat-bot"
            onContextMenu={(e) => {
                if (e.target !== e.currentTarget) {
                    e.stopPropagation()

                    return false
                }

                e.preventDefault()
                e.stopPropagation()

                return true
            }}
        >
            <NodeResizer minWidth={300} minHeight={200} isVisible={selected} />
            <Handle
                type="target"
                position={Position.Top}
                id="input"
                style={targetStyle}
            >
                <div className="-ml-6 -mt-6 pointer-events-none">Input</div>
            </Handle>
            <div className="chat-bot__header">
                <QueryBotDropDownMenu sessionId={session.id} />

                <span className="chat-bot__title">
                    {session.bot.name ?? 'Chat'}
                </span>
                <button className="chat-bot__close" onClick={handleClose}>
                    <span>
                        <XIcon size={16} />
                    </span>
                </button>
            </div>
            <div className="chat-bot__content nowheel cursor-default">
                <div className="chat h-full">
                    <BotInfo bot={session.bot} />
                    <div className="p-4 h-full flex flex-col nodrag">
                        {/* input */}
                        <TextArea
                            placeholder="Ask a question..."
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleQuery(input)
                                    setInput('')
                                }
                            }}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <div className="flex justify-end my-2 gap-2">
                            {/* clear */}
                            <Button
                                onClick={() => {
                                    setInput('')
                                    setOutput('')
                                }}
                                variant="outlined"
                            >
                                Clear
                            </Button>
                            {/* query */}
                            <Button
                                onClick={() => {
                                    handleQuery(
                                        replacePrompt(
                                            session.bot.settings.prompt,
                                            input,
                                        ),
                                    )
                                }}
                            >
                                Query
                            </Button>
                        </div>
                        {/* output */}
                        <div className="textarea-fix flex-1 flex flex-col max-h-full">
                            <TextArea
                                className="flex-1"
                                value={output}
                                placeholder="Answer..."
                                readOnly
                            />
                        </div>
                    </div>
                </div>
            </div>
            <Handle
                type="source"
                position={Position.Bottom}
                id="output"
                style={sourceStyle}
            >
                <div className="-ml-6 pointer-events-none">Output</div>
            </Handle>
        </div>
    )
}
