import { useNodesState, useEdgesState, Node, Edge, XYPosition } from 'reactflow';
import { generateId } from '../util/misc-util';
import { NodeTypeName, defaultStyles } from '../constants/nodeTypes';

export const useGraph = (initialNodes: Node[], initialEdges: Edge[]) => {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, , onEdgesChange] = useEdgesState(initialEdges);

    const handleAddNode = (type: NodeTypeName, position: XYPosition) => {
        const newNode = {
            id: generateId(),
            type: type,
            data: { label: 'New Node' },
            style: defaultStyles[type],
            position: position
        };
        setNodes((nds) => [...nds, newNode]);
    }

    return {
        nodes,
        onNodesChange,
        edges,
        onEdgesChange,
        handleAddNode
    };
};
