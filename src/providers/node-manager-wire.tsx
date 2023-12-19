import { useEdgesState, useNodesState } from 'reactflow'
import { NodeManagerProvider } from '../hooks/NodeManager'
import { initNodes } from '../constants/initData'
import { ChatBotNodeService } from '../services/chat-bot-node.service'
import { useRecoilState } from 'recoil'
import { AppNodeTypes, PORT_DEFINITIONS } from '../constants/nodeTypes'
import { chatSessionsState } from '../states/chat-states'
import { SubManager } from '../hooks/NodeManager/SubManager'
import { querySessionsState } from '../states/query-states'
import { QueryBotNodeService } from '../services/query-bot-node.service'
import { useGraphTelecom } from '../hooks/GraphTelecom/useGraphTelecom'
import { NodeIdGenerator } from '../util/id-generator'
import { useMemo, useState } from 'react'
import { TextToSpeechNodeService } from '../nodes/text-to-speech/text-to-speech-node.service'
import { textToSpeechSessionsState } from '../nodes/text-to-speech/text-to-speech-sessions.states'

export function NodeManaged({ children }: { children: React.ReactElement }) {
    const [nodes, setNodes, onNodesChange] = useNodesState(initNodes)
    const [edges, setEdges, onEdgesChange] = useEdgesState([])
    const [idGenerator, setIdGenerator] = useState<NodeIdGenerator>(new NodeIdGenerator())
    /**
     * Chat session state
     */
    const [chatSessions, setChatSessions] = useRecoilState(chatSessionsState)
    const chatService = useMemo(() => new ChatBotNodeService({
        sessionCreateHandler: (session) => {
            setChatSessions((sessions) => sessions.concat(session))
        },
        sessionDestroyHandler: (sessId) => {
            setChatSessions((sessions) => sessions.filter(s => s.id !== sessId))
        },
        sessionsGetter: () => {
            return chatSessions
        },
        idGeneratorGetter: () => idGenerator
    }), [chatSessions, idGenerator, setChatSessions])

    /**
     * Query session state
     */

    const [querySessions, setQuerySessions] = useRecoilState(querySessionsState)
    const queryService = useMemo(() => new QueryBotNodeService({
        sessionCreateHandler: (session) => {
            setQuerySessions((sessions) => sessions.concat(session))
        },
        sessionDestroyHandler: (sessId) => {
            setQuerySessions((sessions) => sessions.filter(s => s.id !== sessId))
        },
        sessionsGetter: () => {
            return querySessions
        },
        idGeneratorGetter: () => idGenerator
    }), [idGenerator, querySessions, setQuerySessions])

    /**
     * Text to speech session state
     */
    const [textToSpeechSessions, setTextToSpeechSessions] = useRecoilState(textToSpeechSessionsState)
    const textToSpeechService = useMemo(() => new TextToSpeechNodeService({
        sessionCreateHandler: (session) => {
            setTextToSpeechSessions((sessions) => sessions.concat(session))
        },
        sessionDestroyHandler: (sessId) => {
            setTextToSpeechSessions((sessions) => sessions.filter(s => s.id !== sessId))
        },
        sessionsGetter: () => {
            return textToSpeechSessions
        },
        idGeneratorGetter: () => idGenerator
    }), [idGenerator, setTextToSpeechSessions, textToSpeechSessions])

    /**
     * Sub managers
     */
    type AppNodeSubManagers = {
        [K in AppNodeTypes]: SubManager<K>;
    };

    const subManagers: AppNodeSubManagers = useMemo(() => ({
        [AppNodeTypes.ChatBot]: chatService,
        [AppNodeTypes.QueryBot]: queryService,
        [AppNodeTypes.TextToSpeech]: textToSpeechService,
    }), [chatService, queryService, textToSpeechService])

    const graphTelecom = useGraphTelecom({ workspaceId: 'singleton' })

    return (<NodeManagerProvider
        options={{
            subManagers,
            portDefs: PORT_DEFINITIONS,
            telecom: graphTelecom,
            idGeneratorGetter: () => idGenerator,
            idGeneratorSetter: setIdGenerator,
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
    </NodeManagerProvider>)
}
