import { useContext } from 'react'
import { NodeManagerContext } from './NodeManagerProvider'

export const useNodeManager = () => {
    const mgr = useContext(NodeManagerContext)

    if (mgr === undefined) {
        throw new Error(
            'useNodeManager must be used within a NodeManagerProvider',
        )
    }

    return mgr
}

export const useCurrentCommunicationNode = (id: string) => {
    const mgr = useNodeManager()
    const { handleSignal, signal } = mgr.getCommunicationNode(id) ?? {}

    return { handleSignal, signal }
}
