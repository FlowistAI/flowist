import { Handle, NodeResizer, Position } from 'reactflow';
import { XIcon } from '@primer/octicons-react';
import './QueryBotNode.css';
import { QueryBotNodeData } from "../../../types/query-node-types";
import { querySessionsState } from '../../../states/query-states';
import { useRecoilValue } from 'recoil';
import { useNodeManager } from '../../../hooks/NodeManager';
import { QueryBotDropDownMenu } from './QueryBotDropdownMenu';
import QueryBot from '../../QueryBot';

export type QueryBotNodeProps = {
    data: QueryBotNodeData
    selected: boolean
};

export function QueryBotNode({ data, selected }: QueryBotNodeProps) {
    const { id } = data
    const { removeNode } = useNodeManager()
    const session = useRecoilValue(querySessionsState).find(session => session.id === id);

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

            return true
        }}>
            <NodeResizer minWidth={300} minHeight={200} isVisible={selected} />
            <Handle type="target" position={Position.Top}>
                <div className='-ml-6 -mt-6 pointer-events-none'>
                    Input
                </div>
            </Handle>
            <div className="chat-bot__header">
                <QueryBotDropDownMenu sessionId={session.id} />

                <span className="chat-bot__title">{session.bot.name ?? "Chat"}</span>
                <button className="chat-bot__close" onClick={() => removeNode(data.id)}>
                    <span>
                        <XIcon size={16} />
                    </span>
                </button>
            </div>
            <div className="chat-bot__content nowheel cursor-default" >
                <QueryBot session={session} />
            </div>
            <Handle type="source" position={Position.Bottom}>
                <div className='-ml-6 pointer-events-none'>
                    Output
                </div>
            </Handle>
        </div >
    );
}