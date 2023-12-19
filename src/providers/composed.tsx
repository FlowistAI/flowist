import { ReactFlowProvider } from 'reactflow'
import { RecoilRoot } from 'recoil'
import { NodeManaged } from './node-manager-wire'

export function Composed({ children }: { children: React.ReactElement }) {

    return (<ReactFlowProvider>
        <RecoilRoot>
            <NodeManaged>
                {children}
            </NodeManaged>
        </RecoilRoot>
    </ReactFlowProvider>)
}
