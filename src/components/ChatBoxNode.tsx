import { Handle, Position } from 'reactflow';
import { XIcon } from '@primer/octicons-react';
import './ChatBoxNode.css';

import {
    BasicStorage,
    ChatProvider,
    AutoDraft,
    ChatServiceFactory
} from "@chatscope/use-chat";
import { ExampleChatService } from '../services/ExampleChatService';
import { generateId } from '../util/misc-util';
import { ChatWrapper } from './ChatWrapper';
import { useMemo } from 'react';

const messageIdGenerator = () => generateId();
const groupIdGenerator = () => generateId();



export type ChatBoxNodeProps = {
    data: {
        title: string;
        content: string;
        onClose: () => void;
    };
};
const handleStyle = { left: 10 };

export function ChatBoxNode({ data }: ChatBoxNodeProps) {
    const storage = useMemo(() => new BasicStorage({ groupIdGenerator, messageIdGenerator }), [])
    const serviceFactory: ChatServiceFactory<ExampleChatService> = (storage, updateState) => {
        console.log("serviceFactory", storage);

        return new ExampleChatService(storage, updateState);
    };
    return (
        <div className="chat-box">
            <Handle type="target" position={Position.Top} />

            <div className="chat-box__header">
                <span className="chat-box__title">{data.title ?? "GPT4"}</span>
                <button className="chat-box__close" onClick={data.onClose}>
                    <span>
                        <XIcon size={16} />
                    </span>
                </button>
            </div>
            <div className="chat-box__content">
                <ChatProvider serviceFactory={serviceFactory} storage={storage} config={{
                    typingThrottleTime: 250,
                    typingDebounceTime: 900,
                    debounceTyping: true,
                    autoDraft: AutoDraft.Save | AutoDraft.Restore
                }}>
                    <ChatWrapper className="nodrag h-full " />
                    {data.content}
                </ChatProvider>

            </div>
            <Handle type="source" position={Position.Bottom} id="a" />
            <Handle
                type="source"
                position={Position.Bottom}
                id="b"
                style={handleStyle}
            />
        </div>
    );
}
