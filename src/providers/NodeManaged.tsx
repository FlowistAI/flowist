import { useEdgesState, useNodesState } from 'reactflow';
import { NodeManagerProvider } from '../hooks/NodeManager';
import { initNodes } from '../constants/initData';
import { ChatBotNodeService } from '../services/chat-node-service';
import { useRecoilState } from 'recoil';
import { AppNodeTypes, PORT_DEFINITIONS } from '../constants/nodeTypes';
import { chatSessionsState } from '../states/chat-states';
import { useMemo } from 'react';
import { SubManager } from "../hooks/NodeManager/SubManager";
import { querySessionsState } from '../states/query-states';
import { QueryBotNodeService } from '../services/query-submanager';
import { useGraphTelecom } from '../hooks/GraphTelecom/useGraphTelecom';

export function NodeManaged({ children }: { children: React.ReactElement; }) {
    const [nodes, setNodes, onNodesChange] = useNodesState(initNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    /**
     * Chat session state
     */

    const [chatSessions, setChatSessions] = useRecoilState(chatSessionsState);
    const chatService = useMemo(() => new ChatBotNodeService({
        sessionCreateHandler: (session) => {
            setChatSessions((sessions) => sessions.concat(session));
        },
        sessionDestroyHandler: (sessId) => {
            setChatSessions((sessions) => sessions.filter(s => s.id !== sessId));
        },
        sessionsGetter: () => {
            return chatSessions;
        }
    }), [chatSessions, setChatSessions]);

    /**
     * Query session state
     */

    const [querySessions, setQuerySessions] = useRecoilState(querySessionsState);
    const queryService = useMemo(() => new QueryBotNodeService({
        sessionCreateHandler: (session) => {
            setQuerySessions((sessions) => sessions.concat(session));
        },
        sessionDestroyHandler: (sessId) => {
            setQuerySessions((sessions) => sessions.filter(s => s.id !== sessId));
        },
        sessionsGetter: () => {
            return querySessions;
        }
    }), [querySessions, setQuerySessions]);

    /**
     * Sub managers
     */

    const subManagers: Record<AppNodeTypes, SubManager<AppNodeTypes, unknown>> = useMemo(() => ({
        [AppNodeTypes.ChatBot]: chatService,
        [AppNodeTypes.QueryBot]: queryService,
    }), [chatService, queryService]);

    const graphTelecom = useGraphTelecom({ workspaceId: 'singleton' })
    return (<NodeManagerProvider
        options={{
            subManagers,
            portDefs: PORT_DEFINITIONS,
            telecom: graphTelecom,
            // node
            nodes,
            setNodes,
            onNodesChange,
            // edge
            edges,
            setEdges,
            onEdgesChange,
        }}
    >
        {children}
    </NodeManagerProvider>);
}
