import React from 'react'
import './Chat.css'
import { BotInfo } from './Chat'
import { Button } from '@mui/joy'
import { QuerySession } from '../types/query-node.types'
import { TextArea } from './TextArea'
import { replacePrompt } from '../util/misc.util'

interface ChatProps {
    session: QuerySession
    onQueryDone?: (output: string) => void
    input: string
    setInput: (input: string) => void
}

const QueryBot: React.FC<ChatProps> = ({
    session,
    onQueryDone,
    input,
    setInput,
}) => {
    const bot = session.bot
    const [output, setOutput] = React.useState<string>('')

    console.log('output', output)

    const { output: modelOutput, query: onQuery } = useGoogleAI({
        apiKey: session.bot.settings.serviceSource.apiKey,
        model: session.bot.settings.model,
        onDone: onQueryDone ?? (() => {}),
    })

    React.useEffect(() => {
        setOutput(modelOutput)
    }, [modelOutput])

    return (
        <div className="chat h-full">
            <BotInfo bot={bot} />
            <div className="p-4 h-full flex flex-col nodrag">
                {/* input */}
                <TextArea
                    placeholder="Ask a question..."
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            onQuery(input)
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
                            onQuery(replacePrompt(bot.settings.prompt, input))
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
    )
}

export default QueryBot
