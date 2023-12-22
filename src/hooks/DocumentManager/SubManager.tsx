/* eslint-disable @typescript-eslint/no-explicit-any */
import { Node } from 'reactflow'
import { AppNodeType } from '../../constants/nodeTypes'
import { AddNodeOptions } from './DocumentManager'

export type SubManager<
    NodeType extends AppNodeType,
    NodeData = any,
    Preset = any,
    StateSnapshot = any,
> = {
    createNode: (
        options: AddNodeOptions<NodeType, NodeData, Preset>,
    ) => Node<NodeData, NodeType>
    destroyNode: (nodeId: string) => void
    snapshot: () => StateSnapshot
    restore: (snapshot: StateSnapshot) => void
}
