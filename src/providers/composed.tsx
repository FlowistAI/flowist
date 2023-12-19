import { ReactFlowProvider } from 'reactflow'
import { RecoilRoot } from 'recoil'
import { NodeManaged } from './NodeManaged'

export function Composed({ children }: { children: React.ReactElement }) {

    return (<ReactFlowProvider>
        <RecoilRoot>
            <NodeManaged>
                {children}
            </NodeManaged>
        </RecoilRoot>
    </ReactFlowProvider>)
}
