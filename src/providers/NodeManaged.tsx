import { useNodesState } from 'reactflow';
import { NodeManagerProvider } from '../hooks/NodeManager';
import { initNodes } from '../constants/initData';
import { ChatNodeService } from '../services/chat-node-service';
import { useSetRecoilState } from 'recoil';
import { AppNodeTypes } from '../constants/nodeTypes';
import { chatSessionsState } from '../states/chat-states';
import { useMemo } from 'react';
import { SubManager } from '../hooks/NodeManager/NodeManager';

export function NodeManaged({ children }: { children: React.ReactElement; }) {
    const [nodes, setNodes, onNodesChange] = useNodesState(initNodes);
    const setChatSession = useSetRecoilState(chatSessionsState);
    const chatService = useMemo(() => new ChatNodeService({
        sessionCreateHandler: (session) => {
            setChatSession((sessions) => sessions.concat(session));
        },
        sessionDestroyHandler: (sessId) => {
            setChatSession((sessions) => sessions.filter(s => s.id !== sessId));
        }
    }), [setChatSession]);

    const subManagers: Record<AppNodeTypes, SubManager<AppNodeTypes, unknown>> = useMemo(() => ({
        [AppNodeTypes.ChatBox]: chatService,
    }), [chatService]);

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
