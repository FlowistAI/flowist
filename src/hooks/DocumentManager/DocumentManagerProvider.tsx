/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useState, useEffect, FC } from 'react'
import { DocumentManager, DocumentManagerOptions } from './DocumentManager'

export const DocumentManagerContext = createContext<DocumentManager>(
    undefined as any,
)

export type DocumentManagerProviderProps = {
    options: DocumentManagerOptions<any>
    children: React.ReactNode
}

export const DocumentManagerProvider: FC<DocumentManagerProviderProps> = ({
    children,
    options,
}) => {
    const [documentManager, setDocumentManager] = useState(
        DocumentManager.from(undefined, options),
    )

    useEffect(() => {
        setDocumentManager((prev) => DocumentManager.from(prev, options))
    }, [options])

    return (
        <DocumentManagerContext.Provider value={documentManager}>
            {children}
        </DocumentManagerContext.Provider>
    )
}
