import React, { useMemo } from 'react';
import './Chat.css';
import { BotInfo } from './Chat';
import { Button } from '@mui/joy';
import { QuerySession } from '../types/query-node-types';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { TextArea } from './Textarea';


interface ChatProps {
    session: QuerySession
}

const QueryBot: React.FC<ChatProps> = ({ session }) => {

    const [input, setInput] = React.useState<string>('');
    const [output, setOutput] = React.useState<string>('');
    const { bot } = session;
    const genAI = useMemo(() => new GoogleGenerativeAI(bot.settings.serviceSource.apiKey), [bot.settings.serviceSource.apiKey])
    const model = useMemo(() => genAI.getGenerativeModel({ model: bot.settings.model }), [genAI, bot.settings.model])
    console.log('render');

    const onQuery = async (query: string) => {
        const { totalTokens } = await model.countTokens(query);
        console.log('totalTokens', totalTokens);
        const result = await model.generateContentStream([query]);
        for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            console.log(chunkText);
            setOutput((prev) => prev + chunkText)
        }
    }

    return (
        <div className="chat h-full">
            <BotInfo bot={bot} />
            <div className="p-4 h-full flex flex-col nodrag">
                {/* input */}
                <TextArea
                    placeholder="Ask a question..."
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            onQuery(input);
                            setInput('');
                        }
                    }}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <div className="flex justify-end my-2 gap-2">
                    {/* clear */}
                    <Button
                        onClick={() => {
                            setInput('');
                            setOutput('');
                        }}
                        variant='outlined'
                    >
                        Clear
                    </Button>
                    {/* query */}
                    <Button
                        onClick={() => {
                            onQuery(input);
                        }}
                    >
                        Query
                    </Button>
                </div>
                {/* output */}
                <div className="textarea-fix flex-1 flex flex-col max-h-full">
                    <TextArea
                        className='flex-1'
                        value={output}
                        placeholder="Answer..."
                        readOnly
                    />
                </div>
            </div>

        </div>
    )
};

export default QueryBot;
