import React, { useRef, useEffect } from 'react';
import './Chat.css';
import { Participant, Bot } from '../types/bot-types';
import { BotInfo } from './Chat';
import { Button, Textarea } from '@mui/joy';


interface ChatProps {
    user: Participant;
    bot: Bot;
    onQuery: (input: string) => void;
}

const QueryBot: React.FC<ChatProps> = ({ bot, onQuery }) => (
    <div className="chat h-full">
        <BotInfo bot={bot} />
        <div className="p-4 h-full flex flex-col">
            {/* input */}
            <Textarea
                placeholder="Ask a question..."
                minRows={3}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        onQuery(e.currentTarget.value);
                        e.currentTarget.value = '';
                    }
                }}
            />
            <div className="flex justify-end my-2">
                {/* query */}
                <Button
                    onClick={() => {
                        const input = (document.querySelector('.chat textarea') as HTMLTextAreaElement).value;
                        onQuery(input);
                    }}
                >
                    Query
                </Button>
            </div>
            {/* output */}
            <div className="flex-1 flex flex-col">
                <Textarea
                    minRows={3}
                    placeholder="Answer..."
                    readOnly
                    sx={{
                        flexGrow: 1,
                    }}
                />
            </div>
        </div>

    </div>
);

export default QueryBot;
