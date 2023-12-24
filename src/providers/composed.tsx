import { ReactFlowProvider } from 'reactflow'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

export function Composed({ children }: { children: React.ReactElement }) {
    return (
        <ReactFlowProvider>
            <DndProvider backend={HTML5Backend}>{children}</DndProvider>
        </ReactFlowProvider>
    )
}
