import { Handle, NodeResizer, Position } from 'reactflow';
import { XIcon } from '@primer/octicons-react';
import './ChatBotNode.css';
import Chat from '../../Chat';
import { ChatBotNodeData } from "../../../types/chat-node-types";
import { chatSessionsState } from '../../../states/chat-states';
import { useRecoilValue } from 'recoil';
import { useNodeManager } from '../../../hooks/NodeManager';
import { ChatBotDropDownMenu } from './ChatBotDropdownMenu';
import { sourceStyle, targetStyle } from '../../../constants/handle-styles';

export type ChatBotNodeProps = {
    data: ChatBotNodeData
    selected: boolean
};

export function ChatBotNode({ data, selected }: ChatBotNodeProps) {
    const { id } = data
    const { removeNode } = useNodeManager()
    const session = useRecoilValue(chatSessionsState).find(session => session.id === id);

    if (!session) {
        return null;
    }

    return (
        <div className="chat-bot" onContextMenu={e => {
            if (e.target !== e.currentTarget) {
                e.stopPropagation()
                return false
            }
            e.preventDefault()
            e.stopPropagation()
        }}>
            <NodeResizer minWidth={300} minHeight={200} isVisible={selected} />
            <Handle type="target" position={Position.Right} style={targetStyle}>
                <div className='ml-2 pointer-events-none'>
                    Input
                </div>
            </Handle>
            <div className="chat-bot__header">
                <ChatBotDropDownMenu sessionId={session.id} />

                <span className="chat-bot__title">{session.bot.name ?? "Chat"}</span>
                <button className="chat-bot__close" onClick={() => removeNode(data.id)}>
                    <span>
                        <XIcon size={16} />
                    </span>
                </button>
            </div>
            <div className="chat-bot__content nowheel cursor-default" >
                <Chat session={session} />
            </div>
            <Handle type="source" position={Position.Left} style={sourceStyle}>
                <div className='-ml-14 pointer-events-none'>
                    Output
                </div>
            </Handle>
        </div >
    );
}
