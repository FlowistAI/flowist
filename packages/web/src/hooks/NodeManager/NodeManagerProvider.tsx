/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useState, useEffect, FC } from 'react'
import { NodeManager, NodeManagerOptions } from './NodeManager'

export const NodeManagerContext = createContext<NodeManager>(undefined as any)

export type NodeManagerProviderProps = {
    options: NodeManagerOptions<any>
    children: React.ReactNode
};

export const NodeManagerProvider: FC<NodeManagerProviderProps> = ({ children, options }) => {
    const [nodeManager, setNodeManager] = useState(NodeManager.from(undefined, options))

    useEffect(() => {
        setNodeManager(prev => NodeManager.from(prev, options))
    }, [options])

    return (
        <NodeManagerContext.Provider value={nodeManager}>
            {children}
        </NodeManagerContext.Provider>
    )
}
