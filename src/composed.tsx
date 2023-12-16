import { ReactFlowProvider } from 'reactflow';

export function Composed({ children }: { children: React.ReactElement }) {

    return (<ReactFlowProvider>
        {children}
    </ReactFlowProvider>)
}
