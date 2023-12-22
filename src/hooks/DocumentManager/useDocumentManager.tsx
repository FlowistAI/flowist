import { useContext } from 'react'
import { DocumentManagerContext } from './DocumentManagerProvider'

export const useDocumentManager = () => {
    const mgr = useContext(DocumentManagerContext)

    if (mgr === undefined) {
        throw new Error(
            'useDocumentManager must be used within a DocumentManagerProvider',
        )
    }

    return mgr
}

export const useCurrentCommunicationNode = (id: string) => {
    const mgr = useDocumentManager()
    const { handleSignal, signal } = mgr.getCommunicationNode(id) ?? {}

    return { handleSignal, signal }
}
