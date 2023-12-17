import { useNodesState } from 'reactflow';
import { NodeManagerProvider } from '../hooks/NodeManager';
import { initNodes } from '../constants/initData';
import { ChatBotNodeService } from '../services/chat-node-service';
import { useSetRecoilState } from 'recoil';
import { AppNodeTypes } from '../constants/nodeTypes';
import { chatSessionsState } from '../states/chat-states';
import { useMemo } from 'react';
import { SubManager } from '../hooks/NodeManager/NodeManager';
import { querySessionsState } from '../states/query-states';
import { QueryBotNodeService } from '../services/query-submanager';

export function NodeManaged({ children }: { children: React.ReactElement; }) {
    const [nodes, setNodes, onNodesChange] = useNodesState(initNodes);
    /**
     * Chat session state
     */
    const setChatSession = useSetRecoilState(chatSessionsState);
    const chatService = useMemo(() => new ChatBotNodeService({
        sessionCreateHandler: (session) => {
            setChatSession((sessions) => sessions.concat(session));
        },
        sessionDestroyHandler: (sessId) => {
            setChatSession((sessions) => sessions.filter(s => s.id !== sessId));
        }
    }), [setChatSession]);

    /**
     * Query session state
     */

    const setQuerySession = useSetRecoilState(querySessionsState);
    const queryService = useMemo(() => new QueryBotNodeService({
        sessionCreateHandler: (session) => {
            setQuerySession((sessions) => sessions.concat(session));
        },
        sessionDestroyHandler: (sessId) => {
            setQuerySession((sessions) => sessions.filter(s => s.id !== sessId));
        }
    }), [setQuerySession]);
    /**
     * Sub managers
     */
    const subManagers: Record<AppNodeTypes, SubManager<AppNodeTypes, unknown>> = useMemo(() => ({
        [AppNodeTypes.ChatBot]: chatService,
        [AppNodeTypes.QueryBot]: queryService,
    }), [chatService, queryService]);

    return (<NodeManagerProvider
        options={{
            nodes,
            setNodes,
            onNodesChange,
            subManagers
        }}
    >
        {children}
    </NodeManagerProvider>);
}
